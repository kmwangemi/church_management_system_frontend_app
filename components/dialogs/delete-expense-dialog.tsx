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

interface DeleteExpenseDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string | undefined;
  onDelete: (expenseId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteExpenseDialog({
  open,
  isDeleting,
  onOpenChange,
  expenseId,
  onDelete,
}: DeleteExpenseDialogProps) {
  if (!expenseId) return null;
  const handleDelete = async () => await onDelete(expenseId);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Expense</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all the
            expense data.
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
                Deleting Expense...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Expense
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
