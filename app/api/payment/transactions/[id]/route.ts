import { connectDB } from '@/lib/db/connection';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();

		const transaction = await ClientTransaction.findById(params.id).populate(
			'clientId',
			'name email phone company',
		);

		if (!transaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: transaction,
		});
	} catch (error) {
		console.error('Error fetching transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch transaction' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();

		const body = await request.json();

		const transaction = await ClientTransaction.findByIdAndUpdate(params.id, body, {
			new: true,
			runValidators: true,
		}).populate('clientId', 'name email phone company');

		if (!transaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: transaction,
		});
	} catch (error) {
		console.error('Error updating transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update transaction' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();

		const transaction = await ClientTransaction.findByIdAndDelete(params.id);

		if (!transaction) {
			return NextResponse.json(
				{ success: false, error: 'Transaction not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Transaction deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting transaction:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete transaction' },
			{ status: 500 },
		);
	}
}
