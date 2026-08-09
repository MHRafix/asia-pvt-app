import { connectDB } from '@/lib/db/connection';
import { DailyService } from '@/lib/models/DailyService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	await connectDB();

	try {
		const serviceId = request.nextUrl.searchParams.get('serviceId')?.trim();

		if (!serviceId) {
			return NextResponse.json(
				{
					success: false,
					error: 'Service ID is required',
				},
				{ status: 400 },
			);
		}

		const service = await DailyService.findOne({ serviceId })
			.select(
				'serviceId serviceStatus createdAt serviceCost createdDate linkedClientId assignedEmployeeId',
			)
			.populate({
				path: 'linkedClientId',
				select: 'name email phone',
			})
			.populate({
				path: 'assignedEmployeeId',
				select: 'name phone',
			})
			.lean()
			.exec();

		if (!service) {
			return NextResponse.json(
				{
					success: false,
					error: 'Service not found',
				},
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					service,
				},
			},
			{
				status: 200,
				headers: {
					'Cache-Control': 'private, max-age=30',
				},
			},
		);
	} catch (error) {
		console.error('GET /api/services error:', error);

		return NextResponse.json(
			{
				success: false,
				error: 'Internal server error',
			},
			{ status: 500 },
		);
	}
}
