import { connectDB } from '@/lib/db/connection';
import { sendMail } from '@/lib/mail-service/mail';
import { Client } from '@/lib/models/Client';
import { DailyService } from '@/lib/models/DailyService';
import { Employee } from '@/lib/models/Employee';
import { generateUniqueServiceId } from '@/lib/utils/generateServiceId';
import { dailyServiceSchema } from '@/lib/validations/crm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const status = searchParams.get('status') || '';
		const clientId = searchParams.get('clientId') || '';
		const employeeId = searchParams.get('employeeId') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (search) {
			query.$or = [
				{ serviceId: { $regex: search, $options: 'i' } },
				{ serviceTitle: { $regex: search, $options: 'i' } },
			];
		}

		if (status && status !== 'all') {
			query.serviceStatus = status;
		}

		if (clientId) {
			query.linkedClientId = clientId;
		}

		if (employeeId) {
			query.assignedEmployeeId = employeeId;
		}

		const [services, total] = await Promise.all([
			DailyService.find(query)
				.populate('linkedClientId', 'name email phone company')
				.populate('assignedEmployeeId', 'name email')
				.populate('serviceRefId', 'title')
				.populate('createdBy', 'name email phone')
				.sort({ createdDate: -1 })
				.skip(skip)
				.limit(limit),
			DailyService.countDocuments(query),
		]);

		// Get stats
		const stats = await DailyService.aggregate([
			{
				$match: query,
			},
			{
				$group: {
					_id: null,
					totalServices: { $sum: 1 },
					pendingServices: {
						$sum: { $cond: [{ $eq: ['$serviceStatus', 'pending'] }, 1, 0] },
					},
					completedServices: {
						$sum: { $cond: [{ $eq: ['$serviceStatus', 'completed'] }, 1, 0] },
					},
					totalCost: { $sum: '$serviceCost' },
				},
			},
		]);

		return NextResponse.json({
			success: true,
			data: services,
			stats: stats[0] || {
				totalServices: 0,
				pendingServices: 0,
				completedServices: 0,
				totalCost: 0,
			},
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching daily services:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch daily services' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = dailyServiceSchema.safeParse(body);
		// console.log({ body, validationResult });

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

		// Verify client exists
		const clientExists = await Client.findById(
			validationResult.data.linkedClientId,
		);
		if (!clientExists) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		// Verify employee exists if provided
		if (validationResult.data.assignedEmployeeId) {
			const employeeExists = await Employee.findById(
				validationResult.data.assignedEmployeeId,
			);
			if (!employeeExists) {
				return NextResponse.json(
					{ success: false, error: 'Employee not found' },
					{ status: 404 },
				);
			}
		}

		// Generate unique service ID
		const serviceId = await generateUniqueServiceId();

		const service = await DailyService.create({
			...validationResult.data,
			serviceId,
			// serviceRefId: '6a2ad6540ca520dad963be9a',
		});

		await sendMail(
			clientExists?.email,
			`You booked a new service: ${validationResult?.data?.serviceTitle}`,
			`<div>
		
				<div>
		<h1 style="
				margin:0;
				font-size:30px;
				color:#111827;
				font-weight:700;
		">
				Service Booked
		</h1>
		
		<p style="
				margin:15px 0 0;
				color:#6b7280;
				font-size:16px;
				line-height:1.8;
		">
				Hey <strong>${clientExists?.name}</strong>,
				<br><br>
				Thank you for choosing our service. Your service has been successfully booked. Currently your service is <strong style="color: blue;">in-progress</strong>, we'll complete it as soon as possible.
		</p>
		
		<p style="color: blue;">Thank You</p>
		<strong style="color: #ccc;">Team Asia Tours</strong>
		
				</div>
		
		</div>
		`,
		);

		// Update client's total services count
		await Client.findByIdAndUpdate(validationResult.data.linkedClientId, {
			$inc: { totalServices: 1 },
		});

		const populatedService = await service.populate([
			{ path: 'linkedClientId', select: 'name email phone company' },
			{ path: 'assignedEmployeeId', select: 'name email' },
			{
				path: 'serviceRefId',
				select: 'title',
			},
		]);

		return NextResponse.json(
			{ success: true, data: populatedService },
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating daily service:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create daily service' },
			{ status: 500 },
		);
	}
}
