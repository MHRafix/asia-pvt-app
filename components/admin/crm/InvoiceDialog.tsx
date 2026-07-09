'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';
import TransactionForm from './TransactionForm';
import toast from 'react-hot-toast';

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
	transactionStatus: string;
	paymentDate: string;
	description?: string;
	notes?: string;
	clientId?: {
		_id: string;
		name: string;
		email: string;
		phone: string;
	};
	linkedServiceId?: {
		_id: string;
		serviceTitle: string;
	};
	createdAt: string;
}

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
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Invoice Details</DialogTitle>
					<DialogDescription>
						Invoice {invoice.invoiceNumber}
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue='details' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='details'>Details</TabsTrigger>
						<TabsTrigger value='payment'>Payment</TabsTrigger>
					</TabsList>

					<TabsContent value='details' className='space-y-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>Invoice Number</p>
								<p className='font-mono font-semibold text-lg'>{invoice.invoiceNumber}</p>
							</div>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>Status</p>
								<div className='mt-1'>
									<Badge className={getStatusColor(invoice.transactionStatus as any)}>
										{getStatusLabel(invoice.transactionStatus as any)}
									</Badge>
								</div>
							</div>
						</div>

						<div className='border-t pt-4'>
							<h3 className='font-semibold mb-3'>Client Information</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Name</p>
									<p className='font-medium'>{invoice.clientId?.name || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Email</p>
									<p className='font-medium'>{invoice.clientId?.email || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Phone</p>
									<p className='font-medium'>{invoice.clientId?.phone || 'N/A'}</p>
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
									<p className='text-sm text-muted-foreground'>Amount</p>
									<p className='font-semibold text-lg'>
										{formatCurrency(invoice.amount)}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Created Date</p>
									<p className='font-medium'>{formatDate(new Date(invoice.createdAt))}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Payment Date</p>
									<p className='font-medium'>
										{formatDate(new Date(invoice.paymentDate))}
									</p>
								</div>
							</div>
						</div>

						{invoice.description && (
							<div className='border-t pt-4'>
								<p className='text-sm font-medium text-muted-foreground mb-1'>
									Description
								</p>
								<p className='text-sm'>{invoice.description}</p>
							</div>
						)}

						{invoice.notes && (
							<div className='border-t pt-4'>
								<p className='text-sm font-medium text-muted-foreground mb-1'>Notes</p>
								<p className='text-sm'>{invoice.notes}</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value='payment' className='space-y-4 py-4'>
						{showTransactionForm ? (
							<TransactionForm
								invoiceId={invoice._id}
								clientId={invoice.clientId?._id || ''}
								invoiceAmount={invoice.amount}
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
