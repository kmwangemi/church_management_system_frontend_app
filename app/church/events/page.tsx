'use client';

import { AddEventForm } from '@/components/forms/add-event-form';
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
import { UserCombobox } from '@/components/user-combobox';
import {
  useDeleteEvent,
  useFetchEventAttendance,
  useFetchEvents,
  useRecordEventAttendance,
  useRemoveEventAttendance,
  useSendEventReminder,
  useUpdateEvent,
} from '@/lib/hooks/church/event/use-event-queries';
import { EVENT_FREQUENCY_OPTIONS, EVENT_TYPE_OPTIONS } from '@/lib/utils';
import {
  Ban,
  Bell,
  Calendar,
  Clock,
  Download,
  Edit,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    case 'Open for Registration':
      return (
        <Badge className="bg-green-100 text-green-800">
          Open for Registration
        </Badge>
      );
    case 'Completed':
      return <Badge className="bg-muted text-foreground">Completed</Badge>;
    case 'Cancelled':
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    Service: 'bg-purple-100 text-purple-800',
    Conference: 'bg-orange-100 text-orange-800',
    'Bible Study': 'bg-blue-100 text-blue-800',
    Study: 'bg-blue-100 text-blue-800',
    Outreach: 'bg-green-100 text-green-800',
    Meeting: 'bg-muted text-foreground',
  };
  return (
    <Badge className={colors[type] || 'bg-muted text-foreground'}>
      {type}
    </Badge>
  );
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Action Dialog states
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [attendanceEvent, setAttendanceEvent] = useState<any | null>(null);
  const [reminderEvent, setReminderEvent] = useState<any | null>(null);

  // Attendance form state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT');

  // Reminder form state
  const [reminderChannel, setReminderChannel] = useState('all');
  const [reminderMessage, setReminderMessage] = useState('');

  const { data: eventsData, isLoading } = useFetchEvents(1, searchTerm);
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutateAsync: updateEvent, isPending: isUpdatingEvent } =
    useUpdateEvent();

  const { data: attendanceData, isLoading: isAttendanceLoading } =
    useFetchEventAttendance(
      attendanceEvent ? attendanceEvent._id || attendanceEvent.id : null
    );
  const { mutateAsync: recordAttendance, isPending: isRecordingAttendance } =
    useRecordEventAttendance();
  const { mutate: removeAttendance } = useRemoveEventAttendance();
  const { mutateAsync: sendReminder, isPending: isSendingReminder } =
    useSendEventReminder();

  const activeEvents: any[] =
    (eventsData as any)?.events || (eventsData as any)?.data || [];
  const attendeesList: any[] =
    (attendanceData as any)?.attendees || (attendanceData as any)?.data || [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const weekFromNowStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const filteredEvents = activeEvents.filter((event: any) => {
    const matchesSearch =
      !searchTerm ||
      (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.organizer || '').toLowerCase().includes(searchTerm.toLowerCase());

    const evtDateStr = (event.date || event.startDate || '').slice(0, 10);
    if (selectedTab === 'upcoming') {
      return (
        matchesSearch &&
        event.status !== 'Completed' &&
        event.status !== 'Cancelled' &&
        (!evtDateStr || evtDateStr >= todayStr)
      );
    }
    if (selectedTab === 'past') {
      return (
        matchesSearch &&
        ((evtDateStr && evtDateStr < todayStr) || event.status === 'Completed')
      );
    }
    if (selectedTab === 'recurring') {
      return (
        matchesSearch &&
        Boolean(
          event.isRecurring ||
            (event.recurring &&
              event.recurring !== 'None' &&
              event.recurring !== '')
        )
      );
    }
    return matchesSearch;
  });

  const stats = {
    total: activeEvents.length,
    upcoming: activeEvents.filter((e: any) => {
      const d = (e.date || e.startDate || '').slice(0, 10);
      return (
        e.status !== 'Completed' &&
        e.status !== 'Cancelled' &&
        (!d || d >= todayStr)
      );
    }).length,
    thisWeek: activeEvents.filter((e: any) => {
      const d = (e.date || e.startDate || '').slice(0, 10);
      return (
        d &&
        d >= todayStr &&
        d <= weekFromNowStr &&
        e.status !== 'Cancelled'
      );
    }).length,
    registrations: activeEvents.reduce(
      (sum: number, e: any) => sum + (Number(e.registeredAttendees) || 0),
      0
    ),
  };

  const handleExportCalendar = () => {
    if (activeEvents.length === 0) {
      toast.error('No events available to export.');
      return;
    }

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Church Management System//Events Calendar//EN',
      'CALSCALE:GREGORIAN',
    ];

    for (const evt of activeEvents) {
      const startDate = (evt.startDate || evt.date || todayStr).replace(
        /-/g,
        ''
      );
      const endDate = (evt.endDate || evt.startDate || evt.date || todayStr).replace(
        /-/g,
        ''
      );
      const startTime = (evt.startTime || evt.time || '09:00')
        .slice(0, 5)
        .replace(':', '');
      const endTime = (evt.endTime || '11:00').slice(0, 5).replace(':', '');

      lines.push(
        'BEGIN:VEVENT',
        `UID:${evt.id || evt._id}@church.org`,
        `SUMMARY:${(evt.title || 'Church Event').replace(/\n/g, ' ')}`,
        `DESCRIPTION:${(evt.description || '').replace(/\n/g, ' ')}`,
        `LOCATION:${(evt.location || '').replace(/\n/g, ' ')}`,
        `DTSTART:${startDate}T${startTime}00Z`,
        `DTEND:${endDate}T${endTime}00Z`,
        'END:VEVENT'
      );
    }

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], {
      type: 'text/calendar;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `church_events_${todayStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Events calendar (.ics) exported successfully.');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    await updateEvent({
      id: editingEvent._id || editingEvent.id,
      payload: {
        title: editingEvent.title,
        description: editingEvent.description,
        type: editingEvent.typeValue || editingEvent.type,
        organizer: editingEvent.organizer,
        startDate: editingEvent.startDate || editingEvent.date,
        endDate: editingEvent.endDate || editingEvent.startDate || editingEvent.date,
        startTime: editingEvent.startTime || editingEvent.time,
        endTime: editingEvent.endTime,
        location: editingEvent.location,
        expectedAttendees: Number(editingEvent.expectedAttendees) || 100,
        maxAttendees: Number(editingEvent.maxAttendees) || 500,
        status: editingEvent.status,
        isRecurring: editingEvent.recurringPattern !== 'none' && Boolean(editingEvent.recurringPattern),
        recurringPattern:
          editingEvent.recurringPattern === 'none'
            ? ''
            : editingEvent.recurringPattern,
      },
    });
    setEditingEvent(null);
  };

  const handleCheckInMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceEvent || !selectedMemberId) {
      toast.error('Please select a member to check in.');
      return;
    }
    await recordAttendance({
      eventId: attendanceEvent._id || attendanceEvent.id,
      memberId: selectedMemberId,
      status: attendanceStatus,
    });
    setSelectedMemberId('');
  };

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEvent) return;
    await sendReminder({
      eventId: reminderEvent._id || reminderEvent.id,
      channel: reminderChannel,
      message: reminderMessage,
    });
    setReminderEvent(null);
    setReminderMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Event Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Schedule and manage church events, attendance, and reminders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleExportCalendar} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Calendar
          </Button>
          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new church event or service
                </DialogDescription>
              </DialogHeader>
              <AddEventForm onCloseDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Events
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.total}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All events</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Upcoming Events
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.upcoming}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Scheduled ahead
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              This Week
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.thisWeek}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Events next 7 days
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Registrations / Attendance
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.registrations}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Registered or checked-in attendees
            </p>
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
                placeholder="Search events by title, location, or organizer..."
                value={searchTerm}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming">
                Upcoming ({stats.upcoming})
              </TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
              <TabsTrigger value="all">All Events ({stats.total})</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value={selectedTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={7}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event: any) => {
                        const attRatio =
                          event.expectedAttendees > 0
                            ? Math.min(
                                100,
                                Math.round(
                                  ((event.registeredAttendees || 0) /
                                    event.expectedAttendees) *
                                    100
                                )
                              )
                            : 0;
                        return (
                          <TableRow
                            className="hover:bg-accent"
                            key={event.id || event._id}
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium text-foreground">
                                  {event.title}
                                </div>
                                <div className="max-w-xs truncate text-muted-foreground text-sm">
                                  {event.description}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  Organizer: {event.organizer}
                                  {event.recurring &&
                                    event.recurring !== 'None' && (
                                      <span className="ml-2 text-blue-600">
                                        • Repeats {event.recurring}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="mb-1 flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {event.date
                                    ? new Date(event.date).toLocaleDateString()
                                    : 'TBD'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {event.startTime || event.time}
                                  {event.endTime ? ` - ${event.endTime}` : ''}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {event.location}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(event.type)}</TableCell>
                            <TableCell>
                              {getStatusBadge(event.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {event.registeredAttendees || 0} /{' '}
                                    {event.expectedAttendees || 100}
                                  </span>
                                </div>
                                {event.expectedAttendees > 0 && (
                                  <div className="mt-1 h-1.5 w-20 rounded-full bg-secondary">
                                    <div
                                      className="h-1.5 rounded-full bg-blue-600"
                                      style={{
                                        width: `${attRatio}%`,
                                      }}
                                    />
                                  </div>
                                )}
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
                                    onClick={() =>
                                      setEditingEvent({
                                        ...event,
                                        recurringPattern:
                                          event.recurringPattern ||
                                          (event.recurring &&
                                          event.recurring !== 'None'
                                            ? event.recurring.toLowerCase()
                                            : 'none'),
                                      })
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setAttendanceEvent(event)}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Manage Attendance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setReminderEvent(event);
                                      setReminderMessage(
                                        `Reminder: "${event.title}" is scheduled on ${event.date} at ${event.startTime || event.time} (${event.location}).`
                                      );
                                    }}
                                  >
                                    <Bell className="mr-2 h-4 w-4" />
                                    Send Reminders
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {event.status !== 'Cancelled' && (
                                    <DropdownMenuItem
                                      className="cursor-pointer text-orange-600"
                                      onClick={() =>
                                        updateEvent({
                                          id: event._id || event.id,
                                          payload: { status: 'Cancelled' },
                                        })
                                      }
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      Cancel Event
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => {
                                      const targetId = event._id || event.id;
                                      if (targetId) deleteEvent(targetId);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {!isLoading && filteredEvents.length === 0 && (
                <div className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No events found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or create a new event.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingEvent(null)}
        open={Boolean(editingEvent)}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event schedule, status, and attendance capacity
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form className="space-y-4" onSubmit={handleSaveEdit}>
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  required
                  value={editingEvent.title || ''}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  value={editingEvent.description || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingEvent({
                        ...editingEvent,
                        typeValue: val,
                        type: val,
                      })
                    }
                    value={editingEvent.typeValue || 'service'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingEvent({ ...editingEvent, status: val })
                    }
                    value={editingEvent.status || 'Scheduled'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Open for Registration">
                        Open for Registration
                      </SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        startDate: e.target.value,
                        date: e.target.value,
                      })
                    }
                    required
                    type="date"
                    value={(
                      editingEvent.startDate ||
                      editingEvent.date ||
                      ''
                    ).slice(0, 10)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        endDate: e.target.value,
                      })
                    }
                    required
                    type="date"
                    value={(
                      editingEvent.endDate ||
                      editingEvent.startDate ||
                      editingEvent.date ||
                      ''
                    ).slice(0, 10)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        startTime: e.target.value,
                        time: e.target.value,
                      })
                    }
                    required
                    type="time"
                    value={(
                      editingEvent.startTime ||
                      editingEvent.time ||
                      '09:00'
                    ).slice(0, 5)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        endTime: e.target.value,
                      })
                    }
                    required
                    type="time"
                    value={(editingEvent.endTime || '11:00').slice(0, 5)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        location: e.target.value,
                      })
                    }
                    required
                    value={editingEvent.location || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organizer</Label>
                  <Input
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        organizer: e.target.value,
                      })
                    }
                    value={editingEvent.organizer || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Attendees</Label>
                  <Input
                    min="1"
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        expectedAttendees: e.target.value,
                      })
                    }
                    type="number"
                    value={editingEvent.expectedAttendees ?? 100}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recurring Schedule</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingEvent({
                        ...editingEvent,
                        recurringPattern: val,
                      })
                    }
                    value={editingEvent.recurringPattern || 'none'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (One-time)</SelectItem>
                      {EVENT_FREQUENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setEditingEvent(null)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isUpdatingEvent} type="submit">
                  {isUpdatingEvent && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Attendance Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setAttendanceEvent(null)}
        open={Boolean(attendanceEvent)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Attendance — {attendanceEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Check in or register church members for this event (
              {attendeesList.length} /{' '}
              {attendanceEvent?.expectedAttendees || 100} attendees)
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-end"
            onSubmit={handleCheckInMember}
          >
            <div className="flex-1 space-y-1.5">
              <Label>Select Member</Label>
              <UserCombobox
                className="w-full"
                onValueChange={(id) => setSelectedMemberId(id || '')}
                placeholder="Search and select a member..."
                value={selectedMemberId}
              />
            </div>
            <div className="w-full space-y-1.5 sm:w-40">
              <Label>Status</Label>
              <Select
                onValueChange={setAttendanceStatus}
                value={attendanceStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="EXCUSED">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button disabled={isRecordingAttendance} type="submit">
              {isRecordingAttendance ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              Check In
            </Button>
          </form>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked In At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAttendanceLoading ? (
                  <TableRow>
                    <TableCell className="py-6 text-center" colSpan={5}>
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : attendeesList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="py-6 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No attendees checked in yet. Use the form above to record
                      member attendance.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendeesList.map((att: any) => (
                    <TableRow key={att.id || att._id}>
                      <TableCell className="font-medium">
                        {att.memberName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {att.phoneNumber || att.email || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {att.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {att.checkedInAt
                          ? new Date(att.checkedInAt).toLocaleString()
                          : 'Just now'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() =>
                            attendanceEvent &&
                            removeAttendance({
                              eventId:
                                attendanceEvent._id || attendanceEvent.id,
                              attendanceId: att._id || att.id,
                            })
                          }
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Reminders Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setReminderEvent(null)}
        open={Boolean(reminderEvent)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Event Reminders</DialogTitle>
            <DialogDescription>
              Notify registered attendees or church members about{' '}
              <span className="font-medium">{reminderEvent?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSendReminder}>
            <div className="space-y-2">
              <Label>Notification Channel</Label>
              <Select
                onValueChange={setReminderChannel}
                value={reminderChannel}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Channels (SMS, Email & Push)
                  </SelectItem>
                  <SelectItem value="sms">SMS Only</SelectItem>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="push">In-App / Push Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reminder Message</Label>
              <Textarea
                onChange={(e) => setReminderMessage(e.target.value)}
                required
                rows={4}
                value={reminderMessage}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setReminderEvent(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isSendingReminder} type="submit">
                {isSendingReminder ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bell className="mr-2 h-4 w-4" />
                )}
                Send Reminders
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
