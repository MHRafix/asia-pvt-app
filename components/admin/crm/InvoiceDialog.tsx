'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	formatCurrency,
	getStatusColor,
	getStatusLabel,
} from '@/lib/utils/formatting';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Invoice } from './InvoicesTable';
import TransactionForm from './TransactionForm';

interface InvoiceDialogProps {
	invoice: Invoice;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTransactionAdded?: () => void;
}

export default function InvoiceDialog({
	invoice,
	open,
	onOpenChange,
	onTransactionAdded,
}: InvoiceDialogProps) {
	const [showTransactionForm, setShowTransactionForm] = useState(false);

	const handleTransactionAdded = () => {
		setShowTransactionForm(false);
		toast.success('Payment recorded successfully');
		onTransactionAdded?.();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='!max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='flex gap-2 items-center'>
						Invoice:{' '}
						<p className='font-mono font-semibold text-lg'>
							{invoice.invoiceNumber}
						</p>
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue='details' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='details'>Details</TabsTrigger>
						<TabsTrigger value='payment'>Payment</TabsTrigger>
					</TabsList>

					<TabsContent value='details' className='space-y-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									Invoice Number
								</p>
								<p className='font-mono font-semibold text-lg'>
									{invoice.invoiceNumber}
								</p>
							</div>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									Status
								</p>
								<div className='mt-1'>
									<Badge className={getStatusColor(invoice.status as any)}>
										{getStatusLabel(invoice.status as any)}
									</Badge>
								</div>
							</div>
						</div>

						<div className='border-t pt-4'>
							<h3 className='font-semibold mb-3'>Client Information</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Name</p>
									<p className='font-medium'>
										{invoice.clientId?.name || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Email</p>
									<p className='font-medium'>
										{invoice.clientId?.email || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Phone</p>
									<p className='font-medium'>
										{invoice.clientId?.phone || 'N/A'}
									</p>
								</div>
							</div>
						</div>

						<div className='border-t pt-4'>
							<h3 className='font-semibold mb-3'>Invoice Information</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Service</p>
									<p className='font-medium'>
										{invoice.linkedServiceId?.serviceTitle || 'N/A'}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Grand Total</p>
									<p className='font-semibold text-lg'>
										{formatCurrency(invoice.grandTotal)}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Paid Amount</p>
									<p className='font-medium text-green-500'>
										{formatCurrency(invoice?.paidAmount)}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Due Amount</p>
									<p className='font-medium'>
										{formatCurrency(invoice?.dueAmount)}
									</p>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value='payment' className='space-y-4 py-4'>
						{showTransactionForm ? (
							<TransactionForm
								invoiceId={invoice._id}
								clientId={invoice.clientId?._id || ''}
								invoiceAmount={invoice.grandTotal}
								onSubmit={handleTransactionAdded}
								onCancel={() => setShowTransactionForm(false)}
							/>
						) : (
							<div className='text-center py-8'>
								<p className='text-muted-foreground mb-4'>
									Record a payment for this invoice
								</p>
								<Button onClick={() => setShowTransactionForm(true)}>
									Add Payment
								</Button>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
