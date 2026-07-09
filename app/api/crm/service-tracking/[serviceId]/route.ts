import { connectDB } from '@/lib/db/connection';
import { DailyService } from '@/lib/models/DailyService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ serviceId: string }> },
) {
	try {
		await connectDB();

		const { serviceId } = await params;

		if (!serviceId || serviceId.length < 1) {
			return NextResponse.json(
				{ success: false, error: 'Service ID is required' },
				{ status: 400 },
			);
		}

		// Search by service ID
		const service = await DailyService.findById({ _id: serviceId })
			.populate('linkedClientId', 'name email phone company')
			.populate('assignedEmployeeId', 'name phone');

		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

	
		return NextResponse.json({
			success: true,
			data: {
				service
			},
		});
	} catch (error) {
		console.error('Error searching service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to search service' },
			{ status: 500 },
		);
	}
}
