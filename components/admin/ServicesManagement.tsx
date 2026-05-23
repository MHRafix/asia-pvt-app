'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormData } from '@/lib/validations/service';

interface Service {
	_id: string;
	slug: string;
	title: string;
	description: string;
	duration: string;
}

export default function ServicesManagement() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);

	const form = useForm<ServiceFormData>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			slug: '',
			title: '',
			description: '',
			longDescription: '',
			duration: '',
			features: [],
			process: [],
		},
	});

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/services');
			const data = await response.json();
			if (data.success) setServices(data.data);
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to fetch services');
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (data: ServiceFormData) => {
		try {
			const url = editingId ? `/api/services/${editingId}` : '/api/services';
			const method = editingId ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (result.success) {
				toast.success(editingId ? 'Service updated!' : 'Service created!');
				resetForm();
				fetchServices();
			} else {
				toast.error(result.error || 'Failed to save service');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to save service');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this service?')) return;
		try {
			const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (data.success) {
				toast.success('Service deleted!');
				fetchServices();
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to delete service');
		}
	};

	const handleEdit = (service: Service) => {
		setEditingId(service._id);
		form.reset({
			slug: service.slug,
			title: service.title,
			description: service.description,
			longDescription: '',
			duration: service.duration || '',
			features: [],
			process: [],
		});
	};

	const resetForm = () => {
		form.reset({
			slug: '',
			title: '',
			description: '',
			longDescription: '',
			duration: '',
			features: [],
			process: [],
		});
		setEditingId(null);
	};

	if (loading) return <div className='text-center py-8'>Loading services...</div>;

	return (
		<div className='space-y-8'>
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-6'>
					<h3 className='text-xl font-bold text-foreground mb-4'>
						{editingId ? 'Edit Service' : 'Add New Service'}
					</h3>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='grid md:grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='slug'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service Slug</FormLabel>
										<FormControl>
											<Input placeholder='service-slug' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder='Service Title' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='duration'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duration</FormLabel>
										<FormControl>
											<Input placeholder='e.g. 2-3 weeks' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem className='md:col-span-2'>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder='Brief description of the service' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='md:col-span-2 flex gap-2'>
								<Button type='submit' variant='coral' className='flex-1'>
									{editingId ? 'Update Service' : 'Create Service'}
								</Button>
								{editingId && (
									<Button type='button' variant='outline' onClick={resetForm}>
										Cancel
									</Button>
								)}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<div>
				<h3 className='text-xl font-bold text-foreground mb-4'>All Services</h3>
				<div className='grid gap-4'>
					{services.map((service) => (
						<Card key={service._id} className='border-0 shadow-soft'>
							<CardContent className='p-4'>
								<div className='flex items-start justify-between'>
									<div>
										<h4 className='font-bold text-foreground'>{service.title}</h4>
										<p className='text-sm text-muted-foreground'>{service.description}</p>
									</div>
									<div className='flex gap-2'>
										<Button size='sm' variant='ghost' onClick={() => handleEdit(service)}>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button size='sm' variant='ghost' onClick={() => handleDelete(service._id)}>
											<Trash2 className='w-4 h-4 text-destructive' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
