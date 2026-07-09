import { connectDB } from '@/lib/db/connection';
import { Invoice } from '@/lib/models/Invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const invoice = await Invoice.findById(id).populate([
			{ path: 'clientId', select: 'name email phone company' },
			// {
			// 	path: 'linkedServiceId',
			// 	select: 'serviceTitle',
			// },
		]);

		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: invoice,
		});
	} catch (error) {
		console.error('Error fetching invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch invoice' },
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

		const { id } = await params;
		const body = await request.json();

		const invoice = await Invoice.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		}).populate([
			{ path: 'clientId', select: 'name email phone company' },
			{
				path: 'linkedServiceId',
				select: 'serviceTitle serviceCost serviceStatus',
			},
		]);

		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: invoice,
		});
	} catch (error) {
		console.error('Error updating invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update invoice' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = await params;
		await connectDB();

		const invoice = await Invoice.findByIdAndDelete(id);

		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Invoice deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete invoice' },
			{ status: 500 },
		);
	}
}
