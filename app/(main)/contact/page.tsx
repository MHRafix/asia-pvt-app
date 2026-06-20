'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { SplitButtons } from '@/components/common/ToastMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
	firstName: yup.string().trim().required('First name is required').max(50),
	lastName: yup.string().trim().required('Last name is required').max(50),
	email: yup
		.string()
		.trim()
		.email('Invalid email address')
		.required('Email is required'),
	phone: yup
		.string()
		.trim()
		.required('Phone is required')
		.min(7, 'Phone must be at least 7 digits'),
	message: yup
		.string()
		.trim()
		.required('Message is required')
		.max(1000, 'Message must be under 1000 characters'),
});

type FormData = yup.InferType<typeof schema>;

const Contact = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ resolver: yupResolver(schema) });

	const onSubmit = async (data: FormData) => {
		// setSubmitting(true);
		try {
			const url = '/api/contacts';
			const method = 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (result.success) {
				toast.success(
					<SplitButtons
						title='Message sent'
						message='Your message has been sent.'
					/>,
					{
						closeButton: true,
						position: 'top-left',
						className: '!px-4 !py-0 !w-[400px]',
						ariaLabel: 'Message sent',
						closeOnClick: true,
					},
				);
				reset();
			} else {
				toast.error('Failed to sent message', {
					closeButton: true,
					position: 'top-left',
					className: '!px-4 !py-0 !w-[400px]',
					closeOnClick: true,
				});
			}
		} catch (error) {
			toast.error('Somehting wrong in system', {
				closeButton: true,
				position: 'top-left',
				className: '!px-4 !py-0 !w-[400px]',
				closeOnClick: true,
			});
		}
	};

	return (
		<div className='min-h-screen'>
			<div>
				<PageBanner
					title='Contact Us'
					subtitle="Have questions? We'd love to hear from you."
					gradient='ocean'
					backgroundImage='https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
				/>

				<section className='py-24 bg-background'>
					<div className='container mx-auto px-4'>
						<div className='grid lg:grid-cols-2 gap-16'>
							<div>
								<h2 className='font-display text-3xl font-bold text-foreground mb-6'>
									Send us a Message
								</h2>
								<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='font-body text-sm font-medium text-foreground mb-2 block'>
												First Name *
											</label>
											<Input
												{...register('firstName')}
												placeholder='John'
												className='bg-card'
											/>
											{errors.firstName && (
												<p className='text-destructive text-xs mt-1 font-body'>
													{errors.firstName.message}
												</p>
											)}
										</div>
										<div>
											<label className='font-body text-sm font-medium text-foreground mb-2 block'>
												Last Name *
											</label>
											<Input
												{...register('lastName')}
												placeholder='Doe'
												className='bg-card'
											/>
											{errors.lastName && (
												<p className='text-destructive text-xs mt-1 font-body'>
													{errors.lastName.message}
												</p>
											)}
										</div>
									</div>
									<div>
										<label className='font-body text-sm font-medium text-foreground mb-2 block'>
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
									<div>
										<label className='font-body text-sm font-medium text-foreground mb-2 block'>
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
										<label className='font-body text-sm font-medium text-foreground mb-2 block'>
											Message *
										</label>
										<Textarea
											{...register('message')}
											placeholder='How can we help you?'
											rows={5}
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
										size='lg'
										className='w-full'
										disabled={isSubmitting}
									>
										Send Message
									</Button>
								</form>
							</div>

							<div>
								<h2 className='font-display text-3xl font-bold text-foreground mb-6'>
									Get in Touch
								</h2>
								<p className='font-body text-muted-foreground mb-8'>
									We're here to help and answer any questions you might have. We
									look forward to hearing from you!
								</p>
								<div className='space-y-6'>
									{contactInfo.map((item) => (
										<Card key={item.title} className='border-0 shadow-soft'>
											<CardContent className='p-6 flex items-start gap-4'>
												<div
													className={`w-12 h-12 rounded-xl ${item.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}
												>
													<item.icon
														className={`w-6 h-6 ${item.color.split(' ')[1]}`}
													/>
												</div>
												<div>
													<h4 className='font-display font-semibold text-foreground mb-1'>
														{item.title}
													</h4>
													<p className='font-body text-muted-foreground whitespace-pre-line'>
														{item.value}
													</p>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Contact;

const contactInfo = [
	{
		icon: MapPin,
		color: 'bg-primary/10 text-primary',
		title: 'Address',
		value: 'Shop 3A-043, Level 3, Jamuna Future Park, Dhaka - 1229.',
	},
	{
		icon: Phone,
		color: 'bg-ocean/10 text-ocean',
		title: 'Phone',
		value: '+880 1976631563, +880 1976631564',
	},
	{
		icon: Mail,
		color: 'bg-coral/10 text-coral',
		title: 'Email',
		value: 'touch.asiatours@gmail.com',
	},
	{
		icon: Clock,
		color: 'bg-sunset/20 text-foreground',
		title: 'Business Hours',
		value: 'Sat - Thu: 9:00 AM - 8:00 PM',
	},
];
