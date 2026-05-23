import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TravelPackage } from '@/data/packages';
import { ArrowRight, Clock, Star, Users } from 'lucide-react';
import Link from 'next/link';

export function PackagesSection({ packages }: { packages: TravelPackage[] }) {
	return (
		<section className='py-24 bg-background'>
			<div className='container mx-auto px-4'>
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<span className='inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium mb-4'>
						Popular Destinations
					</span>
					<h2 className='font-display text-4xl md:text-5xl font-bold text-foreground mb-4'>
						Curated Travel Packages
					</h2>
					<p className='font-body text-muted-foreground text-lg'>
						Handpicked experiences designed to give you the adventure of a
						lifetime
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{packages?.map((pkg, index) => (
						<div key={pkg.id}>
							<Card
								className='group p-0 overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer'
								// onClick={() => navigate(`/packages/${pkg.id}`)}
							>
								<div className='relative h-64 overflow-hidden'>
									<img
										src={pkg.image}
										alt={pkg.title}
										className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
									/>
									<div className='absolute top-4 right-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm'>
										<div className='flex items-center gap-1'>
											<Star className='w-4 h-4 text-accent fill-accent' />
											<span className='font-body text-sm font-medium text-foreground'>
												{pkg.rating}
											</span>
										</div>
									</div>
								</div>
								<CardContent className='p-5'>
									<p className='font-body text-sm text-primary font-medium mb-1'>
										{pkg.location}
									</p>
									<h3 className='font-display text-xl font-semibold text-foreground mb-3'>
										{pkg.title}
									</h3>
									<div className='flex items-center gap-4 text-muted-foreground mb-4'>
										<div className='flex items-center gap-1'>
											<Clock className='w-4 h-4' />
											<span className='font-body text-sm'>{pkg.duration}</span>
										</div>
										<div className='flex items-center gap-1'>
											<Users className='w-4 h-4' />
											<span className='font-body text-sm'>{pkg.groupSize}</span>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<div>
											<span className='font-body text-sm text-muted-foreground'>
												From
											</span>
											<p className='font-display text-2xl font-bold text-foreground'>
												${pkg.price.toLocaleString()}
											</p>
										</div>
										<Button variant='coral' size='sm' asChild>
											<Link href={`/packages/${pkg.id}`}>View</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>

				<div className='text-center mt-12'>
					<Button variant='outline' size='lg' asChild>
						<Link href='/packages'>
							View All Packages
							<ArrowRight className='w-4 h-4' />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
