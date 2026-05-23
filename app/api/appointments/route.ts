import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Appointment } from '@/lib/models/Appointment';

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error('[v0] Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.fullName || !body.email || !body.phone || !body.service) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAppointment = await Appointment.create(body);
    return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
