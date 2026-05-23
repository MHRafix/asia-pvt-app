'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageBanner } from '@/components/common/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { KeyRound, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');

	const [loading, setLoading] = useState(false);
	const [verifying, setVerifying] = useState(true);
	const [validToken, setValidToken] = useState(false);
	const [success, setSuccess] = useState(false);

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setVerifying(false);
				return;
			}

			try {
				const response = await fetch(`/api/auth/reset-password?token=${token}`);
				const data = await response.json();
				setValidToken(data.success);
			} catch (error) {
				console.error('Error verifying token:', error);
				setValidToken(false);
			} finally {
				setVerifying(false);
			}
		};

		verifyToken();
	}, [token]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		setLoading(true);

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, token }),
			});

			const result = await response.json();

			if (result.success) {
				setSuccess(true);
				toast.success('Password reset successfully!');
			} else {
				toast.error(result.error || 'Failed to reset password');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to reset password');
		} finally {
			setLoading(false);
		}
	};

	if (verifying) {
		return (
			<div className='text-center py-12'>
				<Loader className='w-8 h-8 animate-spin mx-auto text-primary' />
				<p className='text-muted-foreground mt-4'>Verifying reset link...</p>
			</div>
		);
	}

	if (!token || !validToken) {
		return (
			<div className='text-center space-y-6'>
				<div className='w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto'>
					<AlertCircle className='w-8 h-8 text-red-600' />
				</div>
				<div>
					<h3 className='text-lg font-semibold text-foreground'>
						Invalid or Expired Link
					</h3>
					<p className='text-muted-foreground mt-2'>
						This password reset link is invalid or has expired. Please request a
						new one.
					</p>
				</div>
				<Link href='/forgot-password'>
					<Button>Request New Link</Button>
				</Link>
			</div>
		);
	}

	if (success) {
		return (
			<div className='text-center space-y-6'>
				<div className='w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto'>
					<CheckCircle className='w-8 h-8 text-green-600' />
				</div>
				<div>
					<h3 className='text-lg font-semibold text-foreground'>
						Password Reset Successfully
					</h3>
					<p className='text-muted-foreground mt-2'>
						Your password has been reset. You can now sign in with your new
						password.
					</p>
				</div>
				<Link href='/login'>
					<Button>Sign In</Button>
				</Link>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter new password (min. 6 characters)'
									disabled={loading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm New Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Confirm your new password'
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
							Resetting...
						</>
					) : (
						'Reset Password'
					)}
				</Button>
			</form>
		</Form>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				<PageBanner
					title='Reset Password'
					subtitle='Create a new password for your account'
				/>

				<section className='py-24 bg-background'>
					<div className='container mx-auto px-4 max-w-md'>
						<div className='bg-card rounded-2xl shadow-elevated p-8'>
							<div className='text-center mb-8'>
								<div className='w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4'>
									<KeyRound className='w-8 h-8 text-primary-foreground' />
								</div>
								<h2 className='font-display text-2xl font-bold text-foreground'>
									Create New Password
								</h2>
								<p className='font-body text-sm text-muted-foreground mt-2'>
									Enter your new password below
								</p>
							</div>

							<Suspense
								fallback={
									<div className='text-center py-12'>
										<Loader className='w-8 h-8 animate-spin mx-auto text-primary' />
									</div>
								}
							>
								<ResetPasswordContent />
							</Suspense>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
