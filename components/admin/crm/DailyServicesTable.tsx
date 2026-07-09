'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, FileText, Loader } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { formatCurrency, formatDateOnly, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';

interface DailyService {
	_id: string;
	serviceId: string;
	serviceTitle: string;
	serviceCost: number;
	serviceStatus: string;
	linkedClientId?: {
		_id: string;
		name: string;
	};
	createdDate: string;
	invoiceId?: string;
}

interface DailyServicesTableProps {
	services: DailyService[];
	onEdit: (service: DailyService) => void;
	onRefresh: () => void;
}

export default function DailyServicesTable({
	services,
	onEdit,
	onRefresh,
}: DailyServicesTableProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null);

	const handleDelete = async () => {
		if (!deleteId) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/crm/daily-services/${deleteId}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Service deleted successfully');
				onRefresh();
			} else {
				toast.error(result.error || 'Failed to delete service');
			}
		} catch (error) {
			console.error('Error deleting service:', error);
			toast.error('Failed to delete service');
		} finally {
			setIsDeleting(false);
			setDeleteId(null);
		}
	};

	const handleGenerateInvoice = async (serviceId: string) => {
		setGeneratingInvoiceId(serviceId);
		try {
			const response = await fetch('/api/payment/invoices/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ serviceId }),
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Invoice generated successfully');
				onRefresh();
			} else {
				toast.error(result.error || 'Failed to generate invoice');
			}
		} catch (error) {
			console.error('Error generating invoice:', error);
			toast.error('Failed to generate invoice');
		} finally {
			setGeneratingInvoiceId(null);
		}
	};

	return (
		<>
			<div className='border rounded-lg overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted'>
								<TableHead>Service ID</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Client</TableHead>
								<TableHead>Cost</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
								<TableHead className='text-right w-32'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{services.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
									No services found
								</TableCell>
							</TableRow>
						) : (
							services.map((service) => (
								<TableRow key={service._id} className='hover:bg-muted/50'>
									<TableCell className='font-mono text-sm font-semibold'>
										{service.serviceId}
									</TableCell>
									<TableCell>
										<div className='max-w-xs truncate'>{service.serviceTitle}</div>
									</TableCell>
									<TableCell>
										{service.linkedClientId?.name || 'N/A'}
									</TableCell>
									<TableCell className='font-semibold'>
										{formatCurrency(service.serviceCost)}
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(service.serviceStatus as any)}>
											{getStatusLabel(service.serviceStatus as any)}
										</Badge>
									</TableCell>
									<TableCell className='text-sm text-muted-foreground'>
										{formatDateOnly(new Date(service.createdDate))}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex justify-end gap-1'>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleGenerateInvoice(service._id)}
												disabled={generatingInvoiceId === service._id}
												title='Generate Invoice'
											>
												{generatingInvoiceId === service._id ? (
													<Loader className='w-4 h-4 animate-spin' />
												) : (
													<FileText className='w-4 h-4' />
												)}
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onEdit(service)}
											>
												<Edit className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => setDeleteId(service._id)}
											>
												<Trash2 className='w-4 h-4 text-red-500' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Service</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this service? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className='flex justify-end gap-3'>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className='bg-red-600 hover:bg-red-700'
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
