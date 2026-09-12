import z from 'zod';

export const AddPrayerRequestSchema = z
  .object({
    memberId: z.string(),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters'),
    category: z.string().min(1, 'Please select a category'),
    priority: z.string().min(1, 'Please select priority level'),
    isAnonymous: z.boolean(),
    isPublic: z.boolean(),
  })
  .refine(
    (data) => {
      // ✅ Only require memberId when not anonymous
      if (!(data.isAnonymous || data.memberId)) {
        return false;
      }
      return true;
    },
    {
      message: 'Please select a member',
      path: ['memberId'], // ✅ Show error on memberId field
    }
  );

export type AddPrayerRequestPayload = z.infer<typeof AddPrayerRequestSchema>;
