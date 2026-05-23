'use client';

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
import { clientTransactionSchema, type ClientTransactionFormData } from '@/lib/validations/crm';

interface TransactionFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	clientId: string;
}

export default function TransactionFormDialog({
	open,
	onOpenChange,
	onSuccess,
	clientId,
}: TransactionFormDialogProps) {
	const form = useForm<ClientTransactionFormData>({
		resolver: zodResolver(clientTransactionSchema),
		defaultValues: {
			clientId,
			type: 'service',
			description: '',
			amount: 0,
			status: 'completed',
			notes: '',
		},
	});

	const onSubmit = async (data: ClientTransactionFormData) => {
		try {
			const response = await fetch('/api/crm/transactions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, clientId }),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Transaction added!');
				form.reset({
					clientId,
					type: 'service',
					description: '',
					amount: 0,
					status: 'completed',
					notes: '',
				});
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to add transaction');
			}
		} catch (error) {
			console.error('Error adding transaction:', error);
			toast.error('Failed to add transaction');
		}
	};

	const transactionType = form.watch('type');

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Add Transaction</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='service'>Service Booking</SelectItem>
											<SelectItem value='package'>Package Booking</SelectItem>
											<SelectItem value='payment'>Payment Received</SelectItem>
											<SelectItem value='refund'>Refund</SelectItem>
											<SelectItem value='adjustment'>Balance Adjustment</SelectItem>
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
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											placeholder={
												transactionType === 'service'
													? 'e.g. Visa Processing Service'
													: transactionType === 'package'
													? 'e.g. Tokyo Travel Package'
													: transactionType === 'payment'
													? 'e.g. Payment via Bank Transfer'
													: 'Description'
											}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Amount ($)
										{transactionType === 'payment' && (
											<span className='text-muted-foreground font-normal'>
												{' '}
												- Will reduce balance
											</span>
										)}
									</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='0.01'
											placeholder='0.00'
											{...field}
											onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
										/>
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
											<SelectItem value='completed'>Completed</SelectItem>
											<SelectItem value='pending'>Pending</SelectItem>
											<SelectItem value='cancelled'>Cancelled</SelectItem>
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
											placeholder='Additional notes...'
											className='resize-none'
											rows={2}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
										Adding...
									</>
								) : (
									'Add Transaction'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
