'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ArrowUpRight,
	Calendar,
	Clock,
	FileText,
	Globe,
	Loader,
	Mail,
	Package,
	TrendingUp,
	Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface DashboardData {
	stats: {
		totalPackages: number;
		totalServices: number;
		totalBlogs: number;
		totalVisaCountries: number;
		totalAppointments: number;
		pendingAppointments: number;
		totalContacts: number;
		newMessages: number;
	};
	recentPackages: Array<{
		_id: string;
		title: string;
		location: string;
		price: number;
		rating: number;
	}>;
	recentBlogs: Array<{
		_id: string;
		title: string;
		category: string;
		author: string;
		date: string;
	}>;
	recentAppointments: Array<{
		_id: string;
		name?: string;
		fullName?: string;
		service: string;
		date?: string;
		preferredDate?: string;
		status: string;
	}>;
	packagesByLocation: Array<{ name: string; value: number }>;
	appointmentsByStatus: Array<{ name: string; value: number }>;
	monthlyData: Array<{ name: string; appointments: number; contacts: number }>;
}

const COLORS = [
	'#f97316',
	'#3b82f6',
	'#22c55e',
	'#eab308',
	'#ef4444',
	'#8b5cf6',
];

const statusColors: Record<string, string> = {
	pending:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
	confirmed:
		'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
	completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
	cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
};

