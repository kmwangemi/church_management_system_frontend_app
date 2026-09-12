import * as z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const addServiceScheduleSchema = z.object({
  day: z.enum([
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]),
  time: z.string().min(1, 'Time is required'),
  service: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(100, 'Service name must be less than 100 characters'),
  attendance: z
    .string()
    .min(1, 'Attendance number is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Attendance number must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 10_000;
      },
      {
        message: 'Attendance number must be between 1 and 10,000',
      }
    ),
  type: z.enum([
    'worship',
    'prayer',
    'bible_study',
    'youth',
    'children',
    'special',
    'fellowship',
  ]),
  duration: z
    .string()
    .min(1, 'Duration is required') // ✅ Changed from 15 to 1
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Duration must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 15 && num <= 480; // ✅ Move the 15 minimum check here
      },
      {
        message: 'Duration must be between 15 and 480 minutes',
      }
    ),
  facilitator: z.string().optional(),
  location: z
    .string()
    .min(5, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters'),
  recurring: z.boolean(),
  isActive: z.boolean(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  branchId: z.string().optional(),
});

export type AddServiceSchedulePayload = z.infer<
  typeof addServiceScheduleSchema
>;
