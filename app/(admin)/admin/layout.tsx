'use client';

import { AdminNavbar } from '@/components/admin/common/AdminNavbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';
import {
	ArrowLeft,
	Calendar,
	FileText,
	Globe,
	LayoutDashboard,
	Loader,
	LogOut,
	Mail,
	Menu,
	Package,
	Settings,
	User,
	UserCog,
	Users,
	Wrench,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const navItems = [
	{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
	{ label: 'CRM', href: '/admin/crm', icon: Users },
	{ label: 'Employees', href: '/admin/employees', icon: UserCog },
	{ label: 'Packages', href: '/admin/packages', icon: Package },
	{ label: 'Services', href: '/admin/services', icon: Wrench },
	{ label: 'Blog', href: '/admin/blog', icon: FileText },
	{ label: 'Visa Countries', href: '/admin/visa', icon: Globe },
	{ label: 'Appointments', href: '/admin/appointments', icon: Calendar },
	{ label: 'Messages', href: '/admin/contacts', icon: Mail },
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { logout, user, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		if (!isLoading && (!user || user.role !== 'admin')) {
			router.push('/');
		}
	}, [user, isLoading, router]);

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Logged out successfully');
		} catch (error) {
			console.error('Logout error:', error);
			toast.error('Logout failed');
		}
	};

	useEffect(() => {
		setSidebarOpen(false);
	}, [pathname]);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Loader className='w-8 h-8 animate-spin' />
			</div>
		);
	}

	if (!user || user.role !== 'admin') {
		return null;
	}

	return (
		<div className='min-h-screen bg-background'>
			{/* Mobile Header */}
			<div className='lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3'>
				<div className='flex items-center justify-between'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						{sidebarOpen ? (
							<X className='w-5 h-5' />
						) : (
							<Menu className='w-5 h-5' />
						)}
					</Button>
					{user && (
						<div className='flex gap-2 items-center'>
							<Link href='/admin/profile'>
								<div className='flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer'>
									<User className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm text-muted-foreground'>
										{user.name}
									</span>
								</div>
							</Link>
							<Link href='/admin/profile'>
								<Button variant='ghost' size='icon'>
									<Settings className='w-4 h-4' />
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className='lg:hidden fixed inset-0 bg-black/50 z-40'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0',
					sidebarOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<div className='flex flex-col h-full'>
					{/* Sidebar Header */}
					<div className='p-6 border-b border-border'>
						<Link href='/admin' className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-xl bg-primary flex items-center justify-center'>
								<LayoutDashboard className='w-5 h-5 text-primary-foreground' />
							</div>
							<div>
								<h2 className='font-bold text-foreground'>Admin Panel</h2>
								<p className='text-xs text-muted-foreground'>
									Travel Management
								</p>
							</div>
						</Link>
					</div>

					{/* Navigation */}
					<nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link key={item.href} href={item.href}>
									<div
										className={cn(
											'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
											isActive
												? 'bg-primary text-primary-foreground shadow-md'
												: 'text-muted-foreground hover:bg-muted hover:text-foreground',
										)}
									>
										<item.icon className='w-5 h-5' />
										<span className='font-medium'>{item.label}</span>
									</div>
								</Link>
							);
						})}
					</nav>

					<div className='p-4 space-y-1'>
						{user?.role === 'admin' && (
							<Button
								variant='ghost'
								size='sm'
								className='w-full text-left justify-start'
								onClick={() => router.push('/')}
							>
								<ArrowLeft className='w-4 h-4' />
								Back to site
							</Button>
						)}

						<Button
							variant='destructive'
							className='w-full text-left justify-start'
							size='sm'
							onClick={handleLogout}
						>
							<LogOut className='w-4 h-4' />
							Logout
						</Button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className='lg:ml-64 min-h-screen pt-16 lg:pt-0'>
				<AdminNavbar />

				<div className='p-6 lg:p-8'>
					<br /> <br /> {children}
				</div>
			</main>
		</div>
	);
}
