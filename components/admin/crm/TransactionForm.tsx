'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import toast from 'react-hot-toast';
import { paymentTransactionSchema } from '@/lib/validations/crm';
import { z } from 'zod';

type PaymentTransactionFormData = z.infer<typeof paymentTransactionSchema>;

interface TransactionFormProps {
	invoiceId: string;
	clientId: string;
	invoiceAmount: number;
	onSubmit: (transaction: any) => void;
	onCancel: () => void;
}

export default function TransactionForm({
	invoiceId,
	clientId,
	invoiceAmount,
	onSubmit,
	onCancel,
}: TransactionFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PaymentTransactionFormData>({
		resolver: zodResolver(paymentTransactionSchema),
		defaultValues: {
			invoiceId,
			clientId,
			transactionType: 'Payment',
			amount: undefined,
			paymentMethod: 'cash',
			notes: '',
			date: new Date(),
		},
	});

	const handleFormSubmit = async (data: PaymentTransactionFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch('/api/payment/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Payment recorded successfully');
				form.reset();
				onSubmit(result.data);
			} else {
				toast.error(result.error || 'Failed to record payment');
			}
		} catch (error) {
			console.error('Error recording payment:', error);
			toast.error('Failed to record payment');
		} finally {
			setIsSubmitting(false);
		}
	};

	const watchAmount = form.watch('amount');
	const dueAmount = Math.max(0, invoiceAmount - (watchAmount || 0));

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='transactionType'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Transaction Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='Payment'>Payment</SelectItem>
									<SelectItem value='Refund'>Refund</SelectItem>
									<SelectItem value='Adjustment'>Adjustment</SelectItem>
									<SelectItem value='Credit'>Credit</SelectItem>
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
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type='number'
									step='0.01'
									placeholder='0.00'
									{...field}
									onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormDescription>
								Invoice amount: {invoiceAmount.toFixed(2)} | Remaining due:{' '}
								{dueAmount.toFixed(2)}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='paymentMethod'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payment Method</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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

				<FormField
					control={form.control}
					name='notes'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes (Optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Add any notes about this payment'
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex gap-3 justify-end'>
					<Button type='button' variant='outline' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Recording...' : 'Record Payment'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
