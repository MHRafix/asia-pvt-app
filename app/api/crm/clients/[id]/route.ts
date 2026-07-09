import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { DailyService } from '@/lib/models/DailyService';
import { Invoice } from '@/lib/models/Invoice';
import { clientSchema } from '@/lib/validations/crm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const client = await Client.findById(id);
		if (!client) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		// Get transactions
		const transactions = await ClientTransaction.find({ clientId: id })
			.sort({ createdAt: -1 })
			.limit(50);

		// Get activities
		const takenServices = await DailyService.find({ clientId: id })
			.sort({ createdAt: -1 })
			.limit(50);

		return NextResponse.json({
			success: true,
			data: {
				client,
				transactions,
				takenServices,
			},
		});
	} catch (error) {
		console.error('Error fetching client:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch client' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();

		// Validate with Zod
		const validationResult = clientSchema.partial().safeParse(body);
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

		const existingClient = await Client.findById(id);
		if (!existingClient) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		const client = await Client.findByIdAndUpdate(
			id,
			{ ...validationResult.data, lastActivityDate: new Date() },
			{ new: true, runValidators: true },
		);

		return NextResponse.json({ success: true, data: client });
	} catch (error) {
		console.error('Error updating client:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update client' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const client = await Client.findById(id);
		if (!client) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		// Delete related data
		await Promise.all([
			ClientTransaction.deleteMany({ clientId: id }),
			DailyService.deleteMany({ linkedClientId: id }),
			Invoice.deleteMany({ clientId: id }),
			Client.findByIdAndDelete(id),
		]);

		return NextResponse.json({
			success: true,
			message: 'Client and related data deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting client:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete client' },
			{ status: 500 },
		);
	}
}
