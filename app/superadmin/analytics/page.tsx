'use client';

import { DollarSign, Download, MapPin, TrendingUp, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AnalyticsPage() {
  // Sample data for charts
  const membershipGrowthData = [
    { month: 'Jan', members: 82_450, newMembers: 1250, churches: 235 },
    { month: 'Feb', members: 83_200, newMembers: 750, churches: 238 },
    { month: 'Mar', members: 84_100, newMembers: 900, churches: 240 },
    { month: 'Apr', members: 85_300, newMembers: 1200, churches: 242 },
    { month: 'May', members: 86_800, newMembers: 1500, churches: 244 },
    { month: 'Jun', members: 88_200, newMembers: 1400, churches: 246 },
    { month: 'Jul', members: 89_432, newMembers: 1232, churches: 247 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2_100_000, offerings: 1_800_000, tithes: 300_000 },
    { month: 'Feb', revenue: 2_150_000, offerings: 1_850_000, tithes: 300_000 },
    { month: 'Mar', revenue: 2_200_000, offerings: 1_900_000, tithes: 300_000 },
    { month: 'Apr', revenue: 2_280_000, offerings: 1_950_000, tithes: 330_000 },
    { month: 'May', revenue: 2_350_000, offerings: 2_000_000, tithes: 350_000 },
    { month: 'Jun', revenue: 2_380_000, offerings: 2_030_000, tithes: 350_000 },
    { month: 'Jul', revenue: 2_400_000, offerings: 2_050_000, tithes: 350_000 },
  ];

  const churchDistributionData = [
    { name: 'Baptist', value: 85, color: '#8884d8' },
    { name: 'Methodist', value: 62, color: '#82ca9d' },
    { name: 'Presbyterian', value: 45, color: '#ffc658' },
    { name: 'Pentecostal', value: 38, color: '#ff7300' },
    { name: 'Non-denominational', value: 17, color: '#00ff00' },
  ];

  const attendanceData = [
    { day: 'Sunday', attendance: 45_200, capacity: 52_000 },
    { day: 'Monday', attendance: 8500, capacity: 15_000 },
    { day: 'Tuesday', attendance: 12_000, capacity: 18_000 },
    { day: 'Wednesday', attendance: 28_000, capacity: 35_000 },
    { day: 'Thursday', attendance: 9500, capacity: 15_000 },
    { day: 'Friday', attendance: 15_000, capacity: 22_000 },
    { day: 'Saturday', attendance: 18_000, capacity: 25_000 },
  ];

  const topPerformingChurches = [
    {
      name: 'Grace Community Church',
      growth: 15.2,
      members: 2450,
      revenue: 45_000,
    },
    {
      name: 'Faith Baptist Church',
      growth: 12.8,
      members: 1890,
      revenue: 38_500,
    },
    {
      name: 'Hope Methodist Church',
      growth: 10.5,
      members: 1650,
      revenue: 32_000,
    },
    {
      name: 'Trinity Presbyterian',
      growth: 8.9,
      members: 1420,
      revenue: 28_750,
    },
    { name: 'New Life Assembly', growth: 7.6, members: 1380, revenue: 27_200 },
  ];

  const regionalData = [
    { region: 'North America', churches: 145, members: 52_000, growth: 8.5 },
    { region: 'South America', churches: 38, members: 15_000, growth: 12.3 },
    { region: 'Europe', churches: 42, members: 18_000, growth: 6.2 },
    { region: 'Africa', churches: 15, members: 8000, growth: 18.7 },
    { region: 'Asia', churches: 7, members: 3500, growth: 22.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights across all churches
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">+12.4%</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Avg. Church Size
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">362</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+5.2%</span> members per church
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Revenue per Member
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$27</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+8.3%</span> monthly average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Global Reach</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">5</div>
            <p className="text-muted-foreground text-xs">
              continents with active churches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Membership Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Growth Trend</CardTitle>
            <CardDescription>
              Total members and new registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                members: {
                  label: 'Total Members',
                  color: 'hsl(var(--chart-1))',
                },
                newMembers: {
                  label: 'New Members',
                  color: 'hsl(var(--chart-2))',
                },
              }}
            >
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={membershipGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    dataKey="members"
                    name="Total Members"
                    stroke="var(--color-members)"
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    dataKey="newMembers"
                    name="New Members"
                    stroke="var(--color-newMembers)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Monthly revenue breakdown by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                revenue: {
                  label: 'Total Revenue',
                  color: 'hsl(var(--chart-1))',
                },
                offerings: {
                  label: 'Offerings',
                  color: 'hsl(var(--chart-2))',
                },
                tithes: {
                  label: 'Tithes',
                  color: 'hsl(var(--chart-3))',
                },
              }}
            >
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    dataKey="offerings"
                    fill="var(--color-offerings)"
                    name="Offerings"
                    stackId="1"
                    stroke="var(--color-offerings)"
                    type="monotone"
                  />
                  <Area
                    dataKey="tithes"
                    fill="var(--color-tithes)"
                    name="Tithes"
                    stackId="1"
                    stroke="var(--color-tithes)"
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Church Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Church Distribution by Denomination</CardTitle>
            <CardDescription>
              Breakdown of churches by religious denomination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                baptist: { label: 'Baptist', color: '#8884d8' },
                methodist: { label: 'Methodist', color: '#82ca9d' },
                presbyterian: { label: 'Presbyterian', color: '#ffc658' },
                pentecostal: { label: 'Pentecostal', color: '#ff7300' },
                nondenominational: {
                  label: 'Non-denominational',
                  color: '#00ff00',
                },
              }}
            >
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={churchDistributionData}
                    dataKey="value"
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    outerRadius={80}
                  >
                    {churchDistributionData.map((entry, index) => (
                      <Cell fill={entry.color} key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Pattern</CardTitle>
            <CardDescription>
              Attendance vs capacity across all churches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                attendance: {
                  label: 'Attendance',
                  color: 'hsl(var(--chart-1))',
                },
                capacity: {
                  label: 'Capacity',
                  color: 'hsl(var(--chart-2))',
                },
              }}
            >
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="capacity"
                    fill="var(--color-capacity)"
                    name="Capacity"
                    opacity={0.3}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="var(--color-attendance)"
                    name="Attendance"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Churches */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Churches</CardTitle>
            <CardDescription>
              Churches ranked by growth and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingChurches.map((church, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-3"
                  key={church.name}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 font-medium text-sm text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{church.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {church.members} members
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="mr-1 h-3 w-3" />+{church.growth}%
                      </Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground text-sm">
                      ${church.revenue.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>
              Church distribution and growth by geographic region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalData.map((region) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-3"
                  key={region.region}
                >
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-muted-foreground text-sm">
                      {region.churches} churches •{' '}
                      {region.members.toLocaleString()} members
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${
                        region.growth > 15
                          ? 'bg-green-100 text-green-800'
                          : region.growth > 10
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />+{region.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>
            AI-powered insights based on current data trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Strong Growth</h4>
              </div>
              <p className="text-green-700 text-sm">
                Overall membership growth of 12.4% exceeds industry average.
                Focus on retention strategies.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">
                  Capacity Optimization
                </h4>
              </div>
              <p className="text-blue-700 text-sm">
                Sunday services at 87% capacity. Consider additional service
                times or expansion.
              </p>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-800">
                  Regional Expansion
                </h4>
              </div>
              <p className="text-purple-700 text-sm">
                Africa and Asia show highest growth rates. Consider targeted
                expansion programs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
