import {
	Facebook,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Plane,
	Youtube,
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
	{ name: 'Travel Packages', href: '/packages' },
	{ name: 'Visa Services', href: '/visa' },
	{ name: 'Book Appointment', href: '/appointment' },
	{ name: 'Blog', href: '/blog' },
	{ name: 'Contact', href: '/contact' },
];

const serviceLinks = [
	{ name: 'Travel Consultation', href: '/services/travel-consultation' },
	{ name: 'Flight Booking', href: '/services/flight-booking' },
	{ name: 'Visa Consultation', href: '/services/visa-consultation' },
	{ name: 'Travel Insurance', href: '/services/travel-insurance' },
	{ name: 'Itinerary Planning', href: '/services/itinerary-planning' },
	{ name: 'Corporate Travel', href: '/services/corporate-travel' },
];

export function Footer() {
	return (
		<footer className='bg-foreground text-primary-foreground'>
			<div className='container mx-auto px-4 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
					<div className='space-y-4'>
						<Link href='/' className='flex items-center gap-2'>
							<div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center'>
								<Plane className='w-5 h-5 text-primary-foreground' />
							</div>
							<span className='font-display text-2xl font-semibold'>
								Asia Tours
							</span>
						</Link>
						<p className='text-primary-foreground/70 font-body text-sm leading-relaxed'>
							Your trusted partner for unforgettable travel experiences. Let us
							help you explore the world.
						</p>
						<div className='flex gap-4'>
							{[
								{
									icon: Facebook,
									href: 'https://www.facebook.com/exploreasiatours/',
								},
								{
									icon: Linkedin,
									href: 'https://www.linkedin.com/company/asia-adventure-private-limited',
								},
								{
									icon: Youtube,
									href: 'https://www.youtube.com/@asiaadventurepvtltd.3158',
								},
							].map((media, i) => (
								<a
									key={i}
									href={media?.href}
									className='w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors'
								>
									<media.icon className='w-5 h-5' />
								</a>
							))}
						</div>
					</div>

					<div>
						<h4 className='font-display text-lg font-semibold mb-6'>
							Quick Links
						</h4>
						<ul className='space-y-3'>
							{quickLinks.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className='text-primary-foreground/70 hover:text-primary transition-colors font-body text-sm'
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className='font-display text-lg font-semibold mb-6'>
							Our Services
						</h4>
						<ul className='space-y-3'>
							{serviceLinks.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className='text-primary-foreground/70 hover:text-primary transition-colors font-body text-sm'
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className='font-display text-lg font-semibold mb-6'>
							Contact Us
						</h4>
						<ul className='space-y-4'>
							<li className='flex items-start gap-3'>
								<MapPin className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
								<span className='text-primary-foreground/70 font-body text-sm'>
									Jamuna Future Park Level #3, Shop #3A-043 KA-244, Kuril
									Pragati Sharani Bashundhara R/A, Dhaka-1229, Bangladesh
								</span>
							</li>
							<li className='flex items-center gap-3'>
								<Phone className='w-5 h-5 text-primary flex-shrink-0' />
								<span className='text-primary-foreground/70 font-body text-sm'>
									+880 1726631567
								</span>
							</li>
							<li className='flex items-center gap-3'>
								<Mail className='w-5 h-5 text-primary flex-shrink-0' />
								<span className='text-primary-foreground/70 font-body text-sm'>
									asiatours2018@gmail.com
								</span>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-t border-primary-foreground/10 mt-12 pt-8 text-center'>
					<p className='text-primary-foreground/50 font-body text-sm'>
						© 2026 Asia Tours. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
