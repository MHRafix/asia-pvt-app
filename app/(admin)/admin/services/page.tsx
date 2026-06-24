'use client';

import ServiceForm from '@/components/admin/service/ServiceForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Service } from '@/lib/types';
import { Edit2, Loader, Plus, Search, Trash2, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ServicesAdminPage() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [service, setService] = useState<Service | null>(null);

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/services');
			const data = await response.json();
			if (data.success) {
				setServices(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching services:', error);
			toast.error('Failed to fetch services');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this service?')) return;
		try {
			const response = await fetch(`/api/services/single/${id}`, {
				method: 'DELETE',
			});
			const data = await response.json();
			if (data.success) {
				toast.success('Service deleted!');
				fetchServices();
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to delete service');
		}
	};

	const handleEdit = (service: Service) => {
		setService(service);

		setDrawerOpen(true);
	};

	const filteredServices = services.filter(
		(service) =>
			service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Services</h1>
					<p className='text-muted-foreground mt-1'>
						Manage your travel services
					</p>
				</div>
				<Button
					onClick={() => {
						setDrawerOpen(true);
						setService(null);
					}}
					className='gap-2'
				>
					<Plus className='w-4 h-4' />
					Add Service
				</Button>
			</div>

			{/* Search */}
			<div className='relative mb-6'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
				<Input
					placeholder='Search services...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			{/* Services List */}
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : filteredServices.length === 0 ? (
				<Card className='border-0 shadow-soft'>
					<CardContent className='py-12 text-center'>
						<Wrench className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground'>
							{searchQuery
								? 'No services match your search'
								: 'No services yet'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4'>
					{filteredServices.map((service) => (
						<Card
							key={service._id}
							className='border-0 shadow-soft hover:shadow-md transition-shadow'
						>
							<CardContent className='p-5'>
								<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
									<div className='flex items-start gap-4'>
										<div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0'>
											<Wrench className='w-6 h-6 text-blue-500' />
										</div>
										<div>
											<h3 className='font-semibold text-foreground text-lg'>
												{service.title}
											</h3>
											<p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
												{service.description}
											</p>
											<div className='flex items-center gap-2 mt-2'>
												<Badge variant='outline'>
													{service.features.length} features
												</Badge>
											</div>
										</div>
									</div>
									<div className='flex gap-2 shrink-0'>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleEdit(service)}
										>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleDelete(service._id!)}
										>
											<Trash2 className='w-4 h-4 text-destructive' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Drawer Form */}
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent className='w-full sm:max-w-4xl px-4 overflow-auto'>
					<SheetHeader>
						<SheetTitle>
							{service?._id ? 'Edit Service' : 'Add New Service'}
						</SheetTitle>
						<SheetDescription>
							{service?._id ? 'Update service details' : 'Create a new service'}
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className='flex-1 px-1 -mx-1'>
						<ServiceForm
							service={service}
							setDrawerOpen={setDrawerOpen}
							fetchServices={fetchServices}
						/>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
}
