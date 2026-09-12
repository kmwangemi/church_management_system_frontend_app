import z from 'zod';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-()]+$/;

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginPayload = z.infer<typeof loginSchema>;

// Schema for the initial login request (email or phone number)
export const sendLoginCodeSchema = z.object({
  emailOrPhoneNumber: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (value) => {
        return (
          emailRegex.test(value) ||
          (phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10)
        );
      },
      {
        message: 'Please provide a valid email address or phone number',
      }
    ),
});

// Schema for verifying the login code
export const loginVerificationSchema = z.object({
  emailOrPhoneNumber: z.string().min(1, 'Email or phone number is required'),
  verification_code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

// Type exports
export type SendLoginCodePayload = z.infer<typeof sendLoginCodeSchema>;
export type LoginVerificationPayload = z.infer<typeof loginVerificationSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export const verificationSchema = z.object({
  code: z.string().min(4, 'Verification code must be at least 4 characters'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
