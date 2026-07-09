'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	formatCurrency,
	formatDate,
	getStatusColor,
	getStatusLabel,
} from '@/lib/utils/formatting';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Invoice } from './InvoicesTable';
import TransactionForm from './TransactionForm';

interface Transaction {
	_id: string;
	type: string;
	amount: number;
	status: string;
	paymentMethod?: string;
	description: string;
	notes?: string;
	createdAt: string;
}

interface InvoiceDetailPageProps {
	invoiceId: string;
}

export default function InvoiceDetailPage({
	invoiceId,
}: InvoiceDetailPageProps) {
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);

	useEffect(() => {
		fetchInvoiceDetails();
		fetchTransactions();
	}, [invoiceId]);

	const fetchInvoiceDetails = async () => {
		try {
			const response = await fetch(`/api/payment/invoices/${invoiceId}`);
			const result = await response.json();

			if (result.success) {
				setInvoice(result.data);
			} else {
				toast.error(result.error || 'Failed to fetch invoice');
			}
		} catch (error) {
			console.error('Error fetching invoice:', error);
			toast.error('Failed to fetch invoice details');
		}
	};

	const fetchTransactions = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/payment/transactions?invoiceId=${invoiceId}&limit=100`,
			);
			const result = await response.json();

			if (result.success) {
				setTransactions(result.data || []);
			} else {
				toast.error(result.error || 'Failed to fetch transactions');
			}
		} catch (error) {
			console.error('Error fetching transactions:', error);
			toast.error('Failed to fetch transactions');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePaymentSuccess = () => {
		setShowPaymentDialog(false);
		toast.success('Payment recorded successfully');
		fetchInvoiceDetails();
		fetchTransactions();
	};

	const canPayment =
		invoice && (invoice.status === 'due' || invoice.status === 'partial');

	if (isLoading && !invoice) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				Loading...
			</div>
		);
	}

	if (!invoice) {
		return (
			<div className='text-center py-12'>
				<p className='text-muted-foreground'>Invoice not found</p>
				<Link href='/admin/crm/invoices'>
					<Button className='mt-4'>Back to Invoices</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/crm/invoices'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='w-4 h-4' />
						</Button>
					</Link>
					<div>
						<h1 className='text-3xl font-bold'>
							Invoice {invoice.invoiceNumber}
						</h1>
						<p className='text-muted-foreground mt-1'>
							Created {formatDate(new Date(invoice.createdAt))}
						</p>
					</div>
				</div>
				{canPayment && (
					<Button onClick={() => setShowPaymentDialog(true)} className='gap-2'>
						<Plus className='w-4 h-4' />
						Record Payment
					</Button>
				)}
			</div>

			{/* Invoice Details */}
			<div className='grid gap-4 md:grid-cols-2'>
				{/* Basic Information */}
				<Card className='border-0 shadow-soft'>
					<CardHeader>
						<CardTitle className='text-lg'>Invoice Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
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
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Grand Amount
							</p>
							<p className='text-2xl font-bold'>
								{formatCurrency(invoice.grandTotal)}
							</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Due Amount
							</p>
							<p className='text-2xl font-bold'>
								{formatCurrency(invoice.dueAmount)}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Client Information */}
				<Card className='border-0 shadow-soft'>
					<CardHeader>
						<CardTitle className='text-lg'>Client Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>Name</p>
							<p className='font-medium'>{invoice.clientId?.name || 'N/A'}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>Email</p>
							<p className='font-medium'>{invoice.clientId?.email || 'N/A'}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>Phone</p>
							<p className='font-medium'>{invoice.clientId?.phone || 'N/A'}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Service Information */}
			{invoice.linkedServiceId && (
				<Card className='border-0 shadow-soft'>
					<CardHeader>
						<CardTitle className='text-lg'>Service Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Service
							</p>
							<p className='font-medium'>
								{invoice.linkedServiceId.serviceTitle}
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Transactions */}
			<Card className='border-0 shadow-soft'>
				<CardHeader>
					<CardTitle className='text-lg'>Transaction History</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='text-center py-8 text-muted-foreground'>
							Loading transactions...
						</div>
					) : transactions.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>
							No transactions recorded yet
						</div>
					) : (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='bg-muted'>
										<TableHead>Date</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Method</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Description</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transactions.map((transaction) => (
										<TableRow
											key={transaction._id}
											className='hover:bg-muted/50'
										>
											<TableCell className='text-sm'>
												{formatDate(new Date(transaction.createdAt))}
											</TableCell>
											<TableCell className='capitalize'>
												<Badge variant='outline'>{transaction.type}</Badge>
											</TableCell>
											<TableCell className='font-semibold'>
												{formatCurrency(transaction.amount)}
											</TableCell>
											<TableCell className='capitalize'>
												{transaction.paymentMethod || 'N/A'}
											</TableCell>
											<TableCell>
												<Badge
													className={getStatusColor(transaction.status as any)}
												>
													{getStatusLabel(transaction.status as any)}
												</Badge>
											</TableCell>
											<TableCell>
												<div className='max-w-xs truncate'>
													{transaction.description}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment Dialog */}
			<Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
				<DialogContent className='max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Record Payment</DialogTitle>
						<DialogDescription>
							Record a payment for invoice {invoice.invoiceNumber}
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
						<TransactionForm
							invoiceId={invoice._id}
							clientId={invoice.clientId?._id || ''}
							invoiceAmount={invoice.grandTotal}
							onSubmit={handlePaymentSuccess}
							onCancel={() => setShowPaymentDialog(false)}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
