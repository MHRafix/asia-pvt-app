import { connectDB } from '@/lib/db/connection';
import { DailyService } from '@/lib/models/DailyService';
import { NextRequest, NextResponse } from 'next/server';
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

		const service = await DailyService.findById(params.id).populate(
			'linkedClientId',
			'name email',
		);
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

		// await sendMail(
		// 	// @ts-ignore
		// 	service?.linkedClientId?.email,
		// 	`Update of Your booked service: ${service?.serviceTitle}`,
		// 	`<div>

		// 				<div>
		// 		<h1 style="
		// 				margin:0;
		// 				font-size:30px;
		// 				color:#111827;
		// 				font-weight:700;
		// 		">
		// 				Service Booked
		// 		</h1>

		// 		<p style="
		// 				margin:15px 0 0;
		// 				color:#6b7280;
		// 				font-size:16px;
		// 				line-height:1.8;
		// 		">
		// 				Hey <strong>${
		// 				// @ts-ignore
		// 				service?.linkedClientId?.name}</strong>,
		// 				<br><br>
		// 				Thank you for choosing our service. Your service has been successfully booked. Currently your service is <strong style="color: blue;">in-progress</strong>, we'll complete it as soon as possible.
		// 		</p>

		// 		<p style="color: blue;">Thank You</p>
		// 		<strong style="color: #ccc;">Team Asia Tours</strong>

		// 				</div>

		// 		</div>
		// 		`,
		// );

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
