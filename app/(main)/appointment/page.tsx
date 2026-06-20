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
				backgroundImage='https://plus.unsplash.com/premium_photo-1661964194420-d1237f0b7bd8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<AppointmentContent />
			</Suspense>
		</div>
	);
};

export default AppointmentPage;
