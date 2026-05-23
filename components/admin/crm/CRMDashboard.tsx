'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
	Users,
	DollarSign,
	TrendingUp,
	UserPlus,
	Search,
	Plus,
	Eye,
	Crown,
	Activity,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ClientFormDialog from './ClientFormDialog';

interface Client {
	_id: string;
	name: string;
	email: string;
	phone: string;
	status: 'active' | 'inactive' | 'prospect' | 'vip';
	balance: number;
	totalSpent: number;
	lastActivityDate?: string;
	createdAt: string;
}

interface Stats {
	totalClients: number;
	activeClients: number;
	vipClients: number;
	totalRevenue: number;
	totalBalance: number;
}

export default function CRMDashboard() {
	const [clients, setClients] = useState<Client[]>([]);
	const [stats, setStats] = useState<Stats>({
		totalClients: 0,
		activeClients: 0,
		vipClients: 0,
		totalRevenue: 0,
		totalBalance: 0,
	});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		fetchClients();
	}, [search, statusFilter]);

	const fetchClients = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (search) params.append('search', search);
			if (statusFilter !== 'all') params.append('status', statusFilter);
			params.append('limit', '10');

			const response = await fetch(`/api/crm/clients?${params}`);
			const data = await response.json();

			if (data.success) {
				setClients(data.data);
				setStats(data.stats);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
			toast.error('Failed to fetch clients');
		} finally {
			setLoading(false);
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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>CRM Dashboard</h1>
					<p className='text-muted-foreground mt-1'>
						Manage your clients and track business relationships
					</p>
				</div>
				<Button onClick={() => setDialogOpen(true)} className='gap-2'>
					<Plus className='w-4 h-4' />
					Add Client
				</Button>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card className='border-0 shadow-soft'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									Total Clients
								</p>
								<p className='text-3xl font-bold text-foreground mt-1'>
									{stats.totalClients}
								</p>
							</div>
							<div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
								<Users className='w-6 h-6 text-primary' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									Active Clients
								</p>
								<p className='text-3xl font-bold text-foreground mt-1'>
									{stats.activeClients}
								</p>
							</div>
							<div className='w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
								<Activity className='w-6 h-6 text-green-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									VIP Clients
								</p>
								<p className='text-3xl font-bold text-foreground mt-1'>
									{stats.vipClients}
								</p>
							</div>
							<div className='w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center'>
								<Crown className='w-6 h-6 text-amber-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-muted-foreground'>
									Total Revenue
								</p>
								<p className='text-3xl font-bold text-foreground mt-1'>
									{formatCurrency(stats.totalRevenue)}
								</p>
							</div>
							<div className='w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
								<DollarSign className='w-6 h-6 text-emerald-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-6'>
					<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
						<div className='flex flex-1 gap-4'>
							<div className='relative flex-1 max-w-md'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									placeholder='Search clients...'
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
						<Link href='/admin/crm/clients'>
							<Button variant='outline'>View All Clients</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Recent Clients */}
			<Card className='border-0 shadow-soft'>
				<CardHeader>
					<CardTitle className='text-xl font-bold'>Recent Clients</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='text-center py-8 text-muted-foreground'>
							Loading clients...
						</div>
					) : clients.length === 0 ? (
						<div className='text-center py-8'>
							<Users className='w-12 h-12 mx-auto text-muted-foreground/50 mb-4' />
							<p className='text-muted-foreground'>No clients found</p>
							<Button
								onClick={() => setDialogOpen(true)}
								variant='outline'
								className='mt-4'
							>
								Add Your First Client
							</Button>
						</div>
					) : (
						<div className='space-y-4'>
							{clients.map((client) => (
								<div
									key={client._id}
									className='flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors'
								>
									<div className='flex items-center gap-4'>
										<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
											<span className='text-sm font-semibold text-primary'>
												{client.name.charAt(0).toUpperCase()}
											</span>
										</div>
										<div>
											<p className='font-medium text-foreground'>{client.name}</p>
											<p className='text-sm text-muted-foreground'>{client.email}</p>
										</div>
									</div>
									<div className='flex items-center gap-4'>
										<div className='hidden md:block text-right'>
											<p className='text-sm font-medium text-foreground'>
												{formatCurrency(client.totalSpent)}
											</p>
											<p className='text-xs text-muted-foreground'>Total Spent</p>
										</div>
										<Badge className={getStatusColor(client.status)}>
											{client.status}
										</Badge>
										<Link href={`/admin/crm/clients/${client._id}`}>
											<Button size='sm' variant='ghost'>
												<Eye className='w-4 h-4' />
											</Button>
										</Link>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Client Form Dialog */}
			<ClientFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSuccess={() => {
					fetchClients();
					setDialogOpen(false);
				}}
			/>
		</div>
	);
}
