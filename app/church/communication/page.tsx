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
  DialogFooter,
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  useDeleteAnnouncement,
  useFetchAnnouncements,
  useIncrementAnnouncementView,
  useUpdateAnnouncement,
} from '@/lib/hooks/church/announcement/use-announcement-queries';
import {
  type MessageTemplateItem,
  useCreateMessageTemplate,
  useDeleteMessage,
  useDeleteMessageTemplate,
  useDuplicateMessage,
  useFetchCommunicationStats,
  useFetchMessages,
  useFetchMessageTemplates,
  useUpdateMessage,
  useUpdateMessageTemplate,
} from '@/lib/hooks/church/message/use-message-queries';
import type { AddMessagePayload } from '@/lib/validations/message';
import {
  Bell,
  Copy,
  Download,
  Edit,
  Eye,
  Loader2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Smartphone,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CommunicationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('messages');
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const [sendMessageInitialValues, setSendMessageInitialValues] = useState<
    Partial<AddMessagePayload> | undefined
  >(undefined);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
    useState(false);

  // Message dialogs
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isViewMessageOpen, setIsViewMessageOpen] = useState(false);

  // Announcement dialogs
  const [previewAnnouncement, setPreviewAnnouncement] = useState<any | null>(
    null
  );
  const [isPreviewAnnouncementOpen, setIsPreviewAnnouncementOpen] =
    useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(
    null
  );
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    targetAudience: 'All Members',
    publishDate: '',
    expiryDate: '',
    status: 'Published',
    isPinned: false,
  });

  // Template dialogs
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplateItem | null>(null);
  const [tplForm, setTplForm] = useState({
    name: '',
    type: 'SMS',
    category: 'General',
    content: '',
  });

  // Queries & Mutations
  const { data: annData, isLoading: isLoadingAnnouncements } =
    useFetchAnnouncements(1, searchTerm);
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  const { mutateAsync: updateAnnouncement, isPending: isUpdatingAnnouncement } =
    useUpdateAnnouncement();
  const { mutate: incrementAnnouncementView } = useIncrementAnnouncementView();

  const { data: msgData, isLoading: isLoadingMessages } = useFetchMessages(
    1,
    searchTerm
  );
  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: duplicateMessage } = useDuplicateMessage();
  const { mutateAsync: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { data: tplData, isLoading: isLoadingTemplates } =
    useFetchMessageTemplates(searchTerm);
  const { mutateAsync: createTemplate, isPending: isCreatingTemplate } =
    useCreateMessageTemplate();
  const { mutateAsync: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateMessageTemplate();
  const { mutate: deleteTemplate } = useDeleteMessageTemplate();

  const { data: statsRes } = useFetchCommunicationStats();

  const activeMessages: any[] =
    (msgData as any)?.messages ||
    (msgData as any)?.data?.messages ||
    (Array.isArray((msgData as any)?.data) ? (msgData as any)?.data : []);

  const activeAnnouncements: any[] =
    (annData as any)?.announcements ||
    (Array.isArray((annData as any)?.data) ? (annData as any)?.data : []);

  const activeTemplates: MessageTemplateItem[] =
    tplData?.data?.templates || tplData?.templates || [];

  const liveStats = statsRes?.data || statsRes?.stats;

  const stats = {
    totalMessages: liveStats?.totalMessages ?? activeMessages.length,
    sentToday:
      liveStats?.sentToday ??
      activeMessages.filter(
        (m: any) =>
          m.status === 'Sent' &&
          (m.sentDate || '').startsWith(new Date().toISOString().split('T')[0])
      ).length,
    activeAnnouncements:
      liveStats?.activeAnnouncements ??
      activeAnnouncements.filter(
        (a: any) => (a.status || '').toLowerCase() === 'published'
      ).length,
    totalRecipients:
      liveStats?.totalRecipients ??
      activeMessages.reduce(
        (sum: number, m: any) => sum + (Number(m.recipients) || 0),
        0
      ),
    smsDeliveryRate: liveStats?.smsDeliveryRate ?? 98.5,
    emailDeliveryRate: liveStats?.emailDeliveryRate ?? 94.2,
    messagesThisWeek: liveStats?.messagesThisWeek ?? activeMessages.length,
    messagesLastWeek: liveStats?.messagesLastWeek ?? 0,
    thisWeekPercent: liveStats?.thisWeekPercent ?? 0,
    lastWeekPercent: liveStats?.lastWeekPercent ?? 0,
    smsCount: liveStats?.smsCount ?? 0,
    emailCount: liveStats?.emailCount ?? 0,
    totalViews: liveStats?.totalViews ?? 0,
  };

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

  const handleExportReport = () => {
    const rows: string[][] = [
      [
        'Record Type',
        'Title / Name',
        'Channel / Category',
        'Status / Priority',
        'Recipients / Views / Usage',
        'Author / Sent By',
        'Date',
      ],
    ];

    for (const m of activeMessages) {
      rows.push([
        'Message',
        m.title || '',
        m.type || 'SMS',
        m.status || 'Sent',
        String(m.recipients ?? 0),
        m.sentBy || 'Church Admin',
        m.sentDate ? new Date(m.sentDate).toISOString().split('T')[0] : '',
      ]);
    }

    for (const a of activeAnnouncements) {
      rows.push([
        'Announcement',
        a.title || '',
        a.category || 'General',
        `${a.status || 'Published'} (${a.priority || 'Medium'})`,
        `${a.views ?? 0} views`,
        a.author || 'Church Admin',
        a.publishDate
          ? new Date(a.publishDate).toISOString().split('T')[0]
          : '',
      ]);
    }

    for (const t of activeTemplates) {
      rows.push([
        'Template',
        t.name || '',
        `${t.type} - ${t.category}`,
        'Active',
        `${t.usageCount ?? 0} uses`,
        'System / Admin',
        t.lastUsed ? new Date(t.lastUsed).toISOString().split('T')[0] : '',
      ]);
    }

    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `communication-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Communication report exported successfully.');
  };

  const handleOpenEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setAnnForm({
      title: announcement.title || '',
      content: announcement.content || '',
      category: announcement.category || 'General',
      priority: announcement.priority || 'Medium',
      targetAudience: announcement.targetAudience || 'All Members',
      publishDate: announcement.publishDate
        ? String(announcement.publishDate).slice(0, 10)
        : new Date().toISOString().split('T')[0],
      expiryDate: announcement.expiryDate
        ? String(announcement.expiryDate).slice(0, 10)
        : '',
      status: announcement.status || 'Published',
      isPinned: Boolean(announcement.isPinned),
    });
    setIsEditAnnouncementOpen(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!editingAnnouncement) return;
    const id = editingAnnouncement._id || editingAnnouncement.id;
    await updateAnnouncement({
      id,
      payload: annForm,
    });
    setIsEditAnnouncementOpen(false);
    setEditingAnnouncement(null);
  };

  const handlePreviewAnnouncement = (announcement: any) => {
    const id = announcement._id || announcement.id;
    if (id) {
      incrementAnnouncementView(id);
    }
    setPreviewAnnouncement({
      ...announcement,
      views: (Number(announcement.views) || 0) + 1,
    });
    setIsPreviewAnnouncementOpen(true);
  };

  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null);
    setTplForm({
      name: '',
      type: 'SMS',
      category: 'General',
      content: '',
    });
    setIsTemplateDialogOpen(true);
  };

  const handleOpenEditTemplate = (template: MessageTemplateItem) => {
    setEditingTemplate(template);
    setTplForm({
      name: template.name || '',
      type: template.type || 'SMS',
      category: template.category || 'General',
      content: template.content || '',
    });
    setIsTemplateDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!tplForm.name.trim() || !tplForm.content.trim()) {
      toast.error('Template name and content are required.');
      return;
    }
    if (editingTemplate) {
      await updateTemplate({
        id: editingTemplate.id || editingTemplate._id,
        payload: tplForm,
      });
    } else {
      await createTemplate(tplForm);
    }
    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleUseTemplate = (template: MessageTemplateItem) => {
    setSendMessageInitialValues({
      type: template.type.toLowerCase() === 'email' ? 'email' : 'sms',
      title: template.name,
      content: template.content,
      template: template.id || template._id,
    });
    setIsSendMessageDialogOpen(true);
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
          <Button onClick={handleExportReport} size="sm" variant="outline">
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
            onOpenChange={(open) => {
              setIsSendMessageDialogOpen(open);
              if (!open) setSendMessageInitialValues(undefined);
            }}
            open={isSendMessageDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSendMessageInitialValues(undefined);
                  setIsSendMessageDialogOpen(true);
                }}
              >
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
              <SendMessageForm
                initialValues={sendMessageInitialValues}
                onCloseDialog={() => {
                  setIsSendMessageDialogOpen(false);
                  setSendMessageInitialValues(undefined);
                }}
              />
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
            <p className="mt-1 text-muted-foreground text-xs">
              Currently published
            </p>
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
            <p className="mt-1 text-muted-foreground text-xs">
              Messages delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages, announcements, or templates..."
                value={searchTerm}
              />
            </div>
            {selectedTab === 'templates' && (
              <Button onClick={handleOpenCreateTemplate} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            )}
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

            {/* Messages Tab */}
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
                    {isLoadingMessages ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={7}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : activeMessages.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-8 text-center text-muted-foreground"
                          colSpan={7}
                        >
                          No messages found. Click "Send Message" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeMessages.map((message: any) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={message.id || message._id}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">
                                {message.title}
                              </div>
                              <div className="max-w-xs truncate text-muted-foreground text-sm">
                                {message.content}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                By: {message.sentBy || 'Church Admin'}
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
                              <span>{message.recipients ?? 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(message.status)}
                          </TableCell>
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
                              {message.sentDate
                                ? new Date(
                                    message.sentDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="h-8 w-8 p-0"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedMessage(message);
                                    setIsViewMessageOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const targetId =
                                      message._id || message.id;
                                    if (targetId) duplicateMessage(targetId);
                                  }}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => {
                                    const targetId =
                                      message._id || message.id;
                                    if (targetId) deleteMessage(targetId);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Announcements Tab */}
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
                    {isLoadingAnnouncements ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={7}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : activeAnnouncements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-8 text-center text-muted-foreground"
                          colSpan={7}
                        >
                          No announcements found. Click "New Announcement" to
                          create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeAnnouncements.map((announcement: any) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={announcement.id || announcement._id}
                        >
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2 font-medium text-foreground">
                                <span>{announcement.title}</span>
                                {announcement.isPinned && (
                                  <Badge variant="secondary">Pinned</Badge>
                                )}
                              </div>
                              <div className="max-w-xs truncate text-muted-foreground text-sm">
                                {announcement.content}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                By: {announcement.author || 'Church Admin'}
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
                              <span>{announcement.views || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {announcement.publishDate
                                ? new Date(
                                    announcement.publishDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="h-8 w-8 p-0"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenEditAnnouncement(announcement)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handlePreviewAnnouncement(announcement)
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => {
                                    const targetId =
                                      announcement._id || announcement.id;
                                    if (targetId) deleteAnnouncement(targetId);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Templates Tab */}
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
                    {isLoadingTemplates ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={6}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : activeTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-8 text-center text-muted-foreground"
                          colSpan={6}
                        >
                          No templates found. Click "New Template" to create
                          one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeTemplates.map((template) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={template.id || template._id}
                        >
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
                              {template.usageCount ?? 0} times
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {template.content}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="h-8 w-8 p-0"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleUseTemplate(template)}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Use Template
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenEditTemplate(template)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() =>
                                    deleteTemplate(template.id || template._id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
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
                          SMS Messages ({stats.smsCount})
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {stats.smsDeliveryRate}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{
                            width: `${Math.min(100, stats.smsDeliveryRate)}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Email Messages ({stats.emailCount})
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {stats.emailDeliveryRate}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(100, stats.emailDeliveryRate)}%`,
                          }}
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
                          {stats.messagesThisWeek} messages
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${stats.thisWeekPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Last Week</span>
                        <span className="text-muted-foreground text-sm">
                          {stats.messagesLastWeek} messages
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-gray-400"
                          style={{ width: `${stats.lastWeekPercent}%` }}
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

      {/* View Message Details Dialog */}
      <Dialog onOpenChange={setIsViewMessageOpen} open={isViewMessageOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.title}</DialogTitle>
            <DialogDescription>
              Sent by {selectedMessage?.sentBy || 'Church Admin'} on{' '}
              {selectedMessage?.sentDate
                ? new Date(selectedMessage.sentDate).toLocaleString()
                : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedMessage.type}</Badge>
                {getStatusBadge(selectedMessage.status)}
                <Badge variant="secondary">
                  {selectedMessage.recipients ?? 0} Recipients
                </Badge>
                {selectedMessage.status === 'Sent' && (
                  <Badge className="bg-green-100 text-green-800">
                    Delivery: {selectedMessage.deliveryRate}%
                  </Badge>
                )}
              </div>
              {selectedMessage.recipientGroupNames?.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Recipient Groups
                  </Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedMessage.recipientGroupNames.map(
                      (gName: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {gName}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
              <div className="rounded-lg border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                {selectedMessage.content}
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedMessage && selectedMessage.status !== 'Sent' && (
              <Button
                disabled={isUpdatingMessage}
                onClick={async () => {
                  const id = selectedMessage._id || selectedMessage.id;
                  await updateMessage({
                    id,
                    payload: { status: 'Sent', scheduleType: 'now' },
                  });
                  setIsViewMessageOpen(false);
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </Button>
            )}
            <Button
              onClick={() => setIsViewMessageOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Announcement Dialog */}
      <Dialog
        onOpenChange={setIsPreviewAnnouncementOpen}
        open={isPreviewAnnouncementOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              Published by {previewAnnouncement?.author || 'Church Admin'} •{' '}
              {previewAnnouncement?.views ?? 0} views
            </DialogDescription>
          </DialogHeader>
          {previewAnnouncement && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{previewAnnouncement.category}</Badge>
                {getPriorityBadge(previewAnnouncement.priority)}
                <Badge variant="secondary">
                  Audience: {previewAnnouncement.targetAudience || 'All Members'}
                </Badge>
                <Badge
                  variant={
                    previewAnnouncement.status === 'Published'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {previewAnnouncement.status}
                </Badge>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                {previewAnnouncement.content}
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>
                  Publish Date:{' '}
                  {previewAnnouncement.publishDate
                    ? new Date(
                        previewAnnouncement.publishDate
                      ).toLocaleDateString()
                    : 'N/A'}
                </span>
                <span>
                  Expiry Date:{' '}
                  {previewAnnouncement.expiryDate
                    ? new Date(
                        previewAnnouncement.expiryDate
                      ).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsPreviewAnnouncementOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog
        onOpenChange={setIsEditAnnouncementOpen}
        open={isEditAnnouncementOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update announcement details and publication status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                onChange={(e) =>
                  setAnnForm({ ...annForm, title: e.target.value })
                }
                value={annForm.title}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                onChange={(e) =>
                  setAnnForm({ ...annForm, content: e.target.value })
                }
                rows={4}
                value={annForm.content}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  onValueChange={(v) => setAnnForm({ ...annForm, category: v })}
                  value={annForm.category}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Youth">Youth</SelectItem>
                    <SelectItem value="Children">Children</SelectItem>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Prayer">Prayer</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Ministry">Ministry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  onValueChange={(v) => setAnnForm({ ...annForm, priority: v })}
                  value={annForm.priority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(v) => setAnnForm({ ...annForm, status: v })}
                  value={annForm.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  onChange={(e) =>
                    setAnnForm({ ...annForm, expiryDate: e.target.value })
                  }
                  type="date"
                  value={annForm.expiryDate}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={annForm.isPinned}
                onCheckedChange={(checked) =>
                  setAnnForm({ ...annForm, isPinned: checked })
                }
              />
              <Label>Pin this announcement</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsEditAnnouncementOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdatingAnnouncement}
              onClick={handleSaveAnnouncement}
            >
              {isUpdatingAnnouncement ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Template Dialog */}
      <Dialog
        onOpenChange={setIsTemplateDialogOpen}
        open={isTemplateDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Message Template' : 'New Message Template'}
            </DialogTitle>
            <DialogDescription>
              Create or update a reusable SMS or Email template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                onChange={(e) =>
                  setTplForm({ ...tplForm, name: e.target.value })
                }
                placeholder="e.g., Sunday Service Reminder"
                value={tplForm.name}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  onValueChange={(v) => setTplForm({ ...tplForm, type: v })}
                  value={tplForm.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  onChange={(e) =>
                    setTplForm({ ...tplForm, category: e.target.value })
                  }
                  placeholder="e.g., Service Reminders"
                  value={tplForm.category}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                onChange={(e) =>
                  setTplForm({ ...tplForm, content: e.target.value })
                }
                placeholder="Enter template message body..."
                rows={4}
                value={tplForm.content}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsTemplateDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isCreatingTemplate || isUpdatingTemplate}
              onClick={handleSaveTemplate}
            >
              {isCreatingTemplate || isUpdatingTemplate
                ? 'Saving...'
                : editingTemplate
                  ? 'Update Template'
                  : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
