'use client';

import InvoiceDetailPage from '@/components/admin/crm/InvoiceDetailPage';

export default function InvoicePage({ params }: { params: { id: string } }) {
	return <InvoiceDetailPage invoiceId={params.id} />;
}
