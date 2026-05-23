'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VisaCountry } from '@/data/countries';
import { ArrowRight, Clock, FileCheck, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
	{
		icon: FileCheck,
		title: 'Document Preparation',
		description:
			'We handle all paperwork and ensure your application is complete',
	},
	{
		icon: Clock,
		title: 'Fast Processing',
		description: 'Express processing available for urgent travel requirements',
	},
	{
		icon: Shield,
		title: 'Expert Guidance',
		description: 'Our visa experts guide you through the entire process',
	},
];

export function VisaSection({ countries }: { countries: VisaCountry[] }) {
	const router = useRouter();

	return (
		<section className='py-24 bg-muted'>
			<div className='container mx-auto px-4'>
				<div className='grid lg:grid-cols-2 gap-16 items-center'>
					<div>
						<span className='inline-block px-4 py-2 rounded-full bg-ocean/10 text-ocean font-body text-sm font-medium mb-4'>
							Visa Services
						</span>
						<h2 className='font-display text-4xl md:text-5xl font-bold text-foreground mb-6'>
							Hassle-Free Visa Assistance
						</h2>
						<p className='font-body text-muted-foreground text-lg mb-8'>
							Navigate complex visa requirements with ease. Our expert team
							ensures your documentation is perfect and your application has the
							best chance of approval.
						</p>

						<div className='space-y-6 mb-8'>
							{features.map((feature) => (
								<div key={feature.title} className='flex gap-4'>
									<div className='w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0'>
										<feature.icon className='w-6 h-6 text-ocean' />
									</div>
									<div>
										<h4 className='font-display text-lg font-semibold text-foreground mb-1'>
											{feature.title}
										</h4>
										<p className='font-body text-muted-foreground'>
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<Button variant='ocean' size='lg' asChild>
							<Link href='/visa'>
								Check Visa Requirements
								<ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>

					<div>
						<div className='grid grid-cols-2 gap-4'>
							{countries.slice(0, 6).map((country) => (
								<Card
									key={country.slug}
									className='border-0 shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer group'
									onClick={() => router.push(`/visa/${country.slug}`)}
								>
									<CardContent className='p-4'>
										<div className='flex items-center gap-3 mb-3'>
											<span className='text-3xl'>{country.flag}</span>
											<h4 className='font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors'>
												{country.name}
											</h4>
										</div>
										<div className='space-y-1'>
											<p className='font-body text-xs text-muted-foreground'>
												{country.type}
											</p>
											<p className='font-body text-sm text-primary font-medium'>
												{country.processing}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<div className='mt-6 p-4 rounded-xl bg-card border border-border'>
							<div className='flex items-center gap-3'>
								<Globe className='w-5 h-5 text-ocean' />
								<p className='font-body text-sm text-muted-foreground'>
									<span className='font-medium text-foreground'>
										50+ Countries
									</span>{' '}
									— We assist with visa applications worldwide
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
