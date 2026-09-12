import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import type React from 'react';

export const AdminViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.adminDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Admin ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.adminDetails.adminId}
        </p>
      </div>
      <div>
        <Label className="mr-2 font-medium text-sm" htmlFor={''}>
          Access Level
        </Label>
        <Badge variant="outline">{user.adminDetails.accessLevel}</Badge>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Assigned Branches
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.adminDetails.assignedBranches?.length || 0} branches
        </p>
      </div>
    </div>
  );
};
