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
import type React from 'react';

export const VolunteerViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.volunteerDetails) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volunteer Information</CardTitle>
        <CardDescription>Volunteer status and contributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Volunteer ID
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.volunteerDetails.volunteerId}
            </p>
          </div>
          <div>
            <Label className="mr-2 font-medium text-sm" htmlFor={''}>
              Status
            </Label>
            <Badge
              variant={
                user.volunteerDetails.volunteerStatus === 'active'
                  ? 'default'
                  : 'secondary'
              }
            >
              {user.volunteerDetails.volunteerStatus}
            </Badge>
          </div>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Hours Contributed
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.volunteerDetails.hoursContributed}
            </p>
          </div>
          <div>
            <Label className="mr-2 font-medium text-sm" htmlFor={''}>
              Background Check
            </Label>
            <Badge
              variant={
                user.volunteerDetails.backgroundCheck?.completed
                  ? 'default'
                  : 'secondary'
              }
            >
              {user.volunteerDetails.backgroundCheck?.completed
                ? 'Completed'
                : 'Pending'}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <Label className="font-medium text-sm" htmlFor={''}>
              Availability
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.volunteerDetails.availabilitySchedule?.preferredTimes
                ?.map((time) => `${time}hrs`)
                .join(', ') ?? ''}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="font-medium text-sm" htmlFor={''}>
              Current Roles
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.volunteerDetails.volunteerRoles
                ?.filter((role) => role.isActive)
                .map((role, index) => (
                  <Badge key={index} variant="default">
                    {role.role}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
