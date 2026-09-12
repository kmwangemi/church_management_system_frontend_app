import * as z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const addActivitySchema = z.object({
  date: z.string().min(1, 'Activity date is required'),
  activity: z
    .string()
    .min(3, 'Activity name must be at least 3 characters')
    .max(200, 'Activity name must be less than 200 characters'),
  participants: z
    .string()
    .min(1, 'Participants is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Participants must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 10_000;
      },
      {
        message: 'Participants must be between 1 and 10,000 minutes',
      }
    ),
  type: z.enum([
    'service',
    'meeting',
    'event',
    'program',
    'ministry',
    'social',
    'outreach',
  ]),
  status: z.enum(['planned', 'ongoing', 'completed', 'cancelled', 'postponed']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z
    .string()
    .min(5, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters'),
  facilitator: z.string().optional(),
  budget: z
    .string()
    .min(1, 'Budget number is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Budget number must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 1_000_000;
      },
      {
        message: 'Budget number must be between 1 and 1,000,000',
      }
    ),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  branchId: z.string().optional(),
});

export type AddActivityPayload = z.infer<typeof addActivitySchema>;
