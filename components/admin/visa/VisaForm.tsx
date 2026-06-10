'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Plus, X } from 'lucide-react';

type Props = {
	defaultValues: VisaFormValues;
	onSubmit: (data: VisaFormValues) => Promise<void>;
	submitting: boolean;
};

export function VisaForm({ defaultValues, onSubmit, submitting }: Props) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(visaSchema),
		defaultValues,
	});

	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	const requirements = useFieldArray({
		control,
		name: 'requirements',
	});

	const documents = useFieldArray({
		control,
		name: 'documents',
	});

	const tips = useFieldArray({
		control,
		name: 'tips',
	});

	const fees = useFieldArray({
		control,
		name: 'fees',
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
			<div className='space-y-4'>
				<h4 className='text-sm font-medium'>Basic Information</h4>

				<div className='grid grid-cols-2 gap-3'>
					<div>
						<Label className='mb-2 block'>Country Name *</Label>

						<Input {...register('name')} />

						<p className='text-xs text-red-500 mt-1'>{errors.name?.message}</p>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-3'>
					<div>
						<Label className='mb-2 block'>Flag</Label>

						<Input {...register('flag')} />
					</div>

					<div>
						<Label className='mb-2 block'>Processing Time</Label>

						<Input {...register('processing')} />
					</div>

					<div>
						<Label className='mb-2 block'>Visa Type *</Label>

						<Input {...register('type')} />

						<p className='text-xs text-red-500 mt-1'>{errors.type?.message}</p>
					</div>
				</div>

				<div>
					<Label className='mb-2 block'>Description</Label>

					<Textarea rows={4} {...register('description')} />
				</div>
			</div>

			{/* Requirements */}

			<div className='space-y-3'>
				<div className='flex justify-between'>
					<Label>Requirements</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() => requirements.append('')}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{requirements.fields.map((field, index) => (
					<div key={field.id} className='flex gap-2'>
						<Input {...register(`requirements.${index}`)} />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => requirements.remove(index)}
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				))}
			</div>

			{/* Documents */}

			<div className='space-y-3'>
				<div className='flex justify-between'>
					<Label>Documents</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() => documents.append('')}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{documents.fields.map((field, index) => (
					<div key={field.id} className='flex gap-2'>
						<Input {...register(`documents.${index}`)} />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => documents.remove(index)}
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				))}
			</div>

			{/* Fees */}

			<div className='space-y-3'>
				<div className='flex justify-between'>
					<Label>Visa Fees</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() =>
							fees.append({
								type: '',
								amount: '',
							})
						}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{fees.fields.map((field, index) => (
					<div key={field.id} className='flex gap-2'>
						<Input placeholder='Fee Type' {...register(`fees.${index}.type`)} />

						<Input placeholder='Amount' {...register(`fees.${index}.amount`)} />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => fees.remove(index)}
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				))}
			</div>

			{/* Tips */}

			<div className='space-y-3'>
				<div className='flex justify-between'>
					<Label>Tips</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() => tips.append('')}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{tips.fields.map((field, index) => (
					<div key={field.id} className='flex gap-2'>
						<Input {...register(`tips.${index}`)} />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => tips.remove(index)}
						>
							<X className='w-4 h-4' />
						</Button>
					</div>
				))}
			</div>

			<Button type='submit' className='w-full' disabled={submitting}>
				{submitting ? 'Saving...' : 'Save Country'}
			</Button>
		</form>
	);
}

export const visaSchema = Yup.object({
	name: Yup.string().required('Country name is required'),

	flag: Yup.string(),

	processing: Yup.string(),

	type: Yup.string().required('Visa type is required'),

	description: Yup.string(),

	requirements: Yup.array().of(Yup.string().required()).required(),

	documents: Yup.array().of(Yup.string().required()).required(),

	fees: Yup.array().of(
		Yup.object({
			type: Yup.string().required('Fee type is required'),
			amount: Yup.string().required('Amount is required'),
		}),
	),
	tips: Yup.array().of(Yup.string()),
});

export type VisaFormValues = Yup.InferType<typeof visaSchema>;
