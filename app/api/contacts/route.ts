import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Contact } from '@/lib/models/Contact';

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('[v0] Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.firstName || !body.lastName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newContact = await Contact.create(body);
    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating contact:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
