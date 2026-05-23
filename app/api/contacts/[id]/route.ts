import { connectDB } from '@/lib/db/connection';
import { Contact } from '@/lib/models/Contact';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const contact = await Contact.findById(id);

		if (!contact) {
			return NextResponse.json(
				{ success: false, message: 'Contact not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: contact });
	} catch (error) {
		console.error('[v0] Error fetching contact:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch contact' },
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

		const updatedContact = await Contact.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedContact) {
			return NextResponse.json(
				{ success: false, message: 'Contact not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedContact });
	} catch (error) {
		console.error('[v0] Error updating contact:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update contact' },
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

		const deletedContact = await Contact.findByIdAndDelete(id);

		if (!deletedContact) {
			return NextResponse.json(
				{ success: false, message: 'Contact not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedContact });
	} catch (error) {
		console.error('[v0] Error deleting contact:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete contact' },
			{ status: 500 },
		);
	}
}
