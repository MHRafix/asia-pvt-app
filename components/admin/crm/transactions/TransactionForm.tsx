'use client';

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
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { paymentTransactionSchema } from '@/lib/validations/crm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
			type: 'payment',
			amount: undefined,
			paymentMethod: 'cash',
			notes: '',
			date: new Date().toDateString(),
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
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className='space-y-6'
			>
				<FormField
					control={form.control}
					name='type'
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
									onChange={(e) =>
										field.onChange(parseFloat(e.target.value) || 0)
									}
								/>
							</FormControl>
							<FormDescription>
								Invoice amount:{' '}
								<span className='text-primary font-semibold'>
									{invoiceAmount.toFixed(2)} BDT
								</span>{' '}
								| Remaining due:{' '}
								<span className='text-primary font-semibold'>
									{dueAmount.toFixed(2)} BDT
								</span>
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
