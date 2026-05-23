'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
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
import { Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';

export const SignupForm = ({ searchParams }: any) => {
	const { signup } = useAuth();
	const [loading, setLoading] = useState(false);

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: SignupFormData) => {
		setLoading(true);

		try {
			await signup(
				data.name,
				data.email,
				data.phone,
				data.password,
				data.confirmPassword
			);
			toast.success('Account created successfully!');
		} catch (error) {
			console.error('Signup error:', error);
			toast.error(error instanceof Error ? error.message : 'Signup failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Enter your full name'
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
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input
									type='tel'
									placeholder='Enter your phone number'
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
									placeholder='Create a password (min. 6 characters)'
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
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Confirm your password'
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
							Creating Account...
						</>
					) : (
						'Create Account'
					)}
				</Button>

				<p className='text-center text-sm text-muted-foreground'>
					Already have an account?{' '}
					<a href='/login' className='text-primary font-medium hover:underline'>
						Sign in here
					</a>
				</p>
			</form>
		</Form>
	);
};
