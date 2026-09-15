'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Edit,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ClientFormDialog from './ClientFormDialog';

interface Client {
	_id: string;
	name: string;
	email: string;
	phone: string;
	company?: string;
	status: 'active' | 'inactive' | 'prospect' | 'vip';
	balance: number;
	totalSpent: number;
	totalServices: number;
	totalPackages: number;
	createdAt: string;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

export default function ClientsList() {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingClient, setEditingClient] = useState<Client | null | undefined>(
		null,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		fetchClients();
	}, [search, statusFilter, pagination.page]);

	const fetchClients = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (search) params.append('search', search);
			if (statusFilter !== 'all') params.append('status', statusFilter);
			params.append('page', pagination.page.toString());
			params.append('limit', pagination.limit.toString());

			const response = await fetch(`/api/crm/clients?${params}`);
			const data = await response.json();

			if (data.success) {
				setClients(data.data);
				setPagination(data.pagination);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
			toast.error('Failed to fetch clients');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!deletingId) return;

		try {
			const response = await fetch(`/api/crm/clients/${deletingId}`, {
				method: 'DELETE',
			});
			const data = await response.json();

			if (data.success) {
				toast.success('Client deleted successfully');
				fetchClients();
			} else {
				toast.error(data.error || 'Failed to delete client');
			}
		} catch (error) {
			console.error('Error deleting client:', error);
			toast.error('Failed to delete client');
		} finally {
			setDeleteDialogOpen(false);
			setDeletingId(null);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'new':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
			case 'active':
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			case 'star':
				return 'bg-golden-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
			case 'follow up':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'BDT',
		}).format(amount);
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/dashboard/crm'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='w-5 h-5' />
						</Button>
					</Link>
					<div>
						<h1 className='text-2xl font-bold text-foreground'>All Clients</h1>
						<p className='text-muted-foreground'>
							{pagination.total} total clients
						</p>
					</div>
				</div>
				<Button onClick={() => setDialogOpen(true)} className='gap-2'>
					<Plus className='w-4 h-4' />
					Add Client
				</Button>
			</div>

			{/* Filters */}
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-4'>
					<div className='flex flex-col gap-4 md:flex-row md:items-center'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search by name, phone or email...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='pl-10'
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-40'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Status</SelectItem>
								<SelectItem value='new'>New</SelectItem>
								<SelectItem value='follow up'>Follow Up</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='star'>Star</SelectItem>
							</SelectContent>
						</Select>
						<Select value={'today'} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-40'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='today'>Todays</SelectItem>
								<SelectItem value='this_week'>This week</SelectItem>
								<SelectItem value='this_month'>This Month</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{loading ? (
				<div className='text-center py-12 text-muted-foreground'>
					Loading clients...
				</div>
			) : clients.length === 0 ? (
				<div className='text-center py-12'>
					<p className='text-muted-foreground'>No clients found</p>
				</div>
			) : (
				<>
					<div className='border rounded-lg overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow className='bg-muted'>
									<TableHead>Client</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>
										Service Taken Amount
									</TableHead>
									<TableHead className='text-right'>Service Taken</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{clients.map((client) => (
									<TableRow key={client._id} className='hover:bg-muted/50'>
										<TableCell>
											<div className='flex items-center gap-3'>
												<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
													<span className='text-sm font-semibold text-primary'>
														{client.name.charAt(0).toUpperCase()}
													</span>
												</div>
												<div>
													<p className='font-medium text-foreground'>
														{client.name}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className='text-sm font-mono font-bold'>
													{client.email}
												</p>
												<p className='text-sm text-muted-foreground font-mono font-bold'>
													{client.phone}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={`${getStatusColor(client.status)} font-mono font-bold text-md`}
											>
												{client.status}
											</Badge>
										</TableCell>

										<TableCell className='text-right'>
											{formatCurrency(client.totalSpent)}
										</TableCell>
										<TableCell className='text-right'>
											{client.totalServices}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon'>
														<MoreHorizontal className='w-4 h-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<Link href={`/dashboard/crm/clients/${client._id}`}>
														<DropdownMenuItem>
															<Eye className='w-4 h-4 mr-2' />
															View Details
														</DropdownMenuItem>
													</Link>
													<DropdownMenuItem
														onClick={() => {
															setEditingClient(client);
															setDialogOpen(true);
														}}
													>
														<Edit className='w-4 h-4 mr-2' />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														className='text-destructive'
														onClick={() => {
															setDeletingId(client._id);
															setDeleteDialogOpen(true);
														}}
													>
														<Trash2 className='w-4 h-4 mr-2' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					{/* Pagination */}
					{pagination.pages > 1 && (
						<div className='flex items-center justify-between px-6 py-4 border-t border-border'>
							<p className='text-sm text-muted-foreground'>
								Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
								{Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
								of {pagination.total} clients
							</p>
							<div className='flex items-center gap-2'>
								<Button
									variant='outline'
									size='icon'
									onClick={() =>
										setPagination((prev) => ({
											...prev,
											page: prev.page - 1,
										}))
									}
									disabled={pagination.page === 1}
								>
									<ChevronLeft className='w-4 h-4' />
								</Button>
								<Button
									variant='outline'
									size='icon'
									onClick={() =>
										setPagination((prev) => ({
											...prev,
											page: prev.page + 1,
										}))
									}
									disabled={pagination.page === pagination.pages}
								>
									<ChevronRight className='w-4 h-4' />
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			{/* Client Form Dialog */}
			<ClientFormDialog
				open={dialogOpen}
				onOpenChange={(open) => {
					setDialogOpen(open);
					if (!open) setEditingClient(null);
				}}
				onSuccess={() => {
					fetchClients();
					setDialogOpen(false);
					setEditingClient(null);
				}}
				client={editingClient}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Client</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this client? This will also delete
							all associated transactions and activities. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
