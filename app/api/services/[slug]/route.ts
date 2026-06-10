import { connectDB } from '@/lib/db/connection';
import { Service } from '@/lib/models/Service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		await connectDB();
		const { slug } = await params;

		const service = await Service.findOne({ slug });

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
