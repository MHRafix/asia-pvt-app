'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	formatCurrency,
	formatDate,
	getStatusColor,
	getStatusLabel,
} from '@/lib/utils/formatting';
import { Loader, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from './common/visa/EmptyState';

interface ServiceData {
	service: {
		_id: string;
		serviceId: string;
		serviceTitle: string;
		serviceDescription?: string;
		serviceCost: number;
		serviceStatus: string;
		linkedClientId?: {
			_id: string;
			name: string;
			email: string;
			phone: string;
			company?: string;
		};
		assignedEmployeeId?: {
			_id: string;
			name: string;
			phone: string;
		};
		createdDate: string;
		completedDate?: string;
		notes?: string;
	};
	activities: Array<{
		_id: string;
		type: string;
		title: string;
		description?: string;
		createdAt: string;
		metadata?: Record<string, any>;
	}>;
}

export default function ServiceTracking() {
	const searchParams = useSearchParams();

	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<ServiceData | null>(null);
	const [serviceId, setServiceId] = useState(
		searchParams.get('serviceId') || '',
	);

	useEffect(() => {
		if (serviceId) {
			fetchService();
		}
	}, []);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!serviceId) {
			toast.error('Please enter a service ID');
			return;
		}

		setIsLoading(true);

		fetchService();
	};

	const fetchService = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/crm/service-tracking?serviceId=${serviceId}`,
			);
			const data = await response.json();

			if (data.success) {
				setIsLoading(false);
				setResult(data.data);
			} else {
				setIsLoading(false);
				setResult(null);
				toast.error(data.error || 'Service not found');
			}
		} catch (error) {
			setIsLoading(false);
			setResult(null);
			toast.error('Failed to search service');
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='space-y-8'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold'>Service Tracking</h1>
				<p className='text-muted-foreground mt-3 text-lg'>
					Track your service by entering the service ID
				</p>
			</div>

			<div className='max-w-4xl mx-auto'>
				<form onSubmit={handleSearch} className='flex gap-2'>
					<Input
						placeholder='Enter service ID: 3MGUY'
						value={serviceId}
						onChange={(e) => setServiceId(e.target.value.toUpperCase())}
						className='flex-1 text-lg'
						disabled={isLoading}
						required
					/>
					<button
						type='submit'
						disabled={isLoading}
						className='cursor-pointer flex gap-2 items-center bg-primary text-white rounded-md p-3'
					>
						{isLoading ? (
							<>
								<Loader className='w-4 h-4 animate-spin' />
							</>
						) : (
							<>
								<Search className='w-4 h-4' />
								Search
							</>
						)}
					</button>
				</form>
				<br /> <br />
				{isLoading ? (
					<Loader className='w-8 h-8 text-primary mt-20 animate-spin mx-auto' />
				) : (
					<>
						{result && (
							<div className='max-w-4xl mx-auto space-y-6'>
								{/* Service Card */}
								<Card className='p-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<div>
											<p className='text-sm text-muted-foreground mb-1'>
												Service ID
											</p>
											<p className='text-2xl font-mono font-bold'>
												{result.service.serviceId}
											</p>
										</div>
										<div>
											<p className='text-sm text-muted-foreground mb-2'>
												Service Title
											</p>
											<p className='text-xl font-semibold'>
												{result.service.serviceTitle}
											</p>
										</div>
										<div>
											<p className='text-sm text-muted-foreground mb-1'>
												Amount
											</p>
											<p className='text-xl font-bold'>
												{formatCurrency(result.service.serviceCost)}
											</p>
										</div>{' '}
										<div>
											<p className='text-sm text-muted-foreground mb-1'>
												Status
											</p>
											<Badge
												className={`text-base py-1 px-3 ${getStatusColor(result.service.serviceStatus as any)}`}
											>
												{getStatusLabel(result.service.serviceStatus as any)}
											</Badge>
										</div>
										{result.service.completedDate && (
											<div>
												<p className='text-sm text-muted-foreground mb-1'>
													Completed Date
												</p>
												<p className='text-sm'>
													{formatDate(new Date(result.service.completedDate))}
												</p>
											</div>
										)}
									</div>
								</Card>

								{/* Client Information */}
								{result.service.linkedClientId && (
									<Card className='p-6'>
										<h3 className='text-lg font-semibold'>
											Client Information
										</h3>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<p className='text-sm text-muted-foreground mb-1'>
													Name
												</p>
												<p className='font-semibold'>
													{result.service.linkedClientId.name}
												</p>
											</div>
											<div>
												<p className='text-sm text-muted-foreground mb-1'>
													Email
												</p>
												<p className='text-sm'>
													{result.service.linkedClientId.email}
												</p>
											</div>
											<div>
												<p className='text-sm text-muted-foreground mb-1'>
													Phone
												</p>
												<p className='text-sm'>
													{result.service.linkedClientId.phone}
												</p>
											</div>
										</div>
									</Card>
								)}

								{/* Assigned Employee */}
								{result.service.assignedEmployeeId && (
									<Card className='p-6'>
										<h3 className='text-lg font-semibold'>Assigned To</h3>
										<div className='flex items-center gap-4'>
											<div>
												<p className='font-semibold'>
													{result.service.assignedEmployeeId.name}
												</p>
												<p className='text-sm text-muted-foreground'>
													{result.service.assignedEmployeeId.phone}
												</p>
											</div>
										</div>
									</Card>
								)}
							</div>
						)}
					</>
				)}
				{!isLoading && !result?.service?._id && (
					<EmptyState
						title='No service found'
						desc='Please check your service id'
					/>
				)}
			</div>
		</div>
	);
}
