'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type ChurchNotificationItem,
  useDismissNotification,
  useFetchChurchNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/lib/hooks/church/notification/use-notification-queries';
import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isFetching, refetch } = useFetchChurchNotifications({
    filter,
    category,
    search: searchTerm,
  });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const dismissMutation = useDismissNotification();

  const notifications = data?.notifications || [];
  const stats = data?.stats || {
    total: 0,
    unread: 0,
    urgent: 0,
    today: 0,
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

  const getNotificationBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Prayer':
        return 'bg-purple-100 text-purple-800';
      case 'Members':
        return 'bg-blue-100 text-blue-800';
      case 'Finance':
        return 'bg-green-100 text-green-800';
      case 'Events':
        return 'bg-orange-100 text-orange-800';
      case 'Volunteers':
        return 'bg-pink-100 text-pink-800';
      case 'Assets':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const handleOpenNotification = (notification: ChurchNotificationItem) => {
    if (!notification.read) {
      markReadMutation.mutate({ id: notification.id, read: true });
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with church activities and important alerts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={isFetching}
            onClick={() => refetch()}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
            disabled={stats.unread === 0 || markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
            size="sm"
            variant="outline"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Mark All Read
          </Button>
          <Button
            onClick={() => router.push('/church/settings?tab=notifications')}
            size="sm"
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Urgent</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.urgent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Recent (24h)</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications..."
            value={searchTerm}
          />
        </div>
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status/type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Prayer">Prayer</SelectItem>
            <SelectItem value="Members">Members</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Events">Events</SelectItem>
            <SelectItem value="Volunteers">Volunteers</SelectItem>
            <SelectItem value="Assets">Assets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Latest updates and alerts from your church system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground text-sm">
                Loading notifications...
              </span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-foreground">
                No notifications found
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                {searchTerm || filter !== 'all' || category !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You are all caught up with church updates!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  className={`flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
                    notification.read
                      ? 'bg-background'
                      : 'border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30'
                  }`}
                  key={notification.id}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => handleOpenNotification(notification)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm hover:underline">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getNotificationBadgeColor(
                            notification.category
                          )}
                        >
                          {notification.category}
                        </Badge>
                        {!notification.read && (
                          <div
                            className="h-2 w-2 rounded-full bg-blue-600"
                            title="Unread"
                          />
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-muted-foreground text-xs">
                        {notification.time}
                      </span>
                      {notification.actionUrl && (
                        <span className="inline-flex items-center text-blue-600 text-xs hover:underline">
                          View details
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center space-x-1">
                    <Button
                      onClick={() =>
                        markReadMutation.mutate({
                          id: notification.id,
                          read: !notification.read,
                        })
                      }
                      size="sm"
                      title={
                        notification.read ? 'Mark as unread' : 'Mark as read'
                      }
                      variant="ghost"
                    >
                      <Check
                        className={`h-4 w-4 ${
                          notification.read
                            ? 'text-muted-foreground'
                            : 'text-blue-600'
                        }`}
                      />
                    </Button>
                    <Button
                      disabled={dismissMutation.isPending}
                      onClick={() => dismissMutation.mutate(notification.id)}
                      size="sm"
                      title="Dismiss notification"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
