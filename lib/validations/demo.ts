import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

// Church demo schema
const churchDemoSchema = z.object({
  churchName: z.string().min(2, 'Church name must be at least 2 characters'),
  denomination: z.string().min(1, 'Please select a denomination'),
  address: z.object({
    country: z.string().min(1, 'Please enter a country'),
    address: z.string().min(5, 'Please enter a complete address'),
  }),
  churchSize: z.string().min(1, 'Please select number of members'),
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
});

// User demo schema
const userDemoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms'),
});

export const requestDemoSchema = z.object({
  churchData: churchDemoSchema,
  userData: userDemoSchema,
});

export type ChurchDemoPayload = z.infer<typeof churchDemoSchema>;
export type UserDemoPayload = z.infer<typeof userDemoSchema>;
export type RequestDemoPayload = z.infer<typeof requestDemoSchema>;
