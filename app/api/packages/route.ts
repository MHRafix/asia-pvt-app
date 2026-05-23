import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Package } from '@/lib/models/Package';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const packages = await Package.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error('[v0] Error fetching packages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validation
    if (!body.id || !body.title || !body.location || !body.price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPackage = await Package.create(body);
    return NextResponse.json(
      { success: true, data: newPackage },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error creating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    );
  }
}
