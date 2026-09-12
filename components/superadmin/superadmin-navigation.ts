import {
  Activity,
  BarChart3,
  Building2,
  MapPin,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';

export const SuperAdminNavigation = [
  { name: 'Dashboard', href: '/superadmin', icon: BarChart3 },
  { name: 'Churches', href: '/superadmin/churches', icon: Building2 },
  { name: 'Branches', href: '/superadmin/branches', icon: MapPin },
  { name: 'Analytics', href: '/superadmin/analytics', icon: TrendingUp },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'System Health', href: '/superadmin/system-health', icon: Activity },
  { name: 'Global Settings', href: '/superadmin/settings', icon: Settings },
] as const;
