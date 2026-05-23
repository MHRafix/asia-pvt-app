import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s-()]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
