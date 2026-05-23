'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VisaCountry } from '@/data/countries';
import {
	ArrowLeft,
	ArrowRight,
	DollarSign,
	FileCheck,
	Lightbulb,
	Loader,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const VisaCountry = () => {
	const { slug } = useParams<{ slug: string }>();
	const router = useRouter();

	const [country, setCountry] = useState<VisaCountry>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCountry();
	}, []);

	const fetchCountry = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/visa/${slug}`);
			const data = await response.json();
			if (data.success) {
				setCountry(data.data);
			}
		} catch (error) {
			console.error('Error fetching countries:', error);
			toast.error('Failed to fetch visa countries');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader className='w-8 h-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!country) {
		return (
			<div className='min-h-screen'>
				<div className='pt-40 text-center'>
					<h1 className='font-display text-3xl font-bold text-foreground mb-4'>
						Country Not Found
					</h1>
					<Button variant='ocean' asChild>
						<Link href='/visa'>Browse All Countries</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				<PageBanner
					title={`${country.flag} ${country.name} Visa`}
					subtitle={`${country.type} — Processing: ${country.processing}`}
					gradient='ocean'
				/>

				<section className='py-16 bg-background'>
					<div className='container mx-auto px-4'>
						<Button
							variant='ghost'
							className='mb-8'
							onClick={() => router.back()}
						>
							<ArrowLeft className='w-4 h-4' />
							Back to Visa Services
						</Button>

						{/* Overview */}
						<div className='max-w-3xl mb-16'>
							<h2 className='font-display text-2xl font-bold text-foreground mb-4'>
								Overview
							</h2>
							<p className='font-body text-muted-foreground leading-relaxed'>
								{country.description}
							</p>
						</div>

						<div className='grid lg:grid-cols-2 gap-12 mb-16'>
							{/* Requirements */}
							<div>
								<Card className='border-0 shadow-card h-full'>
									<CardContent className='p-8'>
										<div className='flex items-center gap-3 mb-6'>
											<div className='w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center'>
												<FileCheck className='w-5 h-5 text-ocean' />
											</div>
											<h3 className='font-display text-xl font-bold text-foreground'>
												Requirements
											</h3>
										</div>
										<ul className='space-y-3'>
											{country.requirements.map((req) => (
												<li key={req} className='flex items-start gap-3'>
													<span className='w-2 h-2 rounded-full bg-ocean mt-2 flex-shrink-0' />
													<span className='font-body text-foreground'>
														{req}
													</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>

							{/* Documents */}
							<div>
								<Card className='border-0 shadow-card h-full'>
									<CardContent className='p-8'>
										<div className='flex items-center gap-3 mb-6'>
											<div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
												<FileCheck className='w-5 h-5 text-primary' />
											</div>
											<h3 className='font-display text-xl font-bold text-foreground'>
												Documents Needed
											</h3>
										</div>
										<ul className='space-y-3'>
											{country.documents.map((doc) => (
												<li key={doc} className='flex items-start gap-3'>
													<span className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0' />
													<span className='font-body text-foreground'>
														{doc}
													</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Fees & Tips */}
						<div className='grid lg:grid-cols-2 gap-12'>
							{/* Fees */}
							<div>
								<Card className='border-0 shadow-card h-full'>
									<CardContent className='p-8'>
										<div className='flex items-center gap-3 mb-6'>
											<div className='w-10 h-10 rounded-xl bg-sunset/20 flex items-center justify-center'>
												<DollarSign className='w-5 h-5 text-foreground' />
											</div>
											<h3 className='font-display text-xl font-bold text-foreground'>
												Visa Fees
											</h3>
										</div>
										<div className='space-y-4'>
											{country.fees.map((fee) => (
												<div
													key={fee.type}
													className='flex items-center justify-between p-3 rounded-xl bg-muted'
												>
													<span className='font-body text-foreground'>
														{fee.type}
													</span>
													<span className='font-display font-bold text-primary'>
														{fee.amount}
													</span>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Tips */}
							<div>
								<Card className='border-0 shadow-card h-full'>
									<CardContent className='p-8'>
										<div className='flex items-center gap-3 mb-6'>
											<div className='w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center'>
												<Lightbulb className='w-5 h-5 text-forest' />
											</div>
											<h3 className='font-display text-xl font-bold text-foreground'>
												Pro Tips
											</h3>
										</div>
										<ul className='space-y-3'>
											{country.tips.map((tip) => (
												<li key={tip} className='flex items-start gap-3'>
													<Lightbulb className='w-4 h-4 text-forest mt-1 flex-shrink-0' />
													<span className='font-body text-foreground'>
														{tip}
													</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* CTA */}
						<div className='mt-16 text-center'>
							<Card className='border-0 shadow-elevated bg-primary'>
								<CardContent className='p-12'>
									<h3 className='font-display text-2xl font-bold text-primary-foreground mb-4'>
										Need Help With Your {country.name} Visa?
									</h3>
									<p className='font-body text-primary-foreground/80 mb-8 max-w-xl mx-auto'>
										Our visa specialists will handle the entire application
										process for you.
									</p>
									<div className='flex flex-col sm:flex-row gap-4 justify-center'>
										<Button variant='hero' size='xl' asChild>
											<Link href='/services/visa-consultation'>
												Book Visa Consultation
												<ArrowRight className='w-5 h-5' />
											</Link>
										</Button>
										<Button variant='heroOutline' size='xl' asChild>
											<Link href='/contact'>Contact Us</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default VisaCountry;
