'use client';

import ClientDetail from '@/components/dashboard/crm/client-management/ClientDetail';
import { use } from 'react';

export default function ClientDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return <ClientDetail clientId={id} />;
}
