import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { DailyService } from '@/lib/models/DailyService';
import { Employee } from '@/lib/models/Employee';
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

		const dailyService = await DailyService.findOne({ serviceId });

		if (!dailyService) {
			return NextResponse.json(
				{
					success: false,
					error: 'Service not found',
				},
				{ status: 404 },
			);
		}

		const employee = await Employee.findById(dailyService?.assignedEmployeeId);
		const client = await Client.findById(dailyService?.linkedClientId);

		return NextResponse.json(
			{
				success: true,
				data: {
					service: {
						_id: dailyService?._id,
						serviceId: dailyService?.serviceId,
						serviceTitle: dailyService?.serviceTitle,
						passportNo: dailyService?.passportNo,
						serviceCost: dailyService?.serviceCost,
						serviceStatus: dailyService?.serviceStatus,
						createdDate: '2026-07-28T18:08:06.225Z',
						assignedEmployeeId: {
							name: employee?.name,
							phone: employee?.phone,
						},
						linkedClientId: {
							name: client?.name,
							phone: client?.phone,
							email: client?.email,
						},
					},
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
