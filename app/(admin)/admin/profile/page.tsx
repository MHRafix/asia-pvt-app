'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Lock, Loader, Save, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	userProfileSchema,
	type UserProfileFormData,
} from '@/lib/validations/user';
import {
	changePasswordSchema,
	type ChangePasswordFormData,
} from '@/lib/validations/auth';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ProfilePage() {
	const { user, refreshUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [changingPassword, setChangingPassword] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const profileForm = useForm<UserProfileFormData>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			avatar: '',
		},
	});

	const passwordForm = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch('/api/users/profile');
				const data = await response.json();

				if (data.success) {
					profileForm.reset({
						name: data.data.name || '',
						email: data.data.email || '',
						phone: data.data.phone || '',
						avatar: data.data.avatar || '',
					});
				}
			} catch (error) {
				console.error('Error fetching profile:', error);
				toast.error('Failed to load profile');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [profileForm]);

	const onProfileSubmit = async (data: UserProfileFormData) => {
		setSaving(true);

		try {
			const response = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Profile updated successfully');
				if (refreshUser) refreshUser();
			} else {
				toast.error(result.error || 'Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		} finally {
			setSaving(false);
		}
	};

	const onPasswordSubmit = async (data: ChangePasswordFormData) => {
		setChangingPassword(true);

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Password changed successfully');
				passwordForm.reset();
			} else {
				toast.error(result.error || 'Failed to change password');
			}
		} catch (error) {
			console.error('Error changing password:', error);
			toast.error('Failed to change password');
		} finally {
			setChangingPassword(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader className='w-8 h-8 animate-spin text-primary' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-bold text-foreground'>Profile Settings</h1>
				<p className='text-muted-foreground mt-1'>
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs defaultValue='profile' className='space-y-6'>
				<TabsList>
					<TabsTrigger value='profile' className='gap-2'>
						<User className='w-4 h-4' />
						Profile
					</TabsTrigger>
					<TabsTrigger value='security' className='gap-2'>
						<Lock className='w-4 h-4' />
						Security
					</TabsTrigger>
				</TabsList>

				<TabsContent value='profile'>
					<Card className='border-0 shadow-soft'>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...profileForm}>
								<form
									onSubmit={profileForm.handleSubmit(onProfileSubmit)}
									className='space-y-6'
								>
									<div className='flex items-center gap-6 mb-6'>
										<div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center'>
											<span className='text-3xl font-bold text-primary'>
												{profileForm.watch('name')?.charAt(0)?.toUpperCase() || 'U'}
											</span>
										</div>
										<div>
											<h3 className='font-semibold text-foreground'>
												{profileForm.watch('name') || 'User'}
											</h3>
											<p className='text-sm text-muted-foreground'>
												{user?.role === 'admin' ? 'Administrator' : 'User'}
											</p>
										</div>
									</div>

									<Separator />

									<div className='grid gap-6 md:grid-cols-2'>
										<FormField
											control={profileForm.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name</FormLabel>
													<FormControl>
														<Input placeholder='Your name' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Address</FormLabel>
													<FormControl>
														<Input
															type='email'
															placeholder='your@email.com'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name='phone'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<Input placeholder='+1 234 567 8900' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name='avatar'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Avatar URL (Optional)</FormLabel>
													<FormControl>
														<Input
															placeholder='https://example.com/avatar.jpg'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className='flex justify-end'>
										<Button type='submit' disabled={saving} className='gap-2'>
											{saving ? (
												<>
													<Loader className='w-4 h-4 animate-spin' />
													Saving...
												</>
											) : (
												<>
													<Save className='w-4 h-4' />
													Save Changes
												</>
											)}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='security'>
					<Card className='border-0 shadow-soft'>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...passwordForm}>
								<form
									onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
									className='space-y-6 max-w-md'
								>
									<FormField
										control={passwordForm.control}
										name='currentPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Current Password</FormLabel>
												<FormControl>
													<div className='relative'>
														<Input
															type={showCurrentPassword ? 'text' : 'password'}
															placeholder='Enter current password'
															{...field}
														/>
														<Button
															type='button'
															variant='ghost'
															size='icon'
															className='absolute right-0 top-0 h-full px-3'
															onClick={() =>
																setShowCurrentPassword(!showCurrentPassword)
															}
														>
															{showCurrentPassword ? (
																<EyeOff className='w-4 h-4' />
															) : (
																<Eye className='w-4 h-4' />
															)}
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={passwordForm.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<div className='relative'>
														<Input
															type={showNewPassword ? 'text' : 'password'}
															placeholder='Enter new password (min. 6 characters)'
															{...field}
														/>
														<Button
															type='button'
															variant='ghost'
															size='icon'
															className='absolute right-0 top-0 h-full px-3'
															onClick={() => setShowNewPassword(!showNewPassword)}
														>
															{showNewPassword ? (
																<EyeOff className='w-4 h-4' />
															) : (
																<Eye className='w-4 h-4' />
															)}
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={passwordForm.control}
										name='confirmNewPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm New Password</FormLabel>
												<FormControl>
													<Input
														type='password'
														placeholder='Confirm your new password'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										disabled={changingPassword}
										className='gap-2'
									>
										{changingPassword ? (
											<>
												<Loader className='w-4 h-4 animate-spin' />
												Changing...
											</>
										) : (
											<>
												<Lock className='w-4 h-4' />
												Change Password
											</>
										)}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
