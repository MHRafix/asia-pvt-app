'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TravelPackage } from '@/data/packages';
import {
	ArrowLeft,
	Calendar,
	Check,
	CheckCircle,
	Clock,
	Loader,
	MapPin,
	Star,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const PackageDetail = () => {
	const [pkg, setPackage] = useState<TravelPackage>();
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		fetchPackage();
	}, []);

	const fetchPackage = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/packages/${id}`);
			const data = await response.json();
			if (data.success) {
				setPackage(data.data);
			}
		} catch (error) {
			console.error('Error fetching package:', error);
			toast.error('Failed to fetch package');
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

	if (!pkg) {
		return (
			<div className='min-h-screen'>
				<div className='pt-40 text-center'>
					<h1 className='font-display text-3xl font-bold text-foreground mb-4'>
						Package Not Found
					</h1>

					<Button variant='coral' asChild>
						<Link href='/packages'>Browse All Packages</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				{/* Hero Image */}
				<div className='relative h-[50vh] min-h-[400px]'>
					<img
						src={pkg.image}
						alt={pkg.title}
						className='w-full h-full object-cover'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent' />
					<div className='absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10'>
						<Button
							variant='ghost'
							className='text-primary-foreground mb-4'
							onClick={() => router.back()}
						>
							<ArrowLeft className='w-4 h-4' />
							Back
						</Button>
						<div className='flex items-center gap-2 mb-2'>
							<MapPin className='w-4 h-4 text-primary' />
							<span className='font-body text-primary text-sm font-medium'>
								{pkg.location}
							</span>
						</div>
						<h1 className='font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4'>
							{pkg.title}
						</h1>
						<div className='flex flex-wrap items-center gap-6 text-primary-foreground/80'>
							<div className='flex items-center gap-2'>
								<Star className='w-5 h-5 text-accent fill-accent' />
								<span className='font-body font-medium'>{pkg.rating}</span>
								<span className='font-body text-sm'>
									({pkg.reviews} reviews)
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<Clock className='w-5 h-5' />
								<span className='font-body'>{pkg.duration}</span>
							</div>
							<div className='flex items-center gap-2'>
								<Users className='w-5 h-5' />
								<span className='font-body'>{pkg.groupSize} people</span>
							</div>
						</div>
					</div>
				</div>

				<div className='container mx-auto px-4 py-16'>
					<div className='grid lg:grid-cols-3 gap-12'>
						{/* Main Content */}
						<div className='lg:col-span-2 space-y-12'>
							{/* Description */}
							<div>
								<h2 className='font-display text-2xl font-bold text-foreground mb-4'>
									About This Package
								</h2>
								<p className='font-body text-muted-foreground leading-relaxed'>
									{pkg.description}
								</p>
							</div>

							{/* Highlights */}
							<div>
								<h2 className='font-display text-2xl font-bold text-foreground mb-4'>
									Highlights
								</h2>
								<div className='grid sm:grid-cols-2 gap-3'>
									{pkg.highlights.map((h) => (
										<div
											key={h}
											className='flex items-center gap-3 p-3 rounded-xl bg-primary/5'
										>
											<Check className='w-5 h-5 text-primary flex-shrink-0' />
											<span className='font-body text-foreground'>{h}</span>
										</div>
									))}
								</div>
							</div>

							{/* Itinerary */}
							<div>
								<h2 className='font-display text-2xl font-bold text-foreground mb-6'>
									Day-by-Day Itinerary
								</h2>
								<div className='space-y-4'>
									{pkg.itinerary.map((day) => (
										<div key={day.day} className='flex gap-4'>
											<div className='w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0'>
												<span className='font-body text-sm font-bold bg-primary py-1 px-3 rounded-full text-primary-foreground'>
													{day.day}
												</span>
											</div>
											<div className='flex-1 pb-4 border-b border-border last:border-0'>
												<h4 className='font-display text-lg font-semibold text-foreground'>
													{day.title}
												</h4>
												<p className='font-body text-muted-foreground mt-1'>
													{day.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Included / Not Included */}
							<div className='grid sm:grid-cols-2 gap-8'>
								<div>
									<h3 className='font-display text-xl font-bold text-foreground mb-4'>
										What's Included
									</h3>
									<ul className='space-y-3'>
										{pkg.included.map((item) => (
											<li key={item} className='flex items-start gap-2'>
												<CheckCircle className='w-5 h-5 text-forest mt-0.5 flex-shrink-0' />
												<span className='font-body text-foreground'>
													{item}
												</span>
											</li>
										))}
									</ul>
								</div>
								<div>
									<h3 className='font-display text-xl font-bold text-foreground mb-4'>
										Not Included
									</h3>
									<ul className='space-y-3'>
										{pkg.notIncluded.map((item) => (
											<li key={item} className='flex items-start gap-2'>
												<X className='w-5 h-5 text-destructive mt-0.5 flex-shrink-0' />
												<span className='font-body text-muted-foreground'>
													{item}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						{/* Sidebar - Booking Card */}
						<div>
							<Card className='border-0 shadow-elevated sticky top-28 p-0'>
								<CardContent className='p-8'>
									<div className='mb-6'>
										<span className='font-body text-sm text-muted-foreground'>
											Starting from
										</span>
										<p className='font-display text-4xl font-bold text-foreground'>
											${pkg.price.toLocaleString()}
										</p>
										<span className='font-body text-sm text-muted-foreground'>
											per person
										</span>
									</div>

									<div className='space-y-4 mb-6'>
										<div className='p-3 rounded-xl bg-muted flex items-center gap-3'>
											<Clock className='w-5 h-5 text-primary' />
											<div>
												<p className='font-body text-xs text-muted-foreground'>
													Duration
												</p>
												<p className='font-body font-medium text-foreground'>
													{pkg.duration}
												</p>
											</div>
										</div>
										<div className='p-3 rounded-xl bg-muted flex items-center gap-3'>
											<Users className='w-5 h-5 text-primary' />
											<div>
												<p className='font-body text-xs text-muted-foreground'>
													Group Size
												</p>
												<p className='font-body font-medium text-foreground'>
													{pkg.groupSize} people
												</p>
											</div>
										</div>
										<div className='p-3 rounded-xl bg-muted flex items-center gap-3'>
											<Star className='w-5 h-5 text-accent fill-accent' />
											<div>
												<p className='font-body text-xs text-muted-foreground'>
													Rating
												</p>
												<p className='font-body font-medium text-foreground'>
													{pkg.rating} ({pkg.reviews} reviews)
												</p>
											</div>
										</div>
									</div>

									<Button
										variant='coral'
										size='xl'
										className='w-full mb-3'
										asChild
									>
										<Link href={`/appointment?package=${pkg.id}`}>
											<Calendar className='w-5 h-5' />
											Book This Package
										</Link>
									</Button>
									<Button variant='outline' className='w-full' asChild>
										<Link href='/contact'>Ask a Question</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PackageDetail;
