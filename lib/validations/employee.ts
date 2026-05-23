import { z } from 'zod';

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, 'Employee name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number'),
  role: z.enum(['admin', 'employee']).default('employee'),
  department: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  salary: z
    .number({ invalid_type_error: 'Salary must be a number' })
    .min(0, 'Salary must be a positive number')
    .optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).default('active'),
  joinDate: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export const employeeUpdateSchema = employeeSchema.partial();

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;
