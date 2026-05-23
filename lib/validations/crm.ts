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
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'prospect', 'vip']).default('prospect'),
  source: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export const clientTransactionSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  type: z.enum(['service', 'package', 'payment', 'refund', 'adjustment']),
  serviceId: z.string().optional(),
  packageId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number({ invalid_type_error: 'Amount must be a number' }),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  notes: z.string().optional(),
});

export const clientActivitySchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  type: z.enum(['note', 'call', 'meeting', 'email', 'other']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type ClientTransactionFormData = z.infer<typeof clientTransactionSchema>;
export type ClientActivityFormData = z.infer<typeof clientActivitySchema>;
