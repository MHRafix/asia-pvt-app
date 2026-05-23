import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Employee } from '@/lib/models/Employee';
import { employeeUpdateSchema } from '@/lib/validations/employee';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;

		const employee = await Employee.findById(id);
		if (!employee) {
			return NextResponse.json(
				{ success: false, error: 'Employee not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: employee,
		});
	} catch (error) {
		console.error('Error fetching employee:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch employee' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;
		const body = await request.json();

		// Validate with Zod
		const validationResult = employeeUpdateSchema.safeParse(body);
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

		const existingEmployee = await Employee.findById(id);
		if (!existingEmployee) {
			return NextResponse.json(
				{ success: false, error: 'Employee not found' },
				{ status: 404 }
			);
		}

		// Check if email is being changed and if it's already in use
		if (body.email && body.email !== existingEmployee.email) {
			const emailExists = await Employee.findOne({
				email: body.email,
				_id: { $ne: id },
			});
			if (emailExists) {
				return NextResponse.json(
					{ success: false, error: 'Email is already in use' },
					{ status: 400 }
				);
			}
		}

		const employee = await Employee.findByIdAndUpdate(
			id,
			validationResult.data,
			{ new: true, runValidators: true }
		);

		return NextResponse.json({ success: true, data: employee });
	} catch (error) {
		console.error('Error updating employee:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update employee' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;

		const employee = await Employee.findById(id);
		if (!employee) {
			return NextResponse.json(
				{ success: false, error: 'Employee not found' },
				{ status: 404 }
			);
		}

		await Employee.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: 'Employee deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting employee:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete employee' },
			{ status: 500 }
		);
	}
}
