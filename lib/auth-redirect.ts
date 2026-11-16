export function getLoginRoute(
  role?: string | null,
  pathname?: string | null
): string {
  if (pathname?.startsWith('/superadmin')) return '/auth/superadmin';
  if (pathname?.startsWith('/church')) return '/auth/admin';
  if (pathname?.startsWith('/member')) return '/auth/member';

  const normalizedRole = (role || '').toUpperCase();
  if (normalizedRole === 'SUPER_ADMIN') return '/auth/superadmin';
  if (normalizedRole && normalizedRole !== 'MEMBER') return '/auth/admin';
  return '/auth/member';
}
