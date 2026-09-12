'use client';

import SearchInput from '@/components/search-input';
import {
  Activity,
  DollarSign,
  Eye,
  Plus,
  Trash2,
  // TrendingDown,
  // TrendingUp,
  Users,
} from 'lucide-react';
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
// import { Badge } from '@/components/ui/badge';
import RenderApiError from '@/components/api-error';
import { DeleteDepartmentDialog } from '@/components/dialogs/delete-department-dialog';
import { AddDepartmentForm } from '@/components/forms/add-department-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteDepartmentById,
  useFetchDepartments,
} from '@/lib/hooks/church/department/use-department-queries';
import type { Department } from '@/lib/types/department';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
} from '@/lib/utils';
import Link from 'next/link';

const departmentBudgets = [
  { name: 'Worship', budget: 15_000, spent: 12_000 },
  { name: 'Children', budget: 8000, spent: 6500 },
  { name: 'Youth', budget: 12_000, spent: 9800 },
  { name: 'Outreach', budget: 20_000, spent: 18_500 },
  { name: 'Education', budget: 5000, spent: 3200 },
  { name: 'Prayer', budget: 3000, spent: 2100 },
];

const activityData = [
  {
    month: 'Jan',
    worship: 10,
    children: 6,
    youth: 12,
    outreach: 4,
    education: 8,
    prayer: 3,
  },
  {
    month: 'Feb',
    worship: 11,
    children: 7,
    youth: 13,
    outreach: 5,
    education: 9,
    prayer: 4,
  },
  {
    month: 'Mar',
    worship: 12,
    children: 8,
    youth: 15,
    outreach: 6,
    education: 10,
    prayer: 4,
  },
  {
    month: 'Apr',
    worship: 12,
    children: 8,
    youth: 15,
    outreach: 6,
    education: 10,
    prayer: 4,
  },
];

const memberDistribution = [
  { name: 'Worship & Music', value: 25, color: '#3b82f6' },
  { name: 'Outreach & Missions', value: 22, color: '#10b981' },
  { name: 'Prayer Ministry', value: 20, color: '#f59e0b' },
  { name: "Children's Ministry", value: 18, color: '#ef4444' },
  { name: 'Youth Ministry', value: 15, color: '#8b5cf6' },
  { name: 'Adult Education', value: 12, color: '#06b6d4' },
];

