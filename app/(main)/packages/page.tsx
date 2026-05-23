'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { PackagesSection } from '@/components/home/PackagesSection';
import { TravelPackage } from '@/data/packages';
import { Loader } from 'lucide-react';
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
			<div className='pt-20'>
				<PageBanner
					title='Travel Packages'
					subtitle='Explore our curated collection of travel experiences designed to create unforgettable memories'
				/>

				{loading ? (
					<div className='flex items-center justify-center py-12'>
						<Loader className='w-8 h-8 animate-spin text-primary' />
					</div>
				) : (
					<PackagesSection packages={packages} />
				)}
			</div>
		</div>
	);
};

export default Packages;
