import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import { formatToNewDate } from '@/lib/utils';
import type React from 'react';

export const StaffViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.staffDetails) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Information</CardTitle>
        <CardDescription>Employment details and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Staff ID
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.staffDetails.staffId}
            </p>
          </div>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Job Title
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.staffDetails.jobTitle}
            </p>
          </div>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Department
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.staffDetails.department}
            </p>
          </div>
          <div>
            <Label className="mr-2 font-medium text-sm" htmlFor={''}>
              Employment Type
            </Label>
            <Badge variant="outline">{user.staffDetails.employmentType}</Badge>
          </div>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Start Date
            </Label>
            <p className="text-muted-foreground text-sm">
              {formatToNewDate(user?.staffDetails?.startDate)}
            </p>
          </div>
          <div>
            <Label className="mr-2 font-medium text-sm" htmlFor={''}>
              Status
            </Label>
            <Badge
              variant={user.staffDetails.isActive ? 'default' : 'secondary'}
            >
              {user.staffDetails.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
