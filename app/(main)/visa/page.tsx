'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { VisaCountry } from '@/data/countries';
import { Loader, Search } from 'lucide-react';
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

	const CountryGrid = ({
		title,
		countryList,
	}: {
		title: string;
		countryList: typeof countries;
	}) => {
		const [query, setQuery] = useState('');

		const result = countryList.filter((country) =>
			country?.name.toLowerCase().includes(query.toLowerCase()),
		);
		return (
			<section className='py-16 bg-background'>
				<div className='container mx-auto px-4'>
					<div className='grid space-y-6 mb-12 '>
						<h2 className='font-display text-3xl md:text-4xl font-bold text-foreground text-center'>
							{title}
						</h2>

						<div className='mx-auto w-full max-w-2xl'>
							<div className='group relative'>
								{/* Glow Effect */}
								<div className='absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 opacity-10 blur transition-all duration-500 group-focus-within:opacity-30' />

								{/* Search Box */}
								<div className='relative flex items-center overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-sm'>
									<Search className='ml-4 h-5 w-5 text-slate-400' />

									<Input
										type='search'
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder='Find your expected destination...'
										className='border-0 bg-transparent py-6 !text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
						{result?.map((country) => (
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
	};

	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Visa Destinations We Serve'
				subtitle='Explore visa services for multiple destinations worldwide, backed by expert guidance, transparent processes, and dedicated support throughout your application journey.'
			/>
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : (
				<>
					<CountryGrid title='Countries We Support' countryList={countries} />
				</>
			)}
		</div>
	);
};

export default Visa;
