'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Calendar,
	DollarSign,
	Edit2,
	Loader,
	Mail,
	Phone,
	Plus,
	Search,
	Shield,
	Trash2,
	UserCheck,
	Users,
	UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmployeeFormDialog from './EmployeeFormDialogue';

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
	createdAt: string;
}

interface Stats {
	totalEmployees: number;
	activeEmployees: number;
	onLeaveEmployees: number;
	adminCount: number;
	totalSalary: number;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

const statusColors: Record<string, string> = {
	active:
		'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
	inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
	'on-leave':
		'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
};

const roleColors: Record<string, string> = {
	admin:
		'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
	employee: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function EmployeesManagement() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [stats, setStats] = useState<Stats | null>(null);
	const [departments, setDepartments] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [roleFilter, setRoleFilter] = useState('all');
	const [departmentFilter, setDepartmentFilter] = useState('all');
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	});

	// Dialog states
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

	useEffect(() => {
		fetchEmployees();
	}, [search, statusFilter, roleFilter, departmentFilter, pagination.page]);

	const fetchEmployees = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
			});
			if (search) params.append('search', search);
			if (statusFilter !== 'all') params.append('status', statusFilter);
			if (roleFilter !== 'all') params.append('role', roleFilter);
			if (departmentFilter !== 'all')
				params.append('department', departmentFilter);

			const response = await fetch(`/api/employees?${params}`);
			const data = await response.json();

			if (data.success) {
				setEmployees(data.data);
				setStats(data.stats);
				setDepartments(data.departments || []);
				setPagination((prev) => ({
					...prev,
					total: data.pagination.total,
					pages: data.pagination.pages,
				}));
			}
		} catch (error) {
			console.error('Error fetching employees:', error);
			toast.error('Failed to fetch employees');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this employee?')) return;

		try {
			const response = await fetch(`/api/employees/${id}`, {
				method: 'DELETE',
			});
			const data = await response.json();

			if (data.success) {
				toast.success('Employee deleted successfully');
				fetchEmployees();
			} else {
				toast.error(data.error || 'Failed to delete employee');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to delete employee');
		}
	};

	const handleEdit = (employee: Employee) => {
		setEditingEmployee(employee);
		setFormDialogOpen(true);
	};

	const handleFormSuccess = () => {
		setFormDialogOpen(false);
		setEditingEmployee(null);
		fetchEmployees();
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const statsCards = stats
		? [
				{
					title: 'Total Employees',
					value: stats.totalEmployees,
					icon: Users,
					color: 'text-blue-500',
					bgColor: 'bg-blue-50 dark:bg-blue-950/30',
				},
				{
					title: 'Active',
					value: stats.activeEmployees,
					icon: UserCheck,
					color: 'text-green-500',
					bgColor: 'bg-green-50 dark:bg-green-950/30',
				},
				{
					title: 'On Leave',
					value: stats.onLeaveEmployees,
					icon: UserX,
					color: 'text-amber-500',
					bgColor: 'bg-amber-50 dark:bg-amber-950/30',
				},
				{
					title: 'Admins',
					value: stats.adminCount,
					icon: Shield,
					color: 'text-purple-500',
					bgColor: 'bg-purple-50 dark:bg-purple-950/30',
				},
			]
		: [];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h2 className='text-2xl font-bold text-foreground'>
						Employee Management
					</h2>
					<p className='text-muted-foreground'>
						Manage your team members and their information
					</p>
				</div>
				<Button onClick={() => setFormDialogOpen(true)}>
					<Plus className='w-4 h-4 mr-2' />
					Add Employee
				</Button>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
					{statsCards.map((stat) => (
						<Card key={stat.title} className='border-0 shadow-soft'>
							<CardContent className='p-4'>
								<div className='flex items-center gap-3'>
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<stat.icon className={`w-5 h-5 ${stat.color}`} />
									</div>
									<div>
										<p className='text-xs text-muted-foreground'>
											{stat.title}
										</p>
										<p className='text-xl font-bold text-foreground'>
											{stat.value}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Filters */}
			<Card className='border-0 shadow-soft'>
				<CardContent className='p-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input
								placeholder='Search employees...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='pl-10'
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-full sm:w-36'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Status</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='inactive'>Inactive</SelectItem>
								<SelectItem value='on-leave'>On Leave</SelectItem>
							</SelectContent>
						</Select>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className='w-full sm:w-32'>
								<SelectValue placeholder='Role' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Roles</SelectItem>
								<SelectItem value='admin'>Admin</SelectItem>
								<SelectItem value='employee'>Employee</SelectItem>
							</SelectContent>
						</Select>
						{departments.length > 0 && (
							<Select
								value={departmentFilter}
								onValueChange={setDepartmentFilter}
							>
								<SelectTrigger className='w-full sm:w-40'>
									<SelectValue placeholder='Department' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Departments</SelectItem>
									{departments.map((dept) => (
										<SelectItem key={dept} value={dept}>
											{dept}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Employees List */}
			<Card className='border-0 shadow-soft'>
				<CardHeader className='pb-3'>
					<CardTitle className='text-lg'>
						Employees ({pagination.total})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader className='w-8 h-8 animate-spin text-primary' />
						</div>
					) : employees.length === 0 ? (
						<div className='text-center py-12'>
							<Users className='w-12 h-12 mx-auto text-muted-foreground/50 mb-4' />
							<p className='text-muted-foreground'>No employees found</p>
							<Button
								variant='outline'
								className='mt-4'
								onClick={() => setFormDialogOpen(true)}
							>
								<Plus className='w-4 h-4 mr-2' />
								Add your first employee
							</Button>
						</div>
					) : (
						<>
							<div className='grid gap-4'>
								{employees.map((employee) => (
									<div
										key={employee._id}
										className='flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors gap-4'
									>
										<div className='flex items-start gap-4'>
											<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
												<span className='text-lg font-bold text-primary'>
													{employee.name.charAt(0).toUpperCase()}
												</span>
											</div>
											<div className='min-w-0'>
												<div className='flex items-center gap-2 flex-wrap'>
													<h4 className='font-semibold text-foreground'>
														{employee.name}
													</h4>
													<Badge
														className={`${roleColors[employee.role]} border-0 text-xs`}
													>
														{employee.role}
													</Badge>
													<Badge
														className={`${statusColors[employee.status]} border-0 text-xs`}
													>
														{employee.status.replace('-', ' ')}
													</Badge>
												</div>
												<p className='text-sm text-muted-foreground mt-0.5'>
													{employee.position}
													{employee.department && ` • ${employee.department}`}
												</p>
												<div className='flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground'>
													<span className='flex items-center gap-1'>
														<Mail className='w-3.5 h-3.5' />
														{employee.email}
													</span>
													<span className='flex items-center gap-1'>
														<Phone className='w-3.5 h-3.5' />
														{employee.phone}
													</span>
													{employee.salary && (
														<span className='flex items-center gap-1'>
															<DollarSign className='w-3.5 h-3.5' />
															{formatCurrency(employee.salary)}
														</span>
													)}
													{employee.joinDate && (
														<span className='flex items-center gap-1'>
															<Calendar className='w-3.5 h-3.5' />
															{formatDate(employee.joinDate)}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className='flex items-center gap-2 sm:shrink-0'>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => handleEdit(employee)}
											>
												<Edit2 className='w-4 h-4' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => handleDelete(employee._id)}
											>
												<Trash2 className='w-4 h-4 text-destructive' />
											</Button>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							{pagination.pages > 1 && (
								<div className='flex items-center justify-between mt-6 pt-4 border-t border-border'>
									<p className='text-sm text-muted-foreground'>
										Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
										{Math.min(
											pagination.page * pagination.limit,
											pagination.total,
										)}{' '}
										of {pagination.total}
									</p>
									<div className='flex gap-2'>
										<Button
											variant='outline'
											size='sm'
											disabled={pagination.page === 1}
											onClick={() =>
												setPagination((prev) => ({
													...prev,
													page: prev.page - 1,
												}))
											}
										>
											Previous
										</Button>
										<Button
											variant='outline'
											size='sm'
											disabled={pagination.page === pagination.pages}
											onClick={() =>
												setPagination((prev) => ({
													...prev,
													page: prev.page + 1,
												}))
											}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Employee Form Dialog */}
			<EmployeeFormDialog
				open={formDialogOpen}
				onOpenChange={(open: any) => {
					setFormDialogOpen(open);
					if (!open) setEditingEmployee(null);
				}}
				employee={editingEmployee}
				onSuccess={handleFormSuccess}
			/>
		</div>
	);
}
