import { AuthProvider } from '@/lib/auth/AuthContext';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import './globals.css';

export const metadata: Metadata = {
	title: 'Asia Tours - Explore the World',
	description:
		'Discover and book amazing travel packages to destinations around the world',
	generator: '',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='bg-background'>
			<head>
				<Script id='gtm' strategy='afterInteractive'>
					{`
           (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://asia.asiapvt.com/5bzvrbnni.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','b75h=AApTJSY7VyxaVy0lIjQsRB9TXExDUB4MVA8dCxMGDBZHDQEP');
          `}
				</Script>
			</head>
			<body className='font-sans antialiased'>
				<noscript>
					<iframe
						src='https://asia.asiapvt.com/ns.html?id=GTM-N39CGPBV'
						height='0'
						width='0'
						style={{ display: 'none', visibility: 'hidden' }}
					></iframe>
				</noscript>
				<AuthProvider>
					<ToastContainer />
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}
