'use client';

import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  MapPin,
  RefreshCw,
  Server,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuperAdminDashboard } from '@/hooks/api/use-superadmin';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { data: dashboardData, isLoading, refetch } = useSuperAdminDashboard();

  const iconMap: Record<string, any> = {
    'Total Churches': Building2,
    'Total Members': Users,
    'Active Branches': MapPin,
    'Monthly Revenue': DollarSign,
  };

  const rawStats = dashboardData?.stats || [];
  const stats = rawStats.map((s: any) => ({
    ...s,
    icon: iconMap[s.name] || Building2,
  }));

  const topChurches = dashboardData?.topChurches || [];
  const systemAlerts = dashboardData?.systemAlerts || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const systemHealth = dashboardData?.systemHealth || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            SuperAdmin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Live global overview of all registered churches and system performance (KES)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Live Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [...new Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : stats.length === 0 ? (
          <div className="col-span-full py-6 text-center text-muted-foreground">
            No statistics available yet.
          </div>
        ) : (
          stats.map((stat: any) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  <span
                    className={`inline-flex items-center ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Churches */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Churches</CardTitle>
            <CardDescription>
              Churches ranked by active members and collections (KES)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...new Array(4)].map((_, i) => (
                  <Skeleton className="h-12 w-full" key={i} />
                ))}
              </div>
            ) : topChurches.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                No churches registered yet.
              </div>
            ) : (
              <div className="space-y-4">
                {topChurches.map((church: any, index: number) => (
                  <div
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    key={church.name}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 font-medium text-sm text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{church.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {church.members} members
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{church.revenue}</p>
                      <p className="text-green-600 text-xs">+{church.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Real-time operational and resource metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...new Array(4)].map((_, i) => (
                  <Skeleton className="h-8 w-full" key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {systemHealth.map((metric: any) => (
                  <div className="space-y-2" key={metric.name}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{metric.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {metric.value}%
                      </span>
                    </div>
                    <Progress
                      className={`h-2 ${
                        metric.status === 'excellent'
                          ? 'bg-green-100'
                          : metric.status === 'good'
                            ? 'bg-blue-100'
                            : 'bg-yellow-100'
                      }`}
                      value={metric.value}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Platform notifications and service statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...new Array(3)].map((_, i) => (
                  <Skeleton className="h-10 w-full" key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {systemAlerts.map((alert: any, index: number) => (
                  <div className="flex items-start space-x-3" key={index}>
                    <div className="mt-0.5">
                      {alert.type === 'warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {alert.type === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {alert.type === 'info' && (
                        <Activity className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-muted-foreground text-xs">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Live audit events recorded across all churches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...new Array(3)].map((_, i) => (
                  <Skeleton className="h-10 w-full" key={i} />
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                No recent activities recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity: any, index: number) => (
                  <div className="flex items-start space-x-3" key={index}>
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.church}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Administrative shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/superadmin/churches')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Churches
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/superadmin/branches')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Manage Branches
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/superadmin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/superadmin/system-health')}
            >
              <Server className="mr-2 h-4 w-4" />
              System Health
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
