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
import { packageSchema, type PackageFormData } from '@/lib/validations/package';

interface Package {
	_id: string;
	id: string;
	title: string;
	location: string;
	price: number;
	duration: string;
	rating: number;
}

export default function PackagesManagement() {
	const [packages, setPackages] = useState<Package[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);

	const form = useForm<PackageFormData>({
		resolver: zodResolver(packageSchema),
		defaultValues: {
			id: '',
			title: '',
			location: '',
			price: 0,
			duration: '',
			description: '',
			image: '',
			groupSize: '',
			rating: 4.5,
			highlights: [],
			itinerary: [],
		},
	});

	useEffect(() => {
		fetchPackages();
	}, []);

	const fetchPackages = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/packages');
			const data = await response.json();
			if (data.success) {
				setPackages(data.data);
			}
		} catch (error) {
			console.error('Error fetching packages:', error);
			toast.error('Failed to fetch packages');
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (data: PackageFormData) => {
		try {
			const url = editingId ? `/api/packages/${editingId}` : '/api/packages';
			const method = editingId ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (result.success) {
				toast.success(editingId ? 'Package updated!' : 'Package created!');
				resetForm();
				fetchPackages();
			} else {
				toast.error(result.error || 'Failed to save package');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to save package');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this package?')) return;
		try {
			const response = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (data.success) {
				toast.success('Package deleted!');
				fetchPackages();
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to delete package');
		}
	};

	const handleEdit = (pkg: Package) => {
		setEditingId(pkg._id);
		form.reset({
			id: pkg.id,
			title: pkg.title,
			location: pkg.location,
			price: pkg.price,
			duration: pkg.duration || '',
			description: '',
			image: '',
			groupSize: '',
			rating: pkg.rating || 4.5,
			highlights: [],
			itinerary: [],
		});
	};

	const resetForm = () => {
		form.reset({
			id: '',
			title: '',
			location: '',
			price: 0,
			duration: '',
			description: '',
			image: '',
			groupSize: '',
			rating: 4.5,
			highlights: [],
			itinerary: [],
		});
		setEditingId(null);
	};

	if (loading) {
		return <div className='text-center py-8'>Loading packages...</div>;
	}

	return (
		<div className='space-y-8'>
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-6'>
					<h3 className='text-xl font-bold text-foreground mb-4'>
						{editingId ? 'Edit Package' : 'Add New Package'}
					</h3>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='grid md:grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='id'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Package ID</FormLabel>
										<FormControl>
											<Input placeholder='package-id' {...field} />
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
											<Input placeholder='Package Title' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='location'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input placeholder='e.g. Tokyo, Japan' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='price'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type='number'
												placeholder='0'
												{...field}
												onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
											/>
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
											<Input placeholder='e.g. 7 Days' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='groupSize'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Group Size</FormLabel>
										<FormControl>
											<Input placeholder='e.g. 2-10 people' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='image'
								render={({ field }) => (
									<FormItem className='md:col-span-2'>
										<FormLabel>Image URL</FormLabel>
										<FormControl>
											<Input placeholder='https://example.com/image.jpg' {...field} />
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
											<Input placeholder='Brief description of the package' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='md:col-span-2 flex gap-2'>
								<Button type='submit' variant='coral' className='flex-1'>
									{editingId ? 'Update Package' : 'Create Package'}
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
				<h3 className='text-xl font-bold text-foreground mb-4'>All Packages</h3>
				<div className='grid gap-4'>
					{packages.map((pkg) => (
						<Card key={pkg._id} className='border-0 shadow-soft'>
							<CardContent className='p-4'>
								<div className='flex items-start justify-between'>
									<div>
										<h4 className='font-bold text-foreground'>{pkg.title}</h4>
										<p className='text-sm text-muted-foreground'>{pkg.location}</p>
										<p className='text-sm font-medium text-primary'>${pkg.price}</p>
									</div>
									<div className='flex gap-2'>
										<Button size='sm' variant='ghost' onClick={() => handleEdit(pkg)}>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button size='sm' variant='ghost' onClick={() => handleDelete(pkg._id)}>
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
