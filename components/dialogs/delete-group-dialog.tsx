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
import type { Group } from '@/lib/types/small-group';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
} from '@/lib/utils';
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Loader2,
  Target,
  Trash2,
  User,
  Users,
} from 'lucide-react';

interface DeleteGroupDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onDelete: (groupId: string) => Promise<void>;
}

export function DeleteGroupDialog({
  open,
  isDeleting,
  onOpenChange,
  group,
  onDelete,
}: DeleteGroupDialogProps) {
  if (!group) return null;
  const handleDelete = async () => await onDelete(group._id);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Group</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the group
            and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Group Info */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {capitalizeFirstLetterOfEachWord(group?.groupName || 'N/A')}
              </h3>
              <p className="mt-1 text-muted-foreground text-sm">
                {capitalizeFirstLetter(group?.category || 'N/A')} •{' '}
                {group?.location}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant={group?.isActive ? 'default' : 'secondary'}>
                  {group?.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {group?.leaderId && (
                  <Badge variant="outline">
                    Led by {capitalizeFirstLetter(group.leaderId.firstName)}{' '}
                    {capitalizeFirstLetter(group.leaderId.lastName)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {/* Group Statistics
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="font-bold text-blue-600 text-lg">
                {group?.members || 0}
              </div>
              <div className="text-blue-600 text-sm">Members</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <div className="font-bold text-green-600 text-lg">
                {group?.activities?.length || 0}
              </div>
              <div className="text-green-600 text-sm">Activities</div>
            </div>
          </div> */}
          {/* Warning Section */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> This will permanently delete all data
              associated with this Group including all members.
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
                <span>Group information and contact details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>All member records and participation history</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Activity records and attendance tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Group goals and progress tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Budget allocation and expense records</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-muted-foreground text-sm">
            <div>
              <strong>Group created:</strong>{' '}
              {new Date(group?.createdAt).toLocaleDateString()}
            </div>
            {group?.meetingDay && (
              <div>
                <strong>Meets:</strong> {group.meetingDay.join(', ')}
              </div>
            )}
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
                Deleting Group...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
