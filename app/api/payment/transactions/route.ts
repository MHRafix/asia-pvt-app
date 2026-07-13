import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { Invoice } from '@/lib/models/Invoice';
import { calculateInvoiceStatus } from '@/lib/utils/invoiceUtils';
import { paymentTransactionSchema } from '@/lib/validations/crm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const type = searchParams.get('type') || '';
		const invoiceId = searchParams.get('invoiceId') || '';
		const clientId = searchParams.get('clientId') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {
			type: 'payment', // Filter to payment transactions only
		};

		if (search) {
			query.$or = [{ description: { $regex: search, $options: 'i' } }];
		}

		if (type && type !== 'all') {
			query.type = type;
		}

		if (clientId) {
			query.clientId = clientId;
		}

		if (invoiceId) {
			query.invoiceId = invoiceId;
		}

		const [transactions, total] = await Promise.all([
			ClientTransaction.find(query)
				.populate('clientId', 'name email phone company')
				.populate('invoiceId', 'invoiceNumber')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			ClientTransaction.countDocuments(query),
		]);

		// Get stats
		const stats = await ClientTransaction.aggregate([
			{
				$match: query,
			},
			{
				$group: {
					_id: null,
					totalTransactions: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
					completedTransactions: {
						$sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
					},
					pendingTransactions: {
						$sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
					},
				},
			},
		]);

		return NextResponse.json({
			success: true,
			data: transactions,
			stats: stats[0] || {
				totalTransactions: 0,
				totalAmount: 0,
				completedTransactions: 0,
				pendingTransactions: 0,
			},
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching transactions:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch transactions' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	console.log('object');
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = paymentTransactionSchema.safeParse(body);

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

		// Verify invoice exists
		const invoice = await Invoice.findById(validationResult.data.invoiceId);

		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 },
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

		// Create transaction
		const transaction = await ClientTransaction.create({
			clientId: validationResult.data.clientId,
			type: validationResult?.data?.type,
			description: validationResult?.data?.description,
			transactionId: validationResult?.data?.transactionId,
			invoiceId: validationResult?.data?.invoiceId,
			amount: validationResult.data.amount,
			paymentMethod: validationResult.data.paymentMethod,
		});

		// Update invoice with transaction link and calculate new status
		const newPaidAmount =
			(invoice.paidAmount || 0) + validationResult.data.amount;
		const newStatus = calculateInvoiceStatus(newPaidAmount, invoice.grandTotal);

		const updatedInvoice = await Invoice.findByIdAndUpdate(
			validationResult.data.invoiceId,
			{
				paidAmount: newPaidAmount,
				dueAmount: invoice?.grandTotal - newPaidAmount,
				status: newStatus,
			},
			{ new: true },
		).populate([
			{ path: 'clientId', select: 'name email phone company' },
			{
				path: 'linkedServiceId',
				select: 'serviceTitle serviceCost serviceStatus',
			},
		]);

		const populatedTransaction = await transaction.populate(
			'clientId',
			'name email phone company',
		);

		return NextResponse.json(
			{
				success: true,
				data: {
					transaction: populatedTransaction,
					invoice: updatedInvoice,
				},
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create transaction' },
			{ status: 500 },
		);
	}
}
