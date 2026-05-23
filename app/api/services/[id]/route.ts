import { connectDB } from '@/lib/db/connection';
import { Service } from '@/lib/models/Service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const service = await Service.findById(id);

		if (!service) {
			return NextResponse.json(
				{ success: false, message: 'Service not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: service });
	} catch (error) {
		console.error('[v0] Error fetching service:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch service' },
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

		const updatedService = await Service.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedService) {
			return NextResponse.json(
				{ success: false, message: 'Service not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedService });
	} catch (error) {
		console.error('[v0] Error updating service:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update service' },
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

		const deletedService = await Service.findByIdAndDelete(id);

		if (!deletedService) {
			return NextResponse.json(
				{ success: false, message: 'Service not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedService });
	} catch (error) {
		console.error('[v0] Error deleting service:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete service' },
			{ status: 500 },
		);
	}
}
