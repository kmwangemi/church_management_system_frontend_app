import { Badge } from '@/components/ui/badge';

export const getRoleBadge = (role: string) => {
  const roleColors: Record<string, string> = {
    OWNER: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200',
    ADMIN: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200',
    STAFF: 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200',
    VOLUNTEER: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200',
    MEMBER: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200',
    VISITOR: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-200',
  };
  return (
    <Badge className={roleColors[role] || 'bg-muted text-foreground'}>
      {role}
    </Badge>
  );
};

export const getStatusBadge = (status: string) => {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200',
    active: 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200',
    PENDING: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-200',
    pending: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-200',
    SUSPENDED: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200',
    suspended: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200',
    INACTIVE: 'bg-muted text-foreground',
    inactive: 'bg-muted text-foreground',
  };
  return (
    <Badge className={statusColors[status] || 'bg-muted text-foreground'}>
      {status}
    </Badge>
  );
};
