'use client';

import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  Filter,
  Heart,
  MapPin,
  Music,
  Search,
  Users,
  XCircle,
} from 'lucide-react';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useFetchEvents } from '@/lib/hooks/church/event/use-event-queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MemberEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: eventsData } = useFetchEvents(1, searchTerm);
  const serverEvents =
    (eventsData as any)?.events || (eventsData as any)?.data || [];

  const events = (Array.isArray(serverEvents) ? serverEvents : []).map(
    (e: any) => ({
      id: e.id || e._id,
      title: e.title || e.name || 'Church Event',
      description: e.description || '',
      date: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : e.date || '',
      time: e.startTime || e.time || '09:00 AM',
      endTime: e.endTime || '11:00 AM',
      location: e.location || 'Main Sanctuary',
      category: e.category || e.type || 'Worship',
      capacity: Number(e.maxAttendees || e.capacity || 100),
      registered: Number(e.currentAttendees || e.registered || 0),
      registrationStatus: 'available',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
    })
  );

  const _unusedMockEvents = [
    {
      id: 1,
      title: 'Sunday Morning Service',
      description:
        'Join us for worship, prayer, and biblical teaching every Sunday morning.',
      date: '2024-01-07',
      time: '10:00 AM',
      endTime: '11:30 AM',
      location: 'Main Sanctuary',
      category: 'Worship',
      capacity: 300,
      registered: 245,
      registrationStatus: 'registered',
      icon: Music,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 2,
      title: 'Bible Study Group',
      description:
        "Deep dive into God's word with fellow believers in a small group setting.",
      date: '2024-01-09',
      time: '7:00 PM',
      endTime: '8:30 PM',
      location: 'Room 201',
      category: 'Study',
      capacity: 20,
      registered: 15,
      registrationStatus: 'registered',
      icon: BookOpen,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 3,
      title: 'Youth Fellowship',
      description:
        'Fun activities, games, and fellowship for young people aged 13-25.',
      date: '2024-01-12',
      time: '6:00 PM',
      endTime: '8:00 PM',
      location: 'Youth Hall',
      category: 'Fellowship',
      capacity: 50,
      registered: 32,
      registrationStatus: 'available',
      icon: Heart,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 4,
      title: 'Coffee & Connect',
      description:
        'Casual meetup for coffee and conversation with church members.',
      date: '2024-01-14',
      time: '9:00 AM',
      endTime: '11:00 AM',
      location: 'Church Café',
      category: 'Fellowship',
      capacity: 30,
      registered: 28,
      registrationStatus: 'waitlist',
      icon: Coffee,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      id: 5,
      title: 'Prayer Meeting',
      description:
        'Join us for corporate prayer and intercession for our community.',
      date: '2024-01-16',
      time: '7:00 PM',
      endTime: '8:00 PM',
      location: 'Prayer Room',
      category: 'Prayer',
      capacity: 25,
      registered: 18,
      registrationStatus: 'available',
      icon: Heart,
      color: 'bg-pink-100 text-pink-800',
    },
    {
      id: 6,
      title: 'Community Outreach',
      description:
        'Serve our local community through various volunteer opportunities.',
      date: '2024-01-20',
      time: '9:00 AM',
      endTime: '3:00 PM',
      location: 'Community Center',
      category: 'Service',
      capacity: 40,
      registered: 35,
      registrationStatus: 'available',
      icon: Users,
      color: 'bg-yellow-100 text-yellow-800',
    },
  ];

  const myRegistrations = events.filter(
    (event) => event.registrationStatus === 'registered'
  );
  const availableEvents = events.filter(
    (event) => event.registrationStatus !== 'registered'
  );

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' ||
      event.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'waitlist':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'available':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'waitlist':
        return 'Waitlisted';
      case 'available':
        return 'Available';
      default:
        return 'Unknown';
    }
  };

  const handleRegister = (eventId: number) => {
    // biome-ignore lint/suspicious/noConsole: ignore log
    console.log(`Registering for event ${eventId}`);
    // Handle registration logic
  };

  const handleUnregister = (eventId: number) => {
    // biome-ignore lint/suspicious/noConsole: ignore log
    console.log(`Unregistering from event ${eventId}`);
    // Handle unregistration logic
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Church Events</CardTitle>
          <CardDescription>
            Discover and register for upcoming church events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setFilterCategory} value={filterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="worship">Worship</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs className="space-y-6" defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="registered">
            My Events ({myRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="available">Available Events</TabsTrigger>
        </TabsList>

        {/* All Events */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const IconComponent = event.icon;
              return (
                <Card
                  className="transition-shadow hover:shadow-md"
                  key={event.id}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`rounded-lg p-2 ${event.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {event.title}
                          </CardTitle>
                          <Badge className="mt-1" variant="outline">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      {getStatusIcon(event.registrationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {event.time} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.registered}/{event.capacity} registered
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium text-muted-foreground text-sm">
                        {getStatusText(event.registrationStatus)}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedEvent(event)}
                            size="sm"
                            variant={
                              event.registrationStatus === 'registered'
                                ? 'outline'
                                : 'default'
                            }
                          >
                            {event.registrationStatus === 'registered'
                              ? 'View Details'
                              : 'Register'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          {selectedEvent && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <selectedEvent.icon className="h-5 w-5" />
                                  <span>{selectedEvent.title}</span>
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedEvent.description}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="font-medium">Date</Label>
                                    <p>
                                      {new Date(
                                        selectedEvent.date
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Time</Label>
                                    <p>
                                      {selectedEvent.time} -{' '}
                                      {selectedEvent.endTime}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">
                                      Location
                                    </Label>
                                    <p>{selectedEvent.location}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">
                                      Capacity
                                    </Label>
                                    <p>
                                      {selectedEvent.registered}/
                                      {selectedEvent.capacity}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  {selectedEvent.registrationStatus ===
                                  'registered' ? (
                                    <Button
                                      className="flex-1"
                                      onClick={() =>
                                        handleUnregister(selectedEvent.id)
                                      }
                                      variant="destructive"
                                    >
                                      Unregister
                                    </Button>
                                  ) : (
                                    <Button
                                      className="flex-1"
                                      disabled={
                                        selectedEvent.registrationStatus ===
                                        'waitlist'
                                      }
                                      onClick={() =>
                                        handleRegister(selectedEvent.id)
                                      }
                                    >
                                      {selectedEvent.registrationStatus ===
                                      'waitlist'
                                        ? 'Join Waitlist'
                                        : 'Register'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Events */}
        <TabsContent value="registered">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myRegistrations.map((event) => {
              const IconComponent = event.icon;
              return (
                <Card className="border-green-200 bg-green-50" key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`rounded-lg p-2 ${event.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {event.title}
                          </CardTitle>
                          <Badge className="mt-1 bg-green-100 text-green-800">
                            Registered
                          </Badge>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {event.time} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-transparent"
                      size="sm"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Available Events */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableEvents.map((event) => {
              const IconComponent = event.icon;
              return (
                <Card
                  className="transition-shadow hover:shadow-md"
                  key={event.id}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className={`rounded-lg p-2 ${event.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className="mt-1" variant="outline">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {event.time} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.registered}/{event.capacity} registered
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      disabled={event.registrationStatus === 'waitlist'}
                      onClick={() => handleRegister(event.id)}
                      size="sm"
                    >
                      {event.registrationStatus === 'waitlist'
                        ? 'Join Waitlist'
                        : 'Register Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
