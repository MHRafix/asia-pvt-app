import { connectDB } from '@/lib/db/connection';
import { VisaCountry } from '@/lib/models/VisaCountry';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const country = await VisaCountry.findOne({ slug: id });

		if (!country) {
			return NextResponse.json(
				{ success: false, message: 'Visa country not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: country });
	} catch (error) {
		console.error('[v0] Error fetching visa country:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch visa country' },
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

		const updatedCountry = await VisaCountry.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedCountry) {
			return NextResponse.json(
				{ success: false, message: 'Visa country not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedCountry });
	} catch (error) {
		console.error('[v0] Error updating visa country:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update visa country' },
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

		const deletedCountry = await VisaCountry.findByIdAndDelete(id);

		if (!deletedCountry) {
			return NextResponse.json(
				{ success: false, message: 'Visa country not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedCountry });
	} catch (error) {
		console.error('[v0] Error deleting visa country:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete visa country' },
			{ status: 500 },
		);
	}
}
