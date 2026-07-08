import * as yup from 'yup';

// Client validation schema
export const clientValidationSchema = yup.object().shape({
	name: yup
		.string()
		.required('Client name is required')
		.max(100, 'Name cannot exceed 100 characters'),
	email: yup
		.string()
		.email('Please provide a valid email')
		.required('Email is required'),
	phone: yup
		.string()
		.required('Phone number is required')
		.min(10, 'Phone number must be at least 10 digits'),
	address: yup.string().optional(),
	company: yup.string().optional(),
	profession: yup.string().optional(),
	notes: yup.string().optional(),
	status: yup
		.string()
		.oneOf(['active', 'inactive', 'prospect', 'vip'], 'Invalid status'),
	tags: yup.array().of(yup.string()).optional(),
});

// Daily Service validation schema
export const dailyServiceValidationSchema = yup.object().shape({
	linkedClientId: yup
		.string()
		.required('Client ID is required'),
	assignedEmployeeId: yup.string().optional(),
	serviceTitle: yup
		.string()
		.required('Service title is required')
		.max(150, 'Service title cannot exceed 150 characters'),
	serviceDescription: yup.string().optional(),
	serviceCost: yup
		.number()
		.required('Service cost is required')
		.min(0, 'Service cost cannot be negative'),
	serviceStatus: yup
		.string()
		.oneOf(
			['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'],
			'Invalid service status'
		),
	notes: yup.string().optional(),
});

// Transaction validation schema
export const transactionValidationSchema = yup.object().shape({
	clientId: yup
		.string()
		.required('Client ID is required'),
	type: yup
		.string()
		.oneOf(
			['service', 'package', 'payment', 'refund', 'adjustment'],
			'Invalid transaction type'
		)
		.required('Transaction type is required'),
	description: yup
		.string()
		.required('Description is required'),
	amount: yup
		.number()
		.required('Amount is required')
		.min(0, 'Amount cannot be negative'),
	status: yup
		.string()
		.oneOf(
			['pending', 'completed', 'cancelled', 'partial', 'failed', 'refunded'],
			'Invalid transaction status'
		),
	paymentMethod: yup
		.string()
		.oneOf(
			['cash', 'check', 'bank_transfer', 'card', 'other'],
			'Invalid payment method'
		)
		.optional(),
	serviceId: yup.string().optional(),
	dailyServiceId: yup.string().optional(),
	packageId: yup.string().optional(),
	notes: yup.string().optional(),
});

// Invoice validation schema
export const invoiceValidationSchema = yup.object().shape({
	clientId: yup
		.string()
		.required('Client ID is required'),
	invoiceNumber: yup
		.string()
		.required('Invoice number is required'),
	amount: yup
		.number()
		.required('Amount is required')
		.min(0, 'Amount cannot be negative'),
	paymentMethod: yup
		.string()
		.oneOf(
			['cash', 'check', 'bank_transfer', 'card', 'other'],
			'Invalid payment method'
		)
		.required('Payment method is required'),
	transactionStatus: yup
		.string()
		.oneOf(
			['paid', 'pending', 'partial', 'failed', 'refunded'],
			'Invalid transaction status'
		)
		.required('Transaction status is required'),
	description: yup.string().optional(),
	notes: yup.string().optional(),
});

// Search/Filter validation schema
export const searchValidationSchema = yup.object().shape({
	query: yup.string().optional(),
	status: yup.string().optional(),
	page: yup
		.number()
		.optional()
		.min(1, 'Page must be at least 1'),
	limit: yup
		.number()
		.optional()
		.min(1, 'Limit must be at least 1')
		.max(100, 'Limit cannot exceed 100'),
	sortBy: yup.string().optional(),
	sortOrder: yup
		.string()
		.oneOf(['asc', 'desc'], 'Sort order must be asc or desc')
		.optional(),
});
