import { z } from 'zod';

export const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  longDescription: z.string().optional(),
  duration: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  process: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional().default([]),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
