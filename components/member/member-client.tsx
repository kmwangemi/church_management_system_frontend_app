'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Bell, BookOpen, LogOut, Menu, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { MemberNavigation } from './member-navigation';
import { MemberSidebar } from './member-sidebar';

export function MemberClient({
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
      window.location.href = '/auth/member';
    } catch (_error) {
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-accent">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col border-border border-r bg-background">
          <MemberSidebar
            member={user}
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
      {/* Mobile Sidebar */}
      <Sheet onOpenChange={setSidebarOpen} open={sidebarOpen}>
        <SheetContent className="w-64 p-0" side="left">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu for the member portal
          </SheetDescription>
          <MemberSidebar
            member={user}
            mobile
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
          />
        </SheetContent>
      </Sheet>
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-screen lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-border border-b bg-background px-4 py-2.5">
          <div className="flex items-center space-x-4">
            <Sheet onOpenChange={setSidebarOpen} open={sidebarOpen}>
              <SheetTrigger asChild>
                <Button className="lg:hidden" size="sm" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64 p-0" side="left">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu for the member portal
                </SheetDescription>
                <MemberSidebar
                  member={user}
                  mobile
                  pathname={pathname}
                  setSidebarOpen={setSidebarOpen}
                />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="font-semibold text-foreground text-xl">
                {MemberNavigation.find((item) => item.href === pathname)
                  ?.name || 'Dashboard'}
              </h1>
              <p className="hidden text-muted-foreground text-sm sm:block">
                {user?.churchName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="relative" size="sm" variant="ghost">
              <Bell className="h-5 w-5" />
              <span className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                5
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="relative h-8 w-8 rounded-full"
                  variant="ghost"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      alt={user?.name || 'Member'}
                      src="/placeholder.svg?height=32&width=32"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {(user?.name || 'Member')
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
                      {user?.name || 'Member'}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user?.email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
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
        </header>
        {/* Main Content */}
        <main className="flex-1 bg-accent p-6">{children}</main>
      </div>
    </div>
  );
}
