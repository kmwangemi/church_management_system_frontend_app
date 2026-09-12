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
import type { Branch } from '@/lib/types/branch';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import {
  AlertTriangle,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
} from 'lucide-react';

interface DeleteBranchDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  onDelete: (branchId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteBranchDialog({
  open,
  isDeleting,
  onOpenChange,
  branch,
  onDelete,
}: DeleteBranchDialogProps) {
  if (!branch) return null;
  const handleDelete = async () => await onDelete(branch.id);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Branch</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            branch and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Branch Info */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {capitalizeFirstLetterOfEachWord(branch?.name || 'N/A')}
              </h3>
              <div className="mt-1 flex items-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{branch?.email || 'N/A'}</span>
                </div>
                {branch?.phoneNumber && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{branch.phoneNumber}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant={branch?.isActive ? 'default' : 'secondary'}>
                  {branch?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          {/* Warning Section */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> This will permanently delete all data
              associated with this Branch.
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
                <span>Branch information and contact details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Attendance records and event participation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Giving history and financial contributions</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="text-muted-foreground text-sm">
            <strong>Branch since:</strong>{' '}
            {branch?.establishedDate ? new Date(branch.establishedDate).toLocaleDateString() : 'N/A'}
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
                Deleting Branch...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Branch
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
