'use client';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/lib/auth/AuthContext';
import { LogOut, Menu, Settings, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navLinks = [
	{ name: 'Home', href: '/' },
	{ name: 'Packages', href: '/packages' },
	{ name: 'Visa Services', href: '/visa' },
	{ name: 'Book Appointment', href: '/appointment' },
	{ name: 'Blog', href: '/blog' },
	{ name: 'Contact', href: '/contact' },
];

export function AdminNavbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Logged out successfully');
		} catch (error) {
			console.error('Logout error:', error);
			toast.error('Logout failed');
		}
	};

	return (
		<nav className='fixed top-0 left-0 right-0 z-10 py-1 bg-card/80 backdrop-blur-lg border-b border-border'>
			<div className='container ml-auto px-4'>
				<div className='flex items-center justify-between h-20'>
					<div></div>
					<div className='flex items-center gap-3 justify-end'>
						{user && (
							<>
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
							</>
						)}
					</div>

					<button
						className='lg:hidden p-2'
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
					>
						{isOpen ? (
							<X className='w-6 h-6 text-foreground' />
						) : (
							<Menu className='w-6 h-6 text-foreground' />
						)}
					</button>
				</div>
			</div>

			{isOpen && (
				<div className='lg:hidden bg-card border-t border-border'>
					<div className='container mx-auto px-4 py-6 space-y-4'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className={`block font-body text-base font-medium transition-colors hover:text-primary ${
									location.pathname === link.href
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								{link.name}
							</Link>
						))}
						<div className='flex flex-col gap-3 pt-4'>
							{user && (
								<>
									<Button
										variant='ghost'
										className='w-full'
										onClick={handleLogout}
									>
										<LogOut className='w-4 h-4' />
										Logout
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
