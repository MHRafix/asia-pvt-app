import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Employee } from '@/lib/models/Employee';
import { employeeSchema } from '@/lib/validations/employee';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const status = searchParams.get('status') || '';
		const role = searchParams.get('role') || '';
		const department = searchParams.get('department') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const query: any = {};

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
				{ position: { $regex: search, $options: 'i' } },
			];
		}

		if (status && status !== 'all') {
			query.status = status;
		}

		if (role && role !== 'all') {
			query.role = role;
		}

		if (department && department !== 'all') {
			query.department = department;
		}

		const [employees, total] = await Promise.all([
			Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Employee.countDocuments(query),
		]);

		// Get stats
		const stats = await Employee.aggregate([
			{
				$group: {
					_id: null,
					totalEmployees: { $sum: 1 },
					activeEmployees: {
						$sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
					},
					onLeaveEmployees: {
						$sum: { $cond: [{ $eq: ['$status', 'on-leave'] }, 1, 0] },
					},
					adminCount: {
						$sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] },
					},
					totalSalary: { $sum: { $ifNull: ['$salary', 0] } },
				},
			},
		]);

		// Get unique departments
		const departments = await Employee.distinct('department');

		return NextResponse.json({
			success: true,
			data: employees,
			stats: stats[0] || {
				totalEmployees: 0,
				activeEmployees: 0,
				onLeaveEmployees: 0,
				adminCount: 0,
				totalSalary: 0,
			},
			departments: departments.filter(Boolean),
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error fetching employees:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch employees' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = employeeSchema.safeParse(body);
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

		// Check if employee with email already exists
		const existingEmployee = await Employee.findOne({ email: body.email });
		if (existingEmployee) {
			return NextResponse.json(
				{ success: false, error: 'An employee with this email already exists' },
				{ status: 400 }
			);
		}

		const employee = await Employee.create(validationResult.data);

		return NextResponse.json({ success: true, data: employee }, { status: 201 });
	} catch (error) {
		console.error('Error creating employee:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create employee' },
			{ status: 500 }
		);
	}
}
