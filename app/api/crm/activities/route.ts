import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientActivity } from '@/lib/models/ClientActivity';
import { clientActivitySchema } from '@/lib/validations/crm';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const clientId = searchParams.get('clientId');
		const type = searchParams.get('type');
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (clientId) query.clientId = clientId;
		if (type) query.type = type;

		const [activities, total] = await Promise.all([
			ClientActivity.find(query)
				.populate('clientId', 'name email')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			ClientActivity.countDocuments(query),
		]);

		return NextResponse.json({
			success: true,
			data: activities,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching activities:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch activities' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = clientActivitySchema.safeParse(body);
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

		const { clientId } = validationResult.data;

		// Check if client exists
		const client = await Client.findById(clientId);
		if (!client) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 }
			);
		}

		const activity = await ClientActivity.create(validationResult.data);

		// Update client's last activity date
		await Client.findByIdAndUpdate(clientId, { lastActivityDate: new Date() });

		return NextResponse.json({ success: true, data: activity }, { status: 201 });
	} catch (error) {
		console.error('Error creating activity:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create activity' },
			{ status: 500 }
		);
	}
}
