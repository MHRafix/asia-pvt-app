'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Download } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { formatCurrency, formatDateOnly, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
	paymentMethod: string;
	transactionStatus: string;
	clientId?: {
		_id: string;
		name: string;
	};
	paymentDate: string;
}

interface InvoicesTableProps {
	invoices: Invoice[];
	onEdit: (invoice: Invoice) => void;
	onRefresh: () => void;
}

export default function InvoicesTable({
	invoices,
	onEdit,
	onRefresh,
}: InvoicesTableProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/crm/invoices/${deleteId}`, {
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

	const handleDownload = async (invoiceId: string) => {
		try {
			// Placeholder for PDF generation
			toast.info('PDF generation coming soon');
		} catch (error) {
			toast.error('Failed to download invoice');
		}
	};

	return (
		<>
			<div className='border rounded-lg overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted'>
							<TableHead>Invoice #</TableHead>
							<TableHead>Client</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Payment Method</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
									No invoices found
								</TableCell>
							</TableRow>
						) : (
							invoices.map((invoice) => (
								<TableRow key={invoice._id} className='hover:bg-muted/50'>
									<TableCell className='font-semibold'>
										{invoice.invoiceNumber}
									</TableCell>
									<TableCell>
										{invoice.clientId?.name || 'N/A'}
									</TableCell>
									<TableCell className='font-semibold'>
										{formatCurrency(invoice.amount)}
									</TableCell>
									<TableCell className='capitalize'>
										{invoice.paymentMethod.replace('_', ' ')}
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(invoice.transactionStatus as any)}>
											{getStatusLabel(invoice.transactionStatus as any)}
										</Badge>
									</TableCell>
									<TableCell className='text-sm text-muted-foreground'>
										{formatDateOnly(new Date(invoice.paymentDate))}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex justify-end gap-2'>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleDownload(invoice._id)}
											>
												<Download className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onEdit(invoice)}
											>
												<Edit className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => setDeleteId(invoice._id)}
											>
												<Trash2 className='w-4 h-4 text-red-500' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Invoice</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this invoice? This action cannot be undone.
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
