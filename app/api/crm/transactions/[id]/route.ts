import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { ClientActivity } from '@/lib/models/ClientActivity';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;

		const transaction = await ClientTransaction.findById(id).populate(
			'clientId',
			'name email'
		);

		if (!transaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: transaction });
	} catch (error) {
		console.error('Error fetching transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch transaction' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();

		const existingTransaction = await ClientTransaction.findById(id);
		if (!existingTransaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 }
			);
		}

		// If status is being changed to completed, update client balance
		if (body.status === 'completed' && existingTransaction.status !== 'completed') {
			const { clientId, type, amount } = existingTransaction;
			const updateData: any = { lastActivityDate: new Date() };

			if (type === 'service') {
				updateData.$inc = { balance: amount, totalServices: 1 };
			} else if (type === 'package') {
				updateData.$inc = { balance: amount, totalPackages: 1 };
			} else if (type === 'payment') {
				updateData.$inc = { balance: -Math.abs(amount), totalSpent: Math.abs(amount) };
			} else if (type === 'refund') {
				updateData.$inc = { balance: Math.abs(amount), totalSpent: -Math.abs(amount) };
			} else if (type === 'adjustment') {
				updateData.$inc = { balance: amount };
			}

			await Client.findByIdAndUpdate(clientId, updateData);
		}

		// If status is being changed to cancelled from completed, reverse the changes
		if (body.status === 'cancelled' && existingTransaction.status === 'completed') {
			const { clientId, type, amount } = existingTransaction;
			const updateData: any = { lastActivityDate: new Date() };

			if (type === 'service') {
				updateData.$inc = { balance: -amount, totalServices: -1 };
			} else if (type === 'package') {
				updateData.$inc = { balance: -amount, totalPackages: -1 };
			} else if (type === 'payment') {
				updateData.$inc = { balance: Math.abs(amount), totalSpent: -Math.abs(amount) };
			} else if (type === 'refund') {
				updateData.$inc = { balance: -Math.abs(amount), totalSpent: Math.abs(amount) };
			} else if (type === 'adjustment') {
				updateData.$inc = { balance: -amount };
			}

			await Client.findByIdAndUpdate(clientId, updateData);
		}

		const transaction = await ClientTransaction.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		return NextResponse.json({ success: true, data: transaction });
	} catch (error) {
		console.error('Error updating transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update transaction' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;

		const transaction = await ClientTransaction.findById(id);
		if (!transaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 }
			);
		}

		// If transaction was completed, reverse the balance changes
		if (transaction.status === 'completed') {
			const { clientId, type, amount } = transaction;
			const updateData: any = { lastActivityDate: new Date() };

			if (type === 'service') {
				updateData.$inc = { balance: -amount, totalServices: -1 };
			} else if (type === 'package') {
				updateData.$inc = { balance: -amount, totalPackages: -1 };
			} else if (type === 'payment') {
				updateData.$inc = { balance: Math.abs(amount), totalSpent: -Math.abs(amount) };
			} else if (type === 'refund') {
				updateData.$inc = { balance: -Math.abs(amount), totalSpent: Math.abs(amount) };
			} else if (type === 'adjustment') {
				updateData.$inc = { balance: -amount };
			}

			await Client.findByIdAndUpdate(clientId, updateData);
		}

		await ClientTransaction.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: 'Transaction deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete transaction' },
			{ status: 500 }
		);
	}
}
