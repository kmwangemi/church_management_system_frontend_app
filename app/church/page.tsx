'use client';

import RenderApiError from '@/components/api-error';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
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
import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/use-auth';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
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
  const { organizationId, organizationName } = useActiveOrganization();
  const { user: session } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['church-dashboard-overview', organizationId],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard', {
        params: { organizationId },
      });
      return response.data;
    },
    staleTime: 30_000,
  });

  const statsData = dashboardData?.stats;
  const stats = [
    {
      title: 'Total Members',
      value: Number(statsData?.totalMembers?.value ?? 0).toLocaleString(),
      change: statsData?.totalMembers?.change || '0%',
      trend: statsData?.totalMembers?.trend || 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: "This Week's Attendance",
      value: Number(statsData?.weeklyAttendance?.value ?? 0).toLocaleString(),
      change: statsData?.weeklyAttendance?.change || '0%',
      trend: statsData?.weeklyAttendance?.trend || 'up',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Giving',
      value: `KES ${Number(statsData?.monthlyGiving?.value ?? 0).toLocaleString()}`,
      change: statsData?.monthlyGiving?.change || '0%',
      trend: statsData?.monthlyGiving?.trend || 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Events',
      value: Number(statsData?.activeEvents?.value ?? 0).toLocaleString(),
      change: statsData?.activeEvents?.change || '+0',
      trend: statsData?.activeEvents?.trend || 'up',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities: any[] = dashboardData?.recentActivities || [];
  const upcomingEvents: any[] = dashboardData?.upcomingEvents || [];
  const attendanceTrends: any[] = dashboardData?.attendanceTrends || [
    { week: 'Week 1', attendees: 0, percentage: 0 },
    { week: 'Week 2', attendees: 0, percentage: 0 },
    { week: 'Week 3', attendees: 0, percentage: 0 },
    { week: 'Week 4', attendees: 0, percentage: 0 },
  ];
  const ministryHealth = dashboardData?.ministryHealth || {
    newMembers: { label: '0 this month', percentage: 0 },
    volunteerEngagement: { label: '0%', percentage: 0 },
    givingGoal: { label: 'KES 0 / KES 50,000', percentage: 0 },
    prayerRequests: { label: '0 active', percentage: 0 },
  };

  const getEventStyle = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('study') || cat.includes('prayer')) {
      return { Icon: Heart, color: 'bg-green-100 text-green-600' };
    }
    if (cat.includes('youth') || cat.includes('meeting') || cat.includes('social')) {
      return { Icon: Users, color: 'bg-purple-100 text-purple-600' };
    }
    return { Icon: Calendar, color: 'bg-blue-100 text-blue-600' };
  };

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

  const userFirstName =
    session?.firstName ||
    (session as any)?.name?.split(' ')?.[0] ||
    (session as any)?.display_name?.split(' ')?.[0] ||
    'User';
  const displayChurchName =
    dashboardData?.churchName || organizationName || 'Your Church';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl">
              Welcome back, {capitalizeFirstLetterOfEachWord(userFirstName)}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening at{' '}
              {capitalizeFirstLetterOfEachWord(displayChurchName)} today.
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

      {isError && <RenderApiError error={error} />}
      {isLoading ? (
        <SpinnerLoader description="Loading dashboard overview..." />
      ) : (
        <>
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
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          className="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-accent"
                          key={activity.id}
                        >
                          <div
                            className={`mt-2 h-2 w-2 rounded-full ${activity.color || 'bg-blue-500'}`}
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
                  ) : (
                    <p className="py-8 text-center text-muted-foreground text-sm">
                      No recent activity recorded yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <div className="rounded bg-purple-100 p-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Upcoming Events</span>
                </CardTitle>
                <CardDescription>Events scheduled for this church</CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/church/events">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {upcomingEvents.map((event) => {
                    const { Icon, color } = getEventStyle(event.category);
                    return (
                      <div
                        className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                        key={event.id}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className={`rounded-lg p-2 ${color}`}>
                            <Icon className="h-5 w-5" />
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
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground text-sm">
                  No upcoming events scheduled yet.
                </p>
              )}
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
                  {attendanceTrends.map((item, idx) => (
                    <div className="space-y-2" key={idx}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.week}</span>
                        <span className="text-muted-foreground text-sm">
                          {item.attendees} people
                        </span>
                      </div>
                      <Progress className="h-2" value={item.percentage} />
                    </div>
                  ))}
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
                      <span className="text-muted-foreground text-sm">
                        {ministryHealth.newMembers?.label}
                      </span>
                    </div>
                    <Progress
                      className="h-2"
                      value={ministryHealth.newMembers?.percentage ?? 0}
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-sm">
                        Volunteer Engagement
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {ministryHealth.volunteerEngagement?.label}
                      </span>
                    </div>
                    <Progress
                      className="h-2"
                      value={
                        ministryHealth.volunteerEngagement?.percentage ?? 0
                      }
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-sm">Giving Goal</span>
                      <span className="text-muted-foreground text-sm">
                        {ministryHealth.givingGoal?.label}
                      </span>
                    </div>
                    <Progress
                      className="h-2"
                      value={ministryHealth.givingGoal?.percentage ?? 0}
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-sm">
                        Prayer Requests
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {ministryHealth.prayerRequests?.label}
                      </span>
                    </div>
                    <Progress
                      className="h-2"
                      value={ministryHealth.prayerRequests?.percentage ?? 0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
