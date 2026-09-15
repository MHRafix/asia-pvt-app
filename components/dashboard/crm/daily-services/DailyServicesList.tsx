'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Service } from '@/lib/types';
import { Tabs } from '@radix-ui/react-tabs';
import { Loader, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DailyServiceFormDialog from './DailyServiceFormDialog';
import DailyServicesTable from './DailyServicesTable';

export interface DailyService {
	_id: string;
	serviceId: string;
	serviceTitle: string;
	serviceCost: number;
	serviceStatus: any;
	linkedClientId?: {
		_id: string;
		name: string;
		phone: string;
		email: string;
	};

	assignedEmployeeId: {
		_id: string;
		name: string;
		phone: string;
	};
	createdBy?: {
		_id: string;
		name: string;
	};
	passportNo: string;
	serviceRefId: {
		_id: string;
		name: string;
	};
	serviceDescription?: string;
	createdDate: string;
}

interface Client {
	_id: string;
	name: string;
}

interface Employee {
	_id: string;
	name: string;
}

export default function DailyServicesList() {
	const [services, setServices] = useState<DailyService[]>([]);
	const [asiaServices, setAsiaServices] = useState<Service[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [clientPhone, setClientPhone] = useState('');
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<
		DailyService | null | undefined
	>(null);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');
	const [filter, setFilter] = useState('today');

	const fetchServices = async () => {
		setIsLoading(true);
		try {
			const query = new URLSearchParams({
				...(search && { search }),
				...(clientPhone && { clientPhone }),
				...(status !== 'all' && { status }),
				limit: '100',
			});

			const response = await fetch(`/api/crm/daily-services?${query}`);
			const result = await response.json();

			if (result.success) {
				setServices(result.data);
			} else {
				toast.error(result.error || 'Failed to fetch services');
			}
		} catch (error) {
			console.error('Error fetching services:', error);
			toast.error('Failed to fetch services');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchClients = async () => {
		try {
			const response = await fetch('/api/crm/clients?limit=1000');
			const result = await response.json();

			if (result.success) {
				setClients(result.data);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	const fetchEmployees = async () => {
		try {
			const response = await fetch('/api/employees');
			const result = await response.json();

			if (result.success) {
				setEmployees(result.data);
			}
		} catch (error) {
			console.error('Error fetching employees:', error);
		}
	};

	const fetchAsiaServices = async () => {
		try {
			const response = await fetch('/api/services');
			const data = await response.json();
			if (data.success) {
				setAsiaServices(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching services:', error);
			toast.error('Failed to fetch services');
		} finally {
		}
	};

	useEffect(() => {
		fetchServices();
		fetchAsiaServices();
		fetchClients();
		fetchEmployees();
	}, [search, status, clientPhone]);

	const handleEdit = (service: DailyService) => {
		setSelectedService(service);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setSelectedService(null);
	};

	const handleSuccess = () => {
		fetchServices();
		handleFormClose();
	};

	const [date, setDate] = useState<Date>();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold'>Daily Services</h1>
					<p className='text-muted-foreground mt-2'>
						Manage all daily services
					</p>
				</div>
				<Button onClick={() => setIsFormOpen(true)}>
					<Plus className='w-4 h-4 mr-2' />
					New Service
				</Button>
			</div>

			<div className='w-full grid lg:grid-cols-2 gap-5'>
				<div className='grid lg:flex items-center lg:justify-between gap-2'>
					<Input
						placeholder='Search by service ID or title...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='flex-1'
						type='search'
					/>
					<Input
						placeholder='Search by client phone...'
						value={clientPhone}
						onChange={(e) => setClientPhone(e.target.value)}
						className='flex-1'
						type='search'
					/>
				</div>
				<div className='grid lg:flex items-center lg:justify-end gap-2'>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className='w-full lg:w-50'>
							<SelectValue placeholder='Filter by status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value='pending'>Pending</SelectItem>
							<SelectItem value='in_progress'>In Progress</SelectItem>
							<SelectItem value='completed'>Completed</SelectItem>
							<SelectItem value='on_hold'>On Hold</SelectItem>
							<SelectItem value='cancelled'>Cancelled</SelectItem>
						</SelectContent>
					</Select>
					<Popover>
						<PopoverTrigger className='bg-primary/20 p-3 rounded-md w-full lg:w-64 flex items-center gap-2 hover:bg-primary/25 duration-300 font-mono font-bold'>
							<CalendarIcon className='w-5 h-5' />
							{date ? format(date, 'PPP') : <span>Pick a date</span>}
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<Calendar mode='single' selected={date} onSelect={setDate} />
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-muted-foreground' />
				</div>
			) : (
				<div className='space-y-8'>
					<Tabs defaultValue='todays' className='space-y-6'>
						<TabsList className='bg-primary/20 flex items-center gap-5'>
							<TabsTrigger value='todays'>Today's Services</TabsTrigger>
							<TabsTrigger value='weekly'>This Week Services</TabsTrigger>
							<TabsTrigger value='monthly'>This Month Services</TabsTrigger>
						</TabsList>

						<TabsContent value='todays' className='space-y-6'>
							<DailyServicesTable
								services={services}
								onEdit={handleEdit}
								onRefresh={fetchServices}
							/>
						</TabsContent>

						<TabsContent value='weekly' className='space-y-6'>
							<DailyServicesTable
								services={services}
								onEdit={handleEdit}
								onRefresh={fetchServices}
							/>
						</TabsContent>

						<TabsContent value='monthly' className='space-y-6'>
							<DailyServicesTable
								services={services}
								onEdit={handleEdit}
								onRefresh={fetchServices}
							/>
						</TabsContent>
					</Tabs>
				</div>
			)}

			<DailyServiceFormDialog
				open={isFormOpen}
				onOpenChange={handleFormClose}
				onSuccess={handleSuccess}
				clients={clients}
				employees={employees}
				// @ts-ignore
				service={selectedService}
				asiaServices={asiaServices}
			/>
		</div>
	);
}
