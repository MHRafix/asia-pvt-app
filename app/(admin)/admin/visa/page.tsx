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
import type { VisaCountry } from '@/lib/types';
import {
	Clock,
	Edit2,
	Globe,
	Loader,
	Plus,
	Search,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const initialFormData = {
	slug: '',
	name: '',
	flag: '',
	processing: '',
	type: '',
	description: '',
	requirements: [''],
	documents: [''],
	fees: [{ type: '', amount: '' }],
	tips: [''],
};

export default function VisaAdminPage() {
	const [countries, setCountries] = useState<VisaCountry[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		fetchCountries();
	}, []);

	const fetchCountries = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/visa');
			const data = await response.json();
			if (data.success) {
				setCountries(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching countries:', error);
			toast.error('Failed to fetch visa countries');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.slug || !formData.name || !formData.type) {
			toast.error('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		try {
			const url = editingId ? `/api/visa/${editingId}` : '/api/visa';
			const method = editingId ? 'PUT' : 'POST';

			const cleanedData = {
				...formData,
				requirements: formData.requirements.filter((r) => r.trim()),
				documents: formData.documents.filter((d) => d.trim()),
				fees: formData.fees.filter((f) => f.type.trim() || f.amount.trim()),
				tips: formData.tips.filter((t) => t.trim()),
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(editingId ? 'Country updated!' : 'Country added!');
				setDrawerOpen(false);
				resetForm();
				fetchCountries();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to save country');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this country?')) return;
		try {
			const response = await fetch(`/api/visa/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (data.success) {
				toast.success('Country deleted!');
				fetchCountries();
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to delete country');
		}
	};

	const handleEdit = (country: VisaCountry) => {
		setEditingId(country._id || null);
		setFormData({
			slug: country.slug,
			name: country.name,
			flag: country.flag,
			processing: country.processing,
			type: country.type,
			description: country.description,
			requirements:
				country.requirements.length > 0 ? country.requirements : [''],
			documents: country.documents.length > 0 ? country.documents : [''],
			fees: country.fees.length > 0 ? country.fees : [{ type: '', amount: '' }],
			tips: country.tips.length > 0 ? country.tips : [''],
		});
		setDrawerOpen(true);
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setEditingId(null);
	};

	const addArrayItem = (field: 'requirements' | 'documents' | 'tips') => {
		setFormData({ ...formData, [field]: [...formData[field], ''] });
	};

	const updateArrayItem = (
		field: 'requirements' | 'documents' | 'tips',
		index: number,
		value: string,
	) => {
		const updated = [...formData[field]];
		updated[index] = value;
		setFormData({ ...formData, [field]: updated });
	};

	const removeArrayItem = (
		field: 'requirements' | 'documents' | 'tips',
		index: number,
	) => {
		const updated = formData[field].filter((_, i) => i !== index);
		setFormData({ ...formData, [field]: updated.length > 0 ? updated : [''] });
	};

	const addFee = () => {
		setFormData({
			...formData,
			fees: [...formData.fees, { type: '', amount: '' }],
		});
	};

	const updateFee = (
		index: number,
		field: 'type' | 'amount',
		value: string,
	) => {
		const updated = [...formData.fees];
		updated[index] = { ...updated[index], [field]: value };
		setFormData({ ...formData, fees: updated });
	};

	const removeFee = (index: number) => {
		const updated = formData.fees.filter((_, i) => i !== index);
		setFormData({
			...formData,
			fees: updated.length > 0 ? updated : [{ type: '', amount: '' }],
		});
	};

	const filteredCountries = countries.filter(
		(country) =>
			country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			country.type.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Visa Countries</h1>
					<p className='text-muted-foreground mt-1'>
						Manage visa information for countries
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
					Add Country
				</Button>
			</div>

			{/* Search */}
			<div className='relative mb-6'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
				<Input
					placeholder='Search countries...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			{/* Countries List */}
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : filteredCountries.length === 0 ? (
				<Card className='border-0 shadow-soft'>
					<CardContent className='py-12 text-center'>
						<Globe className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground'>
							{searchQuery
								? 'No countries match your search'
								: 'No visa countries yet'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredCountries.map((country) => (
						<Card
							key={country._id}
							className='border-0 shadow-soft hover:shadow-md transition-shadow'
						>
							<CardContent className='p-5'>
								<div className='flex items-start justify-between'>
									<div className='flex items-center gap-3'>
										<div className='w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center text-2xl'>
											{country.flag}
										</div>
										<div>
											<h3 className='font-semibold text-foreground'>
												{country.name}
											</h3>
											<p className='text-sm text-muted-foreground'>
												{country.type}
											</p>
										</div>
									</div>
									<div className='flex gap-1'>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleEdit(country)}
										>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleDelete(country._id!)}
										>
											<Trash2 className='w-4 h-4 text-destructive' />
										</Button>
									</div>
								</div>
								<div className='mt-4 flex items-center gap-2'>
									<Badge variant='secondary' className='gap-1'>
										<Clock className='w-3 h-3' />
										{country.processing}
									</Badge>
									<Badge variant='outline'>
										{country.requirements.length} requirements
									</Badge>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Drawer Form */}
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent className='w-full sm:max-w-4xl overflow-auto px-4'>
					<SheetHeader>
						<SheetTitle>
							{editingId ? 'Edit Country' : 'Add New Country'}
						</SheetTitle>
						<SheetDescription>
							{editingId
								? 'Update visa country details'
								: 'Add a new visa country'}
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
										placeholder='Country Name *'
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div className='grid grid-cols-3 gap-3'>
									<Input
										placeholder='Flag (emoji or code)'
										value={formData.flag}
										onChange={(e) =>
											setFormData({ ...formData, flag: e.target.value })
										}
									/>
									<Input
										placeholder='Processing Time'
										value={formData.processing}
										onChange={(e) =>
											setFormData({ ...formData, processing: e.target.value })
										}
									/>
									<Input
										placeholder='Visa Type *'
										value={formData.type}
										onChange={(e) =>
											setFormData({ ...formData, type: e.target.value })
										}
										required
									/>
								</div>
								<Textarea
									placeholder='Description'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
								/>
							</div>

							{/* Requirements */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Requirements
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('requirements')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.requirements.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Requirement'
											value={item}
											onChange={(e) =>
												updateArrayItem('requirements', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('requirements', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Documents */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Required Documents
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('documents')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.documents.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Document'
											value={item}
											onChange={(e) =>
												updateArrayItem('documents', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('documents', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Fees */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Visa Fees
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={addFee}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.fees.map((fee, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Fee type'
											value={fee.type}
											onChange={(e) => updateFee(index, 'type', e.target.value)}
											className='flex-1'
										/>
										<Input
											placeholder='Amount'
											value={fee.amount}
											onChange={(e) =>
												updateFee(index, 'amount', e.target.value)
											}
											className='w-32'
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeFee(index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>

							{/* Tips */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Tips
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => addArrayItem('tips')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.tips.map((item, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Tip'
											value={item}
											onChange={(e) =>
												updateArrayItem('tips', index, e.target.value)
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeArrayItem('tips', index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
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
							{editingId ? 'Update Country' : 'Add Country'}
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
