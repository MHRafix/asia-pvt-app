'use client';

import InvoiceDetails from '@/components/admin/crm/InvoiceDemo';
import { use } from 'react';

export default function InvoicePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return <InvoiceDetails invoiceId={id} />;
}
