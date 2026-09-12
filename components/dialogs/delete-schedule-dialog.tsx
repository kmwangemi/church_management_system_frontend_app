'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { ServiceSchedule } from '@/lib/types/service-schedule';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteScheduleDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ServiceSchedule | null;
  onDelete: (scheduleId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteScheduleDialog({
  open,
  isDeleting,
  onOpenChange,
  schedule,
  onDelete,
}: DeleteScheduleDialogProps) {
  if (!schedule) return null;
  const handleDelete = async () => await onDelete(schedule._id);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Schedule</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            service schedule data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Schedule Name */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                Service Name: {''}
                {capitalizeFirstLetterOfEachWord(schedule?.service || 'N/A')}
              </h3>
            </div>
          </div>
          <Separator />
          <div className="text-muted-foreground text-sm">
            <strong>Created On:</strong>{' '}
            {new Date(schedule?.createdAt).toLocaleDateString()}
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            disabled={isDeleting}
            onClick={handleDelete}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting Schedule...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
