import z from 'zod';

export const AddDiscipleSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
  mentorId: z.string().min(1, 'Please select a mentor'),
  startDate: z.string().min(1, 'Start date is required'),
  currentLevel: z.string().min(1, 'Please select current level'),
  goals: z.string().min(10, 'Please describe discipleship goals'),
  notes: z.string().optional(),
});

export type AddDisciplePayload = z.infer<typeof AddDiscipleSchema>;
