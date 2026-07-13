'use client';

import TransactionFormDialog from '@/components/admin/crm/transactions/TransactionFormDialog';
import TransactionsTable from '@/components/admin/crm/transactions/TransactionsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils/formatting';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Transaction {
	_id: string;
	type: string;
	amount: number;
	status: string;
	paymentMethod?: string;
	description: string;
	notes?: string;
	clientId?: {
		_id: string;
		name: string;
		email: string;
	};
	createdAt: string;
}

interface Stats {
	totalTransactions: number;
	totalAmount: number;
	successfulTransactions: number;
	failedTransactions: number;
}

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [stats, setStats] = useState<Stats | null>(null);
	const [pagination, setPagination] = useState<any>(null);
	const [showAddDialog, setShowAddDialog] = useState(false);

	const fetchTransactions = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: '20',
				search,
				...(statusFilter !== 'all' && { status: statusFilter }),
				...(typeFilter !== 'all' && { type: typeFilter }),
			});

			const response = await fetch(`/api/payment/transactions?${params}`);
			const result = await response.json();

			if (result.success) {
				setTransactions(result.data);
				setStats(result.stats);
				setPagination(result.pagination);
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

	useEffect(() => {
		fetchTransactions();
	}, [search, statusFilter, typeFilter, page]);

	const handleAddSuccess = () => {
		setShowAddDialog(false);
		setPage(1);
		fetchTransactions();
		toast.success('Transaction added successfully');
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Transactions</h1>
					<p className='text-muted-foreground'>
						Manage and track all transactions
					</p>
				</div>
				<Button onClick={() => setShowAddDialog(true)} className='gap-2'>
					<Plus className='w-4 h-4' />
					Add Transaction
				</Button>
			</div>

			{/* Stats */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Transactions
							</p>
							<p className='text-2xl font-bold mt-2'>
								{stats.totalTransactions}
							</p>
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Amount
							</p>
							<p className='text-2xl font-bold mt-2 text-green-600'>
								{formatCurrency(stats.totalAmount)}
							</p>
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>
								Successful
							</p>
							<p className='text-2xl font-bold mt-2'>
								{stats.successfulTransactions}
							</p>
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>
								Failed
							</p>
							<p className='text-2xl font-bold mt-2 text-red-600'>
								{stats.failedTransactions}
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters */}
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-6'>
					<div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-4'>
						<div className='relative flex-1 max-w-md'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search transactions...'
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								className='pl-10'
							/>
						</div>
						<Select
							value={typeFilter}
							onValueChange={(value) => {
								setTypeFilter(value);
								setPage(1);
							}}
						>
							<SelectTrigger className='w-full md:w-48'>
								<SelectValue placeholder='Transaction Type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Types</SelectItem>
								<SelectItem value='Payment'>Payment</SelectItem>
								<SelectItem value='Refund'>Refund</SelectItem>
								<SelectItem value='Adjustment'>Adjustment</SelectItem>
								<SelectItem value='Credit'>Credit</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={statusFilter}
							onValueChange={(value) => {
								setStatusFilter(value);
								setPage(1);
							}}
						>
							<SelectTrigger className='w-full md:w-48'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Status</SelectItem>
								<SelectItem value='completed'>Completed</SelectItem>
								<SelectItem value='pending'>Pending</SelectItem>
								<SelectItem value='failed'>Failed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<TransactionsTable
				transactions={transactions}
				onRefresh={fetchTransactions}
				isLoading={isLoading}
			/>

			{/* Pagination */}
			{pagination && pagination.pages > 1 && (
				<div className='flex items-center justify-between py-4'>
					<p className='text-sm text-muted-foreground'>
						Page {pagination.page} of {pagination.pages}
					</p>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage(Math.max(1, page - 1))}
							disabled={page === 1 || isLoading}
						>
							Previous
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage(Math.min(pagination.pages, page + 1))}
							disabled={page === pagination.pages || isLoading}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Add Transaction Dialog */}
			<TransactionFormDialog
				open={showAddDialog}
				onOpenChange={setShowAddDialog}
				onSuccess={handleAddSuccess}
			/>
		</div>
	);
}
