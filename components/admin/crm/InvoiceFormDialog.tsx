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
import { invoiceSchema, type InvoiceFormData } from '@/lib/validations/crm';

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
	paymentMethod: string;
	transactionStatus: string;
	clientId?: string;
	description?: string;
	notes?: string;
}

interface InvoiceFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	clients: Array<{ _id: string; name: string }>;
	invoice?: Invoice | null;
}

export default function InvoiceFormDialog({
	open,
	onOpenChange,
	onSuccess,
	clients,
	invoice,
}: InvoiceFormDialogProps) {
	const isEditing = !!invoice;

	const form = useForm<InvoiceFormData>({
		resolver: zodResolver(invoiceSchema),
		defaultValues: {
			clientId: '',
			invoiceNumber: '',
			amount: 0,
			paymentMethod: 'cash',
			transactionStatus: 'pending',
			description: '',
			notes: '',
		},
	});

	useEffect(() => {
		if (invoice) {
			form.reset({
				clientId: invoice.clientId || '',
				invoiceNumber: invoice.invoiceNumber,
				amount: invoice.amount,
				paymentMethod: invoice.paymentMethod as any,
				transactionStatus: invoice.transactionStatus as any,
				description: invoice.description || '',
				notes: invoice.notes || '',
			});
		} else {
			form.reset({
				clientId: '',
				invoiceNumber: '',
				amount: 0,
				paymentMethod: 'cash',
				transactionStatus: 'pending',
				description: '',
				notes: '',
			});
		}
	}, [invoice, form]);

	const onSubmit = async (data: InvoiceFormData) => {
		try {
			const url = isEditing ? `/api/crm/invoices/${invoice._id}` : '/api/crm/invoices';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(isEditing ? 'Invoice updated!' : 'Invoice created!');
				form.reset();
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to save invoice');
			}
		} catch (error) {
			console.error('Error saving invoice:', error);
			toast.error('Failed to save invoice');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Invoice' : 'Create New Invoice'}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='invoiceNumber'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Invoice Number *</FormLabel>
										<FormControl>
											<Input placeholder='INV-2024-001' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='clientId'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Client *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a client' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{clients.map((client) => (
													<SelectItem key={client._id} value={client._id}>
														{client.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='amount'
								render={({ field }) => (
									<FormItem className='col-span-1'>
										<FormLabel>Amount *</FormLabel>
										<FormControl>
											<Input
												type='number'
												placeholder='0'
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='paymentMethod'
								render={({ field }) => (
									<FormItem className='col-span-1'>
										<FormLabel>Payment Method *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select method' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='cash'>Cash</SelectItem>
												<SelectItem value='check'>Check</SelectItem>
												<SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
												<SelectItem value='card'>Card</SelectItem>
												<SelectItem value='other'>Other</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='transactionStatus'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Status *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='paid'>Paid</SelectItem>
												<SelectItem value='pending'>Pending</SelectItem>
												<SelectItem value='partial'>Partial</SelectItem>
												<SelectItem value='failed'>Failed</SelectItem>
												<SelectItem value='refunded'>Refunded</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder='Invoice description' {...field} />
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
												placeholder='Additional notes...'
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
									'Update Invoice'
								) : (
									'Create Invoice'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
