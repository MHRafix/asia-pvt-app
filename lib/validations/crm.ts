import { z } from 'zod';

export const clientSchema = z.object({
	name: z
		.string()
		.min(1, 'Client name is required')
		.max(100, 'Name cannot exceed 100 characters'),
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number'),
	address: z.string().optional(),
	company: z.string().optional(),
	profession: z.string().optional(),
	notes: z.string().optional(),
	status: z.enum(['active', 'inactive', 'prospect', 'vip']).default('prospect'),
	customStatus: z.array(z.string()).optional().default([]),
	source: z.string().optional(),
	tags: z.array(z.string()).optional().default([]),
});

export const clientTransactionSchema = z.object({
	clientId: z.string().min(1, 'Client ID is required'),
	type: z.enum(['service', 'package', 'payment', 'refund', 'adjustment']),
	serviceId: z.string().optional(),
	dailyServiceId: z.string().optional(),
	packageId: z.string().optional(),
	description: z.string().min(1, 'Description is required'),
	amount: z.number({ invalid_type_error: 'Amount must be a number' }),
	status: z
		.enum([
			'pending',
			'completed',
			'cancelled',
			'partial',
			'failed',
			'refunded',
		])
		.default('pending'),
	paymentMethod: z
		.enum(['cash', 'check', 'bank_transfer', 'card', 'other'])
		.optional(),
	notes: z.string().optional(),
});

export const dailyServiceSchema = z.object({
	linkedClientId: z.string().min(1, 'Client ID is required'),
	assignedEmployeeId: z.string().min(1, 'Must have to assign employee'),
	serviceTitle: z
		.string()
		.min(1, 'Service title is required')
		.max(150, 'Service title cannot exceed 150 characters'),
	serviceDescription: z.string().optional(),
	serviceCost: z.number().min(0, 'Service cost cannot be negative'),
	serviceStatus: z
		.enum(['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'])
		.default('pending'),
	notes: z.string().optional(),
	serviceRefId: z.string().min(1, 'Service reference is required'),
});

export const invoiceSchema = z.object({
	clientId: z.string().min(1, 'Client ID is required'),
	linkedServiceId: z.string().optional(),
	linkedTransactionId: z.string().optional(),
	invoiceNumber: z.string().min(1, 'Invoice number is required'),
	subtotal: z.number().min(0, 'Amount cannot be negative'),
	discount: z.number().optional(),
	grandTotal: z.number().optional(),
	paidAmount: z.number().optional(),
	dueAmount: z.number().optional(),
	status: z
		.enum(['paid', 'due', 'partial', 'failed', 'refunded'])
		.default('due'),
});

export const paymentTransactionSchema = z.object({
	transactionId: z.string().min(1, 'Transaction id is required'),
	invoiceId: z.string().min(1, 'Invoice ID is required'),
	clientId: z.string().min(1, 'Client ID is required'),
	type: z
		.enum(['payment', 'refund', 'adjustment', 'credit'])
		.default('payment'),
	amount: z.number().min(0.01, 'Amount must be greater than 0'),
	paymentMethod: z.enum(['cash', 'card', 'bank', 'bkash', 'other']),
	description: z.string().optional(),
	notes: z.string().optional(),
	date: z.string().optional(),
});

export const clientActivitySchema = z.object({
	clientId: z.string().min(1, 'Client ID is required'),
	activityType: z.string().min(1, 'Activity type is required'),
	description: z.string().optional(),
	notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type ClientTransactionFormData = z.infer<typeof clientTransactionSchema>;
export type ClientActivityFormData = z.infer<typeof clientActivitySchema>;
export type DailyServiceFormData = z.infer<typeof dailyServiceSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type PaymentTransactionFormData = z.infer<
	typeof paymentTransactionSchema
>;
