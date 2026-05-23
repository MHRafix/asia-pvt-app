'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
	Search,
	Plus,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
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
	const [editingClient, setEditingClient] = useState<Client | null>(null);
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
			case 'active':
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			case 'vip':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
			case 'inactive':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
			case 'prospect':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/crm'>
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
								placeholder='Search by name, email, or company...'
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
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='prospect'>Prospect</SelectItem>
								<SelectItem value='vip'>VIP</SelectItem>
								<SelectItem value='inactive'>Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-0'>
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
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Client</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Balance</TableHead>
										<TableHead className='text-right'>Total Spent</TableHead>
										<TableHead className='text-right'>Services</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{clients.map((client) => (
										<TableRow key={client._id}>
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
														{client.company && (
															<p className='text-sm text-muted-foreground'>
																{client.company}
															</p>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className='text-sm'>{client.email}</p>
													<p className='text-sm text-muted-foreground'>
														{client.phone}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge className={getStatusColor(client.status)}>
													{client.status}
												</Badge>
											</TableCell>
											<TableCell className='text-right'>
												<span
													className={
														client.balance > 0
															? 'text-amber-600'
															: 'text-green-600'
													}
												>
													{formatCurrency(client.balance)}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												{formatCurrency(client.totalSpent)}
											</TableCell>
											<TableCell className='text-right'>
												{client.totalServices + client.totalPackages}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<MoreHorizontal className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<Link href={`/admin/crm/clients/${client._id}`}>
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

							{/* Pagination */}
							{pagination.pages > 1 && (
								<div className='flex items-center justify-between px-6 py-4 border-t border-border'>
									<p className='text-sm text-muted-foreground'>
										Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
										{Math.min(
											pagination.page * pagination.limit,
											pagination.total
										)}{' '}
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
				</CardContent>
			</Card>

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
