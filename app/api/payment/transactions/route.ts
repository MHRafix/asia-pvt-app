import { connectDB } from '@/lib/db/connection';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { Invoice } from '@/lib/models/Invoice';
import { Client } from '@/lib/models/Client';
import { paymentTransactionSchema } from '@/lib/validations/crm';
import { calculateInvoiceStatus, calculateDueAmount } from '@/lib/utils/invoiceUtils';
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

		if (invoiceId) {
			// Find transactions linked to this invoice
			const invoice = await Invoice.findById(invoiceId);
			if (invoice && invoice.linkedTransactionId) {
				query._id = invoice.linkedTransactionId;
			}
		}

		if (clientId) {
			query.clientId = clientId;
		}

		const [transactions, total] = await Promise.all([
			ClientTransaction.find(query)
				.populate('clientId', 'name email phone company')
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
			type: 'payment',
			description: `Payment for Invoice ${invoice.invoiceNumber}`,
			amount: validationResult.data.amount,
			status: 'completed',
			paymentMethod: validationResult.data.paymentMethod,
			notes: validationResult.data.notes,
		});

		// Update invoice with transaction link and calculate new status
		const newPaidAmount = (invoice.amount || 0) + validationResult.data.amount;
		const newStatus = calculateInvoiceStatus(newPaidAmount, invoice.amount);

		const updatedInvoice = await Invoice.findByIdAndUpdate(
			validationResult.data.invoiceId,
			{
				linkedTransactionId: transaction._id,
				transactionStatus: newStatus,
			},
			{ new: true },
		).populate([
			{ path: 'clientId', select: 'name email phone company' },
			{ path: 'linkedServiceId', select: 'serviceTitle serviceCost serviceStatus' },
		]);

		const populatedTransaction = await transaction.populate('clientId', 'name email phone company');

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
