import { connectDB } from '@/lib/db/connection';
import { Package } from '@/lib/models/Package';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;
		console.log(id);
		const pkg = await Package.findOne({ id });

		if (!pkg) {
			return NextResponse.json(
				{ success: false, message: 'Package not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: pkg });
	} catch (error) {
		console.error('[v0] Error fetching package:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch package' },
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
		const { id } = await params;

		const body = await request.json();

		const updatedPackage = await Package.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedPackage) {
			return NextResponse.json(
				{ success: false, message: 'Package not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedPackage });
	} catch (error) {
		console.error('[v0] Error updating package:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update package' },
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

		const deletedPackage = await Package.findByIdAndDelete(id);

		if (!deletedPackage) {
			return NextResponse.json(
				{ success: false, message: 'Package not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedPackage });
	} catch (error) {
		console.error('[v0] Error deleting package:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete package' },
			{ status: 500 },
		);
	}
}
