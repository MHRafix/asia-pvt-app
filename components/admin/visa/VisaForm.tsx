'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import FormErrorText from '@/components/common/FormErrorText';
import { VisaCountry } from '@/lib/types';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface VisaFormPropsType {
	visaCountry?: VisaCountry | null;
	fetchVisaCountries: CallableFunction;
	setDrawerOpen: (state: boolean) => void;
}
export const VisaForm: React.FC<VisaFormPropsType> = ({
	visaCountry,
	fetchVisaCountries,
	setDrawerOpen,
}) => {
	const [submitting, setSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<VisaFormValues>({
		resolver: yupResolver(visaSchema),
		defaultValues: {
			requirements: [{ name: '' }],
			description: '',
			fees: [
				{
					type: '',
					amount: '',
				},
			],
			documents: [
				{
					name: '',
				},
			],
			tips: [
				{
					name: '',
				},
			],
		},
	});

	useEffect(() => {
		reset({});
	}, [visaCountry]);

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

	const onSubmit = async (value: VisaFormValues) => {
		setSubmitting(true);
		try {
			const url = visaCountry?._id
				? `/api/visa/${visaCountry?._id}`
				: '/api/visa';
			const method = visaCountry?._id ? 'PUT' : 'POST';

			const cleanedData = {
				...value,
				requirements: value?.requirements?.map((r) => r?.name),
				documents: value?.documents?.map((d) => d?.name),
				fees: value?.fees?.filter((f) => f.type.trim() || f.amount.trim()),
				tips: value?.tips?.map((t) => t?.name),
				slug: value.name
					.toLowerCase()
					.trim()
					.replace(/[^\w\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/--+/g, '-'),
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(visaCountry?._id ? 'Country updated!' : 'Country added!');
				setDrawerOpen(false);
				reset();
				fetchVisaCountries();
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
			<div className='space-y-4'>
				<h4 className='text-sm font-medium'>Basic Information</h4>

				<div className='grid'>
					<div>
						<Label className='mb-2 block'>Country Name *</Label>

						<Input {...register('name')} placeholder='Saudi Arabia' />

						<FormErrorText message={errors?.name?.message!} />
					</div>
				</div>

				<div className='grid grid-cols-3 gap-3'>
					<div>
						<Label className='mb-2 block'>Flag</Label>

						<Input {...register('flag')} placeholder='eg: Flag emoji' />
						<FormErrorText message={errors?.flag?.message!} />
					</div>

					<div>
						<Label className='mb-2 block'>Processing Time</Label>

						<Input {...register('processing')} placeholder='3-5 days' />

						<FormErrorText message={errors?.processing?.message!} />
					</div>

					<div>
						<Label className='mb-2 block'>Visa Type *</Label>

						<Input {...register('type')} placeholder='Visit' />

						<FormErrorText message={errors?.type?.message!} />
					</div>
				</div>

				<div>
					<Label className='mb-2 block'>Description</Label>

					<Textarea
						rows={4}
						{...register('description')}
						placeholder='Type in details'
					/>
				</div>
			</div>

			{/* Requirements */}

			<div className='space-y-3 bg-white p-4 rounded-md'>
				<div className='flex justify-between'>
					<Label>Requirements</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() =>
							requirements.append({
								name: '',
							})
						}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{requirements.fields.map((_, index) => (
					<div key={index}>
						<div className='flex gap-2'>
							<Input
								{...register(`requirements.${index}.name`)}
								placeholder='Type about requirement'
							/>

							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => requirements.remove(index)}
							>
								<X className='w-4 h-4' />
							</Button>
						</div>

						<FormErrorText
							message={errors?.requirements?.[index]?.name?.message!}
						/>
					</div>
				))}
			</div>

			{/* Documents */}

			<div className='space-y-3 bg-white p-4 rounded-md'>
				<div className='flex justify-between'>
					<Label>Documents</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() =>
							documents.append({
								name: '',
							})
						}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{documents?.fields?.map((_, index) => (
					<div key={index}>
						<div className='flex gap-2'>
							<Input
								{...register(`documents.${index}.name`)}
								placeholder='Type about document'
							/>

							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => documents.remove(index)}
							>
								<X className='w-4 h-4' />
							</Button>
						</div>
						<FormErrorText
							message={errors?.documents?.[index]?.name?.message!}
						/>
					</div>
				))}
			</div>

			{/* Fees */}

			<div className='space-y-3 bg-white p-4 rounded-md'>
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

				{fees?.fields?.map((_, index) => (
					<div key={index} className='flex gap-2 !w-full'>
						<div className='w-full'>
							<Input
								placeholder='eg: Visit'
								{...register(`fees.${index}.type`)}
							/>
							<FormErrorText message={errors?.fees?.[index]?.type?.message!} />
						</div>

						<div className='w-full'>
							<Input
								placeholder='Amount'
								{...register(`fees.${index}.amount`)}
							/>
							<FormErrorText
								message={errors?.fees?.[index]?.amount?.message!}
							/>
						</div>

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

			<div className='space-y-3 bg-white p-4 rounded-md'>
				<div className='flex justify-between'>
					<Label>Tips</Label>

					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() =>
							tips.append({
								name: '',
							})
						}
					>
						<Plus className='w-4 h-4' />
					</Button>
				</div>

				{tips?.fields?.map((_, index) => (
					<div key={index}>
						<div className='flex gap-2'>
							<Input
								{...register(`tips.${index}.name`)}
								placeholder='eg: Apply online for fast delivery'
							/>

							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => tips.remove(index)}
							>
								<X className='w-4 h-4' />
							</Button>
						</div>
						<FormErrorText message={errors?.tips?.[index]?.name?.message!} />
					</div>
				))}
			</div>

			<Button type='submit' className='w-full' disabled={submitting}>
				{submitting ? 'Saving...' : 'Save Country'}
			</Button>
		</form>
	);
};

export const visaSchema = Yup.object({
	name: Yup.string().required('Country name is required'),

	flag: Yup.string().required().label('Flag emoji'),

	processing: Yup.string().required().label('Processing'),

	type: Yup.string().required('Visa type is required'),

	description: Yup.string(),

	requirements: Yup.array()
		.of(
			Yup.object({
				name: Yup.string().required('Requirement name is required'),
			}),
		)
		.required()
		.label('Requirement'),

	documents: Yup.array().of(
		Yup.object({
			name: Yup.string().required('Document name is required'),
		})
			.required()
			.label('Document'),
	),

	fees: Yup.array().of(
		Yup.object({
			type: Yup.string().required('Fee type is required'),
			amount: Yup.string().required('Amount is required'),
		}),
	),
	tips: Yup.array().of(
		Yup.object({
			name: Yup.string().required('Tips is required'),
		}),
	),
});

export type VisaFormValues = Yup.InferType<typeof visaSchema>;
