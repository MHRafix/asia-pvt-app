import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { DailyService } from '@/lib/models/DailyService';
import { ClientActivity } from '@/lib/models/ClientActivity';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const serviceId = searchParams.get('serviceId') || '';

		if (!serviceId || serviceId.length < 1) {
			return NextResponse.json(
				{ success: false, error: 'Service ID is required' },
				{ status: 400 }
			);
		}

		// Search by service ID
		const service = await DailyService.findOne({
			serviceId: { $regex: serviceId, $options: 'i' },
		})
			.populate('linkedClientId', 'name email phone company')
			.populate('assignedEmployeeId', 'name email');

		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 }
			);
		}

		// Get service activities
		const activities = await ClientActivity.find({
			metadata: {
				$exists: true,
				serviceId: service._id,
			},
		})
			.sort({ createdAt: -1 })
			.limit(50);

		return NextResponse.json({
			success: true,
			data: {
				service,
				activities: activities || [],
			},
		});
	} catch (error) {
		console.error('Error searching service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to search service' },
			{ status: 500 }
		);
	}
}
