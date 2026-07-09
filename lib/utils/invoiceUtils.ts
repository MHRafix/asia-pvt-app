import { Invoice } from '@/lib/models/Invoice';

/**
 * Generate a unique invoice number with format: INV-YYYYMMDD-XXXXX
 */
export async function generateUniqueInvoiceNumber(): Promise<string> {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const dateStr = `${year}${month}${day}`;

	// Get count of invoices created today to make unique suffix
	const todayStart = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const todayEnd = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() + 1,
	);

	const countToday = await Invoice.countDocuments({
		createdAt: {
			$gte: todayStart,
			$lt: todayEnd,
		},
	});

	const suffix = String(countToday + 1).padStart(5, '0');
	const invoiceNumber = `INV-${dateStr}-${suffix}`;

	// Ensure uniqueness (failsafe)
	let isUnique = false;
	let counter = 0;
	let finalInvoiceNumber = invoiceNumber;

	while (!isUnique && counter < 10) {
		const existing = await Invoice.findOne({
			invoiceNumber: finalInvoiceNumber,
		});
		if (!existing) {
			isUnique = true;
		} else {
			counter++;
			finalInvoiceNumber = `INV-${dateStr}-${String(countToday + counter + 1).padStart(5, '0')}`;
		}
	}

	return finalInvoiceNumber;
}

/**
 * Calculate invoice status based on paid amount and total amount
 */
export function calculateInvoiceStatus(
	paidAmount: number,
	grandTotal: number,
): 'paid' | 'due' | 'partial' {
	if (paidAmount <= 0) return 'due';
	if (paidAmount >= grandTotal) return 'paid';
	return 'partial';
}

/**
 * Calculate due amount for an invoice
 */
export function calculateDueAmount(
	grandTotal: number,
	paidAmount: number,
): number {
	const due = grandTotal - paidAmount;
	return Math.max(0, due);
}
