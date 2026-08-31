'use client';

import InvoiceDetails from '@/components/dashboard/crm/invoice-management/InvoiceDetails';
import { use } from 'react';

export default function InvoicePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return <InvoiceDetails invoiceId={id} />;
}
