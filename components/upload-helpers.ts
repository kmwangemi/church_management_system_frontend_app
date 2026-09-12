import type { FileType, UploadResponse } from '@/lib/types';
import axios from 'axios';

// Generic upload function
export const uploadFile = async (
  file: File,
  type: FileType
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(`/api/shared/upload?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || 'Upload failed';
      throw new Error(errorMessage);
    }
    throw new Error('Upload failed');
  }
};

// Specific upload functions for different use cases
export const uploadImage = async (file: File): Promise<string> => {
  const result = await uploadFile(file, 'image');
  return result.data!.secure_url;
};

export const uploadDocument = async (file: File): Promise<string> => {
  const result = await uploadFile(file, 'document');
  return result.data!.secure_url;
};

// Add more specific upload functions as needed
export const uploadLogo = async (file: File): Promise<string> => {
  const result = await uploadFile(file, 'image'); // Assuming logos are images
  return result.data!.secure_url;
};
