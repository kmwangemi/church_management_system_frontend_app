'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import type { Department } from '@/lib/types/department';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import { AlertTriangle, Calendar, Loader2, Trash2, User } from 'lucide-react';

interface DeleteDepartmentDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onDelete: (departmentId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteDepartmentDialog({
  open,
  isDeleting,
  onOpenChange,
  department,
  onDelete,
}: DeleteDepartmentDialogProps) {
  if (!department) return null;
  const handleDelete = async () => await onDelete(department._id);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Department</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            department and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Department Info */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {capitalizeFirstLetterOfEachWord(
                  department?.departmentName || 'N/A'
                )}
              </h3>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant={department?.isActive ? 'default' : 'secondary'}>
                  {department?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          {/* Warning Section */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> This will permanently delete all data
              associated with this Department.
            </AlertDescription>
          </Alert>
          {/* What will be deleted */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">
              The following data will be permanently removed:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-muted-foreground text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Department information and contact details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Attendance records and event participation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>
                  Department Budget and category allocation and expenses
                </span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="text-muted-foreground text-sm">
            <strong>Department since:</strong>{' '}
            {new Date(department?.createdAt).toLocaleDateString()}
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
                Deleting Department...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Department
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