export default function Dashboard() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/dashboard/stats');
			const result = await response.json();
			if (result.success) {
				setData(result.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching dashboard data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<Loader className='w-8 h-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!data) {
		return (
			<div className='text-center py-12'>
				<p className='text-muted-foreground'>Failed to load dashboard data</p>
			</div>
		);
	}

	const statsCards = [
		{
			title: 'Travel Packages',
			value: data.stats.totalPackages,
			icon: Package,
			color: 'text-orange-500',
			bgColor: 'bg-orange-50 dark:bg-orange-950/30',
			href: '/admin/packages',
		},
		{
			title: 'Services',
			value: data.stats.totalServices,
			icon: Wrench,
			color: 'text-blue-500',
			bgColor: 'bg-blue-50 dark:bg-blue-950/30',
			href: '/admin/services',
		},
		{
			title: 'Blog Posts',
			value: data.stats.totalBlogs,
			icon: FileText,
			color: 'text-purple-500',
			bgColor: 'bg-purple-50 dark:bg-purple-950/30',
			href: '/admin/blog',
		},
		{
			title: 'Visa Countries',
			value: data.stats.totalVisaCountries,
			icon: Globe,
			color: 'text-green-500',
			bgColor: 'bg-green-50 dark:bg-green-950/30',
			href: '/admin/visa',
		},
		{
			title: 'Appointments',
			value: data.stats.totalAppointments,
			icon: Calendar,
			color: 'text-cyan-500',
			bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
			href: '/admin/appointments',
			badge:
				data.stats.pendingAppointments > 0
					? `${data.stats.pendingAppointments} pending`
					: undefined,
		},
		{
			title: 'Messages',
			value: data.stats.totalContacts,
			icon: Mail,
			color: 'text-pink-500',
			bgColor: 'bg-pink-50 dark:bg-pink-950/30',
			href: '/admin/contacts',
			badge:
				data.stats.newMessages > 0
					? `${data.stats.newMessages} new`
					: undefined,
		},
	];

	return (
		<div className='space-y-8'>
			{/* Welcome Section */}
			<div className='flex flex-col gap-2'>
				<h2 className='text-2xl font-bold text-foreground'>
					Dashboard Overview
				</h2>
				<p className='text-muted-foreground'>
					Welcome back! Here&apos;s what&apos;s happening with your travel
					business.
				</p>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
				{statsCards.map((stat) => (
					<Link key={stat.title} href={stat.href}>
						<Card className='group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-soft h-full'>
							<CardContent className='p-5'>
								<div className='flex items-start justify-between'>
									<div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
										<stat.icon className={`w-5 h-5 ${stat.color}`} />
									</div>
									<ArrowUpRight className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
								<div className='mt-4'>
									<p className='text-3xl font-bold text-foreground'>
										{stat.value}
									</p>
									<div className='flex items-center gap-2 mt-1'>
										<p className='text-sm text-muted-foreground'>
											{stat.title}
										</p>
										{stat.badge && (
											<Badge
												variant='secondary'
												className='text-xs px-1.5 py-0.5'
											>
												{stat.badge}
											</Badge>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Charts Section */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Monthly Activity Chart */}
				<Card className='border-0 shadow-soft'>
					<CardHeader className='pb-2'>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg font-semibold'>
								Monthly Activity
							</CardTitle>
							<TrendingUp className='w-5 h-5 text-muted-foreground' />
						</div>
					</CardHeader>
					<CardContent className='pt-4'>
						<div className='h-[280px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<AreaChart data={data.monthlyData}>
									<defs>
										<linearGradient
											id='colorAppointments'
											x1='0'
											y1='0'
											x2='0'
											y2='1'
										>
											<stop offset='5%' stopColor='#f97316' stopOpacity={0.3} />
											<stop offset='95%' stopColor='#f97316' stopOpacity={0} />
										</linearGradient>
										<linearGradient
											id='colorContacts'
											x1='0'
											y1='0'
											x2='0'
											y2='1'
										>
											<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
											<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray='3 3'
										stroke='hsl(var(--border))'
									/>
									<XAxis
										dataKey='name'
										tick={{ fontSize: 12 }}
										stroke='hsl(var(--muted-foreground))'
									/>
									<YAxis
										tick={{ fontSize: 12 }}
										stroke='hsl(var(--muted-foreground))'
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: 'hsl(var(--card))',
											border: '1px solid hsl(var(--border))',
											borderRadius: '8px',
										}}
									/>
									<Area
										type='monotone'
										dataKey='appointments'
										stroke='#f97316'
										strokeWidth={2}
										fillOpacity={1}
										fill='url(#colorAppointments)'
										name='Appointments'
									/>
									<Area
										type='monotone'
										dataKey='contacts'
										stroke='#3b82f6'
										strokeWidth={2}
										fillOpacity={1}
										fill='url(#colorContacts)'
										name='Messages'
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<div className='flex items-center justify-center gap-6 mt-4'>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-orange-500' />
								<span className='text-sm text-muted-foreground'>
									Appointments
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-blue-500' />
								<span className='text-sm text-muted-foreground'>Messages</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Distribution Charts */}
				<div className='grid grid-rows-2 gap-6'>
					{/* Packages by Location */}
					<Card className='border-0 shadow-soft'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg font-semibold'>
								Packages by Location
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-0'>
							<div className='h-[120px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={data.packagesByLocation} layout='vertical'>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='hsl(var(--border))'
										/>
										<XAxis
											type='number'
											tick={{ fontSize: 11 }}
											stroke='hsl(var(--muted-foreground))'
										/>
										<YAxis
											type='category'
											dataKey='name'
											tick={{ fontSize: 11 }}
											stroke='hsl(var(--muted-foreground))'
											width={70}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: 'hsl(var(--card))',
												border: '1px solid hsl(var(--border))',
												borderRadius: '8px',
											}}
										/>
										<Bar
											dataKey='value'
											fill='#f97316'
											radius={[0, 4, 4, 0]}
											name='Packages'
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>

					{/* Appointment Status */}
					<Card className='border-0 shadow-soft'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-lg font-semibold'>
								Appointment Status
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-0'>
							<div className='flex items-center gap-6'>
								<div className='w-[120px] h-[120px]'>
									<ResponsiveContainer width='100%' height='100%'>
										<PieChart>
											<Pie
												data={data.appointmentsByStatus}
												cx='50%'
												cy='50%'
												innerRadius={35}
												outerRadius={55}
												paddingAngle={2}
												dataKey='value'
											>
												{data.appointmentsByStatus.map((_, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor: 'hsl(var(--card))',
													border: '1px solid hsl(var(--border))',
													borderRadius: '8px',
												}}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className='flex flex-wrap gap-3'>
									{data.appointmentsByStatus.map((item, index) => (
										<div key={item.name} className='flex items-center gap-2'>
											<div
												className='w-2.5 h-2.5 rounded-full'
												style={{
													backgroundColor: COLORS[index % COLORS.length],
												}}
											/>
											<span className='text-xs text-muted-foreground capitalize'>
												{item.name}: {item.value}
											</span>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Activity Section */}
			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Recent Packages */}
				<Card className='border-0 shadow-soft w-full min-w-0'>
					<CardHeader className='pb-3'>
						<div className='flex items-center justify-between gap-3 min-w-0'>
							<CardTitle className='text-lg font-semibold truncate'>
								Recent Packages
							</CardTitle>

							<Link
								href='/admin/packages'
								className='text-sm text-primary hover:underline flex items-center gap-1 shrink-0'
							>
								View all <ArrowUpRight className='w-3 h-3' />
							</Link>
						</div>
					</CardHeader>

					<CardContent className='space-y-4 min-w-0'>
						{data.recentPackages.length === 0 ? (
							<p className='text-sm text-muted-foreground text-center py-4'>
								No packages yet
							</p>
						) : (
							data.recentPackages.map((pkg) => (
								<div
									key={pkg._id}
									className='flex items-center justify-between min-w-0 gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
								>
									<div className='flex-1 min-w-0'>
										<p className='font-medium text-foreground truncate'>
											{pkg.title}
										</p>

										<p className='text-sm text-muted-foreground truncate'>
											{pkg.location}
										</p>
									</div>

									<div className='text-right shrink-0'>
										<p className='font-semibold text-primary'>${pkg.price}</p>

										<p className='text-xs text-muted-foreground flex items-center gap-1 justify-end'>
											<span className='text-yellow-500'>★</span>
											{pkg.rating}
										</p>
									</div>
								</div>
							))
						)}
					</CardContent>
				</Card>

				{/* Recent Blogs */}
				<Card className='border-0 shadow-soft w-full min-w-0'>
					<CardHeader className='pb-3'>
						<div className='flex items-center justify-between gap-3 min-w-0'>
							<CardTitle className='text-lg font-semibold truncate'>
								Recent Blog Posts
							</CardTitle>

							<Link
								href='/admin/blog'
								className='text-sm text-primary hover:underline flex items-center gap-1 shrink-0'
							>
								View all <ArrowUpRight className='w-3 h-3' />
							</Link>
						</div>
					</CardHeader>

					<CardContent className='space-y-4 min-w-0'>
						{data.recentBlogs.length === 0 ? (
							<p className='text-sm text-muted-foreground text-center py-4'>
								No blog posts yet
							</p>
						) : (
							data.recentBlogs.map((post) => (
								<div
									key={post._id}
									className='flex items-center justify-between min-w-0 gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
								>
									<div className='flex-1 min-w-0'>
										<p className='font-medium text-foreground truncate'>
											{post.title}
										</p>

										<p className='text-sm text-muted-foreground truncate'>
											{post.author}
										</p>
									</div>

									<Badge
										variant='outline'
										className='ml-2 shrink-0 max-w-[120px] truncate'
									>
										{post.category}
									</Badge>
								</div>
							))
						)}
					</CardContent>
				</Card>

				{/* Recent Appointments */}
				<Card className='border-0 shadow-soft w-full min-w-0'>
					<CardHeader className='pb-3'>
						<div className='flex items-center justify-between gap-3 min-w-0'>
							<CardTitle className='text-lg font-semibold truncate'>
								Recent Appointments
							</CardTitle>

							<Link
								href='/admin/appointments'
								className='text-sm text-primary hover:underline flex items-center gap-1 shrink-0'
							>
								View all <ArrowUpRight className='w-3 h-3' />
							</Link>
						</div>
					</CardHeader>

					<CardContent className='space-y-4 min-w-0'>
						{data.recentAppointments.length === 0 ? (
							<p className='text-sm text-muted-foreground text-center py-4'>
								No appointments yet
							</p>
						) : (
							data.recentAppointments.map((apt) => (
								<div
									key={apt._id}
									className='flex items-center justify-between min-w-0 gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
								>
									<div className='flex-1 min-w-0'>
										<p className='font-medium text-foreground truncate'>
											{apt.fullName || apt.name}
										</p>

										<p className='text-sm text-muted-foreground flex items-center gap-1 truncate'>
											<Clock className='w-3 h-3 shrink-0' />
											<span className='truncate'>{apt.service}</span>
										</p>
									</div>

									<Badge
										className={`ml-2 shrink-0 max-w-[120px] truncate border-0 ${
											statusColors[apt.status] || ''
										}`}
									>
										{apt.status}
									</Badge>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</div>
			{/* Quick Actions */}
			<Card className='border-0 shadow-soft'>
				<CardHeader>
					<CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{[
							{
								label: 'Add Package',
								href: '/admin/packages',
								icon: Package,
								color: 'bg-orange-500',
							},
							{
								label: 'Add Service',
								href: '/admin/services',
								icon: Wrench,
								color: 'bg-blue-500',
							},
							{
								label: 'New Blog',
								href: '/admin/blog',
								icon: FileText,
								color: 'bg-purple-500',
							},
							{
								label: 'Add Country',
								href: '/admin/visa',
								icon: Globe,
								color: 'bg-green-500',
							},
							{
								label: 'Bookings',
								href: '/admin/appointments',
								icon: Calendar,
								color: 'bg-cyan-500',
							},
							{
								label: 'Messages',
								href: '/admin/contacts',
								icon: Mail,
								color: 'bg-pink-500',
							},
						].map((action) => (
							<Link key={action.label} href={action.href}>
								<div className='flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group'>
									<div className={`p-3 rounded-xl ${action.color} text-white`}>
										<action.icon className='w-5 h-5' />
									</div>
									<span className='text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors'>
										{action.label}
									</span>
								</div>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
