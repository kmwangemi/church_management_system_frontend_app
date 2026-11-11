'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { UserResponse } from '@/lib/types/user';
import { capitalizeFirstLetter, getFirstLetter } from '@/lib/utils';
import {
  AlertTriangle,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
} from 'lucide-react';

interface DeleteUserDialogProps {
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  onDelete: (userId: string) => Promise<void>; // Updated to accept string and return Promise
}

export function DeleteUserDialog({
  open,
  isDeleting,
  onOpenChange,
  user,
  onDelete,
}: DeleteUserDialogProps) {
  if (!user) return null;
  const u = user as any;
  const targetId = user._id || u.id || u?.user?.id || '';
  const firstName = user?.firstName || u?.user?.firstName || 'User';
  const lastName = user?.lastName || u?.user?.lastName || '';
  const email = user?.email || u?.user?.email || 'N/A';
  const phoneNumber = user?.phoneNumber || u?.user?.phoneNumber || '';
  const roleLabel = Array.isArray(user.role)
    ? user.role.join(', ')
    : user.role || 'MEMBER';
  const statusStr = String(user?.status || 'ACTIVE').toLowerCase();
  const handleDelete = async () => await onDelete(targetId);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Delete Member</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            member and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Member Info */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                alt={firstName}
                src={user?.profilePictureUrl ?? u?.image ?? ''}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {`${getFirstLetter(firstName)}${getFirstLetter(lastName)}`}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{`${capitalizeFirstLetter(
                firstName
              )} ${capitalizeFirstLetter(lastName)}`}</h3>
              <div className="mt-1 flex items-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{email}</span>
                </div>
                {phoneNumber && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{phoneNumber}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary">{roleLabel}</Badge>
                <Badge
                  variant={statusStr === 'active' ? 'default' : 'secondary'}
                >
                  {capitalizeFirstLetter(statusStr)}
                </Badge>
              </div>
            </div>
          </div>
          {/* Warning Section */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> This will permanently delete all data
              associated with this member.
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
                <span>Personal information and contact details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Attendance records and event participation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Giving history and financial contributions</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Group memberships and ministry involvement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Prayer requests and spiritual journey data</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="text-muted-foreground text-sm">
            <strong>Member since:</strong>{' '}
            {new Date(user?.createdAt).toLocaleDateString()}
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
                Deleting User...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
