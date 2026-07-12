'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatting';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Invoice } from './InvoicesTable';

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

export default function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
	const payments = [
		{
			date: '02 Jul 2026',
			method: 'Cash',
			note: 'Booking Advance',
			amount: 50000,
		},
		{
			date: '08 Jul 2026',
			method: 'Bank Transfer',
			note: 'Second Payment',
			amount: 75000,
		},
		{
			date: '12 Jul 2026',
			method: 'Card',
			note: 'Final Payment',
			amount: 25000,
		},
	];

	const totalPaid = payments.reduce((a, b) => a + b.amount, 0);
	const totalCost = 170000;

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
		<div className='bg-gray-100 py-10'>
			<div className='mx-auto w-[210mm] min-h-[297mm] bg-white shadow-2xl'>
				{/* Header */}

				<div className='border-b'>
					<div className='flex justify-between items-start px-12 pt-10'>
						<div>
							<h1 className='text-4xl font-bold text-red-600'>Asia Tours</h1>

							<p className='text-gray-500 mt-2'>Travel • Visa • Immigration</p>
						</div>

						<div className='text-right'>
							<h2 className='text-5xl font-light tracking-widest uppercase'>
								Invoice
							</h2>

							<div className='mt-5 text-sm space-y-1'>
								<p>
									<span className='font-semibold'>Invoice Number:</span>{' '}
									{invoice?.invoiceNumber}
								</p>

								<p>
									<span className='font-semibold'>Date</span>{' '}
									{formatDate(new Date(invoice?.createdAt))}
								</p>
							</div>
						</div>
					</div>

					<div className='mt-8 h-3 bg-red-600' />
				</div>

				{/* Client & Service */}

				<div className='grid grid-cols-2 gap-8 px-12 py-10'>
					{/* Client */}

					<div className='rounded-xl border'>
						<div className='bg-red-50 px-5 py-3 border-b'>
							<h3 className='font-semibold text-red-600'>Client Details</h3>
						</div>

						<div className='p-5 space-y-2 text-sm'>
							<p>
								<b>Name:</b> {invoice?.clientId?.name}
							</p>
							<p>
								<b>Phone:</b> {invoice?.clientId?.phone}
							</p>
							<p>
								<b>Email:</b> {invoice?.clientId?.email}
							</p>
							<p>
								<b>Passport:</b> BX1234567
							</p>
							<p>
								<b>Address:</b> Dhaka, Bangladesh
							</p>
						</div>
					</div>

					{/* Service */}

					<div className='rounded-xl border'>
						<div className='bg-red-50 px-5 py-3 border-b'>
							<h3 className='font-semibold text-red-600'>Taken Service</h3>
						</div>

						<div className='p-5 space-y-2 text-sm'>
							<div className='flex items-center gap-2'>
								<CheckCircle2 size={16} className='text-red-600' />
								{invoice?.linkedServiceId?.serviceTitle || 'Visa Processing'}
							</div>

							{/* <div className='flex items-center gap-2'>
								<CheckCircle2 size={16} className='text-red-600' />
								Visa Processing
							</div>

							<div className='flex items-center gap-2'>
								<CheckCircle2 size={16} className='text-red-600' />
								Documentation Support
							</div>

							<div className='flex items-center gap-2'>
								<CheckCircle2 size={16} className='text-red-600' />
								Embassy Appointment
							</div> */}
						</div>
					</div>
				</div>

				{/* Payment List */}

				<div className='px-12'>
					<h3 className='text-xl font-semibold text-red-600 mb-4'>
						Payment History
					</h3>

					<table className='w-full border text-sm'>
						<thead>
							<tr className='bg-gray-800 text-white'>
								<th className='p-3 text-left'>SL</th>
								<th className='p-3 text-left'>Payment Date</th>
								<th className='p-3 text-left'>Method</th>
								<th className='p-3 text-left'>Description</th>
								<th className='p-3 text-right'>Amount</th>
							</tr>
						</thead>

						<tbody>
							{payments.map((payment, index) => (
								<tr key={index} className='border-b even:bg-gray-50'>
									<td className='p-3'>{index + 1}</td>

									<td className='p-3'>{payment.date}</td>

									<td className='p-3'>{payment.method}</td>

									<td className='p-3'>{payment.note}</td>

									<td className='p-3 text-right font-medium'>
										৳ {payment.amount.toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Bottom */}

				<div className='flex justify-between px-12 mt-12'>
					<div className='w-1/2'>
						<h4 className='font-semibold mb-2'>Terms & Conditions</h4>

						<p className='text-sm text-gray-500 leading-6'>
							Thank you for choosing Asia Tours. All payments are non-refundable
							once the visa processing has begun. Please keep this invoice for
							future reference.
						</p>
					</div>

					<div className='w-80'>
						<div className='space-y-3'>
							<div className='flex justify-between'>
								<span>Total Service Cost</span>
								<span>৳ {invoice.grandTotal}</span>
							</div>

							<div className='flex justify-between'>
								<span>Total Paid</span>
								<span>৳ {invoice?.paidAmount}</span>
							</div>

							<div className='flex justify-between border-t pt-3 font-bold text-lg'>
								<span>Due</span>
								<span>৳ {invoice?.dueAmount}</span>
							</div>
						</div>

						<div className='mt-5 bg-red-600 text-white rounded-lg p-4'>
							<div className='flex justify-between items-center'>
								<span className='font-medium'>Outstanding Balance</span>

								<span className='text-2xl font-bold'>
									৳ {invoice?.dueAmount}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}

				<div className='mt-20 px-12 pb-10'>
					<div className='border-t pt-6 flex justify-between items-end'>
						<div className='text-sm text-gray-500'>
							+880 1700-000000 <br />
							info@asiatours.com <br />
							www.asiatours.com
						</div>

						<div className='text-center'>
							<div className='w-52 border-t mb-2' />

							<p className='text-sm'>Authorized Signature</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
