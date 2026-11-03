import { passwordSchema } from '@/lib/validations/auth';
import * as z from 'zod';

// 🔹 Helper function to handle empty strings as optional
const optionalString = z.string().optional().or(z.literal(''));
export const optionalEmail = z
  .email()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true;
      return z.email().safeParse(val).success;
    },
    { message: 'Please enter a valid email address' }
  );

// 🔹 Common reusable schemas
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
});

// 🔹 Fixed emergency details schema
const emergencyDetailsSchema = z.object({
  emergencyContactFullName: optionalString,
  emergencyContactEmail: optionalEmail, // ✅ Handles empty strings properly
  emergencyContactPhoneNumber: optionalString,
  emergencyContactRelationship: optionalString,
  emergencyContactAddress: optionalString,
  emergencyContactNotes: optionalString,
});

const memberDetailsSchema = z.object({
  memberId: optionalString,
  membershipDate: optionalString,
  membershipStatus: z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'DECEASED']),
  departmentIds: z.array(z.string()).optional(),
  groupIds: z.array(z.string()).optional(),
  occupation: optionalString,
  baptismDate: optionalString,
  joinedDate: optionalString,
});

// 🔹 Other role-based details with fixed string handling
const pastorDetailsSchema = z.object({
  pastorId: optionalString,
  ordinationDate: optionalString,
  qualifications: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  assignments: z.array(z.any()).optional(),
  sermonCount: z.number().optional(),
  counselingSessions: z.number().optional(),
  biography: optionalString,
});

const bishopDetailsSchema = z.object({
  bishopId: optionalString,
  appointmentDate: optionalString,
  jurisdictionArea: optionalString,
  oversight: z.record(z.string(), z.any()).optional(),
  qualifications: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  biography: optionalString,
});

const staffDetailsSchema = z.object({
  staffId: optionalString,
  jobTitle: optionalString,
  department: optionalString,
  startDate: optionalString,
  salary: z.number().optional(),
  employmentType: z.string().optional(),
  isActive: z.boolean().optional(),
});

const volunteerDetailsSchema = z.object({
  volunteerId: optionalString,
  volunteerStatus: z.string().optional(),
  availabilitySchedule: z.record(z.string(), z.any()).optional(),
  departments: z.array(z.string()).optional(),
  volunteerRoles: z.array(z.any()).optional(),
  backgroundCheck: z.record(z.string(), z.any()).optional(),
  hoursContributed: z.number().optional(),
});

const adminDetailsSchema = z.object({
  adminId: optionalString,
  accessLevel: z.string().optional(),
  assignedBranches: z.array(z.string()).optional(),
});

const superAdminDetailsSchema = z.object({
  superAdminId: optionalString,
  accessLevel: z.enum(['GLOBAL', 'SYSTEM']).optional(),
  systemSettings: z.record(z.string(), z.any()).optional(),
  companyInfo: z.record(z.string(), z.any()).optional(),
});

const visitorDetailsSchema = z.object({
  visitorId: optionalString,
  visitDate: optionalString,
  invitedBy: optionalString,
  howDidYouHear: z
    .enum([
      'FRIEND',
      'WEBSITE',
      'ADVERTISEMENT',
      'FAMILY',
      'ONLINE',
      'FLYER',
      'OTHER',
    ])
    .optional(),
  followUpStatus: z
    .enum(['PENDING', 'CONTACTED', 'CONVERTED', 'DECLINED'])
    .optional(),
  followUpDate: optionalString,
  followUpNotes: optionalString,
  interestedInMembership: z.boolean(),
  servicesAttended: z.array(z.string()).optional(),
  occupation: optionalString,
});

// 🔹 Create Schema (minimal required)
export const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: optionalEmail,
  phoneNumber: optionalString,
  position: z.string().min(1, 'Church position is required'),
  address: addressSchema.optional().or(
    z.object({
      street: optionalString,
      city: optionalString,
      state: optionalString,
      zipCode: optionalString,
      country: optionalString,
    })
  ),
  gender: z.enum(['MALE', 'FEMALE', 'male', 'female'], {
    error: 'Gender is required',
  }),
  role: z
    .array(
      z.enum(['OWNER', 'MEMBER', 'STAFF', 'VOLUNTEER', 'VISITOR', 'ADMIN'])
    )
    .min(1, 'At least one role is required')
    .max(2, 'Only a maximum of 2 roles are allowed'),
  systemAccessLevel: z.enum(['NONE', 'PORTAL', 'STAFF', 'ADMIN']).optional(),
  ministryTags: z.array(z.string()).optional(),
  teamId: optionalString,
  sendWelcomeEmail: z.boolean().optional(),
});

export type AddUserPayload = z.infer<typeof userSchema>;

// Base object, NO refinements
export const adminBaseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  gender: z.enum(['MALE', 'FEMALE'], { error: 'Gender is required' }),
  position: z.string().optional(),
  address: addressSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().optional(),
  teamId: z.string().optional(),
  role: z
    .array(z.enum(['OWNER', 'MEMBER', 'STAFF', 'VOLUNTEER', 'VISITOR', 'ADMIN']))
    .max(2, 'Only a maximum of 2 roles are allowed')
    .optional(),
});

// Create schema: unchanged behavior
export const adminDataSchema = adminBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
);

// Edit schema: only the fields the edit form actually has
export const adminEditSchema = adminBaseSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    gender: true,
    position: true,
    role: true,
  })
  .extend({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']),
  });

export type AdminPayload = z.infer<typeof adminDataSchema>;
export type AdminEditPayload = z.infer<typeof adminEditSchema>;

// 🔹 Update Schema (full detailed) - Fixed version
export const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: optionalEmail,
  phoneNumber: optionalString,
  position: z.string().min(1, 'Church position is required'),
  address: addressSchema.optional().or(
    z.object({
      street: optionalString,
      city: optionalString,
      state: optionalString,
      zipCode: optionalString,
      country: optionalString,
    })
  ).optional(),
  dateOfBirth: optionalString,
  gender: z.enum(['MALE', 'FEMALE', 'male', 'female']).optional(),
  profilePictureUrl: optionalString,
  occupation: optionalString,
  branchId: optionalString,
  role: z
    .array(
      z.enum(['OWNER', 'MEMBER', 'STAFF', 'VOLUNTEER', 'VISITOR', 'ADMIN'])
    )
    .min(1, 'At least one role is required')
    .max(2, 'Only a maximum of 2 roles are allowed'),
  systemAccessLevel: z.enum(['NONE', 'PORTAL', 'STAFF', 'ADMIN']).optional(),
  ministryTags: z.array(z.string()).optional(),
  status: z.string().optional(),
  lastLogin: optionalString,
  maritalStatus: z.string().optional(),
  emergencyDetails: emergencyDetailsSchema, // ✅ Using the fixed schema
  notes: optionalString,
  skills: z.array(z.string()).optional(),
  createdAt: optionalString,
  // role-based details
  memberDetails: memberDetailsSchema.optional(),
  pastorDetails: pastorDetailsSchema.optional(),
  bishopDetails: bishopDetailsSchema.optional(),
  staffDetails: staffDetailsSchema.optional(),
  volunteerDetails: volunteerDetailsSchema.optional(),
  adminDetails: adminDetailsSchema.optional(),
  superAdminDetails: superAdminDetailsSchema.optional(),
  visitorDetails: visitorDetailsSchema.optional(),
});

export type UpdateUserPayload = z.infer<typeof userUpdateSchema>;
