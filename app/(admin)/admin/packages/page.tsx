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
import type { TravelPackage } from '@/lib/types';
import {
	Edit2,
	Loader,
	MapPin,
	Package,
	Plus,
	Search,
	Star,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const initialFormData = {
	id: '',
	title: '',
	location: '',
	price: 0,
	duration: '',
	description: '',
	image: '',
	groupSize: '',
	rating: 4.5,
	reviews: 0,
	highlights: [''],
	included: [''],
	notIncluded: [''],
	itinerary: [{ day: 1, title: '', description: '' }],
};

export default function PackagesAdminPage() {
	const [packages, setPackages] = useState<TravelPackage[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

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
			console.error('[v0] Error fetching packages:', error);
			toast.error('Failed to fetch packages');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.id ||
			!formData.title ||
			!formData.location ||
			!formData.price
		) {
			toast.error('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		try {
			const url = editingId ? `/api/packages/${editingId}` : '/api/packages';
			const method = editingId ? 'PUT' : 'POST';

			// Clean up empty array items
			const cleanedData = {
				...formData,
				highlights: formData.highlights.filter((h) => h.trim()),
				included: formData.included.filter((i) => i.trim()),
				notIncluded: formData.notIncluded.filter((n) => n.trim()),
				itinerary: formData.itinerary.filter(
					(i) => i.title.trim() || i.description.trim(),
				),
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(editingId ? 'Package updated!' : 'Package created!');
				setDrawerOpen(false);
				resetForm();
				fetchPackages();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to save package');
		} finally {
			setSubmitting(false);
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
			console.error('[v0] Error:', error);
			toast.error('Failed to delete package');
		}
	};

	const handleEdit = (pkg: TravelPackage) => {
		setEditingId(pkg._id || null);
		setFormData({
			id: pkg.id,
			title: pkg.title,
			location: pkg.location,
			price: pkg.price,
			duration: pkg.duration,
			description: pkg.description,
			image: pkg.image,
			groupSize: pkg.groupSize,
			rating: pkg.rating,
			reviews: pkg.reviews,
			highlights: pkg.highlights.length > 0 ? pkg.highlights : [''],
			included: pkg.included.length > 0 ? pkg.included : [''],
			notIncluded: pkg.notIncluded.length > 0 ? pkg.notIncluded : [''],
			itinerary:
				pkg.itinerary.length > 0
					? pkg.itinerary
					: [{ day: 1, title: '', description: '' }],
		});
		setDrawerOpen(true);
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setEditingId(null);
	};

	const addArrayItem = (field: 'highlights' | 'included' | 'notIncluded') => {
		setFormData({ ...formData, [field]: [...formData[field], ''] });
	};

	const updateArrayItem = (
		field: 'highlights' | 'included' | 'notIncluded',
		index: number,
		value: string,
	) => {
		const updated = [...formData[field]];
		updated[index] = value;
		setFormData({ ...formData, [field]: updated });
	};

	const removeArrayItem = (
		field: 'highlights' | 'included' | 'notIncluded',
		index: number,
	) => {
		const updated = formData[field].filter((_, i) => i !== index);
		setFormData({ ...formData, [field]: updated.length > 0 ? updated : [''] });
	};

	const addItineraryDay = () => {
		const nextDay = formData.itinerary.length + 1;
		setFormData({
			...formData,
			itinerary: [
				...formData.itinerary,
				{ day: nextDay, title: '', description: '' },
			],
		});
	};

	const updateItinerary = (
		index: number,
		field: 'title' | 'description',
		value: string,
	) => {
		const updated = [...formData.itinerary];
		updated[index] = { ...updated[index], [field]: value };
		setFormData({ ...formData, itinerary: updated });
	};

	const removeItineraryDay = (index: number) => {
		const updated = formData.itinerary
			.filter((_, i) => i !== index)
			.map((item, i) => ({ ...item, day: i + 1 }));
		setFormData({
			...formData,
			itinerary:
				updated.length > 0 ? updated : [{ day: 1, title: '', description: '' }],
		});
	};

	const filteredPackages = packages.filter(
		(pkg) =>
			pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			pkg.location.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Travel Packages
					</h1>
					<p className='text-muted-foreground mt-1'>
						Manage your travel packages
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
					Add Package
				</Button>
			</div>

			{/* Search */}
			<div className='relative mb-6'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
				<Input
					placeholder='Search packages...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			{/* Packages List */}
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : filteredPackages.length === 0 ? (
				<Card className='border-0 shadow-soft'>
					<CardContent className='py-12 text-center'>
						<Package className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground'>
							{searchQuery
								? 'No packages match your search'
								: 'No packages yet'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4'>
					{filteredPackages.map((pkg) => (
						<Card
							key={pkg._id}
							className='border-0 shadow-soft hover:shadow-md transition-shadow'
						>
							<CardContent>
								<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
									<div className='flex items-start gap-4'>
										<div className='w-22 h-22 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
											<img
												src={pkg.image}
												alt={pkg.title}
												className='w-full h-full object-cover transition-transform duration-500 rounded-lg'
											/>
										</div>
										<div>
											<h3 className='font-semibold text-foreground text-lg'>
												{pkg.title}
											</h3>
											<div className='flex items-center gap-3 mt-1 text-sm text-muted-foreground'>
												<span className='flex items-center gap-1'>
													<MapPin className='w-3.5 h-3.5' />
													{pkg.location}
												</span>
												<span className='flex items-center gap-1'>
													<Star className='w-3.5 h-3.5 text-yellow-500' />
													{pkg.rating}
												</span>
											</div>
											<div className='flex flex-wrap gap-2 mt-2'>
												<Badge variant='secondary'>{pkg.duration}</Badge>
												<Badge variant='outline'>{pkg.groupSize} people</Badge>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-3 sm:flex-col sm:items-end'>
										<p className='text-2xl font-bold text-primary'>
											${pkg.price}
										</p>
										<div className='flex gap-2'>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => handleEdit(pkg)}
											>
												<Edit2 className='w-4 h-4' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => handleDelete(pkg._id!)}
											>
												<Trash2 className='w-4 h-4 text-destructive' />
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Drawer Form */}
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent className='w-full sm:max-w-5xl overflow-auto px-4'>
					<SheetHeader>
						<SheetTitle>
							{editingId ? 'Edit Package' : 'Add New Package'}{' '}
						</SheetTitle>
						<SheetDescription>
							{editingId
								? 'Update package details'
								: 'Create a new travel package'}
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
										placeholder='Package ID *'
										value={formData.id}
										onChange={(e) =>
											setFormData({ ...formData, id: e.target.value })
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
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Location *'
										value={formData.location}
										onChange={(e) =>
											setFormData({ ...formData, location: e.target.value })
										}
										required
									/>
									<Input
										placeholder='Price *'
										type='number'
										value={formData.price}
										onChange={(e) =>
											setFormData({
												...formData,
												price: parseFloat(e.target.value) || 0,
											})
										}
										required
									/>
								</div>
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Duration (e.g., 7 Days)'
										value={formData.duration}
										onChange={(e) =>
											setFormData({ ...formData, duration: e.target.value })
										}
									/>
									<Input
										placeholder='Group Size (e.g., 2-8)'
										value={formData.groupSize}
										onChange={(e) =>
											setFormData({ ...formData, groupSize: e.target.value })
										}
									/>
								</div>
								<Input
									placeholder='Image URL'
									value={formData.image}
									onChange={(e) =>
										setFormData({ ...formData, image: e.target.value })
									}
								/>
								<Textarea
									placeholder='Description'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
								/>
							</div>

							{/* Highlights */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Highlights
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('highlights')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.highlights.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Highlight'
											value={item}
											onChange={(e) =>
												updateArrayItem('highlights', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('highlights', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Included */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										What&apos;s Included
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('included')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.included.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Included item'
											value={item}
											onChange={(e) =>
												updateArrayItem('included', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('included', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Not Included */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Not Included
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('notIncluded')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.notIncluded.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Not included item'
											value={item}
											onChange={(e) =>
												updateArrayItem('notIncluded', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('notIncluded', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Itinerary */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Itinerary
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={addItineraryDay}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.itinerary.map((day, index) => (
									<Card key={index} className='p-3'>
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm font-medium'>Day {day.day}</span>
											<Button
												type='button'
												variant='ghost'
												size='sm'
												onClick={() => removeItineraryDay(index)}
											>
												<X className='w-4 h-4' />
											</Button>
										</div>
										<div className='space-y-2'>
											<Input
												placeholder='Day title'
												value={day.title}
												onChange={(e) =>
													updateItinerary(index, 'title', e.target.value)
												}
											/>
											<Textarea
												placeholder='Day description'
												value={day.description}
												onChange={(e) =>
													updateItinerary(index, 'description', e.target.value)
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
							{editingId ? 'Update Package' : 'Create Package'}
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
