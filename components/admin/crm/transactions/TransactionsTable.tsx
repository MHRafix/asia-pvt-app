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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Transaction {
	_id: string;
	type: string;
	amount: number;
	status: string;
	paymentMethod?: string;
	description: string;
	notes?: string;
	invoiceId?: {
		_id: string;
		name: string;
		invoiceNumber: string;
	};
	createdAt: string;
}

interface TransactionsTableProps {
	transactions: Transaction[];
	onEdit?: (transaction: Transaction) => void;
	onRefresh: () => void;
	isLoading?: boolean;
}

export default function TransactionsTable({
	transactions,
	onEdit,
	onRefresh,
	isLoading = false,
}: TransactionsTableProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!deleteId) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/payment/transactions/${deleteId}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Transaction deleted successfully');
				onRefresh();
			} else {
				toast.error(result.error || 'Failed to delete transaction');
			}
		} catch (error) {
			console.error('Error deleting transaction:', error);
			toast.error('Failed to delete transaction');
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
							<TableHead>Date</TableHead>
							<TableHead>Invoice</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Method</TableHead>
							<TableHead>Description</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className='text-center py-8 text-muted-foreground'
								>
									Loading transactions...
								</TableCell>
							</TableRow>
						) : transactions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className='text-center py-8 text-muted-foreground'
								>
									No transactions found
								</TableCell>
							</TableRow>
						) : (
							transactions.map((transaction) => (
								<TableRow key={transaction._id} className='hover:bg-muted/50'>
									<TableCell className='text-sm text-muted-foreground'>
										{formatDate(new Date(transaction.createdAt))}
									</TableCell>{' '}
									<TableCell>
										<div>
											<div className='font-medium'>
												{transaction?.invoiceId?.invoiceNumber || 'N/A'}
											</div>
										</div>
									</TableCell>
									<TableCell className='capitalize'>
										<Badge variant='outline'>{transaction.type}</Badge>
									</TableCell>
									<TableCell className='font-semibold'>
										{formatCurrency(transaction.amount)}
									</TableCell>
									<TableCell className='capitalize font-mono font-semibold'>
										{transaction.paymentMethod || 'N/A'}
									</TableCell>
									<TableCell>
										<div className='max-w-xs truncate'>
											{transaction.description || 'N/A'}
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
						<AlertDialogTitle>Delete Transaction</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this transaction? This action
							cannot be undone.
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
