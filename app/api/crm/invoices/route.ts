import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Invoice } from '@/lib/models/Invoice';
import { Client } from '@/lib/models/Client';
import { invoiceSchema } from '@/lib/validations/crm';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
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
			query.transactionStatus = status;
		}

		if (clientId) {
			query.clientId = clientId;
		}

		const [invoices, total] = await Promise.all([
			Invoice.find(query)
				.populate('clientId', 'name email phone')
				.populate('linkedServiceId', 'serviceId serviceTitle serviceCost')
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
						$sum: { $cond: [{ $eq: ['$transactionStatus', 'paid'] }, 1, 0] },
					},
					pendingInvoices: {
						$sum: { $cond: [{ $eq: ['$transactionStatus', 'pending'] }, 1, 0] },
					},
					totalAmount: { $sum: '$amount' },
					paidAmount: {
						$sum: {
							$cond: [{ $eq: ['$transactionStatus', 'paid'] }, '$amount', 0],
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
				paidInvoices: 0,
				pendingInvoices: 0,
				totalAmount: 0,
				paidAmount: 0,
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
			{ status: 500 }
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
				{ status: 400 }
			);
		}

		// Verify client exists
		const clientExists = await Client.findById(validationResult.data.clientId);
		if (!clientExists) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 }
			);
		}

		// Check if invoice number already exists
		const existingInvoice = await Invoice.findOne({
			invoiceNumber: validationResult.data.invoiceNumber,
		});
		if (existingInvoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice number already exists' },
				{ status: 400 }
			);
		}

		const invoice = await Invoice.create(validationResult.data);

		const populatedInvoice = await invoice.populate([
			{ path: 'clientId', select: 'name email phone' },
			{ path: 'linkedServiceId', select: 'serviceId serviceTitle serviceCost' },
		]);

		return NextResponse.json(
			{ success: true, data: populatedInvoice },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create invoice' },
			{ status: 500 }
		);
	}
}
