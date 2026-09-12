import { uploadFile } from '@/components/upload-helpers';
import type { FileType } from '@/lib/types';
import { useCallback, useState } from 'react';

export const useFileUpload = (fileType: FileType) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);
        const result = await uploadFile(file, fileType);
        clearInterval(progressInterval);
        setUploadProgress(100);
        // Return the secure URL from the upload response
        return result.data!.secure_url;
      } catch (err: any) {
        const errorMessage = err.message || 'Upload failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [fileType]
  );
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return {
    upload,
    isUploading,
    uploadProgress,
    error,
    clearError,
  };
};
