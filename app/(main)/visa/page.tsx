'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { Card, CardContent } from '@/components/ui/card';
import { VisaCountry } from '@/data/countries';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Visa = () => {
	const router = useRouter();

	const [countries, setCountries] = useState<VisaCountry[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCountries();
	}, []);

	const fetchCountries = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/visa');
			const data = await response.json();
			if (data.success) {
				setCountries(data.data);
			}
		} catch (error) {
			console.error('Error fetching countries:', error);
			toast.error('Failed to fetch visa countries');
		} finally {
			setLoading(false);
		}
	};

	// Separate countries into Asia and Europe
	const asiaCountries = countries.slice(0, 10);
	const europeCountries = countries.slice(10, 20);

	const CountryGrid = ({
		title,
		countryList,
	}: {
		title: string;
		countryList: typeof countries;
	}) => (
		<section className='py-16 bg-background'>
			<div className='container mx-auto px-4'>
				<h2 className='font-display text-3xl md:text-4xl font-bold text-foreground mb-12 text-center'>
					{title}
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
					{countryList.map((country) => (
						<Card
							key={country.slug}
							className='border-0 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group overflow-hidden'
							onClick={() => router.push(`/visa/${country.slug}`)}
						>
							<CardContent className='p-4 text-center h-full flex flex-col items-center justify-center'>
								<div className='text-5xl mb-3'>{country.flag}</div>
								<h3 className='font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2'>
									{country.name}
								</h3>
								<p className='font-body text-xs text-muted-foreground mb-2'>
									{country.type}
								</p>
								<p className='font-body text-xs text-primary font-medium'>
									{country.processing}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);

	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Visa Services'
				subtitle='Explore visa requirements for 20+ countries across Asia and Europe with expert guidance'
			/>
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : (
				<>
					<CountryGrid title='Asian Countries' countryList={asiaCountries} />
					<CountryGrid
						title='European Countries'
						countryList={europeCountries}
					/>
				</>
			)}
		</div>
	);
};

export default Visa;
