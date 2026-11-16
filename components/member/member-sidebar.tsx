'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import type { IUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Church, Gift } from 'lucide-react';
import Link from 'next/link';
import { MemberNavigation } from './member-navigation';

interface MemberSidebarProps {
  member: any;
  pathname: string;
  mobile?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200';
    case 'new':
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200';
    case 'inactive':
      return 'bg-muted text-foreground';
    default:
      return 'bg-muted text-foreground';
  }
};

export function MemberSidebar({
  member,
  pathname,
  mobile = false,
  setSidebarOpen,
}: MemberSidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col bg-background',
        mobile ? 'w-full' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-blue-600 p-1.5">
            <Church className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-foreground text-xl">Member Portal</span>
        </div>
      </div>
      {/* Member Info */}
      {member && (
        <div className="border-b bg-accent p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                alt={member.name}
                src="/placeholder.svg?height=48&width=48"
              />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-950/60 text-blue-600">
                {member.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">
                {member.name}
              </p>
              <div className="mt-1 flex items-center space-x-2">
                <Badge
                  className={cn(
                    'text-xs',
                    getStatusColor(member.membershipStatus)
                  )}
                  variant="secondary"
                >
                  {member.membershipStatus}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Member since {new Date(member.membershipDate).getFullYear()}
              </p>
            </div>
          </div>
          <p className="mt-2 truncate text-muted-foreground text-xs">
            {member.churchName}
          </p>
        </div>
      )}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {MemberNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200',
                isActive
                  ? 'border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
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
                  className="h-5 bg-red-100 dark:bg-red-950/60 px-1.5 text-red-800 dark:text-red-200 text-xs"
                  variant="secondary"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-3">
          <div className="mb-2 flex items-center space-x-2">
            <Gift className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100 text-sm">
              Quick Give
            </span>
          </div>
          <p className="mb-2 text-blue-700 dark:text-blue-300 text-xs">
            Make a quick contribution
          </p>
          <Button
            className="h-7 w-full bg-transparent text-xs"
            size="sm"
            variant="outline"
          >
            Give Now
          </Button>
        </div>
      </div>
    </div>
  );
}
