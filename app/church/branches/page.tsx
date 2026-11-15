'use client';

import {
  Activity,
  Building,
  Eye,
  MoreHorizontal,
  // Phone,
  Plus,
  Trash2,
  // TrendingDown,
  // TrendingUp,
  Users,
} from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import RenderApiError from '@/components/api-error';
import { DeleteBranchDialog } from '@/components/dialogs/delete-branch-dialog';
import { AddBranchForm } from '@/components/forms/add-branch-form';
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
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useAdminTeams } from '@/lib/hooks/admin/use-organization-team-mutation';
import { useDeleteBranchById } from '@/lib/hooks/church/branch/use-branch-queries';
import type { Branch } from '@/lib/types/branch';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  formatToNewDate,
} from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
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

export default function BranchesPage() {
  const searchParams = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('query') || '';
  const { organizationId } = useActiveOrganization();
  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      query: searchQuery,
    },
  });

  const {
    data: branches,
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
    error: errorBranches,
  } = useAdminTeams({
    organizationId,
    page,
    pageSize: 50,
    search: searchQuery,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  });

  const {
    mutateAsync: deleteBranchMutation,
    isPending: isPendingDeleteBranch,
    isError: isErrorDeleteBranch,
    error: errorDeleteBranch,
  } = useDeleteBranchById();

  const handleDeleteBranch = async (branchId: string) => {
    await deleteBranchMutation(branchId);
    setDeletingBranch(null);
  };
  const openDeleteDialog = (branch: Branch) => {
    setDeletingBranch(branch);
  };

  const branchList = useMemo(() => {
    return (branches?.teams || branches?.branches || []) as any[];
  }, [branches]);

  const analytics = branches?.analytics;

  const totalBranchesCount = analytics?.totalBranches ?? branchList.length;
  const activeBranchesCount =
    analytics?.activeBranches ?? branchList.filter((b: any) => b?.isActive).length;

  const totalMembers = useMemo(() => {
    if (typeof analytics?.totalMembers === 'number') {
      return analytics.totalMembers;
    }
    return branchList.reduce((sum: number, b: any) => {
      const count = Number(b?._count?.teammembers ?? b?.memberCount ?? b?.members ?? 0);
      return sum + (Number.isNaN(count) ? 0 : count);
    }, 0);
  }, [analytics, branchList]);

  const totalCapacity = useMemo(() => {
    if (typeof analytics?.totalCapacity === 'number') {
      return analytics.totalCapacity;
    }
    return branchList.reduce((sum: number, b: any) => {
      const cap = Number(b?.capacity ?? 0);
      return sum + (Number.isNaN(cap) ? 0 : cap);
    }, 0);
  }, [analytics, branchList]);

  const capacityUtilization =
    analytics?.capacityUtilization ??
    (totalCapacity > 0 ? Math.min(100, Math.round((totalMembers / totalCapacity) * 100)) : 0);
  const seatsAvailable =
    analytics?.seatsAvailable ?? Math.max(0, totalCapacity - totalMembers);
  const averageGrowth = analytics?.averageGrowth ?? 0;

  const dynamicBranchDistribution = useMemo(() => {
    if (Array.isArray(analytics?.branchDistribution) && analytics.branchDistribution.length > 0) {
      return analytics.branchDistribution;
    }
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    if (branchList.length === 0) return [];
    return branchList.map((b: any, index: number) => ({
      name: capitalizeFirstLetterOfEachWord(b?.name || b?.branchName || `Branch ${index + 1}`),
      value: Number(b?._count?.teammembers ?? b?.memberCount ?? b?.members ?? 0),
      color: colors[index % colors.length],
    }));
  }, [analytics, branchList]);

  const attendanceSeries = useMemo(() => {
    if (Array.isArray(analytics?.attendanceSeries) && analytics.attendanceSeries.length > 0) {
      return analytics.attendanceSeries;
    }
    return [{ key: 'total', label: 'Total Attendance', color: '#3b82f6' }];
  }, [analytics]);

  const attendanceChartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    for (const s of attendanceSeries) {
      cfg[s.key] = { label: s.label, color: s.color };
    }
    return cfg;
  }, [attendanceSeries]);

  const attendanceData = useMemo(() => {
    return Array.isArray(analytics?.attendanceData) ? analytics.attendanceData : [];
  }, [analytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Church Branches</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and monitor all church locations
          </p>
        </div>
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>Create a new church branch</DialogDescription>
            </DialogHeader>
            <AddBranchForm onCloseDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Branches
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {totalBranchesCount}
            </div>
            <p className="text-muted-foreground text-xs">
              {activeBranchesCount} active location{activeBranchesCount === 1 ? '' : 's'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {totalMembers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Across all branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Capacity Utilization
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {capacityUtilization}%
            </div>
            <p className="text-muted-foreground text-xs">
              {seatsAvailable.toLocaleString()} seats available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`font-bold text-2xl ${
                averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {averageGrowth >= 0 ? `+${averageGrowth}%` : `${averageGrowth}%`}
            </div>
            <p className="text-muted-foreground text-xs">This quarter</p>
          </CardContent>
        </Card>
      </div>
      <Tabs className="space-y-6" defaultValue="branches">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Branch Attendance Trends</CardTitle>
                <CardDescription>
                  Monthly attendance across all branches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={attendanceChartConfig}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {attendanceSeries.map((series: any) => (
                        <Line
                          dataKey={series.key}
                          key={series.key}
                          name={series.label}
                          stroke={series.color}
                          strokeWidth={2}
                          type="monotone"
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Member Distribution</CardTitle>
                <CardDescription>Members across all branches</CardDescription>
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
                        data={dynamicBranchDistribution}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                      >
                        {dynamicBranchDistribution.map((entry: any, index: number) => (
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
                <CardTitle>Branch Performance</CardTitle>
                <CardDescription>Member & growth comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    memberCount: { label: 'Members', color: '#3b82f6' },
                    growth: { label: 'Growth %', color: '#10b981' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={branchList}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="memberCount" fill="var(--color-memberCount)" name="Members" />
                      <Bar dataKey="growth" fill="var(--color-growth)" name="Growth %" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Capacity Analysis</CardTitle>
                <CardDescription>Current vs maximum capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branchList.map((branch: any) => {
                    const mCount = Number(
                      branch?._count?.teammembers ?? branch?.memberCount ?? branch?.members ?? 0
                    );
                    const cap = Number(branch?.capacity || 500);
                    const pct = cap > 0 ? Math.min(100, Math.round((mCount / cap) * 100)) : 0;
                    return (
                      <div className="space-y-2" key={branch.id || branch._id}>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {branch?.branchName || branch?.name}
                          </span>
                          <span className="text-muted-foreground">
                            {mCount.toLocaleString()} / {cap.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${pct}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {branchList.length === 0 && (
                    <p className="py-8 text-center text-muted-foreground text-sm">
                      No branch capacity data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent className="space-y-4" value="branches">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row">
                <SearchInput
                  handleSubmit={handleSubmit}
                  placeholder="Search branches..."
                  register={register}
                />
                <Select
                  onValueChange={setSelectedStatus}
                  value={selectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="growing">Growing</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isErrorBranches && <RenderApiError error={errorBranches} />}
              {isErrorDeleteBranch && (
                <RenderApiError error={errorDeleteBranch} />
              )}
              {isLoadingBranches ? (
                <SpinnerLoader description="Loading branches..." />
              ) : (
                <div className="mt-6">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Branch</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Pastor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Established Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(branches?.teams || branches?.branches || []).map((branch: any) => (
                          <TableRow
                            className="hover:bg-accent"
                            key={branch.id || branch._id}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="font-medium text-foreground">
                                    {capitalizeFirstLetterOfEachWord(
                                      branch?.name || branch?.branchName || 'Not Provided'
                                    )}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {branch?.email || 'Not Provided'}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {branch?.phoneNumber || branch?.phone || 'Not Provided'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground text-sm">
                                {branch?.capacity || 'Not Provided'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground text-sm font-semibold">
                                {Number(
                                  branch?._count?.teammembers ??
                                  branch?.memberCount ??
                                  branch?.members ??
                                  0
                                ).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground text-sm">
                                {`${capitalizeFirstLetter(branch?.pastorId?.firstName || '')} ${capitalizeFirstLetter(branch?.pastorId?.lastName || 'Resident Pastor')}`}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  branch?.isActive ? 'default' : 'secondary'
                                }
                              >
                                {branch?.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground text-sm">
                                {branch?.establishedDate
                                  ? formatToNewDate(new Date(branch?.establishedDate))
                                  : (branch?.createdAt ? formatToNewDate(new Date(branch?.createdAt)) : 'Not Provided')}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className="h-8 w-8 p-0"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                  >
                                    <Link
                                      href={`/church/branches/${branch.id || branch._id}`}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Branch
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => openDeleteDialog(branch)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Branch
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {branches?.teams?.length === 0 && (
                    <div className="py-12 text-center">
                      <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-medium text-foreground text-lg">
                        No branches found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Delete Branch Dialog */}
      <DeleteBranchDialog
        branch={deletingBranch}
        isDeleting={isPendingDeleteBranch}
        onDelete={handleDeleteBranch}
        onOpenChange={(open) => {
          if (!open) setDeletingBranch(null);
        }}
        open={!!deletingBranch}
      />
    </div>
  );
}
