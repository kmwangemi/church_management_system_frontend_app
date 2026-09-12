import z from 'zod';

export const AddMessageSchema = z.object({
  type: z.string().min(1, 'Please select message type'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Message content must be at least 10 characters'),
  recipients: z
    .array(z.string())
    .min(1, 'Please select at least one recipient group'),
  scheduleType: z.string().min(1, 'Please select when to send'),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  template: z.string().optional(),
});

export type AddMessagePayload = z.infer<typeof AddMessageSchema>;
