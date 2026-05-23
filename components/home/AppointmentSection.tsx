'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/lib/types';
import {
	ArrowRight,
	Briefcase,
	Calendar,
	CreditCard,
	FileText,
	Headphones,
	Plane,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AppointmentSection({ services }: { services: Service[] }) {
	const router = useRouter();

	const serviceIcons = [
		<Headphones />,
		<Briefcase />,
		<Plane />,
		<CreditCard />,
		<FileText />,
		<Calendar />,
	];
	return (
		<section className='py-24 bg-background'>
			<div className='container mx-auto px-4'>
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<span className='inline-block px-4 py-2 rounded-full bg-sunset/20 text-foreground font-body text-sm font-medium mb-4'>
						Book an Appointment
					</span>
					<h2 className='font-display text-4xl md:text-5xl font-bold text-foreground mb-4'>
						Expert Travel Services
					</h2>
					<p className='font-body text-muted-foreground text-lg'>
						Schedule a consultation with our travel experts and get personalized
						assistance
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
					{services?.map((service, index) => (
						<div key={service?.slug}>
							<Card
								className='border-0 shadow-soft hover:shadow-card transition-all duration-300 group cursor-pointer h-full'
								onClick={() => router.push(`/services/${service?.slug}`)}
							>
								<CardContent className='p-6'>
									<div className='w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
										{serviceIcons[index]}
									</div>
									<h3 className='font-display text-xl font-semibold text-foreground mb-2'>
										{service?.title}
									</h3>
									<p className='font-body text-muted-foreground mb-4'>
										{service?.description}
									</p>
									<div className='flex items-center justify-between'>
										<span className='font-body text-sm text-primary font-medium'>
											{service?.duration}
										</span>
										<ArrowRight className='w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>

				<div className='text-center'>
					<Button variant='coral' size='xl' asChild>
						<Link href='/appointment'>
							<Calendar className='w-5 h-5' />
							Schedule Your Appointment
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
