'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	formatCurrency,
	formatDate,
	getStatusColor,
	getStatusLabel,
} from '@/lib/utils/formatting';
import { AlertCircle, Loader, Search } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
	const [serviceId, setServiceId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<ServiceData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!serviceId.trim()) {
			toast.error('Please enter a service ID');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/crm/service-tracking/${serviceId}`);
			const data = await response.json();

			if (data.success) {
				setResult(data.data);
			} else {
				setError(data.error || 'Service not found');
				setResult(null);
				toast.error(data.error || 'Service not found');
			}
		} catch (error) {
			console.error('Error searching service:', error);
			setError('Failed to search service');
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

			<div className='max-w-2xl mx-auto'>
				<form onSubmit={handleSearch} className='flex gap-2'>
					<Input
						placeholder='Enter service ID (e.g., AB123)'
						value={serviceId}
						onChange={(e) => setServiceId(e.target.value.toUpperCase())}
						className='flex-1 text-lg'
						disabled={isLoading}
						// maxLength={5}
					/>
					<Button type='submit' disabled={isLoading} className='gap-2'>
						{isLoading ? (
							<>
								<Loader className='w-4 h-4 animate-spin' />
								Searching...
							</>
						) : (
							<>
								<Search className='w-4 h-4' />
								Search
							</>
						)}
					</Button>
				</form>
			</div>

			{error && (
				<Card className='border-red-200 bg-red-50 p-6 max-w-2xl mx-auto'>
					<div className='flex items-start gap-3'>
						<AlertCircle className='w-5 h-5 text-red-600 mt-0.5' />
						<p className='text-red-800'>{error}</p>
					</div>
				</Card>
			)}

			{result && (
				<div className='max-w-4xl mx-auto space-y-6'>
					{/* Service Card */}
					<Card className='p-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<p className='text-sm text-muted-foreground mb-1'>Service ID</p>
								<p className='text-2xl font-mono font-bold'>
									{result.service.serviceId}
								</p>
							</div>

							<div>
								<p className='text-sm text-muted-foreground mb-1'>Status</p>
								<Badge
									className={`text-base py-1 px-3 ${getStatusColor(result.service.serviceStatus as any)}`}
								>
									{getStatusLabel(result.service.serviceStatus as any)}
								</Badge>
							</div>

							<div className='md:col-span-2'>
								<p className='text-sm text-muted-foreground mb-2'>
									Service Title
								</p>
								<p className='text-xl font-semibold'>
									{result.service.serviceTitle}
								</p>
								{result.service.serviceDescription && (
									<p className='text-muted-foreground mt-2'>
										{result.service.serviceDescription}
									</p>
								)}
							</div>

							<div>
								<p className='text-sm text-muted-foreground mb-1'>Cost</p>
								<p className='text-xl font-bold'>
									{formatCurrency(result.service.serviceCost)}
								</p>
							</div>

							<div>
								<p className='text-sm text-muted-foreground mb-1'>
									Created Date
								</p>
								<p className='text-sm'>
									{formatDate(new Date(result.service.createdDate))}
								</p>
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
							<h3 className='text-lg font-semibold mb-4'>Client Information</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground mb-1'>Name</p>
									<p className='font-semibold'>
										{result.service.linkedClientId.name}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground mb-1'>Email</p>
									<p className='text-sm'>
										{result.service.linkedClientId.email}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground mb-1'>Phone</p>
									<p className='text-sm'>
										{result.service.linkedClientId.phone}
									</p>
								</div>
								{result.service.linkedClientId.company && (
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Company
										</p>
										<p className='text-sm'>
											{result.service.linkedClientId.company}
										</p>
									</div>
								)}
							</div>
						</Card>
					)}

					{/* Assigned Employee */}
					{result.service.assignedEmployeeId && (
						<Card className='p-6'>
							<h3 className='text-lg font-semibold mb-4'>Assigned To</h3>
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

					{/* Activity Timeline */}
					{result.activities.length > 0 && (
						<Card className='p-6'>
							<h3 className='text-lg font-semibold mb-4'>Activity Timeline</h3>
							<div className='space-y-4'>
								{result.activities.map((activity) => (
									<div
										key={activity._id}
										className='border-l-2 border-muted pl-4'
									>
										<div className='flex items-start justify-between gap-4'>
											<div className='flex-1'>
												<p className='font-semibold'>{activity.title}</p>
												{activity.description && (
													<p className='text-sm text-muted-foreground mt-1'>
														{activity.description}
													</p>
												)}
											</div>
											<p className='text-xs text-muted-foreground whitespace-nowrap'>
												{formatDate(new Date(activity.createdAt))}
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					)}

					{result.activities.length === 0 && (
						<Card className='p-6 text-center text-muted-foreground'>
							No activity history available
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
