import { z } from 'zod';

// Base Content Schema
const BaseContentSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  type: z.string().min(1, 'Type is required').trim(),
  category: z.string().min(1, 'Category is required').trim(),
  tags: z.string().min(1, 'Tags is required').trim(),
  status: z.string().min(1, 'Status is required').trim(),
  isPublic: z.boolean(),
});

// File-related schema
const FileSchema = z.object({
  fileUrl: z.string().url('Invalid file URL').optional(),
  fileName: z.string().max(255, 'File name too long').optional(),
  fileSize: z
    .number()
    .min(0, 'File size must be greater than or equal to 0')
    .max(104_857_600, 'File size must be less than or equal to 100MB')
    .optional(),
  fileMimeType: z.string().optional(),
});

// Add Content Schema
export const AddContentSchema = BaseContentSchema.extend({
  branchId: z.string().min(1, 'Branch ID is required'),
  ...FileSchema.shape,
});

// Update Content Schema (all fields optional except id)
export const UpdateContentSchema = BaseContentSchema.partial().extend({
  id: z.string().min(1, 'Content ID is required'),
  publishedAt: z.date().optional(),
  ...FileSchema.shape,
});

// Query Parameters Schema
// export const ContentQuerySchema = z.object({
//   page: z.coerce.number().min(1).default(1),
//   limit: z.coerce.number().min(1).max(50).default(10),
//   search: z.string().optional(),
//   type: ContentTypeEnum.optional(),
//   category: ContentCategoryEnum.optional(),
//   status: ContentStatusEnum.optional(),
//   tags: z.string().optional(),
//   sortBy: z
//     .enum([
//       'createdAt',
//       'updatedAt',
//       'publishedAt',
//       'title',
//       'viewCount',
//       'downloadCount',
//     ])
//     .default('createdAt'),
//   sortOrder: z.enum(['asc', 'desc']).default('desc'),
// });

// Export types
export type AddContentPayload = z.infer<typeof AddContentSchema>;
export type UpdateContentPayload = z.infer<typeof UpdateContentSchema>;
// export type ContentQueryParams = z.infer<typeof ContentQuerySchema>;

// Content validation utilities
export const validateContentData = (data: unknown) => {
  return AddContentSchema.safeParse(data);
};

// export const validateUpdateContentData = (data: unknown) => {
//   return UpdateContentSchema.safeParse(data);
// };

// export const validateContentQuery = (query: unknown) => {
//   return ContentQuerySchema.safeParse(query);
// };

export const FILE_VALIDATION = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  ALLOWED_EXTENSIONS: [
    '.pdf',
    '.doc',
    '.docx',
    '.mp3',
    '.wav',
    '.mp4',
    '.avi',
    '.mov',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.ppt',
    '.pptx',
  ],
} as const;
