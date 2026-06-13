'use client';

import { PageBanner } from '@/components/common/PageBanner';
import AppointmentContent from '@/components/main/AppointmentContent';

import { Suspense } from 'react';

const AppointmentPage = () => {
	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Book an Appointment'
				subtitle='Schedule a consultation with our travel experts and get personalized assistance'
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<AppointmentContent />
			</Suspense>
		</div>
	);
};

export default AppointmentPage;
