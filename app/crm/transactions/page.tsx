'use client';

import TransactionsTable from '@/components/admin/crm/transactions/TransactionsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
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

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [stats, setStats] = useState<any>(null);
	const [pagination, setPagination] = useState<any>(null);

	const fetchTransactions = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: '20',
				search,
				...(statusFilter !== 'all' && { type: statusFilter }),
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
	}, [search, statusFilter, page]);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Transactions</h1>
					<p className='text-muted-foreground'>
						View and manage all payment transactions
					</p>
				</div>
				<Button disabled>
					<Plus className='w-4 h-4 mr-2' />
					Add Transaction
				</Button>
			</div>

			{/* Stats */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Transactions
						</p>
						<p className='text-2xl font-bold mt-1'>{stats.totalTransactions}</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Amount
						</p>
						<p className='text-2xl font-bold mt-1'>
							{stats.totalAmount.toLocaleString('en-US', {
								style: 'currency',
								currency: 'BDT',
							})}
						</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>
							Completed
						</p>
						<p className='text-2xl font-bold mt-1 text-green-600'>
							{stats.completedTransactions}
						</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>Pending</p>
						<p className='text-2xl font-bold mt-1 text-yellow-600'>
							{stats.pendingTransactions}
						</p>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
				<Input
					placeholder='Search transactions...'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					className='md:w-64'
				/>
				<Select
					value={statusFilter}
					onValueChange={(value) => {
						setStatusFilter(value);
						setPage(1);
					}}
				>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Types</SelectItem>
						<SelectItem value='payment'>Payment</SelectItem>
						<SelectItem value='refund'>Refund</SelectItem>
						<SelectItem value='adjustment'>Adjustment</SelectItem>
						<SelectItem value='credit'>Credit</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<TransactionsTable
				transactions={transactions}
				onRefresh={fetchTransactions}
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
		</div>
	);
}
