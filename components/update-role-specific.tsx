import { AdminUpdateCard } from '@/components/cards/usercard/updatecard/admin-update-card';
import { BishopUpdateCard } from '@/components/cards/usercard/updatecard/bishop-update-card';
import { MemberUpdateCard } from '@/components/cards/usercard/updatecard/member-update-card';
import { PastorUpdateCard } from '@/components/cards/usercard/updatecard/pastor-update-card';
import { StaffUpdateCard } from '@/components/cards/usercard/updatecard/staff-update-card';
import { VisitorUpdateCard } from '@/components/cards/usercard/updatecard/visitor-update-card';
import { VolunteerUpdateCard } from '@/components/cards/usercard/updatecard/volunteer-update-card';
import type {
  OrganizationRole,
  RestSpecificFormProps,
  RoleSpecificFormProps,
  StaffUpdateFormProps,
} from '@/lib/types/index';

// Helper function to check if user has a specific role
const hasRole = (
  roles: OrganizationRole[] | undefined,
  role: OrganizationRole
): boolean | undefined => {
  return roles?.includes(role);
};

export const RenderUpdateRoleSpecificFields: React.FC<
  RoleSpecificFormProps
> = ({
  form,
  roles, // Use roles array instead of currentRole
  position,
}) => {
    if (!roles || roles.length === 0) return null;
    // Render cards based on roles in priority order
    // You can render multiple cards if user has multiple roles
    return (
      <>
        {position === 'PASTOR' && <PastorUpdateCard form={form} />}
        {position === 'BISHOP' && <BishopUpdateCard form={form} />}
        {hasRole(roles, 'ADMIN') && <AdminUpdateCard form={form} />}
        {hasRole(roles, 'VISITOR') && <VisitorUpdateCard form={form} />}
      </>
    );
  };

export const RenderMemberUpdate: React.FC<RestSpecificFormProps> = ({
  roles,
  form,
}) => {
  if (hasRole(roles, 'MEMBER')) {
    return <MemberUpdateCard form={form} />;
  }
  return null;
};

export const RenderStaffUpdate: React.FC<StaffUpdateFormProps> = ({
  roles,
  form,
}) => {
  if (hasRole(roles, 'STAFF')) {
    return <StaffUpdateCard form={form} />;
  }
  return null;
};

export const RenderVolunteerUpdate: React.FC<StaffUpdateFormProps> = ({
  roles,
  form,
}) => {
  if (hasRole(roles, 'VOLUNTEER')) {
    return <VolunteerUpdateCard form={form} />;
  }
  return null;
};
