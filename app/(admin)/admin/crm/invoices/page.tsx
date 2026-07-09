'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import InvoicesTable from '@/components/admin/crm/InvoicesTable';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatting';

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

interface Stats {
	totalInvoices: number;
	paidInvoices: number;
	pendingInvoices: number;
	partialInvoices: number;
	totalAmount?: number;
	paidAmount?: number;
}

export default function AdminInvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [stats, setStats] = useState<Stats | null>(null);
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
					<p className='text-muted-foreground'>Manage and track your invoices</p>
				</div>
				<Button disabled className='gap-2'>
					<Plus className='w-4 h-4' />
					Create Invoice
				</Button>
			</div>

			{/* Stats */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Invoices
							</p>
							<p className='text-2xl font-bold mt-2'>{stats.totalInvoices}</p>
							{stats.totalAmount && (
								<p className='text-sm text-muted-foreground mt-1'>
									{formatCurrency(stats.totalAmount)}
								</p>
							)}
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>Paid</p>
							<p className='text-2xl font-bold mt-2 text-green-600'>
								{stats.paidInvoices}
							</p>
							{stats.paidAmount && (
								<p className='text-sm text-green-600 mt-1'>
									{formatCurrency(stats.paidAmount)}
								</p>
							)}
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>Pending</p>
							<p className='text-2xl font-bold mt-2 text-yellow-600'>
								{stats.pendingInvoices}
							</p>
						</CardContent>
					</Card>
					<Card className='border-0 shadow-soft'>
						<CardContent className='p-6'>
							<p className='text-sm font-medium text-muted-foreground'>Partial</p>
							<p className='text-2xl font-bold mt-2 text-blue-600'>
								{stats.partialInvoices}
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
								placeholder='Search invoices...'
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								className='pl-10'
							/>
						</div>
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
				</CardContent>
			</Card>

			{/* Table */}
			<InvoicesTable
				invoices={invoices}
				onRefresh={fetchInvoices}
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
