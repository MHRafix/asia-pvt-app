import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { VisaCountry } from '@/lib/models/VisaCountry';

export async function GET() {
  try {
    await connectDB();
    const countries = await VisaCountry.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: countries });
  } catch (error) {
    console.error('[v0] Error fetching visa countries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch visa countries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.slug || !body.name || !body.flag) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCountry = await VisaCountry.create(body);
    return NextResponse.json({ success: true, data: newCountry }, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating visa country:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create visa country' },
      { status: 500 }
    );
  }
}
