'use client';

import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import {
	BanknoteArrowUp,
	CheckCircle2,
	Loader,
	Printer,
	ReceiptText,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import TransactionFormDialog from '../transactions/TransactionFormDialog';
import { Invoice } from './InvoicesTable';

interface Transaction {
	_id: string;
	type: string;
	invoiceId: {
		invoiceNumber: string;
	};
	amount: number;
	paymentMethod?: string;
	description: string;
	transactionId: string;
	createdAt: string;
}

export default function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);

	const printRef = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: `invoice-${invoice?.clientId?.name}-${invoice?.invoiceNumber}`,
	});

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

	if (!isLoading && !invoice) {
		return (
			<div className='text-center py-12'>
				<p className='text-muted-foreground'>Invoice not found</p>
				<Link href='/admin/crm/invoices'>
					<Button className='mt-4'>Back to Invoices</Button>
				</Link>
			</div>
		);
	}

	if (isLoading) {
		return (
			<Loader className='text-primary w-8 animate-spin mx-auto h-[80vh]' />
		);
	}

	return (
		<div className='py-5'>
			<div className='mx-auto w-[250mm] min-h-[297Documentationmm] bg-white shadow-2xl'>
				<div ref={printRef}>
					{/* Header */}
					<div className='border-b'>
						<div className='flex justify-between items-start px-12 pt-10'>
							<div>
								<h1 className='text-4xl font-bold text-red-600'>Asia Tours</h1>
								<p className='text-gray-500 mb-2'>
									Travel • Visa • Immigration
								</p>
								<p className='text-gray-400 text-sm'>+880 1726631567</p>
								<p className='text-gray-400 text-sm'>www.asiapvt.com</p>
							</div>

							<div className='text-right'>
								<h2 className='text-5xl font-light tracking-widest uppercase'>
									Invoice
								</h2>

								<div className='mt-5 text-sm space-y-1'>
									<p className='font-mono text-sm font-semibold'>
										<span className='font-semibold'>Invoice Number:</span>
										{invoice?.invoiceNumber}
									</p>

									<p>
										<span className='font-semibold'>Date</span>{' '}
										{formatDate(new Date(invoice?.createdAt!))}
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
							</div>
						</div>
					</div>
					{/* Payment List */}
					<div className='px-12'>
						<h3 className='text-xl font-semibold text-red-600 mb-4'>
							Payment History
						</h3>

						<div className='w-full overflow-hidden rounded-xl border border-slate-300'>
							<div className='overflow-x-auto'>
								<table className='w-full text-sm'>
									<thead className='bg-gray-800 text-white'>
										<tr>
											<th className='px-4 py-3 text-left font-semibold'>
												Payment Date
											</th>
											<th className='px-4 py-3 text-left font-semibold'>
												Invoice Number
											</th>
											<th className='px-4 py-3 text-left font-semibold'>
												Transaction ID
											</th>
											<th className='px-4 py-3 text-left font-semibold'>
												Method
											</th>

											<th className='px-4 py-3 text-right font-semibold'>
												Amount
											</th>
										</tr>
									</thead>

									<tbody>
										{transactions?.length ? (
											transactions.map((payment, index) => (
												<tr
													key={index}
													className='border-t hover:bg-slate-50 transition-colors'
												>
													<td className='px-4 py-3 whitespace-nowrap'>
														{formatDate(new Date(payment.createdAt))}
													</td>

													<td className='px-4 py-3 font-mono font-semibold whitespace-nowrap'>
														{payment.invoiceId.invoiceNumber}
													</td>

													<td className='px-4 py-3 font-mono whitespace-nowrap'>
														{payment.transactionId || 'N/A'}
													</td>

													<td className='px-4 py-3 whitespace-nowrap font-mono font-semibold'>
														{payment.paymentMethod}
													</td>

													<td className='px-4 py-3 text-right font-semibold font-mono whitespace-nowrap'>
														{formatCurrency(payment.amount).replace('BDT', '৳')}
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={7} className='py-5'>
													<div className='flex flex-col items-center justify-center text-center'>
														<div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100'>
															<ReceiptText className='w-5 h-5' />
														</div>

														<h3 className='text-base font-semibold text-slate-800'>
															No payment records found
														</h3>

														<p className='mt-1 text-sm text-slate-500'>
															Payment history will appear here once transactions
															are available.
														</p>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					{/* Bottom */}
					<div className='flex justify-between px-12 mt-12 items-end'>
						<div className='flex items-center gap-5 justify-between'>
							<div className='text-center'>
								<div className='w-52 border-t mb-2' />

								<p className='text-sm'>Authorized Signature</p>
							</div>
						</div>
						<div className='w-80'>
							<div className='space-y-3'>
								<div className='flex justify-between'>
									<span>Sub Total (service cost)</span>
									<span>
										{formatCurrency(invoice?.subTotal!).replace('BDT', '৳')}
									</span>
								</div>

								<div className='flex justify-between font-mono'>
									<span>Discount</span>
									<span>
										({formatCurrency(invoice?.discount!).replace('BDT', '৳')})
									</span>
								</div>

								<hr />

								<div className='flex justify-between font-mono font-semibold'>
									<span>Grand Total</span>
									<span>
										{formatCurrency(invoice?.grandTotal!).replace('BDT', '৳')}
									</span>
								</div>

								<div className='flex justify-between font-mono'>
									<span>Total Paid</span>
									<span>
										{formatCurrency(invoice?.paidAmount!).replace('BDT', '৳')}
									</span>
								</div>

								<div className='flex justify-between border-t pt-3 font-bold font-mono text-lg'>
									<span>Due</span>
									<span>
										{formatCurrency(invoice?.dueAmount!).replace('BDT', '৳')}
									</span>
								</div>
							</div>

							{invoice?.status === 'paid' ? (
								<div className='mt-5 bg-green-600 text-white rounded-lg p-4'>
									<div className='flex justify-between items-center'>
										<span className='font-bold font-mono'>Invoice Paid</span>

										<span className='text-2xl font-mono font-bold'>
											{formatCurrency(invoice?.paidAmount!).replace('BDT', '৳')}
										</span>
									</div>
								</div>
							) : (
								<div className='mt-5 bg-red-600 text-white rounded-lg p-4'>
									<div className='flex justify-between items-center'>
										<span className='font-medium'>Outstanding Balance</span>

										<span className='text-2xl font-mono font-bold'>
											{formatCurrency(invoice?.dueAmount!).replace('BDT', '৳')}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='mx-auto p-5'>
					<Button variant={'destructive'} onClick={handlePrint}>
						<Printer className='w-4 h-4' /> Print
					</Button>{' '}
					&nbsp;&nbsp;
					{invoice?.status !== 'paid' && (
						<Button
							variant={'secondary'}
							onClick={() => setShowPaymentDialog(true)}
						>
							<BanknoteArrowUp className='w-4 h-4' /> Pay now
						</Button>
					)}
				</div>
			</div>
			<TransactionFormDialog
				open={showPaymentDialog}
				onOpenChange={setShowPaymentDialog}
				onSuccess={() => {
					fetchTransactions();
					fetchInvoiceDetails();
				}}
				invoiceId={invoice?._id}
				amount={invoice?.grandTotal! - invoice?.paidAmount!}
			/>
		</div>
	);
}
