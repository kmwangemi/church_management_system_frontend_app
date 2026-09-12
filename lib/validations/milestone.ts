import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const AddMilestoneSchema = z.object({
  name: z.string().min(2, 'Milestone name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  points: z.string().refine((val) => {
    if (!val || val.trim() === '') return true;
    if (!REGEX.test(val)) return false;
    const num = Number.parseFloat(val);
    return num >= 1 && num <= 100;
  }, 'Max points must be a valid number between 1 and 100'),
  requirements: z.string().optional(),
});

export type AddMilestonePayload = z.infer<typeof AddMilestoneSchema>;
