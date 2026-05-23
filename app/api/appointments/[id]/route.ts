import { connectDB } from '@/lib/db/connection';
import { Appointment } from '@/lib/models/Appointment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();

		const { id } = await params;

		const appointment = await Appointment.findById(id);

		if (!appointment) {
			return NextResponse.json(
				{ success: false, message: 'Appointment not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: appointment });
	} catch (error) {
		console.error('[v0] Error fetching appointment:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch appointment' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const body = await request.json();

		const { id } = await params;

		const updatedAppointment = await Appointment.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedAppointment) {
			return NextResponse.json(
				{ success: false, message: 'Appointment not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedAppointment });
	} catch (error) {
		console.error('[v0] Error updating appointment:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update appointment' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();

		const { id } = await params;

		const deletedAppointment = await Appointment.findByIdAndDelete(id);

		if (!deletedAppointment) {
			return NextResponse.json(
				{ success: false, message: 'Appointment not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedAppointment });
	} catch (error) {
		console.error('[v0] Error deleting appointment:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete appointment' },
			{ status: 500 },
		);
	}
}
