import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { ClientActivity } from '@/lib/models/ClientActivity';
import { clientTransactionSchema } from '@/lib/validations/crm';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const clientId = searchParams.get('clientId');
		const type = searchParams.get('type');
		const status = searchParams.get('status');
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (clientId) query.clientId = clientId;
		if (type) query.type = type;
		if (status) query.status = status;

		const [transactions, total] = await Promise.all([
			ClientTransaction.find(query)
				.populate('clientId', 'name email')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			ClientTransaction.countDocuments(query),
		]);

		return NextResponse.json({
			success: true,
			data: transactions,
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
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = clientTransactionSchema.safeParse(body);
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

		const { clientId, type, amount, description, status } = validationResult.data;

		// Check if client exists
		const client = await Client.findById(clientId);
		if (!client) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 }
			);
		}

		// Create transaction
		const transaction = await ClientTransaction.create(validationResult.data);

		// Update client balance and stats based on transaction type
		const updateData: any = { lastActivityDate: new Date() };

		if (status === 'completed') {
			if (type === 'service') {
				updateData.$inc = {
					balance: amount, // Add to balance (amount owed)
					totalServices: 1,
				};
			} else if (type === 'package') {
				updateData.$inc = {
					balance: amount,
					totalPackages: 1,
				};
			} else if (type === 'payment') {
				updateData.$inc = {
					balance: -Math.abs(amount), // Subtract from balance
					totalSpent: Math.abs(amount),
				};
			} else if (type === 'refund') {
				updateData.$inc = {
					balance: Math.abs(amount),
					totalSpent: -Math.abs(amount),
				};
			} else if (type === 'adjustment') {
				updateData.$inc = { balance: amount };
			}
		}

		await Client.findByIdAndUpdate(clientId, updateData);

		// Create activity
		await ClientActivity.create({
			clientId,
			type: 'transaction',
			title: `${type.charAt(0).toUpperCase() + type.slice(1)} Transaction`,
			description: `${description} - $${Math.abs(amount)}`,
			metadata: { transactionId: transaction._id, type, amount },
		});

		return NextResponse.json({ success: true, data: transaction }, { status: 201 });
	} catch (error) {
		console.error('Error creating transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create transaction' },
			{ status: 500 }
		);
	}
}
