'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ChurchListResponse } from '@/lib/types/church';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import {
  Activity,
  Building2,
  Calendar,
  DollarSign,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Users,
} from 'lucide-react';

interface ViewChurchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: ChurchListResponse | null;
}

export function ViewChurchDetailsDialog({
  open,
  onOpenChange,
  church,
}: ViewChurchDetailsDialogProps) {
  if (!church) return null;
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const getPlanBadge = (plan?: string) => {
    const planLower = plan?.toLowerCase();
    switch (planLower) {
      case 'CUSTOM':
        return <Badge className="bg-purple-100 text-purple-800">Custom</Badge>;
      case 'CATHEDRAL':
        return <Badge className="bg-blue-100 text-blue-800">Cathedral</Badge>;
      case 'MINISTRY':
        return <Badge className="bg-muted text-foreground">Ministry</Badge>;
      default:
        return <Badge variant="secondary">{plan || 'None'}</Badge>;
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Church Details
          </DialogTitle>
          <DialogDescription>
            Complete information about {church.name}
          </DialogDescription>
        </DialogHeader>
        <Tabs className="w-full" defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Church Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={church?.logo || undefined} />
                    <AvatarFallback>
                      {church.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold text-2xl">
                      {capitalizeFirstLetterOfEachWord(
                        church.name || 'Not Provided'
                      )}
                    </h3>
                    <p className="text-muted-foreground">
                      {capitalizeFirstLetterOfEachWord(
                        church.denomination || 'Not Provided'
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(church?.status || 'Pending')}
                      {getPlanBadge(church?.subscription?.plan || 'Basic')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="pastor"
                    >
                      Lead Pastor
                    </Label>
                    {/* <p className="font-semibold text-sm">
                      {church?.metadata?.pastor || 'Not Provided'}
                    </p> */}
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="established"
                    >
                      Established
                    </Label>
                    <p className="text-sm">
                      {church?.establishedDate?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="activity"
                    >
                      Last Activity
                    </Label>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      {/* <p className="text-sm">
                        {church?.metadata?.lastActivity}
                      </p> */}
                    </div>
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="branches"
                    >
                      Total Branches
                    </Label>
                    <p className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {church?.numberOfBranches}
                    </p>
                  </div>
                </div>
                <div>
                  <Label
                    className="font-medium text-muted-foreground text-sm"
                    htmlFor="address"
                  >
                    Address
                  </Label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{church?.address?.street}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent className="space-y-4" value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="email"
                    >
                      Email Address
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        className="text-blue-600 text-sm hover:underline"
                        href={`mailto:${church?.email}`}
                      >
                        {church?.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        className="text-blue-600 text-sm hover:underline"
                        href={`tel:${church?.phoneNumber}`}
                      >
                        {church?.phoneNumber}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="website"
                    >
                      website
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        className="text-blue-600 text-sm hover:underline"
                        href={church?.website}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {church?.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium">Quick Actions</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent className="space-y-4" value="statistics">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {(church?._count?.members || 0).toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Active congregation members
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Growth Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl text-green-600">
                    +{church?.metadata?.growth || 0}%
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Year over year growth
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Monthly Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    ${(church?.metadata?.revenue || 0).toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Subscription revenue
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Total Branches
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {church?.numberOfBranches}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Active church locations
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Average Attendance
                    </span>
                    <span className="text-muted-foreground text-sm">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-sm">Active Users</span>
                    <span className="text-muted-foreground text-sm">92%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: '92%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Online Engagement
                    </span>
                    <span className="text-muted-foreground text-sm">78%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent className="space-y-4" value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="plan"
                    >
                      Current Plan
                    </Label>
                    <div className="mt-1">
                      {getPlanBadge(church?.subscription?.plan || 'Basic')}
                    </div>
                  </div>
                  <div>
                    <Label
                      className="font-medium text-muted-foreground text-sm"
                      htmlFor="cost"
                    >
                      Monthly Cost
                    </Label>
                    <p className="font-bold text-green-600 text-lg">
                      ${(church?.metadata?.revenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label
                    className="font-medium text-muted-foreground text-sm"
                    htmlFor="billing"
                  >
                    Billing Cycle
                  </Label>
                  <p className="text-sm">Monthly - Auto-renewal enabled</p>
                </div>
                <div>
                  <Label
                    className="font-medium text-muted-foreground text-sm"
                    htmlFor="next-billing"
                  >
                    Next Billing Date
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium">Plan Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      {church?.subscription?.plan === 'CATHEDRAL'
                        ? 'Unlimited members'
                        : church?.subscription?.plan === 'MINISTRY'
                          ? 'Up to 500 members'
                          : 'Up to 100 members'}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Multiple branches support
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Priority support
                    </li>
                  </ul>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-transparent"
                    size="sm"
                    variant="outline"
                  >
                    Change Plan
                  </Button>
                  <Button
                    className="flex-1 bg-transparent"
                    size="sm"
                    variant="outline"
                  >
                    View Billing History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
          <Button>Edit Church</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
