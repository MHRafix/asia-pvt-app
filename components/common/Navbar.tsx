'use client';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/lib/auth/AuthContext';
import {
	ArrowRight,
	LayoutGrid,
	LogOut,
	Menu,
	Plane,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Logged out successfully');
		} catch (error) {
			console.error('[v0] Logout error:', error);
			toast.error('Logout failed');
		}
	};

	return (
		<nav className='fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-20'>
					<Link href='/' className='flex items-center gap-2'>
						<div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center'>
							<Plane className='w-5 h-5 text-primary-foreground' />
						</div>
						<span className='font-display text-2xl font-semibold text-foreground'>
							Asia Tours
						</span>
					</Link>

					<div className='hidden lg:flex items-center gap-8'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`font-body text-sm font-medium transition-colors hover:text-primary ${
									pathname === link.href
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								{link.name}
							</Link>
						))}
					</div>

					<div className='hidden lg:flex items-center gap-3'>
						{user ? (
							<>
								<div className='flex items-center gap-2 px-3 py-2 bg-muted rounded-lg'>
									<User className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm text-muted-foreground'>
										{user.name}
									</span>
								</div>
								<Button variant='ghost' size='sm' onClick={handleLogout}>
									<LogOut className='w-4 h-4' />
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => router.push('/login')}
								>
									<User className='w-4 h-4' />
									Login
								</Button>
								<Button
									variant='coral'
									size='lg'
									onClick={() => router.push('/signup')}
								>
									Sign Up
								</Button>
							</>
						)}
						<Button
							variant='coral'
							size='lg'
							onClick={() => router.push('/appointment')}
						>
							Book Now
						</Button>
						{user?.role === 'admin' && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => router.push('/admin')}
							>
								<LayoutGrid className='w-4 h-4' />
								Dashboard
								<ArrowRight className='w-4 h-4' />
							</Button>
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
							{user ? (
								<>
									<Button
										variant='ghost'
										className='w-full'
										onClick={handleLogout}
									>
										<LogOut className='w-4 h-4' />
										Logout
									</Button>{' '}
									{user?.role === 'admin' && (
										<Button
											variant='ghost'
											size='sm'
											onClick={() => router.push('/admin')}
										>
											<LayoutGrid className='w-4 h-4' />
											Dashboard
											<ArrowRight className='w-4 h-4' />
										</Button>
									)}
								</>
							) : (
								<>
									<Button
										variant='ghost'
										className='w-full'
										onClick={() => {
											router.push('/login');
											setIsOpen(false);
										}}
									>
										<User className='w-4 h-4' />
										Login
									</Button>
									<Button
										variant='coral'
										className='w-full'
										onClick={() => {
											router.push('/signup');
											setIsOpen(false);
										}}
									>
										Sign Up
									</Button>
								</>
							)}
							<Button
								variant='coral'
								className='w-full'
								onClick={() => {
									router.push('/appointment');
									setIsOpen(false);
								}}
							>
								Book Now
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
