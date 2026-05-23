import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Service } from '@/lib/models/Service';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('[v0] Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.slug || !body.title || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newService = await Service.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating service:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create service' },
      { status: 500 }
    );
  }
}
