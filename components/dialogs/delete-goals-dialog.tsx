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
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteGoalDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string | undefined;
  onDelete: (goalId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteGoalDialog({
  open,
  isDeleting,
  onOpenChange,
  goalId,
  onDelete,
}: DeleteGoalDialogProps) {
  if (!goalId) return null;
  const handleDelete = async () => await onDelete(goalId);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Goal</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all the
            goal data.
          </DialogDescription>
        </DialogHeader>
        <Separator />
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
                Deleting Goal...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Goal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
