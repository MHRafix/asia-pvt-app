import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { DailyService } from '@/lib/models/DailyService';
import { z } from 'zod';

const statusSchema = z.object({
	serviceStatus: z.enum([
		'pending',
		'in_progress',
		'completed',
		'cancelled',
		'on_hold',
	]),
});

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate status
		const validationResult = statusSchema.safeParse(body);
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

		const service = await DailyService.findById(params.id);
		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

		service.serviceStatus = validationResult.data.serviceStatus;

		// Set completed date if status is completed
		if (
			validationResult.data.serviceStatus === 'completed' &&
			!service.completedDate
		) {
			service.completedDate = new Date();
		}

		await service.save();

		const updatedService = await service.populate([
			{ path: 'linkedClientId', select: 'name email phone' },
			{ path: 'assignedEmployeeId', select: 'name email' },
		]);

		return NextResponse.json({ success: true, data: updatedService });
	} catch (error) {
		console.error('Error updating service status:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update service status' },
			{ status: 500 },
		);
	}
}
