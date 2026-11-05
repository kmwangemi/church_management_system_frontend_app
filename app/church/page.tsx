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
import { Progress } from '@/components/ui/progress';
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useFetchEvents } from '@/lib/hooks/church/event/use-event-queries';
import { useFetchOfferings } from '@/lib/hooks/church/offering/use-offering-queries';
import { useFetchUsers } from '@/lib/hooks/church/user/use-user-queries';
import { useAuth } from '@/lib/use-auth';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import {
  Building,
  Calendar,
  CalendarDays,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { organizationName } = useActiveOrganization();
  const {
    user: session,
  } = useAuth();
  const { data: usersData } = useFetchUsers(1, '');
  const { data: eventsData } = useFetchEvents(1, '');
  const { data: offeringsData } = useFetchOfferings();

  const totalMembersCount =
    (usersData as any)?.pagination?.total ??
    (usersData as any)?.users?.length ??
    0;
  const serverEvents =
    (eventsData as any)?.events || (eventsData as any)?.data || [];
  const serverOfferings =
    (offeringsData as any)?.data?.offerings ||
    (offeringsData as any)?.offerings ||
    (offeringsData as any)?.data ||
    [];
  const totalGivingAmount = Array.isArray(serverOfferings)
    ? serverOfferings.reduce(
        (sum: number, o: any) => sum + Number(o.amount || 0),
        0
      )
    : 0;

  const stats = [
    {
      title: 'Total Members',
      value: totalMembersCount.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: "This Week's Attendance",
      value: String(Math.round(totalMembersCount * 0.85)),
      change: '+5%',
      trend: 'up',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Giving',
      value: `KES ${totalGivingAmount.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Events',
      value: String(Array.isArray(serverEvents) ? serverEvents.length : 0),
      change: '+1',
      trend: 'up',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'member',
      title: 'New member registered',
      description: 'Sarah Johnson joined the church',
      time: '2h ago',
      color: 'bg-green-500',
    },
    {
      id: 2,
      type: 'event',
      title: 'Event created',
      description: 'Youth Conference scheduled for next month',
      time: '4h ago',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      type: 'finance',
      title: 'Offering recorded',
      description: 'Sunday service offering: KES 2,450',
      time: '1d ago',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      type: 'prayer',
      title: 'Prayer request submitted',
      description: 'New prayer request needs attention',
      time: '2d ago',
      color: 'bg-orange-500',
    },
    {
      id: 5,
      type: 'asset',
      title: 'Asset maintenance scheduled',
      description: 'Church bus maintenance due next week',
      time: '3d ago',
      color: 'bg-red-500',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Service',
      location: 'Main sanctuary',
      time: '9:00 AM',
      date: 'Tomorrow',
      attendees: 450,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      title: 'Bible Study',
      location: 'Fellowship hall',
      time: '7:00 PM',
      date: 'Wednesday',
      attendees: 85,
      icon: Heart,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 3,
      title: 'Youth Meeting',
      location: 'Youth center',
      time: '6:00 PM',
      date: 'Friday',
      attendees: 120,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Member',
      description: 'Register a new church member',
      icon: UserPlus,
      href: '/church/users',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      title: 'Create Event',
      description: 'Schedule a new church event',
      icon: CalendarDays,
      href: '/church/events',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      title: 'Record Offering',
      description: 'Log financial contributions',
      icon: DollarSign,
      href: '/church/finance',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
    {
      title: 'Manage Assets',
      description: 'Update church assets and properties',
      icon: Building,
      href: '/church/assets',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl">
              Welcome back,{' '}
              {capitalizeFirstLetterOfEachWord(session?.firstName || 'user')}!
              👋
            </h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening at{' '}
              {capitalizeFirstLetterOfEachWord(organizationName)} today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="rounded-lg bg-background/10 p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card className="transition-shadow hover:shadow-lg" key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 flex items-center space-x-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="rounded bg-blue-100 p-1">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  asChild
                  className={`h-auto w-full justify-start p-4 ${action.color}`}
                  key={index}
                  variant="outline"
                >
                  <Link href={action.href}>
                    <div className="flex items-start space-x-3">
                      <action.icon className="mt-0.5 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-muted-foreground text-sm">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="rounded bg-green-100 p-1">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    className="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-accent"
                    key={activity.id}
                  >
                    <div
                      className={`mt-2 h-2 w-2 rounded-full ${activity.color}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {activity.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {activity.description}
                      </p>
                    </div>
                    <Badge className="text-xs" variant="secondary">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="rounded bg-purple-100 p-1">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <span>Upcoming Events</span>
          </CardTitle>
          <CardDescription>Events scheduled for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                key={event.id}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${event.color}`}>
                    <event.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{event.date}</Badge>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">
                  {event.title}
                </h4>
                <div className="space-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} expected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Church Health Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              Weekly attendance over the last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Week 1</span>
                <span className="text-muted-foreground text-sm">820 people</span>
              </div>
              <Progress className="h-2" value={85} />
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Week 2</span>
                <span className="text-muted-foreground text-sm">856 people</span>
              </div>
              <Progress className="h-2" value={89} />
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Week 3</span>
                <span className="text-muted-foreground text-sm">792 people</span>
              </div>
              <Progress className="h-2" value={82} />
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Week 4</span>
                <span className="text-muted-foreground text-sm">901 people</span>
              </div>
              <Progress className="h-2" value={94} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ministry Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">New Members</span>
                  <span className="text-muted-foreground text-sm">15 this month</span>
                </div>
                <Progress className="h-2" value={75} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Volunteer Engagement
                  </span>
                  <span className="text-muted-foreground text-sm">89%</span>
                </div>
                <Progress className="h-2" value={89} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">Giving Goal</span>
                  <span className="text-muted-foreground text-sm">KES 45K / KES 50K</span>
                </div>
                <Progress className="h-2" value={90} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">Prayer Requests</span>
                  <span className="text-muted-foreground text-sm">23 active</span>
                </div>
                <Progress className="h-2" value={60} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
