import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { capitalizeFirstLetter, formatToNewDate } from '@/lib/utils';

export const MemberViewCard: React.FC<UserViewProps> = ({ user }) => {
  const memberId =
    user?.memberDetails?.memberId ||
    user?.membershipNumber ||
    user?.member?.membershipNumber ||
    user?.memberId ||
    'Not Provided';

  const rawDate =
    user?.memberDetails?.membershipDate ||
    user?.memberDetails?.joinedDate ||
    user?.member?.joinedDate ||
    user?.joinedAt ||
    user?.createdAt;
  const membershipDate = rawDate ? formatToNewDate(rawDate) || 'Not Provided' : 'Not Provided';

  const rawStatus =
    user?.memberDetails?.membershipStatus ||
    user?.member?.status ||
    user?.status ||
    user?.user?.status ||
    'ACTIVE';
  const membershipStatus = capitalizeFirstLetter(rawStatus || 'Active');

  const rawRole = user?.member?.householdRole || user?.householdRole;
  const householdRole = rawRole ? capitalizeFirstLetter(rawRole) : 'Not Provided';

  const rawType = user?.memberType || user?.member?.memberType || 'Member';
  const memberType = capitalizeFirstLetter(rawType || 'Member');

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm">
          Member ID
        </Label>
        <p className="font-mono text-sm font-semibold text-primary">
          {memberId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm">
          Membership Date
        </Label>
        <p className="text-muted-foreground text-sm">
          {membershipDate}
        </p>
      </div>
      <div>
        <Label className="mr-2 font-medium text-sm">
          Membership Status
        </Label>
        <Badge
          variant={
            rawStatus?.toLowerCase() === 'active'
              ? 'default'
              : 'secondary'
          }
        >
          {membershipStatus}
        </Badge>
      </div>
      <div>
        <Label className="font-medium text-sm">
          Member Type
        </Label>
        <p className="text-muted-foreground text-sm">
          {memberType}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm">
          Household Role
        </Label>
        <p className="text-muted-foreground text-sm">
          {householdRole}
        </p>
      </div>
      {user?.memberDetails?.baptismDate && (
        <div>
          <Label className="font-medium text-sm">
            Baptism Date
          </Label>
          <p className="text-muted-foreground text-sm">
            {formatToNewDate(user.memberDetails.baptismDate) || 'Not Provided'}
          </p>
        </div>
      )}
    </div>
  );
};
