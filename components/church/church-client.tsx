'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { uploadFile } from '@/components/upload-helpers';
import { useLogout } from '@/hooks/api/use-auth';
import type { AuthUser as IUser } from '@/lib/hooks/auth/use-auth-queries';
import {
  type ChurchNotificationItem,
  useDismissNotification,
  useFetchAdminSelfProfile,
  useFetchChurchNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUpdateAdminSelfProfile,
} from '@/lib/hooks/church/notification/use-notification-queries';
import { useAuth } from '@/lib/use-auth';
import { capitalizeFirstLetter } from '@/lib/utils';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  Info,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Phone,
  Settings,
  Shield,
  Upload,
  User as UserIcon,
  X,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChurchNavigation } from './church-navigation';
import { ChurchSidebar } from './church-sidebar';

export function ChurchClient({
  user: propUser,
  children,
}: {
  user: IUser;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { mutateAsync: logoutMutation } = useLogout();

  // Fetch self profile and notifications
  const { data: selfProfile } = useFetchAdminSelfProfile();
  const { data: notifData } = useFetchChurchNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const dismissNotifMutation = useDismissNotification();
  const updateProfileMutation = useUpdateAdminSelfProfile();

  const effectiveUser = useMemo(() => {
    const mergedName =
      selfProfile?.fullName ||
      authUser?.fullName ||
      authUser?.name ||
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(' ') ||
      propUser?.name ||
      'Church Admin';
    return {
      ...propUser,
      ...authUser,
      name: mergedName,
      fullName: mergedName,
      firstName: selfProfile?.firstName || authUser?.firstName || '',
      lastName: selfProfile?.lastName || authUser?.lastName || '',
      email: selfProfile?.email || authUser?.email || propUser?.email || '',
      phoneNumber: selfProfile?.phoneNumber || (authUser as any)?.phoneNumber || '',
      image:
        selfProfile?.profilePictureUrl ||
        authUser?.profilePictureUrl ||
        (authUser as any)?.image ||
        propUser?.image ||
        '',
      profilePictureUrl:
        selfProfile?.profilePictureUrl ||
        authUser?.profilePictureUrl ||
        (authUser as any)?.image ||
        '',
      role: selfProfile?.role || authUser?.role || authUser?.globalRole || 'Admin',
      globalRole:
        selfProfile?.role || authUser?.globalRole || authUser?.role || 'Admin',
      churchName:
        selfProfile?.churchName ||
        authUser?.churchName ||
        (propUser as any)?.churchName ||
        'Church Management System',
      branchName: selfProfile?.branchName || (authUser as any)?.branchName || '',
      memberId: selfProfile?.memberId || (authUser as any)?.memberId || '',
    };
  }, [propUser, authUser, selfProfile]);

  // Profile dialog form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    position: '',
    bio: '',
    profilePictureUrl: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (isProfileOpen) {
      setProfileForm({
        firstName: selfProfile?.firstName || effectiveUser.firstName || '',
        lastName: selfProfile?.lastName || effectiveUser.lastName || '',
        phoneNumber: selfProfile?.phoneNumber || effectiveUser.phoneNumber || '',
        position: selfProfile?.position || 'Church Administrator',
        bio: selfProfile?.bio || '',
        profilePictureUrl:
          selfProfile?.profilePictureUrl || effectiveUser.profilePictureUrl || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [isProfileOpen, selfProfile, effectiveUser]);

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.stats?.unread ?? 0;

  const pageTitle = useMemo(() => {
    const exactMatch = ChurchNavigation.find((item) => item.href === pathname);
    if (exactMatch) return exactMatch.name;
    if (pathname === '/church/notifications') return 'Notifications';
    const prefixMatch = ChurchNavigation.find(
      (item) => item.href !== '/church' && pathname?.startsWith(`${item.href}/`)
    );
    if (prefixMatch) return prefixMatch.name;
    return 'Dashboard';
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation();
      window.location.href = '/auth/admin';
    } catch (_error) {
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const uploadRes = await uploadFile(file, 'image');
      const uploadedUrl =
        uploadRes?.data?.secure_url || (uploadRes as any)?.url || '';
      setProfileForm((prev) => ({ ...prev, profilePictureUrl: uploadedUrl }));
      toast.success('Profile photo uploaded');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload profile photo');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phoneNumber: profileForm.phoneNumber,
      position: profileForm.position,
      bio: profileForm.bio,
      profilePictureUrl: profileForm.profilePictureUrl,
      currentPassword: profileForm.currentPassword || undefined,
      newPassword: profileForm.newPassword || undefined,
    });
    setIsProfileOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = (item: ChurchNotificationItem) => {
    if (!item.read) {
      markReadMutation.mutate({ id: item.id, read: true });
    }
    router.push(item.actionUrl || '/church/notifications');
  };

  const initials =
    (effectiveUser.name || 'CA')
      .split(' ')
      .map((n: string) => n[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || 'CA';

  const formattedRole = capitalizeFirstLetter(
    (effectiveUser.globalRole || effectiveUser.role || 'Admin')
      .toString()
      .replace(/_/g, ' ')
      .toLowerCase()
  );

  return (
    <div className="min-h-screen bg-accent">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col border-border border-r bg-background">
          <ChurchSidebar
            onOpenHelp={() => setIsHelpOpen(true)}
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
            user={effectiveUser}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet onOpenChange={setSidebarOpen} open={sidebarOpen}>
        <SheetContent className="w-64 p-0" side="left">
          <SheetTitle className="sr-only">Dashboard Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu for the dashboard
          </SheetDescription>
          <ChurchSidebar
            mobile
            onOpenHelp={() => setIsHelpOpen(true)}
            pathname={pathname}
            setSidebarOpen={setSidebarOpen}
            user={effectiveUser}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-border border-b bg-background px-4 py-2.5">
          <div className="flex items-center space-x-4">
            <Button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              size="sm"
              variant="ghost"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-xl">
                {pageTitle}
              </h1>
              <p className="hidden text-muted-foreground text-sm sm:block">
                {effectiveUser.churchName || 'Church Management System'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Notifications"
                  className="relative"
                  size="sm"
                  variant="ghost"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="-top-1 -right-1 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white font-semibold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {unreadCount > 0 && (
                      <Button
                        className="h-7 px-2 text-xs"
                        disabled={markAllReadMutation.isPending}
                        onClick={(e) => {
                          e.preventDefault();
                          markAllReadMutation.mutate();
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />
                      <p className="font-medium text-foreground text-sm">
                        No notifications right now
                      </p>
                      <p className="text-muted-foreground text-xs">
                        New member registrations, offerings, and prayer alerts will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <div
                        className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/60 ${
                          !item.read ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''
                        }`}
                        key={item.id}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {getNotificationIcon(item.type)}
                        </div>
                        <button
                          className="min-w-0 flex-1 text-left"
                          onClick={() => handleNotificationClick(item)}
                          type="button"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-medium text-foreground text-xs">
                              {item.title}
                            </p>
                            {!item.read && (
                              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs">
                            {item.message}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">
                              {item.time}
                            </span>
                            <Badge className="h-4 px-1.5 text-[10px]" variant="outline">
                              {item.category}
                            </Badge>
                          </div>
                        </button>
                        <Button
                          className="h-6 w-6 flex-shrink-0 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotifMutation.mutate(item.id);
                          }}
                          size="sm"
                          title="Dismiss"
                          variant="ghost"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t p-2">
                  <Button
                    className="w-full justify-center text-xs"
                    onClick={() => router.push('/church/notifications')}
                    size="sm"
                    variant="ghost"
                  >
                    View all notifications
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Account menu"
                  className="relative h-8 w-8 rounded-full"
                  variant="ghost"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      alt={effectiveUser.name || 'Admin'}
                      src={effectiveUser.image || ''}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="truncate font-semibold text-foreground text-sm leading-none">
                      {effectiveUser.name}
                    </p>
                    <p className="text-blue-600 text-xs font-medium leading-none">
                      {formattedRole}
                    </p>
                    {effectiveUser.email && (
                      <p className="truncate text-muted-foreground text-xs leading-none">
                        {effectiveUser.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setIsProfileOpen(true)}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer justify-between"
                  onSelect={() => router.push('/church/notifications')}
                >
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="h-5 px-1.5 text-xs" variant="secondary">
                      {unreadCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => router.push('/church/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setIsHelpOpen(true)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  disabled={isLoggingOut}
                  onSelect={handleLogout}
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

      {/* Admin Self-Profile Modal */}
      <Dialog onOpenChange={setIsProfileOpen} open={isProfileOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Admin Profile
            </DialogTitle>
            <DialogDescription>
              View and update your personal details, avatar, and password.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div className="flex items-center gap-4 rounded-lg border bg-accent/40 p-3">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  alt={effectiveUser.name}
                  src={profileForm.profilePictureUrl || effectiveUser.image}
                />
                <AvatarFallback className="text-base">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm">
                  {effectiveUser.name}
                </p>
                <p className="truncate text-muted-foreground text-xs">
                  {effectiveUser.email} • {effectiveUser.churchName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    ref={avatarInputRef}
                    type="file"
                  />
                  <Button
                    disabled={isUploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Upload Photo
                  </Button>
                  {effectiveUser.memberId && (
                    <Button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push(`/church/users/${effectiveUser.memberId}`);
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Full Member Record
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="admin-first-name">First Name</Label>
                <Input
                  id="admin-first-name"
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  required
                  value={profileForm.firstName}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-last-name">Last Name</Label>
                <Input
                  id="admin-last-name"
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  required
                  value={profileForm.lastName}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="admin-phone">Phone Number</Label>
                <Input
                  id="admin-phone"
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                  placeholder="+254700000000"
                  value={profileForm.phoneNumber}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-position">Position / Title</Label>
                <Input
                  id="admin-position"
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, position: e.target.value }))
                  }
                  placeholder="Church Administrator"
                  value={profileForm.position}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-bio">Bio / Notes</Label>
              <Textarea
                id="admin-bio"
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Brief ministry bio or administrative role notes..."
                rows={2}
                value={profileForm.bio}
              />
            </div>

            <div className="border-t pt-3">
              <p className="mb-2 font-medium text-xs text-muted-foreground">
                Change Password (optional)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-curr-pwd">Current Password</Label>
                  <Input
                    id="admin-curr-pwd"
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    type="password"
                    value={profileForm.currentPassword}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-new-pwd">New Password</Label>
                  <Input
                    id="admin-new-pwd"
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Min. 6 characters"
                    type="password"
                    value={profileForm.newPassword}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setIsProfileOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={updateProfileMutation.isPending} type="submit">
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Help & Support Modal */}
      <Dialog onOpenChange={setIsHelpOpen} open={isHelpOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              ChurchHub Help & Support
            </DialogTitle>
            <DialogDescription>
              Quick guides, system resources, and support channels for church administrators.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="flex flex-col items-start rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                onClick={() => {
                  setIsHelpOpen(false);
                  router.push('/church/users');
                }}
                type="button"
              >
                <span className="font-semibold text-foreground text-sm">
                  Member & Role Management
                </span>
                <span className="mt-1 text-muted-foreground text-xs">
                  Register members, assign leadership roles, and manage households.
                </span>
              </button>
              <button
                className="flex flex-col items-start rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                onClick={() => {
                  setIsHelpOpen(false);
                  router.push('/church/finance');
                }}
                type="button"
              >
                <span className="font-semibold text-foreground text-sm">
                  Finance & Contributions
                </span>
                <span className="mt-1 text-muted-foreground text-xs">
                  Record tithes, offerings, pledges, budgets, and expense vouchers.
                </span>
              </button>
              <button
                className="flex flex-col items-start rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                onClick={() => {
                  setIsHelpOpen(false);
                  router.push('/church/events');
                }}
                type="button"
              >
                <span className="font-semibold text-foreground text-sm">
                  Events & Attendance
                </span>
                <span className="mt-1 text-muted-foreground text-xs">
                  Schedule church services, track check-ins, and review trends.
                </span>
              </button>
              <button
                className="flex flex-col items-start rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                onClick={() => {
                  setIsHelpOpen(false);
                  router.push('/church/settings');
                }}
                type="button"
              >
                <span className="font-semibold text-foreground text-sm">
                  System Settings & Backups
                </span>
                <span className="mt-1 text-muted-foreground text-xs">
                  Configure SMS/email integrations, permissions, and data backups.
                </span>
              </button>
            </div>

            <div className="rounded-lg border bg-blue-50/60 p-4 dark:bg-blue-950/20">
              <h4 className="font-semibold text-sm text-foreground">
                Contact Technical Support
              </h4>
              <p className="mt-1 text-muted-foreground text-xs">
                Need assistance with your church workspace or integrations? Reach out to our support team:
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                <a
                  className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline"
                  href="mailto:support@churchhub.org"
                >
                  <Mail className="h-3.5 w-3.5" />
                  support@churchhub.org
                </a>
                <a
                  className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline"
                  href="tel:+254700000000"
                >
                  <Phone className="h-3.5 w-3.5" />
                  +254 700 000 000
                </a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHelpOpen(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
