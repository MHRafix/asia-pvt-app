'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { PackagesSection } from '@/components/home/PackagesSection';
import { TravelPackage } from '@/data/packages';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Packages = () => {
	const [packages, setPackages] = useState<TravelPackage[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPackages();
	}, []);

	const fetchPackages = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/packages');
			const data = await response.json();
			if (data.success) {
				setPackages(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching packages:', error);
			toast.error('Failed to fetch packages');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Travel Packages'
				subtitle='Explore our curated collection of travel experiences designed to create unforgettable memories'
				backgroundImage='https://images.unsplash.com/photo-1768147765107-5eef8e032a62?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
			/>

			<PackagesSection
				packages={packages}
				loading={loading}
				isShowActionBtn={false}
			/>
		</div>
	);
};

export default Packages;
