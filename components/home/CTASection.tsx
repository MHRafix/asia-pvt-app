import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
	return (
		<section className='py-24 bg-primary relative overflow-hidden'>
			<div className='absolute inset-0 opacity-10'>
				<div className='absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl' />
				<div className='absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl' />
			</div>

			<div className='container mx-auto px-4 relative z-10'>
				<div className='text-center max-w-3xl mx-auto'>
					<h2 className='font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6'>
						Ready to Start Your Adventure?
					</h2>
					<p className='font-body text-xl text-primary-foreground/80 mb-10'>
						Let our travel experts craft your perfect getaway. Contact us today
						and turn your dream vacation into reality.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button variant='hero' size='xl' asChild>
							<Link href='/appointment'>
								Get Started
								<ArrowRight className='w-5 h-5' />
							</Link>
						</Button>
						<Button
							variant='heroOutline'
							size='xl'
							className='border-primary-foreground/30 text-primary-foreground'
							asChild
						>
							<Link href='/contact'>
								<Phone className='w-5 h-5' />
								Contact Us
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
