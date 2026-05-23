'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientActivitySchema, type ClientActivityFormData } from '@/lib/validations/crm';

interface ActivityFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	clientId: string;
}

export default function ActivityFormDialog({
	open,
	onOpenChange,
	onSuccess,
	clientId,
}: ActivityFormDialogProps) {
	const form = useForm<ClientActivityFormData>({
		resolver: zodResolver(clientActivitySchema),
		defaultValues: {
			clientId,
			type: 'note',
			title: '',
			description: '',
		},
	});

	const onSubmit = async (data: ClientActivityFormData) => {
		try {
			const response = await fetch('/api/crm/activities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, clientId }),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Activity added!');
				form.reset({
					clientId,
					type: 'note',
					title: '',
					description: '',
				});
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to add activity');
			}
		} catch (error) {
			console.error('Error adding activity:', error);
			toast.error('Failed to add activity');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Add Activity</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Activity Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='note'>Note</SelectItem>
											<SelectItem value='call'>Phone Call</SelectItem>
											<SelectItem value='meeting'>Meeting</SelectItem>
											<SelectItem value='email'>Email</SelectItem>
											<SelectItem value='other'>Other</SelectItem>
										</SelectContent>
									</Select>
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
										<Input placeholder='e.g. Follow-up call' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Details about the activity...'
											className='resize-none'
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
										Adding...
									</>
								) : (
									'Add Activity'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
