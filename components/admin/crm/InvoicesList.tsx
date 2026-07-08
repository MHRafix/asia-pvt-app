'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceFormDialog from './InvoiceFormDialog';
import InvoicesTable from './InvoicesTable';

interface Invoice {
	_id: string;
	invoiceNumber: string;
	amount: number;
	paymentMethod: string;
	transactionStatus: string;
	clientId?: {
		_id: string;
		name: string;
	};
	paymentDate: string;
}

interface Client {
	_id: string;
	name: string;
}

export default function InvoicesList() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('all');

	const fetchInvoices = async () => {
		setIsLoading(true);
		try {
			const query = new URLSearchParams({
				...(search && { search }),
				...(status !== 'all' && { status }),
				limit: '100',
			});

			const response = await fetch(`/api/crm/invoices?${query}`);
			const result = await response.json();

			if (result.success) {
				setInvoices(result.data);
			} else {
				toast.error(result.error || 'Failed to fetch invoices');
			}
		} catch (error) {
			console.error('Error fetching invoices:', error);
			toast.error('Failed to fetch invoices');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchClients = async () => {
		try {
			const response = await fetch('/api/crm/clients?limit=1000');
			const result = await response.json();

			if (result.success) {
				setClients(result.data);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	useEffect(() => {
		fetchInvoices();
		fetchClients();
	}, [search, status]);

	const handleEdit = (invoice: Invoice) => {
		setSelectedInvoice(invoice);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setSelectedInvoice(null);
	};

	const handleSuccess = () => {
		fetchInvoices();
		handleFormClose();
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold'>Invoices</h1>
					<p className='text-muted-foreground mt-2'>Manage and track all invoices</p>
				</div>
				<Button onClick={() => setIsFormOpen(true)}>
					<Plus className='w-4 h-4 mr-2' />
					New Invoice
				</Button>
			</div>

			<div className='flex gap-4'>
				<Input
					placeholder='Search invoices by number...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='flex-1'
				/>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className='w-40'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Status</SelectItem>
						<SelectItem value='paid'>Paid</SelectItem>
						<SelectItem value='pending'>Pending</SelectItem>
						<SelectItem value='partial'>Partial</SelectItem>
						<SelectItem value='failed'>Failed</SelectItem>
						<SelectItem value='refunded'>Refunded</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-muted-foreground' />
				</div>
			) : (
				<InvoicesTable
					invoices={invoices}
					onEdit={handleEdit}
					onRefresh={fetchInvoices}
				/>
			)}

			<InvoiceFormDialog
				open={isFormOpen}
				onOpenChange={handleFormClose}
				onSuccess={handleSuccess}
				clients={clients}
				invoice={selectedInvoice}
			/>
		</div>
	);
}
