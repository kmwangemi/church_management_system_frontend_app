import z from 'zod';

/**
 * Keep these in sync with the backend:
 *  - ChurchPlan enum (app/enums.py) -> seeded into the `plan` table
 *  - Column sizes in models/church.py + models/detail.py (String(255), description String(1000), logo String(500))
 *  - ChurchCreateRequest (schemas/superadmin.py)
 */
export const CHURCH_PLAN_VALUES = [
  'BASIC',
  'MINISTRY',
  'CATHEDRAL',
  'CUSTOM',
] as const;

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(''));

export const churchDataSchema = z.object({
  churchName: z
    .string()
    .trim()
    .min(2, 'Church name must be at least 2 characters')
    .max(255, 'Church name must be 255 characters or fewer'),
  denomination: z
    .string()
    .trim()
    .min(1, 'Please select a denomination')
    .max(255),
  description: optionalText(1000, 'Description must be 1,000 characters or fewer'),
  churchLogoUrl: z
    .string()
    .max(500, 'Logo URL is too long')
    .optional()
    .or(z.literal('')),
  establishedDate: z
    .string()
    .min(1, 'Please enter establishment date')
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    })
    .refine((val) => new Date(val).getTime() <= Date.now(), {
      message: 'Established date cannot be in the future',
    }),
  churchSize: z
    .string()
    .trim()
    .min(1, 'Please select congregation size'),
  email: z
    .string()
    .trim()
    .max(255, 'Email must be 255 characters or fewer')
    .pipe(z.email('Please enter a valid email address')),
  phoneNumber: z
    .string()
    .trim()
    .min(8, 'Please enter a valid phone number')
    .max(255, 'Phone number is too long'),
  website: z
    .string()
    .trim()
    .max(255, 'Website must be 255 characters or fewer')
    .refine((val) => val === '' || z.url().safeParse(val).success, {
      message: 'Please enter a valid website URL (e.g. https://www.church.com)',
    })
    .optional(),
  address: z.object({
    street: z
      .string()
      .trim()
      .min(5, 'Please enter a street address')
      .max(255, 'Street address is too long'),
    country: z
      .string()
      .trim()
      .min(2, 'Please select a country')
      .max(255),
    city: z.string().trim().min(2, 'Please enter city').max(255),
    // County / state / region (Address.state)
    state: optionalText(255, 'County / state is too long'),
    // Postal code (Address.zip_code, sent as `zipCode`)
    zipCode: optionalText(255, 'Postal code is too long'),
  }),
  subscriptionPlan: z.enum(CHURCH_PLAN_VALUES, {
    error: 'Please select a subscription plan',
  }),
});

export type CreateChurchPayload = z.infer<typeof churchDataSchema>;