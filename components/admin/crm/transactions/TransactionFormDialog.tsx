'use client';

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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils/formatting';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Invoice } from '../invoice-management/InvoicesTable';

const transactionSchema = z.object({
	invoiceId: z.string().min(1, 'Invoice is reqiured'),
	transactionId: z.string().min(1, 'Transaction id is reqiured'),
	type: z.enum(['payment', 'refund', 'adjustment', 'credit']),
	amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
	paymentMethod: z.enum(['cash', 'card', 'bank', 'bkash', 'other']),
	// status: z.enum(['completed', 'pending', 'failed']).default('completed'),
	description: z.string(),
	// date: z.date(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	invoiceId?: string;
	amount?: number;
}

export default function TransactionFormDialog({
	open,
	onOpenChange,
	onSuccess,
	invoiceId,
	amount,
}: TransactionFormDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [selectedClientId, setSelectedClientId] = useState('');
	const [loadingClients, setLoadingClients] = useState(false);
	const [loadingInvoices, setLoadingInvoices] = useState(false);

	const form = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			invoiceId,
			transactionId: '',
			type: 'payment',
			amount: amount || 0,
			paymentMethod: 'cash',
			description: '',
		},
	});

	useEffect(() => {
		fetchInvoices();
	}, []);

	const fetchInvoices = async () => {
		try {
			setLoadingInvoices(true);
			const response = await fetch(`/api/payment/invoices`);
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
		console.log(data);
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/payment/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-3xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Add New Transaction</DialogTitle>
					<DialogDescription>
						Record a new transaction in the system
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleFormSubmit)}
						className='space-y-2 grid md:grid-cols-2 gap-5'
					>
						{/* Invoice Selection */}
						{!invoiceId && (
							<FormField
								control={form.control}
								name='invoiceId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Select Invoice *</FormLabel>
										<Select
											disabled={loadingInvoices}
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className='w-full'>
												<SelectTrigger disabled={loadingClients}>
													<SelectValue placeholder='Select a invoice' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{invoices.map((invoice) => (
													<SelectItem key={invoice._id} value={invoice._id}>
														{invoice.invoiceNumber} (
														{formatCurrency(invoice.grandTotal)})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name='transactionId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction ID *</FormLabel>
									<FormControl>
										<Input placeholder='e.g: xxxxxxxxxx' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Transaction Type */}
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Type *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl className='w-full'>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='payment'>Payment</SelectItem>
											<SelectItem value='refund'>Refund</SelectItem>
											<SelectItem value='adjustment'>Adjustment</SelectItem>
											<SelectItem value='credit'>Credit</SelectItem>
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
										<FormControl className='w-full'>
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
						{/* <FormField
							control={form.control}
							name='status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl className='w-full'>
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
						/> */}
						{/* Date */}
						{/* <FormField
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
												disabled={(date) =>
													date > new Date() || date < new Date('1900-01-01')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/> */}
						{/* Notes */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem className='col-span-1'>
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
						<br />
						{/* Submit Buttons */}
						<Button className='ml-auto' type='submit' disabled={isSubmitting}>
							{isSubmitting ? 'Adding...' : 'Add Transaction'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
