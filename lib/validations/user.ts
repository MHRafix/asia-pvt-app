import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number'),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[+]?[\d\s-()]+$/).optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
