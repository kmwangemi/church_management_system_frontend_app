'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLogout } from '@/hooks/api/use-auth';
import type { AuthUser as IUser } from '@/lib/hooks/auth/use-auth-queries';
import { Bell, Globe, LogOut, Menu, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SuperAdminSidebar } from './superadmin-sidebar';

export function SuperAdminClient({
  user,
  children,
}: {
  user: IUser;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { mutateAsync: logoutMutation } = useLogout();
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation();
      window.location.href = '/auth/superadmin';
    } catch (_error) {
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-purple-600 border-b-2" />
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-accent">
      {/* Mobile sidebar */}
      <Sheet onOpenChange={setSidebarOpen} open={sidebarOpen}>
        <SheetContent className="w-64 p-0" side="left">
          <SheetTitle className="sr-only">
            SuperAdmin Navigation Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu for the SuperAdmin portal
          </SheetDescription>
          <SuperAdminSidebar
            mobile
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
          />
        </SheetContent>
      </Sheet>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-border border-r bg-background px-6">
          <SuperAdminSidebar
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
      {/* Main content */}
      <div className="min-w-0 lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 border-border border-b bg-background px-3 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            aria-label="Open menu"
            className="shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            size="sm"
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 flex-1 gap-x-3 self-stretch lg:gap-x-6">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 items-center gap-2">
                <Globe className="h-5 w-5 shrink-0 text-purple-600" />
                <span className="truncate font-medium text-foreground text-sm">
                  Global System Management
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              <Button className="relative" size="sm" variant="ghost">
                <Bell className="h-5 w-5" />
                <Badge className="-right-1 -top-1 absolute flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="relative h-8 w-8 rounded-full"
                    variant="ghost"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        alt={user?.name || 'Admin'}
                        src={user?.image || ''}
                      />
                      <AvatarFallback>
                        {(user?.name || 'Admin')
                          .split(' ')
                          .map((n) => n[0]?.toUpperCase() || '')
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-sm leading-none">
                        Super Admin
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Page content */}
        <main className="min-w-0 py-4 sm:py-8">
          <div className="px-3 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
