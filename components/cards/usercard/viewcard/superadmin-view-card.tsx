import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { UserViewProps } from '@/lib/types/index';
import type React from 'react';

export const SuperAdminViewCard: React.FC<UserViewProps> = ({ user }) => {
  if (!user?.superAdminDetails) {
    return null;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Super Admin ID
        </Label>
        <p className="text-muted-foreground text-sm">
          {user.superAdminDetails.superAdminId}
        </p>
      </div>
      <div>
        <Label className="font-medium text-sm" htmlFor={''}>
          Access Level
        </Label>
        <Badge variant="default">{user.superAdminDetails.accessLevel}</Badge>
      </div>
      {user.superAdminDetails.companyInfo && (
        <>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Position
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.superAdminDetails.companyInfo.position}
            </p>
          </div>
          <div>
            <Label className="font-medium text-sm" htmlFor={''}>
              Department
            </Label>
            <p className="text-muted-foreground text-sm">
              {user.superAdminDetails.companyInfo.department}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
