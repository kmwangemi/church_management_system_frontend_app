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
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Filter,
  Info,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Emergency Prayer Request',
      message:
        'Sarah Johnson has requested urgent prayers for her family situation',
      time: '5 minutes ago',
      read: false,
      category: 'Prayer',
    },
    {
      id: 2,
      type: 'info',
      title: 'New Member Registration',
      message: 'Michael Brown has completed his membership registration',
      time: '1 hour ago',
      read: false,
      category: 'Members',
    },
    {
      id: 3,
      type: 'success',
      title: 'Donation Received',
      message: 'Anonymous donation of KES 1,000 received for building fund',
      time: '2 hours ago',
      read: true,
      category: 'Finance',
    },
    {
      id: 4,
      type: 'warning',
      title: 'Event Reminder',
      message: 'Youth meeting tomorrow at 6:00 PM - 15 attendees confirmed',
      time: '3 hours ago',
      read: false,
      category: 'Events',
    },
    {
      id: 5,
      type: 'info',
      title: 'Volunteer Application',
      message: "Emma Davis applied to volunteer for children's ministry",
      time: '5 hours ago',
      read: true,
      category: 'Volunteers',
    },
  ];
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
  const getNotificationBadgeColor = (category: string) => {
    switch (category) {
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
      default:
        return 'bg-muted text-foreground';
    }
  };
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with church activities and important alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Settings
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
            <div className="font-bold text-2xl">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {notifications.filter((n) => !n.read).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Urgent</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {notifications.filter((n) => n.type === 'urgent').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{notifications.length}</div>
          </CardContent>
        </Card>
      </div>
      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative max-w-sm flex-1">
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
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
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
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                className={`flex items-start space-x-4 rounded-lg border p-4 ${
                  notification.read ? 'bg-background' : 'border-blue-200 bg-blue-50'
                }`}
                key={notification.id}
              >
                <div className="mt-1 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">
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
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-muted-foreground text-xs">
                    {notification.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
