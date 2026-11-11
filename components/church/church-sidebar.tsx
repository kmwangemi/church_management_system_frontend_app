'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  cn,
} from '@/lib/utils';
import { BookOpen, Church } from 'lucide-react';
import Link from 'next/link';
import { ChurchNavigation } from './church-navigation';

interface SidebarProps {
  user: any;
  pathname: string;
  mobile?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  onOpenHelp?: () => void;
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'pastor':
    case 'bishop':
      return 'bg-purple-100 text-purple-800';
    case 'admin':
    case 'church_admin':
    case 'owner':
      return 'bg-blue-100 text-blue-800';
    case 'finance':
    case 'treasurer':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-muted text-foreground';
  }
};

export function ChurchSidebar({
  user,
  pathname,
  mobile = false,
  setSidebarOpen,
  onOpenHelp,
}: SidebarProps) {
  const displayName =
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Church Admin';
  const displayAvatar = user?.profilePictureUrl || user?.image || '';
  const rawRole = (user?.role || user?.globalRole || 'Admin')
    .toString()
    .replace(/_/g, ' ');
  const churchName = user?.churchName || '';

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-background',
        mobile ? 'w-full' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <Link className="flex items-center space-x-2" href="/church">
          <div className="rounded-lg bg-blue-600 p-1.5">
            <Church className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-foreground text-xl">ChurchHub</span>
        </Link>
      </div>
      {/* User Info */}
      {user && (
        <div className="border-b bg-accent p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage alt={displayName} src={displayAvatar} />
              <AvatarFallback>
                {displayName
                  .split(' ')
                  .map((n: string) => n[0]?.toUpperCase() || '')
                  .join('')
                  .slice(0, 2) || 'CA'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">
                {capitalizeFirstLetterOfEachWord(displayName)}
              </p>
              <div className="flex items-center space-x-2">
                <Badge
                  className={cn(
                    'text-xs',
                    getRoleColor(user?.role || user?.globalRole || 'Admin')
                  )}
                  variant="secondary"
                >
                  {capitalizeFirstLetter(rawRole.toLowerCase())}
                </Badge>
              </div>
            </div>
          </div>
          {churchName && (
            <p className="mt-2 truncate text-muted-foreground text-xs">
              {churchName}
            </p>
          )}
        </div>
      )}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {ChurchNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/church' && pathname?.startsWith(`${item.href}/`));
          return (
            <Link
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200',
                isActive
                  ? 'border border-blue-200 bg-blue-50 text-blue-700'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              href={item.href}
              key={item.name}
              onClick={() => mobile && setSidebarOpen && setSidebarOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-muted-foreground'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  className="h-5 px-1.5 text-xs"
                  variant={item.badge === 'New' ? 'default' : 'secondary'}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="mb-2 flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900 text-sm">
              Need Help?
            </span>
          </div>
          <p className="mb-2 text-blue-700 text-xs">
            Check our documentation and tutorials
          </p>
          <Button
            className="h-7 w-full bg-transparent text-xs"
            onClick={() => {
              if (mobile && setSidebarOpen) {
                setSidebarOpen(false);
              }
              onOpenHelp?.();
            }}
            size="sm"
            variant="outline"
          >
            View Docs
          </Button>
        </div>
      </div>
    </div>
  );
}
