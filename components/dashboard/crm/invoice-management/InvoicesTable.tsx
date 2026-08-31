'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
	formatDateOnly,
	getStatusColor,
	getStatusLabel,
} from '@/lib/utils/formatting';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import InvoiceDialog from './InvoiceDialog';

export interface Invoice {
	_id: string;
	invoiceNumber: string;
	subTotal: number;
	grandTotal: number;
	discount: number;
	dueAmount: number;
	paidAmount: number;

	status: string;
	date: string;
	clientId?: {
		_id: string;
		name: string;
		email: string;
		phone: string;
	};
	linkedServiceId?: {
		_id: string;
		serviceTitle: string;
		serviceId: string;
	};
	createdAt: string;
}

interface InvoicesTableProps {
	invoices: Invoice[];
	onEdit?: (invoice: Invoice) => void;
	onRefresh: () => void;
}

export default function InvoicesTable({
	invoices,
	onEdit,
	onRefresh,
}: InvoicesTableProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

	const navigate = useRouter();

	const handleDelete = async () => {
		if (!deleteId) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/payment/invoices/${deleteId}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Invoice deleted successfully');
				onRefresh();
			} else {
				toast.error(result.error || 'Failed to delete invoice');
			}
		} catch (error) {
			console.error('Error deleting invoice:', error);
			toast.error('Failed to delete invoice');
		} finally {
			setIsDeleting(false);
			setDeleteId(null);
		}
	};

	return (
		<>
			<div className='border rounded-lg overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted'>
							<TableHead>Invoice Number</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Service</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Due Amount</TableHead>
							<TableHead>Paid Amount</TableHead>
							<TableHead>Grand Total</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className='text-center py-8 text-muted-foreground'
								>
									No invoices found
								</TableCell>
							</TableRow>
						) : (
							invoices.map((invoice) => (
								<TableRow
									key={invoice._id}
									className='hover:bg-muted/50 cursor-pointer'
								>
									<TableCell className='font-mono text-sm font-semibold'>
										{invoice.invoiceNumber}
									</TableCell>
									<TableCell>
										<div>
											<div className='font-medium'>
												{invoice.clientId?.name || 'N/A'}
											</div>
											<div className='text-sm text-muted-foreground'>
												{invoice.clientId?.email}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className='max-w-xs truncate'>
											{invoice.linkedServiceId?.serviceTitle || 'N/A'}
										</div>
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(invoice.status as any)}>
											{getStatusLabel(invoice.status as any)}
										</Badge>
									</TableCell>
									<TableCell className='font-mono font-semibold text-primary'>
										{formatCurrency(invoice.dueAmount).replace('BDT', '৳')}
									</TableCell>
									<TableCell className='font-mono font-semibold text-green-700'>
										{formatCurrency(invoice.paidAmount).replace('BDT', '৳')}
									</TableCell>
									<TableCell className='font-mono font-semibold'>
										{formatCurrency(invoice.grandTotal).replace('BDT', '৳')}
									</TableCell>
									<TableCell className='text-sm text-muted-foreground'>
										{formatDateOnly(
											new Date(invoice.date || invoice.createdAt),
										)}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex justify-end gap-2'>
											<Button
												variant='ghost'
												size='sm'
												onClick={() =>
													navigate.push(
														`/dashboard/crm/invoices/${invoice?._id}`,
													)
												}
											>
												<Eye className='w-4 h-4' />
											</Button>
											{onEdit && (
												<Button
													variant='ghost'
													size='sm'
													onClick={() => onEdit(invoice)}
												>
													<Edit className='w-4 h-4' />
												</Button>
											)}
											<Button
												variant='destructive'
												size='sm'
												onClick={() => setDeleteId(invoice._id)}
											>
												<Trash2 className='w-4 h-4 text-white' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{selectedInvoice && (
				<InvoiceDialog
					invoice={selectedInvoice}
					open={showInvoiceDialog}
					onOpenChange={setShowInvoiceDialog}
					onTransactionAdded={onRefresh}
				/>
			)}

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Invoice</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this invoice? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className='flex justify-end gap-3'>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className='bg-red-600 hover:bg-red-700'
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
