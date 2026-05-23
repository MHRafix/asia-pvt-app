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
import {
	employeeSchema,
	type EmployeeFormData,
} from '@/lib/validations/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Employee {
	_id: string;
	name: string;
	email: string;
	phone: string;
	role: 'admin' | 'employee';
	department?: string;
	position: string;
	salary?: number;
	status: 'active' | 'inactive' | 'on-leave';
	joinDate?: string;
	address?: string;
	emergencyContact?: string;
	notes?: string;
}

interface EmployeeFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	employee?: Employee | null;
	onSuccess: () => void;
}

export default function EmployeeFormDialog({
	open,
	onOpenChange,
	employee,
	onSuccess,
}: EmployeeFormDialogProps) {
	const [loading, setLoading] = useState(false);
	const isEditing = !!employee;

	const form = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			role: 'employee',
			department: '',
			position: '',
			salary: undefined,
			status: 'active',
			joinDate: '',
			address: '',
			emergencyContact: '',
			notes: '',
		},
	});

	useEffect(() => {
		if (employee) {
			form.reset({
				name: employee.name,
				email: employee.email,
				phone: employee.phone,
				role: employee.role,
				department: employee.department || '',
				position: employee.position,
				salary: employee.salary,
				status: employee.status,
				joinDate: employee.joinDate
					? new Date(employee.joinDate).toISOString().split('T')[0]
					: '',
				address: employee.address || '',
				emergencyContact: employee.emergencyContact || '',
				notes: employee.notes || '',
			});
		} else {
			form.reset({
				name: '',
				email: '',
				phone: '',
				role: 'employee',
				department: '',
				position: '',
				salary: undefined,
				status: 'active',
				joinDate: new Date().toISOString().split('T')[0],
				address: '',
				emergencyContact: '',
				notes: '',
			});
		}
	}, [employee, form]);

	const onSubmit = async (data: EmployeeFormData) => {
		setLoading(true);

		try {
			const url = isEditing
				? `/api/employees/${employee._id}`
				: '/api/employees';
			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(isEditing ? 'Employee updated!' : 'Employee created!');
				onSuccess();
			} else {
				toast.error(result.error || 'Failed to save employee');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to save employee');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Employee' : 'Add New Employee'}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input placeholder='John Doe' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												type='email'
												placeholder='john@example.com'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone *</FormLabel>
										<FormControl>
											<Input placeholder='+1 234 567 8900' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='position'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Position *</FormLabel>
										<FormControl>
											<Input placeholder='Software Engineer' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='department'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department</FormLabel>
										<FormControl>
											<Input placeholder='Engineering' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select role' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='employee'>Employee</SelectItem>
												<SelectItem value='admin'>Admin</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='active'>Active</SelectItem>
												<SelectItem value='inactive'>Inactive</SelectItem>
												<SelectItem value='on-leave'>On Leave</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='salary'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Salary</FormLabel>
										<FormControl>
											<Input
												type='number'
												placeholder='50000'
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value
															? parseFloat(e.target.value)
															: undefined,
													)
												}
												value={field.value ?? ''}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='joinDate'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Join Date</FormLabel>
										<FormControl>
											<Input type='date' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='emergencyContact'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Emergency Contact</FormLabel>
										<FormControl>
											<Input placeholder='+1 234 567 8900' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											placeholder='123 Main St, City, Country'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='notes'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Additional notes about the employee...'
											className='min-h-[80px]'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex justify-end gap-3'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={loading}>
								{loading ? (
									<>
										<Loader className='w-4 h-4 mr-2 animate-spin' />
										Saving...
									</>
								) : isEditing ? (
									'Update Employee'
								) : (
									'Add Employee'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
