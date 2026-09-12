import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

// Church data schema
export const churchDataSchema = z.object({
  churchName: z.string().min(2, 'Church name must be at least 2 characters'),
  denomination: z.string().min(1, 'Please select a denomination'),
  description: z.string().optional(),
  churchLogoUrl: z.string().optional().or(z.literal('')),
  establishedDate: z
    .string()
    .min(1, 'Please enter establishment date')
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
  email: z.email('Please enter a valid email address'),
  phoneNumber: z.string().min(8, 'Please enter a valid phone number'),
  website: z
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  address: z.object({
    street: z.string().min(5, 'Please enter a street address'),
    country: z.string().min(2, 'Please enter country'),
    city: z.string().min(2, 'Please enter city'),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  subscriptionPlan: z.enum(['BASIC', 'MINISTRY', 'CATHEDRAL', 'CUSTOM']),
  // numberOfBranches: z.coerce.number().min(1, 'Please enter number of branches'),
  numberOfBranches: z
    .string()
    .min(1, 'Number of branches is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Number of branches must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 1000;
      },
      {
        message: 'Number of branches must be between 1 and 1,000',
      }
    ),
  churchSize: z.string().min(1, 'Please select number of members'),
});

export type CreateChurchPayload = z.infer<typeof churchDataSchema>;
