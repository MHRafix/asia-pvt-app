'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { packages } from '@/data/packages';
import { services } from '@/data/services';
import { toast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import * as yup from 'yup';

const schema = yup.object({
	fullName: yup
		.string()
		.trim()
		.required('Full name is required')
		.max(100, 'Name must be under 100 characters'),
	email: yup
		.string()
		.trim()
		.email('Invalid email address')
		.required('Email is required'),
	phone: yup
		.string()
		.trim()
		.required('Phone number is required')
		.min(7, 'Phone must be at least 7 digits'),
	service: yup.string().required('Please select a service'),
	preferredDate: yup.string().required('Preferred date is required'),
	preferredTime: yup.string().required('Preferred time is required'),
	message: yup.string().trim().max(500, 'Message must be under 500 characters'),
});

type FormData = yup.InferType<typeof schema>;

const AppointmentPage = ({ searchParams }: any) => {
	const preselectedPackage = searchParams?.package;

	const pkg = preselectedPackage
		? packages.find((p) => p.id === preselectedPackage)
		: null;
	const [submitted, setSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			service: preselectedPackage ? 'travel-consultation' : '',
			message: pkg ? `I'm interested in the "${pkg.title}" package.` : '',
		},
	});

	const onSubmit = (data: FormData) => {
		toast({
			title: 'Appointment Booked!',
			description: `We'll confirm your ${data.service} appointment at ${data.email}.`,
		});
		setSubmitted(true);
	};

	const timeSlots = [
		'09:00 AM',
		'09:30 AM',
		'10:00 AM',
		'10:30 AM',
		'11:00 AM',
		'11:30 AM',
		'02:00 PM',
		'02:30 PM',
		'03:00 PM',
		'03:30 PM',
		'04:00 PM',
		'04:30 PM',
	];

	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				<PageBanner
					title='Book an Appointment'
					subtitle='Schedule a consultation with our travel experts and get personalized assistance'
				/>

				<section className='py-16 bg-background w-7xl mx-auto'>
					<div className='container mx-auto px-4'>
						{submitted ? (
							<div className='max-w-xl mx-auto text-center py-16'>
								<CheckCircle className='w-20 h-20 text-forest mx-auto mb-6' />
								<h2 className='font-display text-3xl font-bold text-foreground mb-4'>
									Appointment Requested!
								</h2>
								<p className='font-body text-muted-foreground mb-8'>
									We've received your booking request. Our team will confirm
									your appointment via email within 24 hours.
								</p>
								<div className='flex gap-4 justify-center'>
									<Button
										variant='coral'
										onClick={() => {
											setSubmitted(false);
											reset();
										}}
									>
										Book Another
									</Button>
									<Button variant='outline' asChild>
										<Link href='/'>Go Home</Link>
									</Button>
								</div>
							</div>
						) : (
							<div className='grid lg:grid-cols-3 gap-12'>
								{/* Form */}
								<div className='lg:col-span-2'>
									<h2 className='font-display text-2xl font-bold text-foreground mb-6'>
										Fill in Your Details
									</h2>
									{pkg && (
										<div className='p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6'>
											<p className='font-body text-sm text-primary font-medium'>
												📦 Booking for: <strong>{pkg.title}</strong> —{' '}
												{pkg.location}
											</p>
										</div>
									)}
									<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
										<div className='grid md:grid-cols-2 gap-4'>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Full Name *
												</label>
												<Input
													{...register('fullName')}
													placeholder='John Doe'
													className='bg-card'
												/>
												{errors.fullName && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.fullName.message}
													</p>
												)}
											</div>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Email *
												</label>
												<Input
													{...register('email')}
													type='email'
													placeholder='john@example.com'
													className='bg-card'
												/>
												{errors.email && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.email.message}
													</p>
												)}
											</div>
										</div>

										<div className='grid md:grid-cols-2 gap-4'>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Phone *
												</label>
												<Input
													{...register('phone')}
													type='tel'
													placeholder='+1 (555) 123-4567'
													className='bg-card'
												/>
												{errors.phone && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.phone.message}
													</p>
												)}
											</div>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Service *
												</label>
												<select
													{...register('service')}
													className='w-full h-10 rounded-md border border-input bg-card px-3 py-2 text-sm font-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
												>
													<option value=''>Select a service...</option>
													{services.map((s) => (
														<option key={s.slug} value={s.slug}>
															{s.title}
														</option>
													))}
												</select>
												{errors.service && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.service.message}
													</p>
												)}
											</div>
										</div>

										<div className='grid md:grid-cols-2 gap-4'>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Preferred Date *
												</label>
												<Input
													{...register('preferredDate')}
													type='date'
													className='bg-card'
												/>
												{errors.preferredDate && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.preferredDate.message}
													</p>
												)}
											</div>
											<div>
												<label className='font-body text-sm font-medium text-foreground mb-1 block'>
													Preferred Time *
												</label>
												<select
													{...register('preferredTime')}
													className='w-full h-10 rounded-md border border-input bg-card px-3 py-2 text-sm font-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
												>
													<option value=''>Select time...</option>
													{timeSlots.map((t) => (
														<option key={t} value={t}>
															{t}
														</option>
													))}
												</select>
												{errors.preferredTime && (
													<p className='text-destructive text-xs mt-1 font-body'>
														{errors.preferredTime.message}
													</p>
												)}
											</div>
										</div>

										<div>
											<label className='font-body text-sm font-medium text-foreground mb-1 block'>
												Message (Optional)
											</label>
											<Textarea
												{...register('message')}
												placeholder='Tell us more about your requirements...'
												rows={4}
												className='bg-card'
											/>
											{errors.message && (
												<p className='text-destructive text-xs mt-1 font-body'>
													{errors.message.message}
												</p>
											)}
										</div>

										<Button
											type='submit'
											variant='coral'
											size='xl'
											className='w-full md:w-auto'
											disabled={isSubmitting}
										>
											<Calendar className='w-5 h-5' />
											Book Appointment
											<ArrowRight className='w-5 h-5' />
										</Button>
									</form>
								</div>

								{/* Sidebar */}
								<div className='space-y-6'>
									<Card className='border-0 shadow-card'>
										<CardContent className='px-6 py-0'>
											<h3 className='font-display text-lg font-bold text-foreground mb-4'>
												Our Services
											</h3>
											<div className='space-y-3'>
												{services.map((s) => {
													const ServiceIcon = s.icon;
													return (
														<Link
															key={s.slug}
															href={`/services/${s.slug}`}
															className='flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group'
														>
															<div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors'>
																<ServiceIcon className='w-5 h-5 text-primary' />
															</div>
															<div>
																<p className='font-body text-sm font-medium text-foreground'>
																	{s.title}
																</p>
																<p className='font-body text-xs text-muted-foreground'>
																	{s.duration}
																</p>
															</div>
														</Link>
													);
												})}
											</div>
										</CardContent>
									</Card>

									<Card className='border-0 shadow-soft bg-ocean/5'>
										<CardContent className='p-6'>
											<h4 className='font-display text-base font-semibold text-foreground mb-2'>
												Need Help?
											</h4>
											<p className='font-body text-sm text-muted-foreground mb-4'>
												Contact us directly for immediate assistance.
											</p>
											<Button
												variant='ocean'
												size='sm'
												className='w-full'
												asChild
											>
												<Link href='/contact'>Contact Us</Link>
											</Button>
										</CardContent>
									</Card>
								</div>
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
};

export default AppointmentPage;
