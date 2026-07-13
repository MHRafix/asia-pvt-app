import { connectDB } from '@/lib/db/connection';
import { Invoice } from '@/lib/models/Invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const serviceId = searchParams.get('serviceId');

		const invoice = await Invoice.findOne({ linkedServiceId: serviceId })
			.populate('clientId', 'name email phone company')
			.populate('linkedServiceId', 'serviceTitle serviceCost serviceStatus');

		return NextResponse.json({
			success: true,
			data: invoice,
			exist: Boolean(invoice),
		});
	} catch (error) {
		console.error('Error fetching invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch invoice' },
			{ status: 500 },
		);
	}
}
