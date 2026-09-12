import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { formatToNewDate } from '@/lib/utils';
import type React from 'react';

export const VisitorViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.visitorDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Visitor ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.visitorDetails.visitorId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Visit Date
        </Label>
        <p className="text-muted-foreground text-sm">
          {formatToNewDate(user?.visitorDetails?.visitDate)}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          How Did You Hear
        </Label>
        <Badge variant="outline">{user.visitorDetails.howDidYouHear}</Badge>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Follow-up Status
        </Label>
        <Badge
          variant={
            user.visitorDetails.followUpStatus === 'interested'
              ? 'default'
              : 'secondary'
          }
        >
          {user.visitorDetails.followUpStatus}
        </Badge>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Interested in Membership
        </Label>
        <Badge
          variant={
            user.visitorDetails.interestedInMembership ? 'default' : 'secondary'
          }
        >
          {user.visitorDetails.interestedInMembership ? 'Yes' : 'No'}
        </Badge>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Services Attended
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.visitorDetails.servicesAttended?.map((service, index) => (
            <Badge key={index} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
