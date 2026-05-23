import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const testimonials = [
	{
		id: 1,
		name: 'Emily Richardson',
		location: 'New York, USA',
		rating: 5,
		text: 'Wanderlust made our honeymoon absolutely magical! Every detail was perfectly planned, and the Santorini sunset was unforgettable.',
		avatar: 'ER',
	},
	{
		id: 2,
		name: 'David Chen',
		location: 'London, UK',
		rating: 5,
		text: 'The visa assistance was incredibly smooth. They handled all the paperwork and we got our Schengen visa in just 10 days!',
		avatar: 'DC',
	},
	{
		id: 3,
		name: 'Sofia Martinez',
		location: 'Madrid, Spain',
		rating: 5,
		text: 'Our Japan trip exceeded all expectations. The cherry blossom tour was perfectly timed, and the local guides were exceptional.',
		avatar: 'SM',
	},
];

export function TestimonialsSection() {
	return (
		<section className='py-24 bg-background'>
			<div className='container mx-auto px-4'>
				{/* Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<span className='inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium mb-4'>
						Testimonials
					</span>
					<h2 className='font-display text-4xl md:text-5xl font-bold text-foreground mb-4'>
						What Our Travelers Say
					</h2>
					<p className='font-body text-muted-foreground text-lg'>
						Real stories from real adventurers who trusted us with their dream
						vacations
					</p>
				</div>

				{/* Testimonials Grid */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.id}>
							<Card className='border-0 shadow-card h-full'>
								<CardContent className='p-8'>
									<Quote className='w-10 h-10 text-primary/30 mb-4' />
									<p className='font-body text-foreground mb-6 leading-relaxed'>
										"{testimonial.text}"
									</p>
									<div className='flex items-center gap-1 mb-4'>
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star
												key={i}
												className='w-4 h-4 text-accent fill-accent'
											/>
										))}
									</div>
									<div className='flex items-center gap-3'>
										<div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center'>
											<span className='font-body font-semibold text-primary-foreground'>
												{testimonial.avatar}
											</span>
										</div>
										<div>
											<p className='font-display font-semibold text-foreground'>
												{testimonial.name}
											</p>
											<p className='font-body text-sm text-muted-foreground'>
												{testimonial.location}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
