'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Client {
	_id: string;
	name: string;
	email: string;
}

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
}

const transactionSchema = z.object({
	clientId: z.string().min(1, 'Client is required'),
	invoiceId: z.string().optional(),
	type: z.enum(['Payment', 'Refund', 'Adjustment', 'Credit']),
	amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
	paymentMethod: z.enum(['cash', 'card', 'bank', 'bkash', 'other']),
	status: z.enum(['completed', 'pending', 'failed']).default('completed'),
	description: z.string().min(1, 'Description is required'),
	notes: z.string().optional(),
	date: z.date(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export default function TransactionFormDialog({
	open,
	onOpenChange,
	onSuccess,
}: TransactionFormDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [clients, setClients] = useState<Client[]>([]);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [selectedClientId, setSelectedClientId] = useState('');
	const [loadingClients, setLoadingClients] = useState(false);
	const [loadingInvoices, setLoadingInvoices] = useState(false);

	const form = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			clientId: '',
			invoiceId: '',
			type: 'Payment',
			amount: undefined,
			paymentMethod: 'cash',
			status: 'completed',
			description: '',
			notes: '',
			date: new Date(),
		},
	});

	useEffect(() => {
		if (open) {
			fetchClients();
		}
	}, [open]);

	useEffect(() => {
		if (selectedClientId) {
			fetchInvoices(selectedClientId);
		}
	}, [selectedClientId]);

	const fetchClients = async () => {
		try {
			setLoadingClients(true);
			const response = await fetch('/api/crm/clients?limit=100');
			const result = await response.json();

			if (result.success) {
				setClients(result.data || []);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		} finally {
			setLoadingClients(false);
		}
	};

	const fetchInvoices = async (clientId: string) => {
		try {
			setLoadingInvoices(true);
			const response = await fetch(
				`/api/payment/invoices?clientId=${clientId}&limit=100`,
			);
			const result = await response.json();

			if (result.success) {
				setInvoices(result.data || []);
			}
		} catch (error) {
			console.error('Error fetching invoices:', error);
		} finally {
			setLoadingInvoices(false);
		}
	};

	const handleFormSubmit = async (data: TransactionFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/payment/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					date: data.date.toISOString(),
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Transaction added successfully');
				form.reset();
				onOpenChange(false);
				onSuccess?.();
			} else {
				toast.error(result.error || 'Failed to add transaction');
			}
		} catch (error) {
			console.error('Error adding transaction:', error);
			toast.error('Failed to add transaction');
		} finally {
			setIsSubmitting(false);
		}
	};

	const watchClientId = form.watch('clientId');

	const handleClientChange = (value: string) => {
		form.setValue('clientId', value);
		setSelectedClientId(value);
		form.setValue('invoiceId', '');
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Add New Transaction</DialogTitle>
					<DialogDescription>
						Record a new transaction in the system
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleFormSubmit)}
						className='space-y-6'
					>
						{/* Client Selection */}
						<FormField
							control={form.control}
							name='clientId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Client *</FormLabel>
									<Select
										onValueChange={handleClientChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger disabled={loadingClients}>
												<SelectValue placeholder='Select a client' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{clients.map(client => (
												<SelectItem key={client._id} value={client._id}>
													{client.name} ({client.email})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Invoice Selection (Optional) */}
						{selectedClientId && (
							<FormField
								control={form.control}
								name='invoiceId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Invoice (Optional)</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || ''}
										>
											<FormControl>
												<SelectTrigger disabled={loadingInvoices}>
													<SelectValue placeholder='Select an invoice' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value=''>No Invoice</SelectItem>
												{invoices.map(invoice => (
													<SelectItem key={invoice._id} value={invoice._id}>
														{invoice.invoiceNumber} (
														{invoice.amount.toFixed(2)})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* Transaction Type */}
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Type *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='Payment'>Payment</SelectItem>
											<SelectItem value='Refund'>Refund</SelectItem>
											<SelectItem value='Adjustment'>
												Adjustment
											</SelectItem>
											<SelectItem value='Credit'>Credit</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Amount */}
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount *</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='0.01'
											placeholder='0.00'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Payment Method */}
						<FormField
							control={form.control}
							name='paymentMethod'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Payment Method *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='cash'>Cash</SelectItem>
											<SelectItem value='card'>Card</SelectItem>
											<SelectItem value='bank'>Bank Transfer</SelectItem>
											<SelectItem value='bkash'>Bkash</SelectItem>
											<SelectItem value='other'>Other</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status */}
						<FormField
							control={form.control}
							name='status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='completed'>Completed</SelectItem>
											<SelectItem value='pending'>Pending</SelectItem>
											<SelectItem value='failed'>Failed</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description *</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Enter transaction description'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Notes */}
						<FormField
							control={form.control}
							name='notes'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Add any additional notes'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Date */}
						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Date *</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant='outline'
												className='w-full justify-start text-left font-normal'
											>
												{field.value
													? format(field.value, 'MMM dd, yyyy')
													: 'Pick a date'}
											</Button>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={date =>
													date > new Date() ||
													date < new Date('1900-01-01')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Buttons */}
						<div className='flex justify-end gap-3'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Adding...' : 'Add Transaction'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
