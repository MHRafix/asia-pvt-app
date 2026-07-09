import { connectDB } from '@/lib/db/connection';
import { Invoice } from '@/lib/models/Invoice';
import { DailyService } from '@/lib/models/DailyService';
import { Client } from '@/lib/models/Client';
import { generateUniqueInvoiceNumber } from '@/lib/utils/invoiceUtils';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payment/invoices/generate
 * Generate an invoice directly from a daily service
 * Body: { serviceId: string }
 */
export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();
		const { serviceId } = body;

		if (!serviceId) {
			return NextResponse.json(
				{ success: false, error: 'Service ID is required' },
				{ status: 400 },
			);
		}

		// Check if invoice already exists for this service
		const existingInvoice = await Invoice.findOne({ linkedServiceId: serviceId });
		if (existingInvoice) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invoice already exists for this service',
					invoiceId: existingInvoice._id,
				},
				{ status: 400 },
			);
		}

		// Fetch the daily service
		const service = await DailyService.findById(serviceId).populate(
			'linkedClientId',
			'name email phone company',
		);

		if (!service) {
			return NextResponse.json(
				{ success: false, error: 'Service not found' },
				{ status: 404 },
			);
		}

		// Verify client exists
		const client = await Client.findById(service.linkedClientId);
		if (!client) {
			return NextResponse.json(
				{ success: false, error: 'Client not found' },
				{ status: 404 },
			);
		}

		// Generate unique invoice number
		const invoiceNumber = await generateUniqueInvoiceNumber();

		// Create invoice from service data
		const invoice = await Invoice.create({
			invoiceNumber,
			clientId: service.linkedClientId,
			linkedServiceId: serviceId,
			amount: service.serviceCost,
			paymentMethod: 'cash',
			transactionStatus: 'pending',
			description: service.serviceTitle,
			notes: service.serviceDescription || '',
		});

		const populatedInvoice = await invoice.populate([
			{ path: 'clientId', select: 'name email phone company' },
			{ path: 'linkedServiceId', select: 'serviceTitle serviceCost serviceStatus' },
		]);

		return NextResponse.json(
			{
				success: true,
				data: populatedInvoice,
				message: 'Invoice generated successfully',
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error generating invoice:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to generate invoice' },
			{ status: 500 },
		);
	}
}
