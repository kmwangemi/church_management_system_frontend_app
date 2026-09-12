import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { formatToNewDate } from '@/lib/utils';
import type React from 'react';

export const PastorViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.pastorDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Pastor ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.pastorDetails.pastorId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Ordination Date
        </Label>
        <p className="text-muted-foreground text-sm">
          {formatToNewDate(user.pastorDetails.ordinationDate)}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Sermon Count
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.pastorDetails.sermonCount}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Counseling Sessions
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.pastorDetails.counselingSessions}
        </p>
      </div>
      <div className="md:col-span-2">
        <Label className="font-medium text-sm" htmlFor={''}>
          Qualifications
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.pastorDetails.qualifications?.map((qual, index) => (
            <Badge key={index} variant="outline">
              {qual}
            </Badge>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <Label className="font-medium text-sm" htmlFor={''}>
          Specializations
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.pastorDetails.specializations?.map((spec, index) => (
            <Badge key={index} variant="secondary">
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
