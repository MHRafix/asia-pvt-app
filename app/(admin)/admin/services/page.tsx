'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Service } from '@/lib/types';
import {
	Clock,
	Edit2,
	Loader,
	Plus,
	Search,
	Trash2,
	Wrench,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const initialFormData = {
	slug: '',
	title: '',
	description: '',
	duration: '',
	longDescription: '',
	features: [''],
	process: [{ step: 1, title: '', description: '' }],
};

export default function ServicesAdminPage() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.slug || !formData.title || !formData.description) {
			toast.error('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		try {
			const url = editingId ? `/api/services/${editingId}` : '/api/services';
			const method = editingId ? 'PUT' : 'POST';

			const cleanedData = {
				...formData,
				features: formData.features.filter((f) => f.trim()),
				process: formData.process.filter(
					(p) => p.title.trim() || p.description.trim(),
				),
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(editingId ? 'Service updated!' : 'Service created!');
				setDrawerOpen(false);
				resetForm();
				fetchServices();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to save service');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this service?')) return;
		try {
			const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
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
		setEditingId(service._id || null);
		setFormData({
			slug: service.slug,
			title: service.title,
			description: service.description,
			duration: service.duration,
			longDescription: service.longDescription,
			features: service.features.length > 0 ? service.features : [''],
			process:
				service.process.length > 0
					? service.process
					: [{ step: 1, title: '', description: '' }],
		});
		setDrawerOpen(true);
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setEditingId(null);
	};

	const addFeature = () => {
		setFormData({ ...formData, features: [...formData.features, ''] });
	};

	const updateFeature = (index: number, value: string) => {
		const updated = [...formData.features];
		updated[index] = value;
		setFormData({ ...formData, features: updated });
	};

	const removeFeature = (index: number) => {
		const updated = formData.features.filter((_, i) => i !== index);
		setFormData({ ...formData, features: updated.length > 0 ? updated : [''] });
	};

	const addProcessStep = () => {
		const nextStep = formData.process.length + 1;
		setFormData({
			...formData,
			process: [
				...formData.process,
				{ step: nextStep, title: '', description: '' },
			],
		});
	};

	const updateProcess = (
		index: number,
		field: 'title' | 'description',
		value: string,
	) => {
		const updated = [...formData.process];
		updated[index] = { ...updated[index], [field]: value };
		setFormData({ ...formData, process: updated });
	};

	const removeProcessStep = (index: number) => {
		const updated = formData.process
			.filter((_, i) => i !== index)
			.map((item, i) => ({ ...item, step: i + 1 }));
		setFormData({
			...formData,
			process:
				updated.length > 0
					? updated
					: [{ step: 1, title: '', description: '' }],
		});
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
						resetForm();
						setDrawerOpen(true);
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
												<Badge variant='secondary' className='gap-1'>
													<Clock className='w-3 h-3' />
													{service.duration}
												</Badge>
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
							{editingId ? 'Edit Service' : 'Add New Service'}
						</SheetTitle>
						<SheetDescription>
							{editingId ? 'Update service details' : 'Create a new service'}
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className='flex-1 px-1 -mx-1'>
						<form onSubmit={handleSubmit} className='space-y-6 py-4 mx-2'>
							{/* Basic Info */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Basic Information
								</h4>
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Slug *'
										value={formData.slug}
										onChange={(e) =>
											setFormData({ ...formData, slug: e.target.value })
										}
										required
									/>
									<Input
										placeholder='Title *'
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										required
									/>
								</div>
								<Input
									placeholder='Duration (e.g., 30 min)'
									value={formData.duration}
									onChange={(e) =>
										setFormData({ ...formData, duration: e.target.value })
									}
								/>
								<Textarea
									placeholder='Short description *'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={2}
									required
								/>
								<Textarea
									placeholder='Long description'
									value={formData.longDescription}
									onChange={(e) =>
										setFormData({
											...formData,
											longDescription: e.target.value,
										})
									}
									rows={4}
								/>
							</div>

							{/* Features */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Features
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={addFeature}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.features.map((feature, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Feature'
											value={feature}
											onChange={(e) => updateFeature(index, e.target.value)}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeFeature(index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Process Steps */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Process Steps
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={addProcessStep}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.process.map((step, index) => (
									<Card key={index} className='p-3'>
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm font-medium'>
												Step {step.step}
											</span>
											<Button
												type='button'
												variant='ghost'
												size='sm'
												onClick={() => removeProcessStep(index)}
											>
												<X className='w-4 h-4' />
											</Button>
										</div>
										<div className='space-y-2'>
											<Input
												placeholder='Step title'
												value={step.title}
												onChange={(e) =>
													updateProcess(index, 'title', e.target.value)
												}
											/>
											<Textarea
												placeholder='Step description'
												value={step.description}
												onChange={(e) =>
													updateProcess(index, 'description', e.target.value)
												}
												rows={2}
											/>
										</div>
									</Card>
								))}
							</div>
						</form>
					</ScrollArea>

					<SheetFooter className='border-t border-border pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								setDrawerOpen(false);
								resetForm();
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={submitting}>
							{submitting && <Loader className='w-4 h-4 mr-2 animate-spin' />}
							{editingId ? 'Update Service' : 'Create Service'}
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
