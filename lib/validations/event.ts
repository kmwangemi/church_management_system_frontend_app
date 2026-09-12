import z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const addEventSchema = z
  .object({
    title: z
      .string()
      .min(2, 'Event title must be at least 2 characters')
      .max(100, 'Title too long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description too long'),
    type: z.string().min(1, 'Please select event type'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    location: z
      .string()
      .min(2, 'Location is required')
      .max(200, 'Location too long'),
    expectedAttendees: z
      .string()
      .min(1, 'Expected attendees is required')
      .regex(/^\d+(\.\d+)?$/, 'Expected attendees must be a valid number')
      .refine((val) => {
        const num = Number.parseFloat(val);
        return num >= 1 && num <= 1_000_000;
      }, 'Expected attendees must be between 1 and 1,000,000'),
    organizer: z
      .string()
      .min(2, 'Organizer name is required')
      .max(100, 'Name too long'),
    requiresRegistration: z.boolean(),
    isRecurring: z.boolean(),
    recurringPattern: z.string().optional(),
    registrationDeadline: z.string().optional(),
    maxAttendees: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === '') return true;
        if (!REGEX.test(val)) return false;
        const num = Number.parseFloat(val);
        return num >= 1 && num <= 1_000_000;
      }, 'Max attendees must be a valid number between 1 and 1,000,000'),
    notes: z
      .string()
      .optional()
      .refine((val) => !val || val.length <= 500, {
        message: 'Notes must be 500 characters or less',
      }),
  })
  .refine(
    (data) => {
      // Validate end date is after start date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      // Validate max attendees >= expected attendees
      if (
        data.maxAttendees &&
        data.maxAttendees.trim() !== '' &&
        data.expectedAttendees
      ) {
        const maxNum = Number.parseFloat(data.maxAttendees);
        const expectedNum = Number.parseFloat(data.expectedAttendees);
        return maxNum >= expectedNum;
      }
      return true;
    },
    {
      message:
        'Maximum attendees must be greater than or equal to expected attendees',
      path: ['maxAttendees'],
    }
  )
  .refine(
    (data) => {
      // Validate registration deadline is before start date
      if (
        data.requiresRegistration &&
        data.registrationDeadline &&
        data.startDate
      ) {
        const regDeadline = new Date(data.registrationDeadline);
        const startDate = new Date(data.startDate);
        return regDeadline <= startDate;
      }
      return true;
    },
    {
      message: 'Registration deadline must be before or on the start date',
      path: ['registrationDeadline'],
    }
  )
  .refine(
    (data) => {
      // Validate recurring pattern is selected when isRecurring is true
      if (data.isRecurring && !data.recurringPattern) {
        return false;
      }
      return true;
    },
    {
      message: 'Please select a recurring pattern',
      path: ['recurringPattern'],
    }
  )
  .refine(
    (data) => {
      // Validate same-day time logic
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      // If same day, check that end time is after start time
      if (startDate.toDateString() === endDate.toDateString()) {
        const [startHour, startMin] = data.startTime.split(':').map(Number);
        const [endHour, endMin] = data.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: 'End time must be after start time for same-day events',
      path: ['endTime'],
    }
  );

export type AddEventPayload = z.infer<typeof addEventSchema>;
