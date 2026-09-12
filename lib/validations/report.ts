import z from 'zod';

export const AddReportSchema = z.object({
  name: z.string().min(5, 'Report name must be at least 5 characters'),
  type: z.string().min(1, 'Please select report type'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dateRange: z.string().min(1, 'Please select date range'),
  format: z.string().min(1, 'Please select output format'),
  includeCharts: z.boolean(),
  includeComparisons: z.boolean(),
  departments: z
    .array(z.string())
    .min(1, 'Please select at least one department'),
  customStartDate: z.string().optional(),
  customEndDate: z.string().optional(),
});

export type AddReportPayload = z.infer<typeof AddReportSchema>;
