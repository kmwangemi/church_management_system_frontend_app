'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Eye,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Users,
} from 'lucide-react';

interface ViewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'branch' | 'department' | 'group';
  item?: any;
}

export function ViewDetailsDialog({
  open,
  onOpenChange,
  type,
  item,
}: ViewDetailsDialogProps) {
  if (!item) return null;

  const renderBranchDetails = () => (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent className="space-y-4" value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Branch Name
                </label>
                <p className="font-semibold text-sm">{item.name}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Pastor/Leader
                </label>
                <p className="font-semibold text-sm">{item.pastor}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Established
                </label>
                <p className="text-sm">{item.established}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Status
                </label>
                <Badge className="mt-1">{item.status}</Badge>
              </div>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Location
              </label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{item.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Phone
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{item.phone}</p>
                </div>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Email
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{item.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="members">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-bold text-2xl text-blue-600">
                  {item.members}
                </p>
                <p className="text-muted-foreground text-sm">Total Members</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl text-green-600">
                  {Math.round(item.members * 0.85)}
                </p>
                <p className="text-muted-foreground text-sm">Active Members</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl text-orange-600">
                  {Math.round(item.members * 0.15)}
                </p>
                <p className="text-muted-foreground text-sm">New This Year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="analytics">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Growth Rate
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="font-semibold text-green-600 text-lg">
                    +{item.growthRate}%
                  </p>
                </div>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Monthly Attendance Trend
                </label>
                <div className="mt-2 h-4 rounded-full bg-secondary">
                  <div
                    className="h-4 rounded-full bg-blue-500"
                    style={{ width: '75%' }}
                  />
                </div>
                <p className="mt-1 text-muted-foreground text-sm">
                  75% average attendance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderDepartmentDetails = () => (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="budget">Budget</TabsTrigger>
      </TabsList>
      <TabsContent className="space-y-4" value="overview">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Department
                </label>
                <p className="font-semibold text-sm">{item.name}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Head
                </label>
                <p className="font-semibold text-sm">{item.head}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Members
                </label>
                <p className="text-sm">{item.members}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Status
                </label>
                <Badge className="mt-1">{item.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl text-blue-600">
              {item.activities}
            </p>
            <p className="text-muted-foreground text-sm">Activities this month</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="budget">
        <Card>
          <CardHeader>
            <CardTitle>Budget Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl text-green-600">
              ${item.budget?.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-sm">Annual budget allocation</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderGroupDetails = () => (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent className="space-y-4" value="overview">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Group Name
                </label>
                <p className="font-semibold text-sm">{item.name}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Leader
                </label>
                <p className="font-semibold text-sm">{item.leader}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Category
                </label>
                <Badge className="mt-1">{item.category}</Badge>
              </div>
              <div>
                <label className="font-medium text-muted-foreground text-sm">
                  Status
                </label>
                <Badge className="mt-1">{item.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="schedule">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meeting Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Meeting Time
              </label>
              <p className="text-sm">{item.meetingTime}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Location
              </label>
              <p className="text-sm">{item.location}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="space-y-4" value="members">
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl text-blue-600">{item.members}</p>
            <p className="text-muted-foreground text-sm">Current members</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {type === 'branch' && 'Branch Details'}
            {type === 'department' && 'Department Details'}
            {type === 'group' && 'Small Group Details'}
          </DialogTitle>
          <DialogDescription>
            View detailed information and statistics
          </DialogDescription>
        </DialogHeader>
        {type === 'branch' && renderBranchDetails()}
        {type === 'department' && renderDepartmentDetails()}
        {type === 'group' && renderGroupDetails()}
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
