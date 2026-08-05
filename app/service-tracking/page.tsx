'use client';

import ServiceTracking from '@/components/ServiceTracking';
import { Suspense } from 'react';

export default function ServiceTrackingPage() {
	return (
		<div className='min-h-screen bg-background'>
			<div className='py-12 px-4'>
				<Suspense fallback={<div>Loading...</div>}>
					<ServiceTracking />
				</Suspense>
			</div>
		</div>
	);
}
