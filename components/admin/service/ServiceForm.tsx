import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/lib/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader, Minus, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface ServiceFormPropsType {
	service?: Service | null;
	fetchServices: CallableFunction;
	setDrawerOpen: (state: boolean) => void;
}
const ServiceForm: React.FC<ServiceFormPropsType> = ({
	service,
	fetchServices,
	setDrawerOpen,
}) => {
	const [submitting, setSubmitting] = useState<boolean>(false);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ServiceFormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			title: '',
			description: '',
			longDescription: '',
			features: [
				{
					name: '',
				},
			],
			process: [
				{
					title: '',
					description: '',
				},
			],
		},
	});

	const {
		fields: featureFields,
		append: appendFeature,
		remove: removeFeature,
	} = useFieldArray({
		control,
		name: 'features',
	});

	const {
		fields: processFields,
		append: appendProcess,
		remove: removeProcess,
	} = useFieldArray({
		control,
		name: 'process',
	});

	useEffect(() => {
		if (service?._id) {
			reset({
				title: service?.title,
				description: service?.description,
				longDescription: service?.longDescription,
				features: service?.features?.map((f) => ({
					name: f,
				})),
				process: service?.process,
			});
		}
	}, [service]);
	const onSubmit = async (value: ServiceFormData) => {
		setSubmitting(true);
		try {
			const payload = {
				title: value?.title,
				description: value?.description,
				longDescription: value?.longDescription,
				process: value?.process,
				features: value?.features?.map((feature) => feature?.name),
				slug: value.title
					.toLowerCase()
					.trim()
					.replace(/[^\w\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/--+/g, '-'),
			};

			const url = service?._id
				? `/api/services/single/${service?._id}`
				: '/api/services';
			const method = service?._id ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(service?._id ? 'Service updated!' : 'Service created!');
				setDrawerOpen(false);
				reset({});
				fetchServices();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			toast.error('Failed to save service');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6 py-4 mx-2'>
				<div className='space-y-2'>
					<Label>Title *</Label>
					<Input placeholder='Title' {...register('title')} />

					{errors.title && (
						<p className='text-red-500 text-sm'>{errors.title.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label>Short description *</Label>

					<Textarea
						placeholder='Short description'
						{...register('description')}
					/>
					{errors.description && (
						<p className='text-red-500 text-sm'>{errors.description.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label>Description *</Label>
					<Textarea
						placeholder='Long description'
						{...register('longDescription')}
					/>
					{errors.description && (
						<p className='text-red-500 text-sm'>{errors.description.message}</p>
					)}
				</div>

				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<h4>Features</h4>

						<Button
							type='button'
							onClick={() =>
								appendFeature({
									name: '',
								})
							}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>

					<Card className='p-3'>
						{featureFields.map((field, index) => (
							<div key={field.id}>
								<Label className='mb-3'>Type the feature</Label>
								<div className='flex items-center space-y-2 gap-2 w-full'>
									<Input
										placeholder='Feature'
										{...register(`features.${index}.name`)}
									/>

									<Button
										size={'icon'}
										variant={'actionIcon'}
										type='button'
										onClick={() => removeFeature(index)}
									>
										<Minus className='w-2 h-2' />
									</Button>
								</div>

								{errors.features?.[index] && (
									<p className='text-red-500 text-sm'>
										{errors.features[index]?.name?.message}
									</p>
								)}
							</div>
						))}
					</Card>
				</div>

				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<h4>Process Steps</h4>

						<Button
							type='button'
							onClick={() =>
								appendProcess({
									title: '',
									description: '',
								})
							}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>

					{processFields?.map((field, index) => (
						<Card key={field.id} className='p-3'>
							<div className='flex items-center justify-between mb-2'>
								<span>Step {index + 1}</span>

								<Button type='button' onClick={() => removeProcess(index)}>
									<X className='w-4 h-4' />
								</Button>
							</div>

							<div className='space-y-2'>
								<Label>Title *</Label>
								<Input
									placeholder='Step title'
									{...register(`process.${index}.title`)}
								/>

								{errors.process?.[index]?.title && (
									<p className='text-red-500 text-sm'>
										{errors.process[index]?.title?.message}
									</p>
								)}
								<br />
								<br />
								<Label>Description *</Label>
								<Textarea
									placeholder='Step description'
									{...register(`process.${index}.description`)}
								/>

								{errors.process?.[index]?.description && (
									<p className='text-red-500 text-sm'>
										{errors.process[index]?.description?.message}
									</p>
								)}
							</div>
						</Card>
					))}
				</div>

				<Button type='submit' disabled={submitting}>
					{submitting ? (
						<>
							<Loader className='animate-spin ' />
							Saving...
						</>
					) : (
						'Save Service'
					)}
				</Button>
			</form>
		</div>
	);
};

export default ServiceForm;

const schema = yup.object({
	title: yup.string().required('Title is required'),

	description: yup.string().required('Short description is required'),

	longDescription: yup.string().required('Description is required'),

	features: yup.array().of(
		yup.object({
			name: yup.string().required('Features is required'),
		}),
	),

	process: yup.array().of(
		yup.object({
			title: yup.string().required('Step title is required'),
			description: yup.string().required('Step description is required'),
		}),
	),
});
export type ServiceFormData = yup.InferType<typeof schema>;
