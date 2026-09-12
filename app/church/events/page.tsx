'use client';

import { AddEventForm } from '@/components/forms/add-event-form';
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
  Calendar,
  Clock,
  Download,
  Edit,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const events = [
  {
    id: 1,
    title: 'Sunday Morning Service',
    description: 'Weekly worship service with sermon and communion',
    date: '2024-01-14',
    time: '09:00 AM',
    endTime: '11:30 AM',
    location: 'Main Sanctuary',
    type: 'Service',
    status: 'Scheduled',
    expectedAttendees: 450,
    registeredAttendees: 0,
    organizer: 'Pastor Michael Brown',
    recurring: 'Weekly',
  },
  {
    id: 2,
    title: 'Youth Conference 2024',
    description: 'Annual youth conference with guest speakers and workshops',
    date: '2024-02-15',
    time: '06:00 PM',
    endTime: '09:00 PM',
    location: 'Fellowship Hall',
    type: 'Conference',
    status: 'Open for Registration',
    expectedAttendees: 120,
    registeredAttendees: 67,
    organizer: 'Sarah Johnson',
    recurring: 'None',
  },
  {
    id: 3,
    title: 'Bible Study',
    description: 'Weekly Bible study and discussion',
    date: '2024-01-10',
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Conference Room',
    type: 'Study',
    status: 'Completed',
    expectedAttendees: 85,
    registeredAttendees: 78,
    organizer: 'David Wilson',
    recurring: 'Weekly',
  },
  {
    id: 4,
    title: 'Community Outreach',
    description: 'Food distribution and community service',
    date: '2024-01-20',
    time: '10:00 AM',
    endTime: '02:00 PM',
    location: 'Community Center',
    type: 'Outreach',
    status: 'Scheduled',
    expectedAttendees: 50,
    registeredAttendees: 23,
    organizer: 'Emily Davis',
    recurring: 'Monthly',
  },
];

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
  const colors = {
    Service: 'bg-purple-100 text-purple-800',
    Conference: 'bg-orange-100 text-orange-800',
    Study: 'bg-blue-100 text-blue-800',
    Outreach: 'bg-green-100 text-green-800',
    Meeting: 'bg-muted text-foreground',
  };
  return (
    <Badge
      className={
        colors[type as keyof typeof colors] || 'bg-muted text-foreground'
      }
    >
      {type}
    </Badge>
  );
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const eventDate = new Date(event.date);
    const today = new Date();
    if (selectedTab === 'upcoming') {
      return matchesSearch && eventDate >= today;
    }
    if (selectedTab === 'past') {
      return matchesSearch && eventDate < today;
    }
    if (selectedTab === 'recurring') {
      return matchesSearch && event.recurring !== 'None';
    }
    return matchesSearch;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.date) >= new Date()).length,
    thisWeek: events.filter((e) => {
      const eventDate = new Date(e.date);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= weekFromNow;
    }).length,
    registrations: events.reduce((sum, e) => sum + e.registeredAttendees, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Event Management</h1>
          <p className="mt-1 text-muted-foreground">
            Schedule and manage church events and services
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
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
            <p className="mt-1 text-muted-foreground text-xs">Scheduled ahead</p>
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
            <p className="mt-1 text-muted-foreground text-xs">Events this week</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Registrations
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.registrations}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Registered attendees</p>
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
              <TabsTrigger value="all">All Events</TabsTrigger>
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
                    {filteredEvents.map((event) => (
                      <TableRow className="hover:bg-accent" key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {event.title}
                            </div>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {event.description}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Organizer: {event.organizer}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="mb-1 flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {event.time} - {event.endTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(event.type)}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.registeredAttendees} /{' '}
                                {event.expectedAttendees}
                              </span>
                            </div>
                            {event.expectedAttendees > 0 && (
                              <div className="mt-1 h-1 w-16 rounded-full bg-secondary">
                                <div
                                  className="h-1 rounded-full bg-blue-600"
                                  style={{
                                    width: `${(event.registeredAttendees / event.expectedAttendees) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
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
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Manage Attendance
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Send Reminders
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredEvents.length === 0 && (
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
    </div>
  );
}
