import { z } from 'zod';

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number'),
  service: z
    .string()
    .min(1, 'Please select a service'),
  preferredDate: z
    .string()
    .min(1, 'Preferred date is required'),
  preferredTime: z
    .string()
    .min(1, 'Preferred time is required'),
  message: z.string().optional(),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'], {
    required_error: 'Status is required',
  }),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type AppointmentStatusFormData = z.infer<typeof appointmentStatusSchema>;
