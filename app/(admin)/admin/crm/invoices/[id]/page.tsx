'use client';

import InvoiceDetailPage from '@/components/admin/crm/InvoiceDetailPage';
import { use } from 'react';

export default function InvoicePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return <InvoiceDetailPage invoiceId={id} />;
}
