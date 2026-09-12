import * as z from 'zod';

export const attendanceRecordSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['present', 'late', 'absent', 'excused'], {
    error: 'Status is required',
  }),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  notes: z
    .string()
    .max(200, 'Notes must be less than 200 characters')
    .optional(),
});

export const addAttendanceSchema = z.object({
  serviceScheduleId: z.string().min(1, 'Service schedule is required'),
  attendanceDate: z.string().min(1, 'Attendance date is required'),
  records: z
    .array(attendanceRecordSchema)
    .min(1, 'At least one attendance record is required'),
  remarks: z
    .string()
    .max(500, 'Remarks must be less than 500 characters')
    .optional(),
  weatherConditions: z
    .string()
    .max(100, 'Weather conditions must be less than 100 characters')
    .optional(),
  specialEvents: z
    .array(z.string().max(100, 'Each event must be less than 100 characters'))
    .optional(),
});

export const updateAttendanceSchema = addAttendanceSchema.partial();

export type AddAttendancePayload = z.infer<typeof addAttendanceSchema>;
export type UpdateAttendancePayload = z.infer<typeof updateAttendanceSchema>;
export type AttendanceRecordPayload = z.infer<typeof attendanceRecordSchema>;
