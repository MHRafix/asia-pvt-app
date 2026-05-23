'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ArrowLeft,
	Edit,
	Mail,
	Phone,
	MapPin,
	Building,
	Calendar,
	DollarSign,
	Package,
	Wrench,
	Plus,
	FileText,
	Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ClientFormDialog from './ClientFormDialog';
import TransactionFormDialog from './TransactionFormDialog';
import ActivityFormDialog from './ActivityFormDialog';

interface Client {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address?: string;
	company?: string;
	notes?: string;
	status: 'active' | 'inactive' | 'prospect' | 'vip';
	source?: string;
	tags: string[];
	balance: number;
	totalSpent: number;
	totalServices: number;
	totalPackages: number;
	lastActivityDate?: string;
	createdAt: string;
}

interface Transaction {
	_id: string;
	type: 'service' | 'package' | 'payment' | 'refund' | 'adjustment';
	serviceName?: string;
	packageName?: string;
	description: string;
	amount: number;
	status: 'pending' | 'completed' | 'cancelled';
	createdAt: string;
}

interface ActivityItem {
	_id: string;
	type: string;
	title: string;
	description?: string;
	createdAt: string;
}

interface ClientDetailProps {
	clientId: string;
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
	const router = useRouter();
	const [client, setClient] = useState<Client | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
	const [activityDialogOpen, setActivityDialogOpen] = useState(false);

	useEffect(() => {
		fetchClientData();
	}, [clientId]);

