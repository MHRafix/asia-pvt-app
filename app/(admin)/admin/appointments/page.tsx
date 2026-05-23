'use client';

import { Badge } from '@/components/ui/badge';
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import {
	Calendar,
	Clock,
	Eye,
	Loader,
	Mail,
	Phone,
	Search,
	User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Appointment {
	_id: string;
	fullName: string;
	email: string;
	phone: string;
	service: string;
	preferredDate: string;
	preferredTime: string;
	message?: string;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
	createdAt: string;
}

const statusColors: Record<string, string> = {
	pending:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
	confirmed:
		'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
	completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
	cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
};

export default function AppointmentsAdminPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/appointments');
			const data = await response.json();
			if (data.success) {
				setAppointments(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching appointments:', error);
			toast.error('Failed to fetch appointments');
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (id: string, status: string) => {
		try {
			const response = await fetch(`/api/appointments/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status }),
			});

			const data = await response.json();
			if (data.success) {
				toast.success('Status updated!');
				fetchAppointments();
				if (selectedAppointment?._id === id) {
					setSelectedAppointment({
						...selectedAppointment,
						status: status as Appointment['status'],
					});
				}
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to update status');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this appointment?')) return;
		try {
			const response = await fetch(`/api/appointments/${id}`, {
				method: 'DELETE',
			});
			const data = await response.json();
			if (data.success) {
				toast.success('Appointment deleted!');
				fetchAppointments();
				setDrawerOpen(false);
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to delete appointment');
		}
	};

	const viewAppointment = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setDrawerOpen(true);
	};

	const filteredAppointments = appointments.filter((apt) => {
		const matchesSearch =
			apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			apt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			apt.service.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	const stats = {
		total: appointments.length,
		pending: appointments.filter((a) => a.status === 'pending').length,
		confirmed: appointments.filter((a) => a.status === 'confirmed').length,
		completed: appointments.filter((a) => a.status === 'completed').length,
	};

	return (
		<div>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-foreground'>Appointments</h1>
				<p className='text-muted-foreground mt-1'>
					Manage customer appointments and bookings
				</p>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
				{[
					{ label: 'Total', value: stats.total, color: 'bg-muted' },
					{
						label: 'Pending',
						value: stats.pending,
						color: 'bg-yellow-100 dark:bg-yellow-950/30',
					},
					{
						label: 'Confirmed',
						value: stats.confirmed,
						color: 'bg-green-100 dark:bg-green-950/30',
					},
					{
						label: 'Completed',
						value: stats.completed,
						color: 'bg-blue-100 dark:bg-blue-950/30',
					},
				].map((stat) => (
					<Card key={stat.label} className='border-0 shadow-soft p-0'>
						<CardContent className={`p-4 ${stat.color} rounded-xl`}>
							<p className='text-2xl font-bold text-foreground'>{stat.value}</p>
							<p className='text-sm text-muted-foreground'>{stat.label}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Filters */}
			<div className='flex flex-col sm:flex-row gap-4 mb-6'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						placeholder='Search appointments...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10'
					/>
				</div>
				<Select value={filterStatus} onValueChange={setFilterStatus}>
					<SelectTrigger className='w-full sm:w-48'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Status</SelectItem>
						<SelectItem value='pending'>Pending</SelectItem>
						<SelectItem value='confirmed'>Confirmed</SelectItem>
						<SelectItem value='completed'>Completed</SelectItem>
						<SelectItem value='cancelled'>Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Appointments List */}
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : filteredAppointments.length === 0 ? (
				<Card className='border-0 shadow-soft'>
					<CardContent className='py-12 text-center'>
						<Calendar className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground'>
							{searchQuery || filterStatus !== 'all'
								? 'No appointments match your filters'
								: 'No appointments yet'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4'>
					{filteredAppointments.map((apt) => (
						<Card
							key={apt._id}
							className='border-0 shadow-soft hover:shadow-md transition-shadow'
						>
							<CardContent className='p-5'>
								<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
									<div className='flex items-start gap-4'>
										<div className='w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/30 flex items-center justify-center shrink-0'>
											<User className='w-6 h-6 text-cyan-500' />
										</div>
										<div>
											<h3 className='font-semibold text-foreground'>
												{apt.fullName}
											</h3>
											<p className='text-sm text-muted-foreground'>
												{apt.service}
											</p>
											<div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground'>
												<span className='flex items-center gap-1'>
													<Calendar className='w-3.5 h-3.5' />
													{format(new Date(apt.preferredDate), 'MMM d, yyyy')}
												</span>
												<span className='flex items-center gap-1'>
													<Clock className='w-3.5 h-3.5' />
													{apt.preferredTime}
												</span>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-3'>
										<Select
											value={apt.status}
											onValueChange={(value) =>
												handleStatusChange(apt._id, value)
											}
										>
											<SelectTrigger className='w-32'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='pending'>Pending</SelectItem>
												<SelectItem value='confirmed'>Confirmed</SelectItem>
												<SelectItem value='completed'>Completed</SelectItem>
												<SelectItem value='cancelled'>Cancelled</SelectItem>
											</SelectContent>
										</Select>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => viewAppointment(apt)}
										>
											<Eye className='w-4 h-4' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Details Drawer */}
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent className='w-full sm:max-w-md'>
					<SheetHeader>
						<SheetTitle>Appointment Details</SheetTitle>
						<SheetDescription>
							View and manage appointment information
						</SheetDescription>
					</SheetHeader>

					{selectedAppointment && (
						<div className='space-y-6 py-6'>
							<div className='flex items-center gap-4'>
								<div className='w-16 h-16 rounded-xl bg-cyan-100 dark:bg-cyan-950/30 flex items-center justify-center'>
									<User className='w-8 h-8 text-cyan-500' />
								</div>
								<div>
									<h3 className='font-semibold text-lg text-foreground'>
										{selectedAppointment.fullName}
									</h3>
									<Badge
										className={`${statusColors[selectedAppointment.status]} border-0`}
									>
										{selectedAppointment.status}
									</Badge>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
									<Mail className='w-5 h-5 text-muted-foreground' />
									<div>
										<p className='text-xs text-muted-foreground'>Email</p>
										<p className='font-medium text-foreground'>
											{selectedAppointment.email}
										</p>
									</div>
								</div>

								<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
									<Phone className='w-5 h-5 text-muted-foreground' />
									<div>
										<p className='text-xs text-muted-foreground'>Phone</p>
										<p className='font-medium text-foreground'>
											{selectedAppointment.phone}
										</p>
									</div>
								</div>

								<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
									<Calendar className='w-5 h-5 text-muted-foreground' />
									<div>
										<p className='text-xs text-muted-foreground'>Service</p>
										<p className='font-medium text-foreground'>
											{selectedAppointment.service}
										</p>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-3'>
									<div className='p-3 rounded-lg bg-muted/50'>
										<p className='text-xs text-muted-foreground'>Date</p>
										<p className='font-medium text-foreground'>
											{format(
												new Date(selectedAppointment.preferredDate),
												'MMM d, yyyy',
											)}
										</p>
									</div>
									<div className='p-3 rounded-lg bg-muted/50'>
										<p className='text-xs text-muted-foreground'>Time</p>
										<p className='font-medium text-foreground'>
											{selectedAppointment.preferredTime}
										</p>
									</div>
								</div>

								{selectedAppointment.message && (
									<div className='p-3 rounded-lg bg-muted/50'>
										<p className='text-xs text-muted-foreground mb-1'>
											Message
										</p>
										<p className='text-sm text-foreground'>
											{selectedAppointment.message}
										</p>
									</div>
								)}

								<div className='p-3 rounded-lg bg-muted/50'>
									<p className='text-xs text-muted-foreground'>Update Status</p>
									<Select
										value={selectedAppointment.status}
										onValueChange={(value) =>
											handleStatusChange(selectedAppointment._id, value)
										}
									>
										<SelectTrigger className='mt-2'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='pending'>Pending</SelectItem>
											<SelectItem value='confirmed'>Confirmed</SelectItem>
											<SelectItem value='completed'>Completed</SelectItem>
											<SelectItem value='cancelled'>Cancelled</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					)}

					<SheetFooter className='border-t border-border pt-4'>
						<Button variant='outline' onClick={() => setDrawerOpen(false)}>
							Close
						</Button>
						{selectedAppointment && (
							<Button
								variant='destructive'
								onClick={() => handleDelete(selectedAppointment._id)}
							>
								Delete
							</Button>
						)}
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
