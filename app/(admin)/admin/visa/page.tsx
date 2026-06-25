'use client';

import { VisaForm } from '@/components/admin/visa/VisaForm';
import EmptyState from '@/components/common/visa/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { VisaCountry } from '@/lib/types';
import { Clock, Edit2, Loader, Plus, Search, Trash2 } from 'lucide-react';
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
	const [visaCountry, setVisaCountry] = useState<VisaCountry | null>(null);

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
		setVisaCountry(country);

		setDrawerOpen(true);
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
						setVisaCountry(null);
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
				<EmptyState />
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
							{visaCountry?._id ? 'Edit Country' : 'Add New Country'}
						</SheetTitle>
						<SheetDescription>
							{visaCountry?._id
								? 'Update visa country details'
								: 'Add a new visa country'}
						</SheetDescription>
					</SheetHeader>

					<VisaForm
						fetchVisaCountries={fetchCountries}
						setDrawerOpen={setDrawerOpen}
						visaCountry={visaCountry}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}
