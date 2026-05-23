import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar /> <br />
			<br />
			{children}
			<Footer />
			<Toaster position='top-right' />
			{process.env.NODE_ENV === 'production' && <Analytics />}
		</>
	);
}
