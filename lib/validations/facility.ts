import * as z from 'zod';

export const addFacilitySchema = z.object({
  name: z
    .string()
    .min(2, 'Facility name must be at least 2 characters')
    .max(100, 'Facility name must be less than 100 characters'),
  type: z.enum([
    'worship',
    'fellowship',
    'education',
    'service',
    'recreation',
    'technical',
    'utility',
  ]),
  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(10_000, 'Capacity seems too high')
    .optional(),
  status: z.enum([
    'available',
    'occupied',
    'maintenance',
    'unavailable',
    'reserved',
  ]),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  features: z.array(z.string()).optional(),
  accessibility: z.boolean().optional(),
  bookingRequired: z.boolean().optional(),
  maintenanceSchedule: z
    .enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually'])
    .optional(),
  lastMaintenance: z.date().optional(),
  nextMaintenance: z.date().optional(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  branchId: z.string().optional(),
});

export type AddFacilityPayload = z.infer<typeof addFacilitySchema>;
