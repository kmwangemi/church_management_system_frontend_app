import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { formatToNewDate } from '@/lib/utils';
import type React from 'react';

export const BishopViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.bishopDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Bishop ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.bishopDetails.bishopId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Appointment Date
        </Label>
        <p className="text-muted-foreground text-sm">
          {formatToNewDate(user?.bishopDetails?.appointmentDate)}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Jurisdiction Area
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.bishopDetails.jurisdictionArea}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Branches Overseen
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.bishopDetails.oversight?.branchIds?.length || 0} branches
        </p>
      </div>
      <div className="md:col-span-2">
        <Label className="font-medium text-sm" htmlFor={''}>
          Achievements
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.bishopDetails.achievements?.map((achievement, index) => (
            <Badge key={index} variant="default">
              {achievement}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
