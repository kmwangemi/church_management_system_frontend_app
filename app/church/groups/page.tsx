'use client';

import RenderApiError from '@/components/api-error';
import { DeleteGroupDialog } from '@/components/dialogs/delete-group-dialog';
import { AddSmallGroupForm } from '@/components/forms/add-small-group-form';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import SearchInput from '@/components/search-input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteGroupById,
  useFetchGroups,
} from '@/lib/hooks/church/group/use-group-queries';
import type { Group } from '@/lib/types/small-group';
import {
  capitalizeFirstLetter,
  GROUP_CATEGORY_OPTIONS,
  MEETING_DAY_OPTIONS,
} from '@/lib/utils';
import {
  Activity,
  Calendar,
  Clock,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export default function SmallGroupsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('query') || '';
  const {
    register,
    // reset: resetSearchInput,
    handleSubmit,
  } = useForm({
    defaultValues: {
      query: searchQuery,
    },
  });
  const {
    data: smallGroups,
    isLoading: isLoadingSmallGroups,
    isError: isErrorSmallGroups,
    error: errorSmallGroups,
  } = useFetchGroups(page, searchQuery, selectedCategory, selectedDay);
  const {
    mutateAsync: deleteGroupMutation,
    isPending: isPendingDeleteGroup,
    isError: isErrorDeleteGroup,
    error: errorDeleteGroup,
  } = useDeleteGroupById();
  const handleDeleteGroup = async (groupId: string) => {
    await deleteGroupMutation({ groupId, options: { force: true } });
    setDeletingGroup(null);
  };
  const openDeleteDialog = (group: Group) => {
    setDeletingGroup(group);
  };
  const openEditDialog = (group: Group) => {
    setEditingGroup(group);
  };

  const analytics = smallGroups?.analytics;
  const totalGroups =
    analytics?.totalGroups ?? smallGroups?.groups?.length ?? 0;
  const activeGroups =
    analytics?.activeGroups ??
    smallGroups?.groups?.filter((group) => group?.isActive).length ??
    0;
  const totalMembers =
    analytics?.totalMembers ??
    smallGroups?.groups?.reduce(
      (sum, group) =>
        sum +
        (group?.memberCount ?? group?.members ?? group?.stats?.totalMembers ?? 0),
      0
    ) ??
    0;
  const totalCapacity =
    analytics?.totalCapacity ??
    smallGroups?.groups?.reduce(
      (sum, group) => sum + (group?.capacity || 0),
      0
    ) ??
    0;
  const capacityUtilization =
    analytics?.capacityUtilization ??
    (totalCapacity > 0 ? Math.round((totalMembers / totalCapacity) * 100) : 0);
  const availableSpots =
    analytics?.availableSpots ?? Math.max(0, totalCapacity - totalMembers);
  const monthlyActivities =
    analytics?.monthlyActivities ??
    smallGroups?.groups?.reduce(
      (sum, group) => sum + (group?.stats?.totalActivities ?? 0),
      0
    ) ??
    0;
  const attendanceData = analytics?.attendanceData ?? [];
  const categoryDistribution = analytics?.categoryDistribution ?? [];
  const meetingDays = analytics?.meetingDays ?? [];
  const activityData = analytics?.activityData ?? [];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Small Groups</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and monitor small group ministries
          </p>
        </div>
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Small Group</DialogTitle>
              <DialogDescription>
                Create a new small group ministry
              </DialogDescription>
            </DialogHeader>
            <AddSmallGroupForm onCloseDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalGroups}</div>
            <p className="text-muted-foreground text-xs">
              {activeGroups} active groups
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalMembers}</div>
            <p className="text-muted-foreground text-xs">Across all groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Capacity Utilization
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{capacityUtilization}%</div>
            <p className="text-muted-foreground text-xs">
              {availableSpots} spots available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{monthlyActivities}</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs className="space-y-6" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Group Attendance Trends</CardTitle>
                <CardDescription>
                  Monthly attendance across all groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    total: { label: 'Total', color: '#3b82f6' },
                    active: { label: 'Active Members', color: '#10b981' },
                    new: { label: 'New Members', color: '#f59e0b' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        dataKey="total"
                        stroke="var(--color-total)"
                        strokeWidth={2}
                        type="monotone"
                      />
                      <Line
                        dataKey="active"
                        stroke="var(--color-active)"
                        strokeWidth={2}
                        type="monotone"
                      />
                      <Line
                        dataKey="new"
                        stroke="var(--color-new)"
                        strokeWidth={2}
                        type="monotone"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Group Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    value: { label: 'Members' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={categoryDistribution}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell fill={entry.color} key={`cell-${index}`} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent className="space-y-6" value="analytics">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Schedule</CardTitle>
                <CardDescription>Groups by meeting day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    groups: { label: 'Groups', color: '#3b82f6' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={meetingDays}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="groups" fill="var(--color-groups)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Group Activities</CardTitle>
                <CardDescription>Monthly activities by group</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    worship: { label: 'Worship', color: '#3b82f6' },
                    children: { label: 'Children', color: '#10b981' },
                    youth: { label: 'Youth', color: '#f59e0b' },
                    outreach: { label: 'Outreach', color: '#ef4444' },
                    education: { label: 'Education', color: '#8b5cf6' },
                    prayer: { label: 'Prayer', color: '#06b6d4' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        dataKey="worship"
                        stroke="var(--color-worship)"
                        strokeWidth={2}
                        type="monotone"
                      />
                      <Line
                        dataKey="children"
                        stroke="var(--color-children)"
                        strokeWidth={2}
                        type="monotone"
                      />
                      <Line
                        dataKey="youth"
                        stroke="var(--color-youth)"
                        strokeWidth={2}
                        type="monotone"
                      />
                      <Line
                        dataKey="outreach"
                        stroke="var(--color-outreach)"
                        strokeWidth={2}
                        type="monotone"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent className="space-y-6" value="management">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchInput
              handleSubmit={handleSubmit}
              placeholder="Search groups..."
              register={register}
            />
            <Select
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {GROUP_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedDay} value={selectedDay}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {MEETING_DAY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Groups Table */}
          <Card>
            <CardHeader>
              <CardTitle>Small Groups Directory</CardTitle>
              <CardDescription>
                Manage all small group ministries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Handling */}
              {isErrorSmallGroups && (
                <RenderApiError error={errorSmallGroups} />
              )}
              {isErrorDeleteGroup && (
                <RenderApiError error={errorDeleteGroup} />
              )}
              {isLoadingSmallGroups ? (
                <SpinnerLoader description="Loading groups..." />
              ) : smallGroups?.groups && smallGroups.groups.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smallGroups.groups.map((group) => (
                      <TableRow key={group._id}>
                        <TableCell>
                          <div className="flex flex-col items-start">
                            <div className="font-medium">
                              {capitalizeFirstLetter(group?.groupName ?? '')}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {capitalizeFirstLetter(group?.category ?? '')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {group?.leaderId?.firstName
                                ? `${capitalizeFirstLetter(group.leaderId.firstName)} ${capitalizeFirstLetter(group.leaderId.lastName)}`
                                : 'Not Assigned'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {group?.meetingDay
                                ?.map(
                                  (day) =>
                                    day.charAt(0).toUpperCase() + day.slice(1)
                                )
                                .join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{group?.meetingTime?.join(', ')}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {capitalizeFirstLetter(group?.location)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">
                              {group.memberCount ??
                                group.members ??
                                group.stats?.totalMembers ??
                                0}
                            </span>
                            <span className="text-muted-foreground">
                              /{group.capacity}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                            <div
                              className="h-1.5 rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (((group.memberCount ??
                                    group.members ??
                                    group.stats?.totalMembers ??
                                    0) /
                                    Math.max(1, group.capacity || 1)) *
                                    100)
                                )}%`,
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={group.isActive ? 'default' : 'secondary'}
                          >
                            {group.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="h-8 w-8 p-0" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link href={`/church/groups/${group?._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Group
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditDialog(group)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Group
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => openDeleteDialog(group)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No groups found
                  </h3>
                  <p className="text-muted-foreground">
                    Couldn't find any groups. Try adjusting your filters or add
                    a new department.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Edit Group Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setEditingGroup(null);
        }}
        open={!!editingGroup}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Small Group</DialogTitle>
            <DialogDescription>
              Update small group ministry details
            </DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <AddSmallGroupForm
              group={editingGroup}
              mode="edit"
              onCloseDialog={() => setEditingGroup(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Group Dialog */}
      <DeleteGroupDialog
        group={deletingGroup}
        isDeleting={isPendingDeleteGroup}
        onDelete={handleDeleteGroup}
        onOpenChange={(open) => {
          if (!open) setDeletingGroup(null);
        }}
        open={!!deletingGroup}
      />
    </div>
  );
}
