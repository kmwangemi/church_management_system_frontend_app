import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const AssetCondition = z.enum(['excellent', 'good', 'fair', 'poor']);
export const AssetStatus = z.enum([
  'active',
  'maintenance',
  'disposed',
  'sold',
  'donated',
  'lost',
  'stolen',
]);
export const MaintenanceSchedule = z.enum([
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annually',
]);
export const AddAssetSchema = z.object({
  name: z
    .string()
    .min(2, 'Asset name must be at least 2 characters')
    .max(100, 'Asset name must be less than 100 characters')
    .trim(),
  type: z.string().min(1, 'Please select an asset type').trim(),
  value: z
    .string()
    .min(1, 'Asset value is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Asset value must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 10_000_000;
      },
      {
        message: 'Asset value must be between 1 and 10,000,000',
      }
    ),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  condition: AssetCondition,
  branchId: z.string().min(1, 'Please select a branch'),
  status: AssetStatus,
  serialNumber: z.string().trim().optional().or(z.literal('')),
  warranty: z.string().trim().optional().or(z.literal('')),
  supplier: z.string().trim().optional().or(z.literal('')),
  maintenanceSchedule: MaintenanceSchedule,
  notes: z.string().trim().optional().or(z.literal('')),
});

export type AddAssetPayload = z.infer<typeof AddAssetSchema>;
