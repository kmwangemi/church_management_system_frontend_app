import * as z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

enum DepartmentCategory {
  MINISTRY = 'ministry',
  ADMINISTRATION = 'administration',
  OPERATIONS = 'operations',
  EDUCATION = 'education',
  OUTREACH = 'outreach',
  SUPPORT = 'support',
  FINANCE = 'finance',
  FACILITIES = 'facilities',
  TECHNOLOGY = 'technology',
  COMMUNICATIONS = 'communications',
  PASTORAL_CARE = 'pastoral_care',
  MISSIONS = 'missions',
  YOUTH = 'youth',
  CHILDREN = 'children',
  WORSHIP = 'worship',
  DISCIPLESHIP = 'discipleship',
  COMMUNITY = 'community',
  EVENTS = 'events',
  SECURITY = 'security',
  VOLUNTEER_COORDINATION = 'volunteer_coordination',
}

export const addDepartmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
  category: z.enum(DepartmentCategory, {
    message: 'Please select a valid department category',
  }),
  leaderId: z.string().optional(),
  branchId: z.string().optional(),
  establishedDate: z.string().min(1, 'Established date is required'),
  location: z.string().min(1, 'Location is required'),
  totalBudget: z
    .string()
    .min(1, 'Total department budget is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Total department budget must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 0 && num <= 1_000_000;
      },
      {
        message: 'Total department budget must be between 0 and 1,000,000',
      }
    ),
  meetingDay: z
    .array(z.string())
    .min(1, 'At least one meeting day is required'),
  meetingTime: z
    .array(z.string())
    .min(1, 'At least one meeting time is required'),
  description: z.string().min(5, 'Description is required'),
});

export type AddDepartmentPayload = z.infer<typeof addDepartmentSchema>;
