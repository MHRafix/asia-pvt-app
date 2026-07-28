import { connectDB } from '@/lib/db/connection';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();
		const { id } = await params;

		const transaction = await ClientTransaction.find({ clientId: id })
			.populate('clientId', 'name email phone')
			.populate('invoiceId', 'invoiceNumber grandTotal');

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
