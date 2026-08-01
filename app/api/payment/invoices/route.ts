import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { DailyService } from '@/lib/models/DailyService';
import { Invoice } from '@/lib/models/Invoice';
import { generateUniqueInvoiceNumber } from '@/lib/utils/invoiceUtils';
import { invoiceSchema } from '@/lib/validations/crm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const serviceId = searchParams.get('serviceId');
		const status = searchParams.get('status') || '';
		const clientId = searchParams.get('clientId') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (search) {
			query.$or = [
				{ invoiceNumber: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		if (status && status !== 'all') {
			query.status = status;
		}

		if (clientId) {
			query.clientId = clientId;
		}

		if (serviceId) {
			query.linkedServiceId = serviceId;
		}

		const [invoices, total] = await Promise.all([
			Invoice.find(query)
				.populate('clientId', 'name email phone company')
				.populate('linkedServiceId', 'serviceTitle serviceCost serviceStatus')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			Invoice.countDocuments(query),
		]);

		// Get stats
		const stats = await Invoice.aggregate([
			{
				$match: query,
			},
			{
				$group: {
					_id: null,
					totalInvoices: { $sum: 1 },
					paidInvoices: {
						$sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
					},
					dueInvoices: {
						$sum: { $cond: [{ $eq: ['$status', 'due'] }, 1, 0] },
					},
					partialInvoices: {
						$sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] },
					},
					totalAmount: { $sum: '$grandTotal' },
					paidAmount: {
						$sum: {
							$cond: [{ $eq: ['$status', 'paid'] }, '$paidAmount', 0],
						},
					},
					dueAmount: {
						$sum: {
							$cond: [{ $eq: ['$status', 'due'] }, '$dueAmount', 0],
						},
					},
					partialPaidAmount: {
						$sum: {
							$cond: [{ $eq: ['$status', 'partial'] }, '$paidAmount', 0],
						},
					},

					partialDueAmount: {
						$sum: {
							$cond: [{ $eq: ['$status', 'partial'] }, '$dueAmount', 0],
						},
					},
				},
			},
		]);

		return NextResponse.json({
			success: true,
			data: invoices,
			stats: stats[0] || {
				totalInvoices: 0,
				paidAmount: 0,
				paidInvoices: 0,
				dueInvoices: 0,
				partialInvoices: 0,
				totalAmount: 0,
			},
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching invoices:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch invoices' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = invoiceSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error: 'Validation failed',
					details: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		// Verify client exists
		const clientExists = await Client.findById(validationResult.data.clientId);
		if (!clientExists) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		// Verify service exists if provided
		if (validationResult.data.linkedServiceId) {
			const serviceExists = await DailyService.findById(
				validationResult.data.linkedServiceId,
			);
			if (!serviceExists) {
				return NextResponse.json(
					{ success: false, error: 'Service not found' },
					{ status: 404 },
				);
			}
		}

		// Generate unique invoice number
		const invoiceNumber = await generateUniqueInvoiceNumber();

		const invoice = await Invoice.create({
			...validationResult.data,
			invoiceNumber,
		});

		const populatedInvoice = await invoice.populate([
			{ path: 'clientId', select: 'name email phone company' },
			{
				path: 'linkedServiceId',
				select: 'serviceTitle serviceCost serviceStatus',
			},
		]);

		return NextResponse.json(
			{ success: true, data: populatedInvoice },
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create invoice' },
			{ status: 500 },
		);
	}
}
