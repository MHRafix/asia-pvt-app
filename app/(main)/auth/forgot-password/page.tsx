'use client';

import { PageBanner } from '@/components/common/PageBanner';
import { SplitButtons } from '@/components/common/ToastMessage';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	forgotPasswordSchema,
	type ForgotPasswordFormData,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, KeyRound, Loader } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		setLoading(true);

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setSubmitted(true);

				toast.success(
					<SplitButtons
						title='Password reset link has been sent'
						message='Check your email inbox for reset link'
					/>,
					{
						closeButton: true,
						position: 'top-left',
						className: '!px-4 !py-0 !w-[450px]',
						ariaLabel: 'Forgot password',
						closeOnClick: true,
					},
				);
			} else {
				toast.error(<SplitButtons title={result.message} />, {
					closeButton: true,
					position: 'top-left',
					className: '!px-4 !py-0 !w-[400px]',
					ariaLabel: 'Forgot password',
					closeOnClick: true,
				});
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to process request');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Forgot Password'
				subtitle='Reset your password to regain access to your account'
			/>

			<section className='py-24 bg-background'>
				<div className='container mx-auto px-4 max-w-md'>
					<div className='bg-card rounded-2xl shadow-elevated p-8'>
						<div className='text-center mb-8'>
							<div className='w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4'>
								<KeyRound className='w-8 h-8 text-primary-foreground' />
							</div>
							<h2 className='font-display text-2xl font-bold text-foreground'>
								Reset Password
							</h2>
							<p className='font-body text-sm text-muted-foreground mt-2'>
								Enter your email to receive a reset link
							</p>
						</div>

						{submitted ? (
							<div className='text-center space-y-6'>
								<div className='w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto'>
									<CheckCircle className='w-8 h-8 text-green-600' />
								</div>
								<div>
									<h3 className='text-lg font-semibold text-foreground'>
										Check your email
									</h3>
									<p className='text-muted-foreground mt-2'>
										If an account exists with the email you entered, you will
										receive a password reset link shortly.
									</p>
								</div>
								<Link href='/auth/login'>
									<Button variant='outline' className='gap-2'>
										<ArrowLeft className='w-4 h-4' />
										Back to Login
									</Button>
								</Link>
							</div>
						) : (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-6'
								>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Address</FormLabel>
												<FormControl>
													<Input
														type='email'
														placeholder='Enter your email'
														disabled={loading}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										variant='coral'
										size='lg'
										className='w-full'
										disabled={loading}
									>
										{loading ? (
											<>
												<Loader className='w-4 h-4 mr-2 animate-spin' />
												Sending...
											</>
										) : (
											'Send Reset Link'
										)}
									</Button>

									<p className='text-center text-sm text-muted-foreground'>
										Remember your password?{' '}
										<Link
											href='/auth/login'
											className='text-primary font-medium hover:underline'
										>
											Sign in here
										</Link>
									</p>
								</form>
							</Form>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
