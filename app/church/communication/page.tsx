'use client';

import { CreateAnnouncementForm } from '@/components/forms/create-announcement-form';
import { SendMessageForm } from '@/components/forms/send-message-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Download,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Send,
  Smartphone,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const messages = [
  {
    id: 1,
    title: 'Sunday Service Reminder',
    content:
      "Don't forget about tomorrow's Sunday service at 9:00 AM. See you there!",
    type: 'SMS',
    recipients: 456,
    status: 'Sent',
    sentDate: '2024-01-06',
    sentBy: 'Pastor Michael Brown',
    deliveryRate: 98.5,
  },
  {
    id: 2,
    title: 'Youth Conference Registration',
    content:
      'Registration is now open for the Youth Conference 2024. Limited seats available!',
    type: 'Email',
    recipients: 120,
    status: 'Scheduled',
    sentDate: '2024-01-08',
    sentBy: 'Sarah Johnson',
    deliveryRate: 0,
  },
  {
    id: 3,
    title: 'Bible Study Cancelled',
    content:
      "Tonight's Bible study has been cancelled due to weather conditions. Stay safe!",
    type: 'SMS',
    recipients: 85,
    status: 'Sent',
    sentDate: '2024-01-03',
    sentBy: 'David Wilson',
    deliveryRate: 96.2,
  },
];

const announcements = [
  {
    id: 1,
    title: 'New Church Building Fund',
    content:
      'We are excited to announce the launch of our new building fund campaign...',
    category: 'General',
    priority: 'High',
    publishDate: '2024-01-05',
    expiryDate: '2024-03-05',
    status: 'Published',
    views: 234,
    author: 'Pastor Michael Brown',
  },
  {
    id: 2,
    title: 'Youth Ministry Leadership Positions',
    content:
      'We are looking for dedicated young adults to join our youth ministry team...',
    category: 'Youth',
    priority: 'Medium',
    publishDate: '2024-01-04',
    expiryDate: '2024-02-04',
    status: 'Published',
    views: 89,
    author: 'Sarah Johnson',
  },
  {
    id: 3,
    title: 'Christmas Service Schedule',
    content:
      'Special Christmas service times and events for the holiday season...',
    category: 'Events',
    priority: 'High',
    publishDate: '2023-12-15',
    expiryDate: '2023-12-26',
    status: 'Expired',
    views: 567,
    author: 'Emily Davis',
  },
];

const templates = [
  {
    id: 1,
    name: 'Service Reminder',
    type: 'SMS',
    content:
      'Reminder: {service_name} is tomorrow at {time}. We look forward to seeing you!',
    category: 'Reminders',
    usageCount: 45,
  },
  {
    id: 2,
    name: 'Event Registration',
    type: 'Email',
    content:
      'Registration is now open for {event_name}. Click here to register: {registration_link}',
    category: 'Events',
    usageCount: 23,
  },
  {
    id: 3,
    name: 'Welcome New Member',
    type: 'Email',
    content:
      "Welcome to our church family, {member_name}! We're excited to have you join us.",
    category: 'Welcome',
    usageCount: 12,
  },
];

export default function CommunicationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('messages');
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
      case 'Scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'Draft':
        return <Badge className="bg-muted text-foreground">Draft</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const stats = {
    totalMessages: messages.length,
    sentToday: messages.filter(
      (m) => m.sentDate === new Date().toISOString().split('T')[0]
    ).length,
    activeAnnouncements: announcements.filter((a) => a.status === 'Published')
      .length,
    totalRecipients: messages.reduce((sum, m) => sum + m.recipients, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Communication Hub
          </h1>
          <p className="mt-1 text-muted-foreground">
            Send messages, manage announcements, and communicate with members
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Dialog
            onOpenChange={setIsAnnouncementDialogOpen}
            open={isAnnouncementDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for the member board
                </DialogDescription>
              </DialogHeader>
              <CreateAnnouncementForm
                onCloseDialog={() => setIsAnnouncementDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={setIsSendMessageDialogOpen}
            open={isSendMessageDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>
                  Send SMS or Email to church members
                </DialogDescription>
              </DialogHeader>
              <SendMessageForm onCloseDialog={() => setIsSendMessageDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Messages
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalMessages}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Sent Today
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <Send className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.sentToday}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Messages today</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Announcements
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.activeAnnouncements}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Currently published</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Recipients
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.totalRecipients}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Messages delivered</p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages, announcements, or templates..."
                value={searchTerm}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value="messages">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Rate</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow className="hover:bg-accent" key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {message.title}
                            </div>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {message.content}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              By: {message.sentBy}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {message.type === 'SMS' ? (
                              <Smartphone className="h-4 w-4 text-green-600" />
                            ) : (
                              <Mail className="h-4 w-4 text-blue-600" />
                            )}
                            <Badge variant="outline">{message.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{message.recipients}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell>
                          {message.status === 'Sent' ? (
                            <span className="font-medium text-green-600">
                              {message.deliveryRate}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(message.sentDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="h-8 w-8 p-0" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="announcements">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Announcement</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Publish Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow
                        className="hover:bg-accent"
                        key={announcement.id}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {announcement.title}
                            </div>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {announcement.content}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              By: {announcement.author}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {announcement.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(announcement.priority)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            // className={
                            //   announcement.status === 'Published'
                            //     ? 'bg-green-100 text-green-800'
                            //     : announcement.status === 'Expired'
                            //       ? 'bg-red-100 text-red-800'
                            //       : 'bg-muted text-foreground'
                            // }
                            variant={
                              announcement.status === 'Published'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {announcement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{announcement.views}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(
                              announcement.publishDate
                            ).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="h-8 w-8 p-0" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="templates">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow className="hover:bg-accent" key={template.id}>
                        <TableCell>
                          <span className="font-medium text-foreground">
                            {template.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {template.type === 'SMS' ? (
                              <Smartphone className="h-4 w-4 text-green-600" />
                            ) : (
                              <Mail className="h-4 w-4 text-blue-600" />
                            )}
                            <Badge variant="outline">{template.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {template.usageCount} times
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="max-w-xs truncate text-muted-foreground text-sm">
                            {template.content}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="h-8 w-8 p-0" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Use Template
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="analytics">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Message Delivery Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          SMS Messages
                        </span>
                        <span className="text-muted-foreground text-sm">97.3%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '97%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Email Messages
                        </span>
                        <span className="text-muted-foreground text-sm">94.8%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '95%' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">This Week</span>
                        <span className="text-muted-foreground text-sm">
                          23 messages
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '76%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Last Week</span>
                        <span className="text-muted-foreground text-sm">
                          18 messages
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-gray-400"
                          style={{ width: '60%' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
