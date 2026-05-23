import { z } from 'zod';

export const packageSchema = z.object({
  id: z
    .string()
    .min(1, 'Package ID is required')
    .regex(/^[a-z0-9-]+$/, 'ID must be lowercase letters, numbers, and hyphens only'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location cannot exceed 100 characters'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be a positive number'),
  duration: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  groupSize: z.string().optional(),
  rating: z
    .number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5')
    .optional()
    .default(4.5),
  highlights: z.array(z.string()).optional().default([]),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional().default([]),
});

export type PackageFormData = z.infer<typeof packageSchema>;
