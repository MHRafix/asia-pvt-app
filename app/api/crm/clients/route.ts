import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { ClientActivity } from '@/lib/models/ClientActivity';
import { clientSchema } from '@/lib/validations/crm';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const status = searchParams.get('status') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
				{ company: { $regex: search, $options: 'i' } },
				{ phone: { $regex: search, $options: 'i' } },
			];
		}

		if (status && status !== 'all') {
			query.status = status;
		}

		const [clients, total] = await Promise.all([
			Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Client.countDocuments(query),
		]);

		// Get stats
		const stats = await Client.aggregate([
			{
				$group: {
					_id: null,
					totalClients: { $sum: 1 },
					activeClients: {
						$sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
					},
					vipClients: {
						$sum: { $cond: [{ $eq: ['$status', 'vip'] }, 1, 0] },
					},
					totalRevenue: { $sum: '$totalSpent' },
					totalBalance: { $sum: '$balance' },
				},
			},
		]);

		return NextResponse.json({
			success: true,
			data: clients,
			stats: stats[0] || {
				totalClients: 0,
				activeClients: 0,
				vipClients: 0,
				totalRevenue: 0,
				totalBalance: 0,
			},
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching clients:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch clients' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = clientSchema.safeParse(body);
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

		// Check if client with email already exists
		const existingClient = await Client.findOne({ email: body.email });
		if (existingClient) {
			return NextResponse.json(
				{ success: false, error: 'A client with this email already exists' },
				{ status: 400 }
			);
		}

		const client = await Client.create(validationResult.data);

		// Create activity for new client
		await ClientActivity.create({
			clientId: client._id,
			type: 'note',
			title: 'Client Created',
			description: `New client ${client.name} was registered`,
		});

		return NextResponse.json({ success: true, data: client }, { status: 201 });
	} catch (error) {
		console.error('Error creating client:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create client' },
			{ status: 500 }
		);
	}
}
