import { AdminViewCard } from '@/components/cards/usercard/viewcard/admin-view-card';
import { BishopViewCard } from '@/components/cards/usercard/viewcard/bishop-view-card';
import { MemberViewCard } from '@/components/cards/usercard/viewcard/member-view-card';
import { PastorViewCard } from '@/components/cards/usercard/viewcard/pastor-view-card';
import { VisitorViewCard } from '@/components/cards/usercard/viewcard/visitor-view-card';
import type { OrganizationRole, RoleViewProps, UserViewProps } from '@/lib/types/index';
import { StaffViewCard } from './cards/usercard/viewcard/staff-view-card';
import { VolunteerViewCard } from './cards/usercard/viewcard/volunteer-view-card';

// Helper function to check if user has a specific role
const hasRole = (
  roles: OrganizationRole[] | undefined,
  role: OrganizationRole
): boolean | undefined => {
  return roles?.includes(role);
};

export const RenderViewRoleSpecificFields: React.FC<RoleViewProps> = ({
  user,
  position,
  roles, // Use roles array instead of currentRole
}) => {
  if (!roles || roles.length === 0) return null;

  // Render cards based on roles in priority order
  // You can render multiple cards if user has multiple roles
  return (
    <>
      {position === 'PASTOR' && <PastorViewCard user={user} />}
      {position === 'BISHOP' && <BishopViewCard user={user} />}
      {hasRole(roles, 'ADMIN') && <AdminViewCard user={user} />}
      {hasRole(roles, 'VISITOR') && <VisitorViewCard user={user} />}
    </>
  );
};

export const RenderMemberView: React.FC<RoleViewProps> = ({ user, roles }) => {
  if (hasRole(roles, 'MEMBER')) {
    return <MemberViewCard user={user} />;
  }
  return null;
};

export const RenderStaffView: React.FC<UserViewProps> = ({ user, roles }) => {
  if (hasRole(roles, 'STAFF')) {
    return <StaffViewCard user={user} />;
  }
  return null;
};

export const RenderVolunteerView: React.FC<UserViewProps> = ({
  user,
  roles,
}) => {
  if (hasRole(roles, 'VOLUNTEER')) {
    return <VolunteerViewCard user={user} />;
  }
  return null;
};
