import {
  BarChart3,
  Calendar,
  DollarSign,
  Headphones,
  Heart,
  Home,
  MessageSquare,
  Settings,
  User,
  Users,
} from 'lucide-react';

export const MemberNavigation = [
  { name: 'Dashboard', href: '/member', icon: Home, badge: null },
  { name: 'My Profile', href: '/member/profile', icon: User, badge: null },
  { name: 'My Giving', href: '/member/giving', icon: DollarSign, badge: null },
  { name: 'Events', href: '/member/events', icon: Calendar, badge: '3' },
  {
    name: 'Announcements',
    href: '/member/announcements',
    icon: MessageSquare,
    badge: '2',
  },
  {
    name: 'Prayer Requests',
    href: '/member/prayer',
    icon: Headphones,
    badge: null,
  },
  { name: 'Small Groups', href: '/member/groups', icon: Users, badge: null },
  {
    name: 'My Analytics',
    href: '/member/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    name: 'Spiritual Journey',
    href: '/member/journey',
    icon: Heart,
    badge: null,
  },
  { name: 'Settings', href: '/member/settings', icon: Settings, badge: null },
] as const;