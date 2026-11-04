'use client';

import {
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  Heart,
  Star,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MemberAnalytics() {
  const memberStats = {
    attendanceRate: 85,
    givingGoal: 3000,
    givingProgress: 2450,
    volunteerHours: 124,
    eventsAttended: 18,
    prayerRequests: 7,
    bibleReadingStreak: 45,
    smallGroupParticipation: 92,
  };

  const attendanceData = [
    { month: 'Jan', attendance: 4, services: 4 },
    { month: 'Feb', attendance: 3, services: 4 },
    { month: 'Mar', attendance: 4, services: 4 },
    { month: 'Apr', attendance: 3, services: 4 },
    { month: 'May', attendance: 4, services: 5 },
    { month: 'Jun', attendance: 4, services: 4 },
    { month: 'Jul', attendance: 3, services: 4 },
    { month: 'Aug', attendance: 4, services: 4 },
    { month: 'Sep', attendance: 4, services: 4 },
    { month: 'Oct', attendance: 3, services: 4 },
    { month: 'Nov', attendance: 4, services: 4 },
    { month: 'Dec', attendance: 4, services: 5 },
  ];

  const givingData = [
    { month: 'Jan', amount: 250 },
    { month: 'Feb', amount: 200 },
    { month: 'Mar', amount: 250 },
    { month: 'Apr', amount: 180 },
    { month: 'May', amount: 300 },
    { month: 'Jun', amount: 250 },
    { month: 'Jul', amount: 220 },
    { month: 'Aug', amount: 250 },
    { month: 'Sep', amount: 280 },
    { month: 'Oct', amount: 200 },
    { month: 'Nov', amount: 250 },
    { month: 'Dec', amount: 270 },
  ];

  const involvementData = [
    { name: 'Worship Services', value: 48, color: '#3b82f6' },
    { name: 'Small Groups', value: 24, color: '#10b981' },
    { name: 'Volunteer Work', value: 16, color: '#f59e0b' },
    { name: 'Prayer Meetings', value: 12, color: '#ef4444' },
  ];

  const spiritualGrowthData = [
    { category: 'Bible Reading', current: 45, goal: 365 },
    { category: 'Prayer Time', current: 280, goal: 365 },
    { category: 'Service Hours', current: 124, goal: 150 },
    { category: 'Small Group', current: 22, goal: 24 },
  ];

  const achievements = [
    {
      title: 'Perfect Attendance',
      description: 'Attended every service in November',
      date: '2023-11-30',
      icon: Calendar,
    },
    {
      title: 'Generous Giver',
      description: 'Exceeded annual giving goal',
      date: '2023-10-15',
      icon: DollarSign,
    },
    {
      title: 'Faithful Volunteer',
      description: '100+ volunteer hours',
      date: '2023-09-20',
      icon: Heart,
    },
    {
      title: 'Bible Study Graduate',
      description: 'Completed Romans study',
      date: '2023-08-10',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Attendance Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {memberStats.attendanceRate}%
            </div>
            <Progress className="mt-2" value={memberStats.attendanceRate} />
            <p className="mt-2 text-muted-foreground text-xs">
              Above church average (78%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Giving Progress
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {memberStats.givingProgress.toLocaleString()}
            </div>
            <Progress
              className="mt-2"
              value={
                (memberStats.givingProgress / memberStats.givingGoal) * 100
              }
            />
            <p className="mt-2 text-muted-foreground text-xs">
              KES {memberStats.givingGoal - memberStats.givingProgress} to goal
            </p>
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
            <p className="text-muted-foreground text-xs">
              This year • +24% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Bible Reading</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {memberStats.bibleReadingStreak}
            </div>
            <p className="text-muted-foreground text-xs">
              Day streak • Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs className="space-y-6" defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="giving">Giving</TabsTrigger>
          <TabsTrigger value="involvement">Involvement</TabsTrigger>
          <TabsTrigger value="growth">Spiritual Growth</TabsTrigger>
        </TabsList>

        {/* Attendance Analytics */}
        <TabsContent value="attendance">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
                <CardDescription>
                  Your service attendance throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    attendance: {
                      label: 'Services Attended',
                      color: 'hsl(var(--chart-1))',
                    },
                    services: {
                      label: 'Total Services',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="services"
                        fill="var(--color-services)"
                        name="Total Services"
                        opacity={0.3}
                      />
                      <Bar
                        dataKey="attendance"
                        fill="var(--color-attendance)"
                        name="Attended"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Insights</CardTitle>
                <CardDescription>
                  Your attendance patterns and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div>
                    <p className="font-medium text-green-900">Best Month</p>
                    <p className="text-green-700 text-sm">
                      Perfect attendance in March & September
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">100%</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <p className="font-medium text-blue-900">Current Streak</p>
                    <p className="text-blue-700 text-sm">
                      4 consecutive services
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                  <div>
                    <p className="font-medium text-purple-900">
                      Special Events
                    </p>
                    <p className="text-purple-700 text-sm">
                      Attended 6 out of 8 special events
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">75%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Giving Analytics */}
        <TabsContent value="giving">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Giving</CardTitle>
                <CardDescription>
                  Your contribution history over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    amount: {
                      label: 'Amount',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <AreaChart data={givingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        dataKey="amount"
                        fill="var(--color-amount)"
                        fillOpacity={0.3}
                        stroke="var(--color-amount)"
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giving Summary</CardTitle>
                <CardDescription>
                  Your generosity impact this year
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4 text-center">
                  <div className="mb-2 font-bold text-3xl text-green-600">
                    KES {memberStats.givingProgress.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-sm">Total given this year</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Average</span>
                    <span className="font-medium">
                      KES {Math.round(memberStats.givingProgress / 12)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Largest Gift</span>
                    <span className="font-medium">KES 300</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Giving Frequency</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goal Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (memberStats.givingProgress / memberStats.givingGoal) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Involvement Analytics */}
        <TabsContent value="involvement">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>
                  How you spend your time at church
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    value: {
                      label: 'Hours',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={involvementData}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                      >
                        {involvementData.map((entry, index) => (
                          <Cell fill={entry.color} key={`cell-${index}`} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ministry Involvement</CardTitle>
                <CardDescription>
                  Your active participation in church ministries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Small Group Leader</p>
                        <p className="text-muted-foreground text-sm">
                          Young Adults Group
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Volunteer</p>
                        <p className="text-muted-foreground text-sm">
                          Community Outreach
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Bible Study</p>
                        <p className="text-muted-foreground text-sm">
                          Wednesday Evening
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Regular
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spiritual Growth */}
        <TabsContent value="growth">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spiritual Growth Goals</CardTitle>
                <CardDescription>
                  Track your progress in key areas of spiritual development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {spiritualGrowthData.map((item) => (
                    <div className="space-y-2" key={item.category}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground text-sm">
                          {item.current}/{item.goal}
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={(item.current / item.goal) * 100}
                      />
                      <p className="text-muted-foreground text-xs">
                        {Math.round((item.current / item.goal) * 100)}% complete
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
                <CardDescription>
                  Milestones in your spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        className="flex items-center space-x-4 rounded-lg border p-3"
                        key={index}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                          <IconComponent className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {achievement.description}
                          </p>
                          <p className="mt-1 text-muted-foreground text-xs">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
