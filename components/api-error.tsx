import { AlertCircle } from 'lucide-react';
import { getError } from '@/lib/utils';

const RenderApiError = ({ error }: { error: any }) => {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-600 text-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{getError(error) || 'An error occurred. Please try again.'}</span>
    </div>
  );
};

export default RenderApiError;
