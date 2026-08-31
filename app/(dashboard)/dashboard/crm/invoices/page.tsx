'use client';

import InvoicesTable, {
	Invoice,
} from '@/components/dashboard/crm/invoice-management/InvoicesTable';
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
import {
	CheckCircle,
	Clock3,
	PieChart,
	Plus,
	Search,
	Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Stats {
	totalInvoices: number;
	paidInvoices: number;
	dueInvoices: number;
	partialInvoices: number;
	totalAmount?: number;
	paidAmount?: number;
	dueAmount: number;
	partialPaidAmount: number;
	partialDueAmount: number;
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
					<p className='text-muted-foreground'>
						Manage and track your invoices
					</p>
				</div>
				<Button disabled className='gap-2'>
					<Plus className='w-4 h-4' />
					Create Invoice
				</Button>
			</div>

			{/* Stats */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='flex items-center gap-4 rounded-xl border border-green-400 bg-white px-4 py-2'>
						<div
							className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full'
							style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)' }}
						>
							<span className='text-green-500'>
								<Wallet size={22} />
							</span>
						</div>

						<div className='min-w-0'>
							<p className='text-sm text-gray-500'>Total Invoices</p>{' '}
							<p className='text-2xl font-bold mt-2'>{stats.totalInvoices}</p>
							<p className='truncate text-lg font-mono font-semibold text-black'>
								{formatCurrency(stats?.totalAmount!).replace('BDT', '৳')}
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4 rounded-xl border border-green-400 bg-white px-5 py-5'>
						<div
							className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full'
							style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)' }}
						>
							<span className='text-green-500'>
								<CheckCircle size={22} />
							</span>
						</div>

						<div className='min-w-0'>
							<p className='text-sm text-gray-500'>Paid</p>{' '}
							<p className='text-2xl font-bold mt-2'>{stats.paidInvoices}</p>
							<p className='truncate text-lg font-mono font-semibold text-green-500'>
								{formatCurrency(stats?.paidAmount! || 0).replace('BDT', '৳')}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-4 rounded-xl border border-red-400 bg-white px-5 py-5'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100'>
							<span className='text-red-500'>
								<Clock3 size={22} />
							</span>
						</div>

						<div className='min-w-0 font-mono font-semibold'>
							<p className='text-sm text-gray-500'>Due</p>{' '}
							<p className='text-2xl font-bold mt-2'>{stats.dueInvoices}</p>
							<p className='truncate text-lg c text-red-500'>
								{formatCurrency(stats?.dueAmount! || 0).replace('BDT', '৳')}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-4 rounded-xl border border-orange-400 bg-white px-5 py-5'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100'>
							<span className='text-orange-500'>
								<PieChart size={22} />
							</span>
						</div>

						<div className='min-w-0 font-mono font-semibold'>
							<p className='text-sm text-gray-500'>Partial</p>{' '}
							<p className='text-2xl font-bold mt-2'>{stats.partialInvoices}</p>
							<p className='truncate text-lg font-semibold text-orange-500'>
								<span className='text-green-500'>
									{' '}
									{formatCurrency(stats?.partialPaidAmount! || 0).replace(
										'BDT',
										'৳',
									)}
								</span>{' '}
								-{' '}
								{formatCurrency(stats?.partialDueAmount! || 0).replace(
									'BDT',
									'৳',
								)}
							</p>
						</div>
					</div>
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
								<SelectItem value='due'>Due</SelectItem>
								<SelectItem value='partial'>Partial</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

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
