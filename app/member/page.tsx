'use client';

import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Gift,
  Heart,
  MapPin,
  Phone,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFetchAnnouncements } from '@/lib/hooks/church/announcement/use-announcement-queries';
import { useFetchEvents } from '@/lib/hooks/church/event/use-event-queries';
import { useFetchOfferings } from '@/lib/hooks/church/offering/use-offering-queries';
import { useFetchPrayerRequests } from '@/lib/hooks/church/prayer-request/use-prayer-request-queries';
import { useAuth } from '@/lib/use-auth';

export default function MemberDashboard() {
  const { user } = useAuth();
  const { data: eventsData } = useFetchEvents(1, '');
  const { data: announcementsData } = useFetchAnnouncements(1, '');
  const { data: offeringsData } = useFetchOfferings();
  const { data: prayersData } = useFetchPrayerRequests({});

  const serverEvents = (eventsData as any)?.events || (eventsData as any)?.data || [];
  const serverAnnouncements =
    (announcementsData as any)?.announcements ||
    (announcementsData as any)?.data ||
    [];
  const serverOfferings =
    (offeringsData as any)?.data?.offerings ||
    (offeringsData as any)?.offerings ||
    [];
  const serverPrayers =
    (prayersData as any)?.data?.prayerRequests ||
    (prayersData as any)?.prayerRequests ||
    [];

  const totalGiving = Array.isArray(serverOfferings)
    ? serverOfferings.reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0)
    : 0;

  const memberStats = {
    totalGiving,
    attendanceRate: 85,
    eventsAttended: Array.isArray(serverEvents) ? serverEvents.length : 0,
    prayerRequests: Array.isArray(serverPrayers) ? serverPrayers.length : 0,
    smallGroups: 2,
    volunteerHours: 24,
  };

  const upcomingEvents = (Array.isArray(serverEvents) ? serverEvents : []).slice(0, 3).map((e: any) => ({
    id: e.id || e._id,
    title: e.title || e.name || 'Church Event',
    date: e.startDate ? new Date(e.startDate).toLocaleDateString() : e.date || '',
    time: e.startTime || e.time || '09:00 AM',
    location: e.location || 'Main Sanctuary',
    registered: true,
  }));

  const recentAnnouncements = (Array.isArray(serverAnnouncements) ? serverAnnouncements : []).slice(0, 3).map((a: any) => ({
    id: a.id || a._id,
    title: a.title || 'Announcement',
    content: a.content || '',
    date: a.publishDate ? new Date(a.publishDate).toLocaleDateString() : '',
    priority: (a.priority || 'medium').toLowerCase(),
  }));

  const spiritualMilestones = [
    { title: 'Baptism', date: '2020-06-15', completed: true },
    { title: 'First Communion', date: '2020-08-20', completed: true },
    { title: 'Bible Study Completion', date: '2023-12-10', completed: true },
    { title: 'Leadership Training', date: '2024-03-15', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-2xl">
              Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-blue-100">
              {"Here's what's happening in your spiritual journey"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Member since</p>
            <p className="font-semibold text-lg">March 2020</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Giving</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {memberStats.totalGiving.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {memberStats.attendanceRate}%
            </div>
            <Progress className="mt-2" value={memberStats.attendanceRate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Events Attended
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {memberStats.eventsAttended}
            </div>
            <p className="text-muted-foreground text-xs">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Volunteer Hours
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {memberStats.volunteerHours}
            </div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>
              Events you're registered for or might be interested in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                className="flex items-center justify-between rounded-lg border p-3"
                key={event.id}
              >
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="mt-1 flex items-center space-x-4 text-muted-foreground text-sm">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {event.registered ? (
                    <Badge
                      className="bg-green-100 text-green-800"
                      variant="secondary"
                    >
                      Registered
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Register
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button className="w-full bg-transparent" variant="outline">
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Recent Announcements</span>
            </CardTitle>
            <CardDescription>Latest updates from your church</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div className="rounded-lg border p-3" key={announcement.id}>
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <Badge
                    className="text-xs"
                    variant={
                      announcement.priority === 'high'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="mb-2 text-muted-foreground text-sm">
                  {announcement.content}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
            <Button className="w-full bg-transparent" variant="outline">
              View All Announcements
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spiritual Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Spiritual Milestones</span>
            </CardTitle>
            <CardDescription>
              Track your spiritual growth and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spiritualMilestones.map((milestone, index) => (
              <div className="flex items-center space-x-3" key={index}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    milestone.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {milestone.completed ? (
                    <Award className="h-4 w-4" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {milestone.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {milestone.completed ? 'Completed' : 'Upcoming'} -{' '}
                    {new Date(milestone.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Gift className="mr-2 h-4 w-4" />
              Make a Contribution
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Heart className="mr-2 h-4 w-4" />
              Submit Prayer Request
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Small Group
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Register for Event
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Pastor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
