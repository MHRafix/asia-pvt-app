import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Invoice } from '@/lib/models/Invoice';
import { invoiceSchema } from '@/lib/validations/crm';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const invoice = await Invoice.findById(params.id)
			.populate('clientId', 'name email phone company address')
			.populate('linkedServiceId', 'serviceId serviceTitle serviceCost')
			.populate('linkedTransactionId', 'amount description');

		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: invoice });
	} catch (error) {
		console.error('Error fetching invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch invoice' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = invoiceSchema.partial().safeParse(body);
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

		const invoice = await Invoice.findById(params.id);
		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 }
			);
		}

		const updatedInvoice = await Invoice.findByIdAndUpdate(
			params.id,
			validationResult.data,
			{ new: true }
		)
			.populate('clientId', 'name email phone company address')
			.populate('linkedServiceId', 'serviceId serviceTitle serviceCost')
			.populate('linkedTransactionId', 'amount description');

		return NextResponse.json({ success: true, data: updatedInvoice });
	} catch (error) {
		console.error('Error updating invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update invoice' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const invoice = await Invoice.findById(params.id);
		if (!invoice) {
			return NextResponse.json(
				{ success: false, error: 'Invoice not found' },
				{ status: 404 }
			);
		}

		await Invoice.findByIdAndDelete(params.id);

		return NextResponse.json({
			success: true,
			message: 'Invoice deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete invoice' },
			{ status: 500 }
		);
	}
}
