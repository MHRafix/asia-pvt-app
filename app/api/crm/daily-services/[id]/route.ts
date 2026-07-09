import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { DailyService } from '@/lib/models/DailyService';
import { dailyServiceSchema } from '@/lib/validations/crm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();

		const service = await DailyService.findById(params.id)
			.populate('linkedClientId', 'name email phone company')
			.populate('assignedEmployeeId', 'name email');

		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: service });
	} catch (error) {
		console.error('Error fetching daily service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch daily service' },
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

		// Validate with Zod
		const validationResult = dailyServiceSchema.partial().safeParse(body);
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

		const service = await DailyService.findById(id);
		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

		const updatedService = await DailyService.findByIdAndUpdate(
			id,
			validationResult.data,
			{ new: true },
		)
			.populate('linkedClientId', 'name email phone company')
			.populate('assignedEmployeeId', 'name email');

		return NextResponse.json({ success: true, data: updatedService });
	} catch (error) {
		console.error('Error updating daily service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update daily service' },
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
		const { id } = await params;

		const service = await DailyService.findById(id);
		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

		// Update client's total services count
		await Client.findByIdAndUpdate(service.linkedClientId, {
			$inc: { totalServices: -1 },
		});

		await DailyService.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: 'Service deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting daily service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete daily service' },
			{ status: 500 },
		);
	}
}
