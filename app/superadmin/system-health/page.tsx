'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  Download,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Wifi,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Progress } from '@/components/ui/progress';

export default function SystemHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30_000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  // System metrics data
  const systemMetrics = [
    {
      name: 'Server Uptime',
      value: 99.97,
      status: 'excellent',
      icon: Server,
      description: '99.97% uptime over last 30 days',
      target: 99.9,
    },
    {
      name: 'Database Performance',
      value: 94.2,
      status: 'good',
      icon: Database,
      description: 'Average query response time: 45ms',
      target: 95.0,
    },
    {
      name: 'API Response Time',
      value: 87.5,
      status: 'warning',
      icon: Activity,
      description: 'Average response time: 120ms',
      target: 90.0,
    },
    {
      name: 'Network Latency',
      value: 92.8,
      status: 'good',
      icon: Wifi,
      description: 'Average latency: 25ms',
      target: 90.0,
    },
  ];

  const resourceUsage = [
    {
      name: 'CPU Usage',
      value: 68,
      max: 100,
      status: 'normal',
      icon: Cpu,
      color: 'blue',
    },
    {
      name: 'Memory Usage',
      value: 72,
      max: 100,
      status: 'normal',
      icon: MemoryStick,
      color: 'green',
    },
    {
      name: 'Storage Usage',
      value: 85,
      max: 100,
      status: 'warning',
      icon: HardDrive,
      color: 'yellow',
    },
    {
      name: 'Bandwidth Usage',
      value: 45,
      max: 100,
      status: 'normal',
      icon: Wifi,
      color: 'purple',
    },
  ];

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 23, storage: 78 },
    { time: '04:00', cpu: 38, memory: 58, network: 19, storage: 79 },
    { time: '08:00', cpu: 72, memory: 75, network: 45, storage: 82 },
    { time: '12:00', cpu: 85, memory: 82, network: 67, storage: 84 },
    { time: '16:00', cpu: 78, memory: 79, network: 52, storage: 85 },
    { time: '20:00', cpu: 65, memory: 71, network: 38, storage: 85 },
    { time: '24:00', cpu: 52, memory: 65, network: 28, storage: 85 },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Storage Usage',
      message: 'Storage usage has exceeded 80%. Consider cleanup or expansion.',
      timestamp: '5 minutes ago',
      severity: 'medium',
    },
    {
      id: 2,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2:00 AM EST.',
      timestamp: '2 hours ago',
      severity: 'low',
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully. All data secured.',
      timestamp: '6 hours ago',
      severity: 'low',
    },
    {
      id: 4,
      type: 'error',
      title: 'API Rate Limit Warning',
      message: 'API rate limits approaching threshold for external services.',
      timestamp: '1 day ago',
      severity: 'high',
    },
  ];

  const services = [
    {
      name: 'Web Server',
      status: 'online',
      uptime: '99.98%',
      lastCheck: '1 min ago',
    },
    {
      name: 'Database Server',
      status: 'online',
      uptime: '99.95%',
      lastCheck: '1 min ago',
    },
    {
      name: 'Email Service',
      status: 'online',
      uptime: '99.92%',
      lastCheck: '2 min ago',
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.99%',
      lastCheck: '1 min ago',
    },
    {
      name: 'Backup Service',
      status: 'maintenance',
      uptime: '99.85%',
      lastCheck: '5 min ago',
    },
    { name: 'CDN', status: 'online', uptime: '99.97%', lastCheck: '1 min ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'maintenance':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of system performance and health metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            disabled={isRefreshing}
            onClick={handleRefresh}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                {metric.name}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`font-bold text-2xl ${getStatusColor(metric.status)}`}
              >
                {metric.value}%
              </div>
              <div className="mt-2">
                <Progress className="h-2" value={metric.value} />
              </div>
              <p className="mt-2 text-muted-foreground text-xs">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>Current system resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {resourceUsage.map((resource) => (
              <div className="space-y-3" key={resource.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <resource.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{resource.name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {resource.value}%
                  </span>
                </div>
                <Progress
                  className={`h-3 ${resource.status === 'warning' ? 'bg-yellow-100' : 'bg-muted'}`}
                  value={resource.value}
                />
                <div className="text-muted-foreground text-xs">
                  {resource.value}/{resource.max}% used
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Performance Trends</CardTitle>
          <CardDescription>
            System performance metrics over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px]"
            config={{
              cpu: {
                label: 'CPU Usage',
                color: 'hsl(var(--chart-1))',
              },
              memory: {
                label: 'Memory Usage',
                color: 'hsl(var(--chart-2))',
              },
              network: {
                label: 'Network Usage',
                color: 'hsl(var(--chart-3))',
              },
              storage: {
                label: 'Storage Usage',
                color: 'hsl(var(--chart-4))',
              },
            }}
          >
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  dataKey="cpu"
                  name="CPU Usage"
                  stroke="var(--color-cpu)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="memory"
                  name="Memory Usage"
                  stroke="var(--color-memory)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="network"
                  name="Network Usage"
                  stroke="var(--color-network)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="storage"
                  name="Storage Usage"
                  stroke="var(--color-storage)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>
              Current status of all system services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-3"
                  key={service.name}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        service.status === 'online'
                          ? 'bg-green-500'
                          : service.status === 'maintenance'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-muted-foreground text-sm">
                        Uptime: {service.uptime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(service.status)}
                    <p className="mt-1 text-muted-foreground text-xs">
                      {service.lastCheck}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Recent system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <Alert
                  className={`${
                    alert.type === 'error'
                      ? 'border-red-200 bg-red-50'
                      : alert.type === 'warning'
                        ? 'border-yellow-200 bg-yellow-50'
                        : alert.type === 'success'
                          ? 'border-green-200 bg-green-50'
                          : 'border-blue-200 bg-blue-50'
                  }`}
                  key={alert.id}
                >
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <AlertTitle className="font-medium text-sm">
                        {alert.title}
                      </AlertTitle>
                      <AlertDescription className="mt-1 text-sm">
                        {alert.message}
                      </AlertDescription>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          {alert.timestamp}
                        </span>
                        <Badge className="text-xs" variant="outline">
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            Quick actions for system maintenance and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col bg-transparent" variant="outline">
              <Database className="mb-2 h-6 w-6" />
              <span>Backup Database</span>
            </Button>
            <Button className="h-20 flex-col bg-transparent" variant="outline">
              <RefreshCw className="mb-2 h-6 w-6" />
              <span>Restart Services</span>
            </Button>
            <Button className="h-20 flex-col bg-transparent" variant="outline">
              <Settings className="mb-2 h-6 w-6" />
              <span>System Settings</span>
            </Button>
            <Button className="h-20 flex-col bg-transparent" variant="outline">
              <Shield className="mb-2 h-6 w-6" />
              <span>Security Scan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