export default function DepartmentsPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const pathname = usePathname();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
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
    data: departments,
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
    error: errorDepartments,
  } = useFetchDepartments(page, searchQuery);
  const {
    mutateAsync: deleteDepartmentMutation,
    isPending: isPendingDeleteDepartment,
    isError: isErrorDeleteDepartment,
    error: errorDeleteDepartment,
  } = useDeleteDepartmentById();
  const handleDeleteDepartment = async (departmentId: string) => {
    await deleteDepartmentMutation({ departmentId, options: { force: true } });
    setDeletingDepartment(null);
  };
  const openDeleteDialog = (department: Department) => {
    setDeletingDepartment(department);
  };

  // const handleResetQueries = () => {
  //   resetSearchInput();
  //   router.push(pathname);
  // };
  // const handleOpenDepartmentDialog = () => {
  //   setIsDialogOpen(true);
  //   handleResetQueries();
  // };
  // const totalMembers = departments.reduce((sum, dept) => sum + dept.members, 0);
  const totalMembers = 0;
  // const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const totalBudget = 0;
  // const totalActivities = departments.reduce(
  //   (sum, dept) => sum + dept.activities,
  //   0,
  // );
  const totalActivities = 0;
  // const averageGrowth =
  //   departments.reduce((sum, dept) => sum + dept.growth, 0) /
  //   departments.length;
  // const averageGrowth = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Departments</h1>
          <p className="mt-1 text-muted-foreground">
            Manage church departments and ministries
          </p>
        </div>
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new ministry department
              </DialogDescription>
            </DialogHeader>
            <AddDepartmentForm onCloseDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Departments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {departments?.departments.length}
            </div>
            <p className="text-muted-foreground text-xs">Active ministries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalMembers}</div>
            <p className="text-muted-foreground text-xs">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${totalBudget.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Annual allocation</p>
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
            <div className="font-bold text-2xl">{totalActivities}</div>
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
                <CardTitle>Department Activities</CardTitle>
                <CardDescription>
                  Monthly activities by department
                </CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle>Member Distribution</CardTitle>
                <CardDescription>Members across departments</CardDescription>
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
                        data={memberDistribution}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name?.split(' ')[0]} ${(
                            (percent ?? 0) * 100
                          ).toFixed(0)}%`
                        }
                        outerRadius={80}
                      >
                        {memberDistribution.map((entry, index) => (
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
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>
                  Budget vs spending by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    budget: { label: 'Budget', color: '#3b82f6' },
                    spent: { label: 'Spent', color: '#10b981' },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={departmentBudgets}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="budget" fill="var(--color-budget)" />
                      <Bar dataKey="spent" fill="var(--color-spent)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Growth Analysis</CardTitle>
                <CardDescription>Department growth rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments?.departments.map((dept) => (
                    <div
                      className="flex items-center justify-between"
                      key={dept._id}
                    >
                      <div className="flex items-center space-x-3">
                        {/* <dept.icon className='h-5 w-5 text-muted-foreground' /> */}
                        <span className="font-medium">
                          {dept?.departmentName}
                        </span>
                      </div>
                      <div
                      // className={`flex items-center ${
                      //   dept?.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      // }`}
                      >
                        {/* {dept?.growth >= 0 ? (
                          <TrendingUp className="mr-1 h-4 w-4" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4" />
                        )}
                        {dept?.growth > 0 ? '+' : ''}
                        {dept?.growth}% */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent className="space-y-6" value="management">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchInput
              handleSubmit={handleSubmit}
              placeholder="Search departments..."
              register={register}
            />
            <Select onValueChange={setSelectedStatus} value={selectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Error Handling */}
          {isErrorDepartments && <RenderApiError error={errorDepartments} />}
          {isErrorDeleteDepartment && (
            <RenderApiError error={errorDeleteDepartment} />
          )}
          {/* Departments Grid */}
          {isLoadingDepartments ? (
            <SpinnerLoader description="Loading departments..." />
          ) : departments?.departments && departments.departments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.departments.map((dept) => (
                <Card key={dept?._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {capitalizeFirstLetterOfEachWord(dept.departmentName)}
                      </CardTitle>
                      <Badge variant={dept?.isActive ? 'default' : 'secondary'}>
                        {dept?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {capitalizeFirstLetter(dept?.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Department Head
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {dept?.leaderId?.firstName
                            ? `${dept.leaderId.firstName} ${dept.leaderId.lastName}`
                            : 'Not Assigned'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Members</span>
                        <span className="text-muted-foreground text-sm">
                          {dept?._count?.members || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Budget</span>
                        <span className="text-muted-foreground text-sm">
                          KES {dept?.totalBudget?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Branch</span>
                        <span className="text-muted-foreground text-sm">
                          {dept?.branchId
                            ? capitalizeFirstLetterOfEachWord(
                                dept?.branchId?.branchName
                              )
                            : 'All'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <Link href={`/church/departments/${dept._id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-4 w-4" />
                          View Department
                        </Button>
                      </Link>
                      <Button
                        onClick={() => openDeleteDialog(dept)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-medium text-foreground text-lg">
                No departments found
              </h3>
              <p className="text-muted-foreground">
                Couldn't find any departments. Try adjusting your filters or add
                a new department.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Delete Department Dialog */}
      <DeleteDepartmentDialog
        department={deletingDepartment}
        isDeleting={isPendingDeleteDepartment}
        onDelete={handleDeleteDepartment}
        onOpenChange={(open) => {
          if (!open) setDeletingDepartment(null);
        }}
        open={!!deletingDepartment}
      />
    </div>
  );
}
