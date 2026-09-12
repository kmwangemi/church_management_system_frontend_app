import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const AddPledgeSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
  amount: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      if (!REGEX.test(val)) return false;
      const num = Number.parseFloat(val);
      return num >= 1 && num <= 1_000_000;
    }, 'Max pledge amount must be a valid number between 1 and 1,000,000'),
  purpose: z.string().min(1, 'Please select purpose'),
  dueDate: z.string().min(1, 'Due date is required'),
  paymentSchedule: z.string().min(1, 'Please select payment schedule'),
  notes: z.string().optional(),
});

export type AddPledgePayload = z.infer<typeof AddPledgeSchema>;
