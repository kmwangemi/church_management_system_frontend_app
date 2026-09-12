import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const AddOfferingSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
  type: z.string().min(1, 'Please select offering type'),
  amount: z.string().refine((val) => {
    if (!val || val.trim() === '') return true;
    if (!REGEX.test(val)) return false;
    const num = Number.parseFloat(val);
    return num >= 1 && num <= 1_000_000;
  }, 'Paid amount must be a valid number between 1 and 1,000,000'),
  method: z.string().min(1, 'Please select payment method'),
  date: z.string().min(1, 'Date is required'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type AddOfferingPayload = z.infer<typeof AddOfferingSchema>;
