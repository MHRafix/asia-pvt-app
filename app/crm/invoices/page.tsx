'use client';

import InvoicesTable from '@/components/dashboard/crm/invoice-management/InvoicesTable';
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

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
	transactionStatus: string;
	paymentDate: string;
	clientId?: {
		_id: string;
		name: string;
		email: string;
	};
	linkedServiceId?: {
		_id: string;
		serviceTitle: string;
	};
	createdAt: string;
}

export default function InvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [stats, setStats] = useState<any>(null);
	const [pagination, setPagination] = useState<any>(null);

	const fetchInvoices = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: '20',
				search,
				...(statusFilter !== 'all' && { status: statusFilter }),
			});

			const response = await fetch(`/api/payment/invoices?${params}`);
			const result = await response.json();

			if (result.success) {
				setInvoices(result.data);
				setStats(result.stats);
				setPagination(result.pagination);
			} else {
				toast.error(result.error || 'Failed to fetch invoices');
			}
		} catch (error) {
			console.error('Error fetching invoices:', error);
			toast.error('Failed to fetch invoices');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchInvoices();
	}, [search, statusFilter, page]);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Invoices</h1>
					<p className='text-muted-foreground'>
						Manage and track your invoices
					</p>
				</div>
				<Button disabled>
					<Plus className='w-4 h-4 mr-2' />
					Create Invoice
				</Button>
			</div>

			{/* Stats */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Invoices
						</p>
						<p className='text-2xl font-bold mt-1'>{stats.totalInvoices}</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>Paid</p>
						<p className='text-2xl font-bold mt-1 text-green-600'>
							{stats.paidInvoices}
						</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>Pending</p>
						<p className='text-2xl font-bold mt-1 text-yellow-600'>
							{stats.pendingInvoices}
						</p>
					</div>
					<div className='border rounded-lg p-4 bg-card'>
						<p className='text-sm font-medium text-muted-foreground'>Partial</p>
						<p className='text-2xl font-bold mt-1 text-blue-600'>
							{stats.partialInvoices}
						</p>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
				<Input
					placeholder='Search invoices...'
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
						<SelectItem value='all'>All Status</SelectItem>
						<SelectItem value='paid'>Paid</SelectItem>
						<SelectItem value='pending'>Pending</SelectItem>
						<SelectItem value='partial'>Partial</SelectItem>
						<SelectItem value='failed'>Failed</SelectItem>
						<SelectItem value='refunded'>Refunded</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<InvoicesTable invoices={invoices} onRefresh={fetchInvoices} />

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
