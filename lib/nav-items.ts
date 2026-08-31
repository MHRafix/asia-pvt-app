import {
	Blocks,
	Calendar,
	CircleGauge,
	Combine,
	FileText,
	Globe,
	Grid2X2Check,
	Grid2X2Plus,
	Mail,
	Notebook,
	Repeat2,
	UserCog,
	UserPlus2,
	Users,
} from 'lucide-react';

export const navItemsForAdmin = [
	{ label: 'Dashboard', href: '/dashboard', icon: CircleGauge },
	{
		label: 'CRM',
		href: '/dashboard/crm',
		icon: Users,
		submenu: [
			{ label: 'CRM Dashboard', href: '/dashboard/crm', icon: Grid2X2Plus },
			{ label: 'Clients', href: '/dashboard/crm/clients', icon: UserPlus2 },
			{
				label: 'Daily Services',
				href: '/dashboard/crm/daily-services',
				icon: Grid2X2Check,
			},
			{ label: 'Invoices', href: '/dashboard/crm/invoices', icon: Notebook },
			{
				label: 'Transactions',
				href: '/dashboard/crm/transactions',
				icon: Repeat2,
			},
		],
	},
	{ label: 'Employees', href: '/dashboard/employees', icon: UserCog },
	{ label: 'Users', href: '/dashboard/users', icon: Users },
	{ label: 'Packages', href: '/dashboard/packages', icon: Blocks },
	{ label: 'Services', href: '/dashboard/services', icon: Combine },
	{ label: 'Blog', href: '/dashboard/blog', icon: FileText },
	{ label: 'Visa Countries', href: '/dashboard/visa', icon: Globe },
	{ label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
	{ label: 'Messages', href: '/dashboard/contacts', icon: Mail },
];

export const navItemsForEmployee = [
	{
		label: 'CRM',
		href: '/dashboard/crm',
		icon: Users,
		submenu: [
			{ label: 'CRM Dashboard', href: '/dashboard/crm', icon: Grid2X2Plus },
			{
				label: 'Daily Services',
				href: '/dashboard/crm/daily-services',
				icon: Grid2X2Check,
			},
			{ label: 'Invoices', href: '/dashboard/crm/invoices', icon: Notebook },
			{
				label: 'Transactions',
				href: '/dashboard/crm/transactions',
				icon: Repeat2,
			},
		],
	},
	{ label: 'Packages', href: '/dashboard/packages', icon: Blocks },
	{ label: 'Services', href: '/dashboard/services', icon: Combine },
	{ label: 'Blog', href: '/dashboard/blog', icon: FileText },
	{ label: 'Visa Countries', href: '/dashboard/visa', icon: Globe },
];

export const navItemsForModerator = [
	{
		label: 'CRM',
		href: '/dashboard/crm',
		icon: Users,
		submenu: [
			{ label: 'CRM Dashboard', href: '/dashboard/crm', icon: Grid2X2Plus },
			// { label: 'Clients', href: '/dashboard/crm/clients', icon: UserPlus2 },
			{
				label: 'Daily Services',
				href: '/dashboard/crm/daily-services',
				icon: Grid2X2Check,
			},
			{ label: 'Invoices', href: '/dashboard/crm/invoices', icon: Notebook },
			{
				label: 'Transactions',
				href: '/dashboard/crm/transactions',
				icon: Repeat2,
			},
		],
	},
	{ label: 'Packages', href: '/dashboard/packages', icon: Blocks },
	{ label: 'Services', href: '/dashboard/services', icon: Combine },
	{ label: 'Blog', href: '/dashboard/blog', icon: FileText },
	{ label: 'Visa Countries', href: '/dashboard/visa', icon: Globe },
	{ label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
	{ label: 'Messages', href: '/dashboard/contacts', icon: Mail },
];
