'use client';

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
import { useAuth } from '@/lib/auth/AuthContext';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { SplitButtons } from '../common/ToastMessage';

export const LoginForm = () => {
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setLoading(true);

		try {
			await login(data.email, data.password);

			toast.success(<SplitButtons title='Login successful!' />, {
				closeButton: true,
				position: 'top-left',
				className: '!px-4 !py-0 !w-[450px]',
				ariaLabel: 'Login',
				closeOnClick: true,
			});
		} catch (error: any) {
			toast.error(<SplitButtons title={error?.message || 'Login Failed!'} />, {
				closeButton: true,
				position: 'top-left',
				className: '!px-4 !py-0 !w-[450px]',
				ariaLabel: 'Login',
				closeOnClick: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter your password'
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
							Signing in...
						</>
					) : (
						'Sign In'
					)}
				</Button>

				<div className='text-center space-y-2'>
					<a
						href='/auth/forgot-password'
						className='text-sm text-primary font-medium hover:underline block'
					>
						Forgot your password?
					</a>
					<p className='text-sm text-muted-foreground'>
						Don&apos;t have an account?{' '}
						<a
							href='/auth/signup'
							className='text-primary font-medium hover:underline'
						>
							Sign up here
						</a>
					</p>
				</div>
			</form>
		</Form>
	);
};
