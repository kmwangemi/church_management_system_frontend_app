import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { formatToNewDate } from '@/lib/utils';

export const MemberViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.memberDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Member ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.memberDetails.memberId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Membership Date
        </Label>
        <p className="text-muted-foreground text-sm">
          {formatToNewDate(user.memberDetails.membershipDate)}
        </p>
      </div>
      <div>
        <Label className="mr-2 font-medium text-sm" htmlFor={''}>
          Membership Status
        </Label>
        <Badge
          variant={
            user.memberDetails.membershipStatus === 'active'
              ? 'default'
              : 'secondary'
          }
        >
          {user.memberDetails.membershipStatus}
        </Badge>
      </div>
      {user?.memberDetails?.baptismDate && (
        <div>
          <Label className="font-medium text-sm" htmlFor={''}>
            Baptism Date
          </Label>
          <p className="text-muted-foreground text-sm">
            {formatToNewDate(user.memberDetails.baptismDate)}
          </p>
        </div>
      )}
    </div>
  );
};
