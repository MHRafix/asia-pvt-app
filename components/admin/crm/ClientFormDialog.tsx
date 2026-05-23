'use client';

import { useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormData } from '@/lib/validations/crm';

interface Client {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address?: string;
	company?: string;
	notes?: string;
	status: 'active' | 'inactive' | 'prospect' | 'vip';
	source?: string;
	tags: string[];
}

interface ClientFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	client?: Client | null;
}

export default function ClientFormDialog({
	open,
	onOpenChange,
	onSuccess,
	client,
}: ClientFormDialogProps) {
	const isEditing = !!client;

	const form = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			address: '',
			company: '',
			notes: '',
			status: 'prospect',
			source: '',
			tags: [],
		},
	});

	useEffect(() => {
		if (client) {
			form.reset({
				name: client.name,
				email: client.email,
				phone: client.phone,
				address: client.address || '',
				company: client.company || '',
				notes: client.notes || '',
				status: client.status,
				source: client.source || '',
				tags: client.tags || [],
			});
		} else {
			form.reset({
				name: '',
				email: '',
				phone: '',
				address: '',
				company: '',
				notes: '',
				status: 'prospect',
				source: '',
				tags: [],
			});
		}
	}, [client, form]);

	const onSubmit = async (data: ClientFormData) => {
		try {
			const url = isEditing ? `/api/crm/clients/${client._id}` : '/api/crm/clients';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(isEditing ? 'Client updated!' : 'Client created!');
				form.reset();
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to save client');
			}
		} catch (error) {
			console.error('Error saving client:', error);
			toast.error('Failed to save client');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Client' : 'Add New Client'}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder='John Doe' {...field} />
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
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type='email' placeholder='john@example.com' {...field} />
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
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder='+1 234 567 8900' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='company'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company</FormLabel>
										<FormControl>
											<Input placeholder='Company name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='prospect'>Prospect</SelectItem>
												<SelectItem value='active'>Active</SelectItem>
												<SelectItem value='vip'>VIP</SelectItem>
												<SelectItem value='inactive'>Inactive</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='source'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source</FormLabel>
										<FormControl>
											<Input placeholder='e.g. Website, Referral' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input placeholder='Street address' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='notes'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Notes</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Additional notes about the client...'
												className='resize-none'
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='flex justify-end gap-3 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<>
										<Loader className='w-4 h-4 mr-2 animate-spin' />
										Saving...
									</>
								) : isEditing ? (
									'Update Client'
								) : (
									'Add Client'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
