'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/lib/types';
import {
	dailyServiceSchema,
	type DailyServiceFormData,
} from '@/lib/validations/crm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { DailyService } from './DailyServicesList';

interface DailyServiceFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	clients: Array<{ _id: string; name: string }>;
	employees: Array<{ _id: string; name: string }>;
	service?: DailyService | null | undefined;
	asiaServices: Service[];
}

export default function DailyServiceFormDialog({
	open,
	onOpenChange,
	onSuccess,
	clients,
	employees,
	service,
	asiaServices,
}: DailyServiceFormDialogProps) {
	const isEditing = !!service;

	const form = useForm<DailyServiceFormData>({
		resolver: zodResolver(dailyServiceSchema),
		defaultValues: {
			linkedClientId: '',
			assignedEmployeeId: '',
			serviceTitle: '',
			serviceDescription: '',
			serviceCost: 0,
			serviceStatus: 'pending',
			notes: '',
			serviceRefId: '',
			passportNo: '',
		},
	});

	useEffect(() => {
		console.log(form.getValues());
		if (service) {
			form.setValue('serviceTitle', service?.serviceTitle);
			form.setValue('linkedClientId', service?.linkedClientId?._id!);
			form.setValue('assignedEmployeeId', service?.assignedEmployeeId?._id);
			form.setValue('serviceDescription', service?.serviceDescription!);
			form.setValue('serviceCost', service?.serviceCost);
			form.setValue('serviceStatus', service?.serviceStatus);
			form.setValue('serviceRefId', service?.serviceRefId?._id);
			form.setValue('passportNo', service?.passportNo);
		} else {
			form.reset({
				linkedClientId: '',
				assignedEmployeeId: '',
				serviceTitle: '',
				serviceDescription: '',
				serviceCost: 0,
				serviceStatus: 'pending',
				notes: '',
				serviceRefId: '',
			});
		}
	}, [service]);

	const onSubmit = async (data: DailyServiceFormData) => {
		try {
			const url = isEditing
				? `/api/crm/daily-services/${service._id}`
				: '/api/crm/daily-services';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(isEditing ? 'Service updated!' : 'Service created!');
				form.reset();
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to save service');
			}
		} catch (error) {
			console.error('Error saving service:', error);
			toast.error('Failed to save service');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Service' : 'Add New Service'}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='serviceTitle'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Service Title *</FormLabel>
										<FormControl>
											<Input
												placeholder='e.g. Website Design, Consultation'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='serviceRefId'
								render={({ field }) => (
									<FormItem className='col-span-1'>
										<FormLabel>Select Service *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={form.watch('serviceRefId')}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select a service' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{asiaServices.map((client) => (
													<SelectItem key={client._id} value={client._id!}>
														{client.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='passportNo'
								render={({ field }) => (
									<FormItem className='col-span-1'>
										<FormLabel>Passport No *</FormLabel>
										<Input placeholder='e.g. A1231231' {...field} />
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='serviceCost'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service Cost *</FormLabel>
										<FormControl>
											<Input
												type='number'
												placeholder='0'
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='serviceStatus'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent className='w-full'>
												<SelectItem value='pending'>Pending</SelectItem>
												<SelectItem value='in_progress'>In Progress</SelectItem>
												<SelectItem value='completed'>Completed</SelectItem>
												<SelectItem value='on_hold'>On Hold</SelectItem>
												<SelectItem value='cancelled'>Cancelled</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='assignedEmployeeId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assign employee *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={form.watch('assignedEmployeeId')}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select an employee' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{employees.map((client) => (
													<SelectItem key={client._id} value={client._id}>
														{client.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='linkedClientId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Select Client *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={form.watch('linkedClientId')}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select a client' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{clients.map((client) => (
													<SelectItem key={client._id} value={client._id}>
														{client.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='serviceDescription'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Service Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Detailed description of the service...'
												className='resize-none'
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='flex justify-end gap-3 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<>
										<Loader className='w-4 h-4 mr-2 animate-spin' />
										Saving...
									</>
								) : isEditing ? (
									'Update Service'
								) : (
									'Add Service'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
