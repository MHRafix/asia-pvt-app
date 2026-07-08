'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import DailyServiceFormDialog from './DailyServiceFormDialog';
import DailyServicesTable from './DailyServicesTable';

interface DailyService {
	_id: string;
	serviceId: string;
	serviceTitle: string;
	serviceCost: number;
	serviceStatus: string;
	linkedClientId?: {
		_id: string;
		name: string;
	};
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
	const [clients, setClients] = useState<Client[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<DailyService | null>(null);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');

	const fetchServices = async () => {
		setIsLoading(true);
		try {
			const query = new URLSearchParams({
				...(search && { search }),
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
			const response = await fetch('/api/employees?limit=1000');
			const result = await response.json();

			if (result.success) {
				setEmployees(result.data);
			}
		} catch (error) {
			console.error('Error fetching employees:', error);
		}
	};

	useEffect(() => {
		fetchServices();
		fetchClients();
		fetchEmployees();
	}, [search, status]);

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

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold'>Daily Services</h1>
					<p className='text-muted-foreground mt-2'>Manage all daily services</p>
				</div>
				<Button onClick={() => setIsFormOpen(true)}>
					<Plus className='w-4 h-4 mr-2' />
					New Service
				</Button>
			</div>

			<div className='flex gap-4'>
				<Input
					placeholder='Search services by ID or title...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='flex-1'
				/>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className='w-40'>
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
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-muted-foreground' />
				</div>
			) : (
				<DailyServicesTable
					services={services}
					onEdit={handleEdit}
					onRefresh={fetchServices}
				/>
			)}

			<DailyServiceFormDialog
				open={isFormOpen}
				onOpenChange={handleFormClose}
				onSuccess={handleSuccess}
				clients={clients}
				employees={employees}
				service={selectedService}
			/>
		</div>
	);
}
