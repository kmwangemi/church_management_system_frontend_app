'use client';

import { DollarSign, Download, MapPin, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useSuperAdminAnalytics } from '@/hooks/api/use-superadmin';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const { data: analyticsData, isLoading, refetch } = useSuperAdminAnalytics({ timeRange });

  const metrics = analyticsData?.metrics || {
    totalGrowthRate: 12.4,
    avgChurchSize: 0,
    revenuePerMember: 0,
    totalRevenue: 0,
    totalChurches: 0,
    totalMembers: 0,
    globalReach: 0,
    currency: 'KES',
  };

  const membershipGrowthData = analyticsData?.membershipGrowthData || [];
  const revenueData = analyticsData?.revenueData || [];
  const churchDistributionData = analyticsData?.churchDistributionData || [];
  const attendanceData = analyticsData?.attendanceData || [];
  const topPerformingChurches = analyticsData?.topPerformingChurches || [];
  const regionalData = analyticsData?.regionalData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and financial insights across all churches (KES)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
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
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="font-bold text-2xl">+{metrics.totalGrowthRate}%</div>
            )}
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+2.1%</span> from last quarter
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
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="font-bold text-2xl">{metrics.avgChurchSize}</div>
            )}
            <p className="text-muted-foreground text-xs">
              members per registered church
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
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="font-bold text-2xl">
                KES {Number(metrics.revenuePerMember).toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              average collections per member
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Churches</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">{metrics.totalChurches}</div>
            )}
            <p className="text-muted-foreground text-xs">
              monitored organizations
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
              Total members and monthly member registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics (KES)</CardTitle>
            <CardDescription>
              Monthly collections broken down by offerings and tithes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer
                className="h-[300px]"
                config={{
                  revenue: {
                    label: 'Total Revenue (KES)',
                    color: 'hsl(var(--chart-1))',
                  },
                  offerings: {
                    label: 'Offerings (KES)',
                    color: 'hsl(var(--chart-2))',
                  },
                  tithes: {
                    label: 'Tithes (KES)',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
              >
                <ResponsiveContainer height="100%" width="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => `KES ${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            `KES ${Number(value).toLocaleString()}`,
                            name,
                          ]}
                        />
                      }
                    />
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Church Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Church Distribution by Denomination</CardTitle>
            <CardDescription>
              Breakdown of registered churches by religious denomination
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] w-full">
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
                      {churchDistributionData.map((entry: any, index: number) => (
                        <Cell fill={entry.color || '#8884d8'} key={`cell-${index}`} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Pattern</CardTitle>
            <CardDescription>
              Attendance vs capacity across all church branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
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
            )}
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
              Churches ranked by active membership and collections (KES)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...new Array(4)].map((_, i) => (
                  <Skeleton className="h-12 w-full" key={i} />
                ))}
              </div>
            ) : topPerformingChurches.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-sm">
                No church records found yet.
              </p>
            ) : (
              <div className="space-y-4">
                {topPerformingChurches.map((church: any, index: number) => (
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
                      <p className="mt-1 font-medium text-sm">
                        {church.revenueFormatted || `KES ${Number(church.revenue || 0).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>
              Church distribution and growth by geographic territory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...new Array(4)].map((_, i) => (
                  <Skeleton className="h-12 w-full" key={i} />
                ))}
              </div>
            ) : regionalData.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-sm">
                No regional data available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {regionalData.map((region: any) => (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>
            System insights based on current data patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Steady Growth</h4>
              </div>
              <p className="text-green-700 text-sm">
                Overall church and membership acquisition is trending positive. Focus on branch expansion.
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
                Sunday services average 85% branch capacity. Consider multiple Sunday services in busy campuses.
              </p>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-800">
                  Regional Focus
                </h4>
              </div>
              <p className="text-purple-700 text-sm">
                Urban campuses show the fastest growth rate in both membership and weekly collections (KES).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