	const fetchClientData = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/crm/clients/${clientId}`);
			const data = await response.json();

			if (data.success) {
				setClient(data.data.client);
				setTransactions(data.data.transactions);
				setActivities(data.data.activities);
			} else {
				toast.error('Client not found');
				router.push('/admin/crm');
			}
		} catch (error) {
			console.error('Error fetching client:', error);
			toast.error('Failed to fetch client');
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

	const getTransactionColor = (type: string) => {
		switch (type) {
			case 'service':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
			case 'package':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
			case 'payment':
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			case 'refund':
				return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
			case 'adjustment':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className='text-center py-12 text-muted-foreground'>
				Loading client...
			</div>
		);
	}

	if (!client) {
		return null;
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
				<div className='flex items-start gap-4'>
					<Link href='/admin/crm/clients'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='w-5 h-5' />
						</Button>
					</Link>
					<div className='flex items-center gap-4'>
						<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
							<span className='text-2xl font-bold text-primary'>
								{client.name.charAt(0).toUpperCase()}
							</span>
						</div>
						<div>
							<div className='flex items-center gap-3'>
								<h1 className='text-2xl font-bold text-foreground'>
									{client.name}
								</h1>
								<Badge className={getStatusColor(client.status)}>
									{client.status}
								</Badge>
							</div>
							{client.company && (
								<p className='text-muted-foreground'>{client.company}</p>
							)}
						</div>
					</div>
				</div>
				<Button onClick={() => setEditDialogOpen(true)} className='gap-2'>
					<Edit className='w-4 h-4' />
					Edit Client
				</Button>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-4'>
				<Card className='border-0 shadow-soft'>
					<CardContent className='p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center'>
								<DollarSign className='w-5 h-5 text-amber-600' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Balance Due</p>
								<p className='text-lg font-bold text-foreground'>
									{formatCurrency(client.balance)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
								<DollarSign className='w-5 h-5 text-green-600' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Total Spent</p>
								<p className='text-lg font-bold text-foreground'>
									{formatCurrency(client.totalSpent)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
								<Wrench className='w-5 h-5 text-blue-600' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Services</p>
								<p className='text-lg font-bold text-foreground'>
									{client.totalServices}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='border-0 shadow-soft'>
					<CardContent className='p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center'>
								<Package className='w-5 h-5 text-purple-600' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>Packages</p>
								<p className='text-lg font-bold text-foreground'>
									{client.totalPackages}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs defaultValue='overview' className='space-y-6'>
				<TabsList>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='transactions'>Transactions</TabsTrigger>
					<TabsTrigger value='activity'>Activity</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='space-y-6'>
					<div className='grid gap-6 md:grid-cols-2'>
						{/* Contact Info */}
						<Card className='border-0 shadow-soft'>
							<CardHeader>
								<CardTitle className='text-lg'>Contact Information</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center gap-3'>
									<Mail className='w-5 h-5 text-muted-foreground' />
									<span>{client.email}</span>
								</div>
								<div className='flex items-center gap-3'>
									<Phone className='w-5 h-5 text-muted-foreground' />
									<span>{client.phone}</span>
								</div>
								{client.address && (
									<div className='flex items-center gap-3'>
										<MapPin className='w-5 h-5 text-muted-foreground' />
										<span>{client.address}</span>
									</div>
								)}
								{client.company && (
									<div className='flex items-center gap-3'>
										<Building className='w-5 h-5 text-muted-foreground' />
										<span>{client.company}</span>
									</div>
								)}
								<div className='flex items-center gap-3'>
									<Calendar className='w-5 h-5 text-muted-foreground' />
									<span>Client since {formatDate(client.createdAt)}</span>
								</div>
							</CardContent>
						</Card>

						{/* Notes */}
						<Card className='border-0 shadow-soft'>
							<CardHeader>
								<CardTitle className='text-lg'>Notes</CardTitle>
							</CardHeader>
							<CardContent>
								{client.notes ? (
									<p className='text-muted-foreground whitespace-pre-wrap'>
										{client.notes}
									</p>
								) : (
									<p className='text-muted-foreground italic'>No notes added</p>
								)}
								{client.source && (
									<div className='mt-4 pt-4 border-t border-border'>
										<p className='text-sm text-muted-foreground'>
											<span className='font-medium'>Source:</span> {client.source}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Recent Transactions */}
					<Card className='border-0 shadow-soft'>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle className='text-lg'>Recent Transactions</CardTitle>
							<Button
								size='sm'
								onClick={() => setTransactionDialogOpen(true)}
								className='gap-2'
							>
								<Plus className='w-4 h-4' />
								Add Transaction
							</Button>
						</CardHeader>
						<CardContent>
							{transactions.length === 0 ? (
								<p className='text-muted-foreground text-center py-8'>
									No transactions yet
								</p>
							) : (
								<div className='space-y-3'>
									{transactions.slice(0, 5).map((transaction) => (
										<div
											key={transaction._id}
											className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
										>
											<div className='flex items-center gap-3'>
												<Badge className={getTransactionColor(transaction.type)}>
													{transaction.type}
												</Badge>
												<div>
													<p className='font-medium'>{transaction.description}</p>
													<p className='text-sm text-muted-foreground'>
														{formatDate(transaction.createdAt)}
													</p>
												</div>
											</div>
											<div className='text-right'>
												<p
													className={`font-semibold ${
														transaction.type === 'payment'
															? 'text-green-600'
															: transaction.type === 'refund'
															? 'text-red-600'
															: 'text-foreground'
													}`}
												>
													{transaction.type === 'payment' ? '-' : '+'}
													{formatCurrency(Math.abs(transaction.amount))}
												</p>
												<Badge
													variant='outline'
													className={
														transaction.status === 'completed'
															? 'border-green-500 text-green-600'
															: transaction.status === 'cancelled'
															? 'border-red-500 text-red-600'
															: 'border-amber-500 text-amber-600'
													}
												>
													{transaction.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='transactions' className='space-y-6'>
					<Card className='border-0 shadow-soft'>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle className='text-lg'>All Transactions</CardTitle>
							<Button
								size='sm'
								onClick={() => setTransactionDialogOpen(true)}
								className='gap-2'
							>
								<Plus className='w-4 h-4' />
								Add Transaction
							</Button>
						</CardHeader>
						<CardContent>
							{transactions.length === 0 ? (
								<p className='text-muted-foreground text-center py-8'>
									No transactions yet
								</p>
							) : (
								<div className='space-y-3'>
									{transactions.map((transaction) => (
										<div
											key={transaction._id}
											className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
										>
											<div className='flex items-center gap-3'>
												<Badge className={getTransactionColor(transaction.type)}>
													{transaction.type}
												</Badge>
												<div>
													<p className='font-medium'>{transaction.description}</p>
													<p className='text-sm text-muted-foreground'>
														{formatDate(transaction.createdAt)}
													</p>
												</div>
											</div>
											<div className='text-right'>
												<p
													className={`font-semibold ${
														transaction.type === 'payment'
															? 'text-green-600'
															: transaction.type === 'refund'
															? 'text-red-600'
															: 'text-foreground'
													}`}
												>
													{transaction.type === 'payment' ? '-' : '+'}
													{formatCurrency(Math.abs(transaction.amount))}
												</p>
												<Badge
													variant='outline'
													className={
														transaction.status === 'completed'
															? 'border-green-500 text-green-600'
															: transaction.status === 'cancelled'
															? 'border-red-500 text-red-600'
															: 'border-amber-500 text-amber-600'
													}
												>
													{transaction.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='activity' className='space-y-6'>
					<Card className='border-0 shadow-soft'>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle className='text-lg'>Activity History</CardTitle>
							<Button
								size='sm'
								onClick={() => setActivityDialogOpen(true)}
								className='gap-2'
							>
								<Plus className='w-4 h-4' />
								Add Activity
							</Button>
						</CardHeader>
						<CardContent>
							{activities.length === 0 ? (
								<p className='text-muted-foreground text-center py-8'>
									No activity recorded
								</p>
							) : (
								<div className='space-y-4'>
									{activities.map((activity) => (
										<div
											key={activity._id}
											className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'
										>
											<div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5'>
												<Activity className='w-4 h-4 text-primary' />
											</div>
											<div className='flex-1'>
												<div className='flex items-center gap-2'>
													<p className='font-medium'>{activity.title}</p>
													<Badge variant='outline' className='text-xs'>
														{activity.type}
													</Badge>
												</div>
												{activity.description && (
													<p className='text-sm text-muted-foreground mt-1'>
														{activity.description}
													</p>
												)}
												<p className='text-xs text-muted-foreground mt-2'>
													{formatDate(activity.createdAt)}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Dialogs */}
			<ClientFormDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onSuccess={() => {
					fetchClientData();
					setEditDialogOpen(false);
				}}
				client={client}
			/>

			<TransactionFormDialog
				open={transactionDialogOpen}
				onOpenChange={setTransactionDialogOpen}
				onSuccess={() => {
					fetchClientData();
					setTransactionDialogOpen(false);
				}}
				clientId={clientId}
			/>

			<ActivityFormDialog
				open={activityDialogOpen}
				onOpenChange={setActivityDialogOpen}
				onSuccess={() => {
					fetchClientData();
					setActivityDialogOpen(false);
				}}
				clientId={clientId}
			/>
		</div>
	);
}
