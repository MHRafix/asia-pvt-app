'use client';

import heroImage from '@/assets/hero-beach.jpg';
import { Button } from '@/components/ui/button';

import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const popularDestinations = [
	'Australia',
	'Malaysia',
	'Thailand',
	'Japan',
	'Canada',
	'Greece',
	'United State',
	'Morocco',
	'India',
	'Pakistan',
	'Singapore',
];

type SearchTab = 'packages' | 'visa';

export function HeroSection() {
	const router = useRouter();
	const [showDestDropdown, setShowDestDropdown] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showCountryDropdown, setShowCountryDropdown] = useState(false);

	const handleVisaSearch = () => {
		if (searchQuery) {
			router.push(`/visa/${searchQuery}`);
		} else {
			router.push('/visa');
		}
	};

	const filteredDestinations = searchQuery
		? popularDestinations.filter((dest) =>
				dest.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: [];

	return (
		<section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
			<div className='absolute inset-0'>
				<Image
					src={heroImage}
					alt='Tropical paradise beach'
					className='w-full h-full object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent' />
			</div>

			<div className='container mx-auto px-4 relative z-10'>
				<div className='max-w-3xl'>
					<div className='inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 border border-primary/40'>
						<span className='h-2 w-2 rounded-full bg-primary animate-pulse' />
						<span className='text-sm font-medium text-white'>
							Your Journey Begins Here
						</span>
					</div>

					<h1 className='font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6'>
						Discover the World's
						<span className='block !text-primary'>Hidden Paradise</span>
					</h1>

					<p className='font-body text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl'>
						Explore breathtaking destinations, create unforgettable memories,
						and let us handle every detail of your perfect vacation.
					</p>

					<div className='flex flex-wrap gap-4'>
						<Button
							variant='hero'
							size='xl'
							onClick={() => router.push('/packages')}
						>
							Explore Packages
							<ArrowRight className='w-5 h-5' />
						</Button>
						<Button
							variant='heroOutline'
							size='xl'
							onClick={() => router.push('/appointment')}
						>
							Plan Your Trip
						</Button>
					</div>
				</div>
				<div className='w-full max-w-2xl space-y-4'>
					<div className='relative !mt-6'>
						<div className='flex items-center gap-3 rounded-full bg-white/95 backdrop-blur-md px-2 py-2 shadow-2xl border border-white/20 hover:shadow-3xl transition-all'>
							<MapPin className='h-5 w-5 text-primary ml-4 flex-shrink-0' />
							<input
								type='text'
								placeholder='Where are you going?'
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setShowSuggestions(true);
								}}
								onFocus={() => setShowSuggestions(true)}
								className='flex-1 bg-transparent px-2 py-3 text-foreground placeholder-muted-foreground outline-none text-base font-medium'
							/>
							<button
								onClick={handleVisaSearch}
								className='group rounded-full bg-primary p-3 text-primary-foreground hover:bg-primary/80 cursor-pointer transition-all mr-2 flex-shrink-0'
							>
								<Search className='h-5 w-5 group-hover:scale-110' />
							</button>
						</div>

						{/* Suggestions Dropdown */}
						{showSuggestions &&
							(filteredDestinations?.length > 0 || searchQuery === '') && (
								<div className='absolute top-full left-0 right-0 mt-3 rounded-2xl bg-white/98 backdrop-blur-lg border border-white/20 shadow-2xl overflow-y-auto z-5 h-56'>
									{filteredDestinations.length > 0 ? (
										<ul className='py-2'>
											{filteredDestinations.map((dest) => (
												<li key={dest}>
													<button
														onClick={() => {
															setSearchQuery(dest);
															setShowSuggestions(false);
														}}
														className='w-full px-6 py-3 flex items-center gap-3 text-left hover:bg-primary/10 transition-colors group'
													>
														<MapPin className='h-4 w-4 text-primary flex-shrink-0' />
														<span className='text-foreground font-medium group-hover:text-primary transition'>
															{dest}
														</span>
													</button>
												</li>
											))}
										</ul>
									) : (
										<div className='p-5 text-center'>
											<p className='text-muted-foreground font-bold text-xl mb-4'>
												Popular Destinations
											</p>
											<div className='grid grid-cols-2 gap-2'>
												{popularDestinations?.slice(0, 6).map((dest) => (
													<button
														key={dest}
														onClick={() => {
															setSearchQuery(dest);
															setShowSuggestions(false);
														}}
														className='p-2 font-medium rounded-lg text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors'
													>
														{dest}
													</button>
												))}
											</div>
										</div>
									)}
								</div>
							)}
					</div>

					{/* Trust Indicators */}
					<div className='flex items-center justify-start gap-6 flex-wrap text-sm'>
						<div className='flex items-center gap-2 text-white/80'>
							<span className='text-xl'>⭐</span>
							<span>10K+ Happy Travelers</span>
						</div>
						<div className='flex items-center gap-2 text-white/80'>
							<span className='text-xl'>✓</span>
							<span>Best Price Guarantee</span>
						</div>
						<div className='flex items-center gap-2 text-white/80'>
							<span className='text-xl'>🛡️</span>
							<span>24/7 Support</span>
						</div>
					</div>
				</div>
			</div>

			{/* Click outside to close dropdowns */}
			{(showDestDropdown || showCountryDropdown) && (
				<div
					className='fixed inset-0 z-40'
					onClick={() => {
						setShowDestDropdown(false);
						setShowCountryDropdown(false);
					}}
				/>
			)}
		</section>
	);
}
