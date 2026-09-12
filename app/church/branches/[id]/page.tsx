'use client';

import RenderApiError from '@/components/api-error';
import { CountrySelect } from '@/components/country-list-input';
import { DatePicker } from '@/components/date-picker';
import { DeleteActivityDialog } from '@/components/dialogs/delete-activity-dialog';
import { DeleteScheduleDialog } from '@/components/dialogs/delete-schedule-dialog';
import { ActivityForm } from '@/components/forms/activity-form';
import { AddDepartmentForm } from '@/components/forms/add-department-form';
import { ServiceScheduleForm } from '@/components/forms/service-schedule-form';
import { getRoleBadge } from '@/components/helpers';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import { NumberInput } from '@/components/number-input';
import { PhoneInput } from '@/components/phone-number-input';
import ReusableSelect from '@/components/reusable-select';
import SearchInput from '@/components/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { UserCombobox } from '@/components/user-combobox';
import {
  useDeleteBranchActivityById,
  useFetchBranchActivities,
} from '@/lib/hooks/church/activity/use-activity-queries';
import {
  useFetchBranchById,
  useFetchBranchDepartments,
  useFetchBranchMembers,
  useUpdateBranchById,
} from '@/lib/hooks/church/branch/use-branch-queries';
import {
  useDeleteBranchServiceScheduleById,
  useFetchBranchServiceSchedules,
} from '@/lib/hooks/church/service-schedule/use-service-schedule-queries';
import type { Activity } from '@/lib/types/activity';
import type { ServiceSchedule } from '@/lib/types/service-schedule';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  formatToNewDate,
  getFirstLetter,
  getRelativeYear,
} from '@/lib/utils';
import {
  type AddBranchPayload,
  type UpdateBranchPayload,
  updateBranchSchema,
} from '@/lib/validations/branch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Building,
  Calendar,
  Edit,
  Eye,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function BranchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // 👈 unwrap the promise
  const [isEditing, setIsEditing] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isServiceScheduleDialogOpen, setIsServiceScheduleDialogOpen] =
    useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedSchedule, setSelectedSchedule] =
    useState<ServiceSchedule | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('query') || '';
  const selectedStatusQuery = searchParams.get('status') || 'all';
  const PAGE_SIZE = 10;
  const {
    data: branch,
    isLoading: isLoadingBranch,
    isError: isErrorBranch,
    error: errorBranch,
  } = useFetchBranchById(id);
  const {
    mutateAsync: UpdateBranchMutation,
    isPending: isPendingUpdateBranch,
    isError: isErrorUpdateBranch,
    error: errorUpdateBranch,
  } = useUpdateBranchById(id);
  const onSubmitBranchForm = async (payload: AddBranchPayload) => {
    await UpdateBranchMutation({
      branchId: id,
      payload,
    });
    setIsEditing(false);
  };
  const form = useForm<UpdateBranchPayload>({
    resolver: zodResolver(updateBranchSchema),
    defaultValues: {
      branchName: '',
      email: '',
      phoneNumber: '',
      pastorId: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
      capacity: '',
      members: '',
      establishedDate: '',
      description: '',
      isActive: false,
    },
  });
  useEffect(() => {
    if (branch) {
      const formData: any = {
        branchName: capitalizeFirstLetter(branch?.name || ''),
        email: branch?.email || undefined, // undefined instead of empty string
        phoneNumber: branch?.phoneNumber || '',
        address: {
          street: branch?.address?.[0]?.street
            ? capitalizeFirstLetter(branch.address[0].street)
            : undefined,
          city: branch?.address?.[0]?.city
            ? capitalizeFirstLetter(branch.address[0].city)
            : undefined,
          state: branch?.address?.[0]?.state
            ? capitalizeFirstLetter(branch.address[0].state)
            : undefined,
          zipCode: branch?.address?.[0]?.zipCode || undefined,
          country: branch?.address?.[0]?.country || undefined,
        },
        establishedDate: branch?.establishedDate || undefined,
        capacity: branch?.capacity || undefined,
        members: branch?.memberCount || undefined,
        pastorId: (branch as any)?.pastorId?._id || undefined,
        description: branch?.description || undefined,
        isActive: branch?.isActive,
      };
      form.reset(formData);
    }
  }, [form, branch]);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: searchQuery,
    },
  });
  // Narrow selectedStatusQuery to only "active" | "inactive" | "suspended" | "pending" | undefined
  const statusFilter:
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'pending'
    | undefined =
    selectedStatusQuery === 'active' ||
    selectedStatusQuery === 'inactive' ||
    selectedStatusQuery === 'suspended' ||
    selectedStatusQuery === 'pending'
      ? selectedStatusQuery
      : undefined;
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useFetchBranchMembers(id, page, searchQuery, statusFilter, PAGE_SIZE);
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
    error: errorDepartments,
  } = useFetchBranchDepartments(id);
  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    isError: isErrorSchedules,
    error: errorSchedules,
  } = useFetchBranchServiceSchedules({
    page: 1,
    limit: PAGE_SIZE,
    search: '',
    // day: '',
    // type: '',
    branchId: id,
    // status: 'active',
  });
  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
    error: errorActivities,
  } = useFetchBranchActivities({
    branchId: id,
    page: 1,
    limit: PAGE_SIZE,
    search: '',
    // type,
    // status,
    // dateFrom,
    // dateTo,
  });
  // Delete schedule mutation
  const {
    mutateAsync: deleteScheduleMutation,
    isPending: isPendingDeleteSchedule,
    isError: isErrorDeleteSchedule,
    error: errorDeleteSchedule,
  } = useDeleteBranchServiceScheduleById();
  // Delete activity mutation
  const {
    mutateAsync: deleteActivityMutation,
    isPending: isPendingDeleteActivity,
    isError: isErrorDeleteActivity,
    error: errorDeleteActivity,
  } = useDeleteBranchActivityById();
  // Filter users based on selected tab and status
  const filteredUsers = useMemo(() => {
    if (!users?.users) return [];
    let filtered = users.users;
    // Filter by tab
    if (selectedTab !== 'all') {
      switch (selectedTab) {
        case 'active':
          filtered = filtered.filter((user) => user.status === 'active');
          break;
        case 'inactive':
          filtered = filtered.filter((user) => user.status === 'inactive');
          break;
        case 'staff':
          filtered = filtered.filter((user) =>
            ['pastor', 'bishop', 'admin'].includes(user.role?.toLowerCase())
          );
          break;
        default:
          break;
      }
    }
    return filtered;
  }, [users?.users, selectedTab]);
  // Calculate stats
  const stats = useMemo(() => {
    const allUsers = users?.users || [];
    return {
      total: allUsers.length || 0,
      active: allUsers.filter((u) => u.status === 'active').length,
      inactive: allUsers.filter((u) => u.status === 'inactive').length,
      staff: allUsers.filter((u) =>
        ['pastor', 'bishop', 'admin'].includes(u.role?.toLowerCase())
      ).length,
    };
  }, [users]);
  const handleDeleteSchedule = async (scheduleId: string) => {
    await deleteScheduleMutation({
      branchId: id,
      scheduleId,
      options: { force: true },
    });
    setSelectedSchedule(null);
  };
  const openScheduleDeleteDialog = (schedule: ServiceSchedule) => {
    setSelectedSchedule(schedule);
  };
  const handleDeleteActivity = async (activityId: string) => {
    await deleteActivityMutation({
      branchId: id,
      activityId,
      options: { force: true },
    });
    setSelectedActivity(null);
  };
  const openActivityDeleteDialog = (activity: Activity) => {
    setSelectedActivity(activity);
  };
  // Function to open dialog in edit mode
  const handleEditServiceSchedule = (serviceSchedule: ServiceSchedule) => {
    setSelectedSchedule(serviceSchedule);
    setDialogMode('edit');
    setIsServiceScheduleDialogOpen(true);
  };
  // Function to open dialog in add mode
  const handleAddServiceSchedule = () => {
    setSelectedSchedule(null);
    setDialogMode('add');
    setIsServiceScheduleDialogOpen(true);
  };
  // Function to close dialog and reset state
  const handleCloseScheduleDialog = () => {
    setIsServiceScheduleDialogOpen(false);
    setSelectedSchedule(null);
    setDialogMode('add');
  };
  // Function to open dialog in add mode
  const handleAddActivity = () => {
    setSelectedActivity(null);
    setDialogMode('add');
    setIsActivityDialogOpen(true);
  };
  // Function to open dialog in edit mode
  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogMode('edit');
    setIsActivityDialogOpen(true);
  };
  // Function to close dialog and reset state
  const handleCloseActivityDialog = () => {
    setIsActivityDialogOpen(false);
    setSelectedActivity(null);
    setDialogMode('add');
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      {isErrorBranch && <RenderApiError error={errorBranch} />}
      {isErrorUpdateBranch && <RenderApiError error={errorUpdateBranch} />}
      {isLoadingBranch ? (
        <SpinnerLoader description="Loading branch data..." />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/church/branches">
                <Button size="sm" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Branches
                </Button>
              </Link>
              <div>
                <h1 className="font-bold text-3xl tracking-tight">
                  {capitalizeFirstLetter(branch?.name ?? 'Not Provided')}
                </h1>
                <p className="text-muted-foreground">
                  Branch details and management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button
                  disabled={isPendingUpdateBranch}
                  onClick={form.handleSubmit(onSubmitBranchForm)}
                  type="submit"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isPendingUpdateBranch ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
            </div>
          </div>
          {/* Branch Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{branch?.memberCount}</div>
                <p className="text-muted-foreground text-xs">
                  {Math.round(
                    ((branch?.memberCount ?? 0) / (branch?.capacity ?? 1)) * 100
                  )}
                  % capacity
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Departments
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {departments?.departments?.length}
                </div>
                <p className="text-muted-foreground text-xs">
                  Active departments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Weekly Services
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {/* {branch.serviceSchedule.length} */}
                  {0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Regular services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Avg. Attendance
                </CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {/* {Math.round(
                branch.serviceSchedule.reduce(
                  (sum, service) => sum + service.attendance,
                  0
                ) / branch.serviceSchedule.length
              )} */}
                  0
                </div>
                <p className="text-muted-foreground text-xs">Per service</p>
              </CardContent>
            </Card>
          </div>
          <Tabs className="space-y-4" defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent className="space-y-6" value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Information</CardTitle>
                    <CardDescription>
                      Basic details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <Form {...form}>
                        <form className="space-y-4">
                          <FormField
                            control={form.control}
                            name="branchName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Branch Name{' '}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Kawangware" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter email address"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    defaultCountry="KE"
                                    onChange={field.onChange}
                                    placeholder="Enter phone number"
                                    value={field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pastorId" // Form field stores just the user ID string
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pastor</FormLabel>
                                <FormControl>
                                  <UserCombobox
                                    className="w-full"
                                    onValueChange={field.onChange} // Use onValueChange for ID
                                    placeholder="Search and select a pastor"
                                    value={field.value} // Pass the ID directly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Capacity (1-100,000 Members){' '}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <NumberInput placeholder="300" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="establishedDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Established Date{' '}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <DatePicker
                                    format="long"
                                    maxDate={new Date()}
                                    minDate={getRelativeYear(-50)}
                                    onChange={(date) =>
                                      field.onChange(
                                        date ? date.toISOString() : ''
                                      )
                                    }
                                    placeholder="Select established date"
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5" />
                                <span>Address Information</span>
                              </CardTitle>
                              <CardDescription>
                                Branch address information
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="address.country"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Country{' '}
                                        <span className="text-red-500">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <CountrySelect
                                          onChange={field.onChange}
                                          placeholder="Select your country"
                                          value={field.value}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="address.city"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        City{' '}
                                        <span className="text-red-500">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Nairobi"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="address.street"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Street Address{' '}
                                        <span className="text-red-500">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="123 Main Street"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="address.zipCode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Postal Code</FormLabel>
                                      <FormControl>
                                        <Input placeholder="00100" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {capitalizeFirstLetter(
                              branch?.address?.[0]?.street ?? 'Not Provided'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {branch?.phoneNumber ?? 'Not Provided'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {branch?.email ?? 'Not Provided'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Pastor:{' '}
                            {(branch as any)?.pastorId
                              ? `${capitalizeFirstLetter((branch as any).pastorId.firstName ?? '')} ${capitalizeFirstLetter((branch as any).pastorId.lastName ?? '')}`.trim()
                              : 'Not Provided'}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                {/* Branch Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Status</CardTitle>
                    <CardDescription>
                      Current status and capacity information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Status</span>
                      <Badge variant="default">
                        {branch?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Established</span>
                      <span className="text-muted-foreground text-sm">
                        {branch?.establishedDate
                          ? formatToNewDate(new Date(branch.establishedDate))
                          : 'Not Provided'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Capacity</span>
                        <span className="text-muted-foreground text-sm">
                          {branch?.memberCount}/{branch?.capacity}
                        </span>
                      </div>
                      <Progress
                        className="w-full"
                        value={
                          ((branch?.memberCount ?? 0) / (branch?.capacity ?? 1)) *
                          100
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Description */}
              {!isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                    <CardDescription>
                      Branch mission and overview
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {capitalizeFirstLetter(branch?.description ?? '')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent className="space-y-6" value="members">
              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <SearchInput
                      handleSubmit={handleSubmit}
                      placeholder="Search users..."
                      register={register}
                    />
                    <ReusableSelect
                      // className="w-full sm:w-[200px]"
                      clearValue="all"
                      defaultValue="all"
                      options={[
                        { value: 'all', label: 'All' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'suspended', label: 'Suspended' },
                        { value: 'pending', label: 'Pending' },
                      ]}
                      paramName="status"
                      placeholder="Filter by status"
                      // resetPagination={false}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs onValueChange={setSelectedTab} value={selectedTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                      <TabsTrigger value="active">
                        Active ({stats.active})
                      </TabsTrigger>
                      <TabsTrigger value="inactive">
                        Inactive ({stats.inactive})
                      </TabsTrigger>
                      <TabsTrigger value="staff">
                        Staff ({stats.staff})
                      </TabsTrigger>
                    </TabsList>
                    {isErrorUsers && <RenderApiError error={errorUsers} />}
                    {isLoadingUsers ? (
                      <SpinnerLoader description="Loading members..." />
                    ) : (
                      <TabsContent className="mt-6" value={selectedTab}>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredUsers?.map((user) => (
                                <TableRow
                                  className="hover:bg-accent"
                                  key={user._id}
                                >
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage
                                          alt={user?.firstName || 'User'}
                                          src={user?.profilePictureUrl ?? ''}
                                        />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                          {`${getFirstLetter(user?.firstName || '')}${getFirstLetter(user?.lastName || '')}`}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium text-foreground">
                                          {`${capitalizeFirstLetter(user?.firstName || '')} ${capitalizeFirstLetter(user?.lastName || 'Not Provided')}`}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                          {user.email || 'Not Provided'}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                          {user.phoneNumber || 'Not Provided'}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-foreground text-sm">
                                      {capitalizeFirstLetter(
                                        user.gender || 'Not Provided'
                                      )}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {getRoleBadge(user.role)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        user.status === 'active'
                                          ? 'default'
                                          : 'secondary'
                                      }
                                    >
                                      {user.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-foreground text-sm">
                                      {formatToNewDate(user.createdAt)}
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
                                        <DropdownMenuLabel>
                                          Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                          asChild
                                          className="cursor-pointer"
                                        >
                                          <Link
                                            href={`/church/users/${user._id}`}
                                          >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View User
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          asChild
                                          className="cursor-pointer"
                                        >
                                          <Link
                                            href={`/church/users/edit/${user._id}`}
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit User
                                          </Link>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        {filteredUsers?.length === 0 && (
                          <div className="py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-medium text-foreground text-lg">
                              No users found
                            </h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-6" value="departments">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Departments</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage branch departments and leadership
                  </p>
                </div>
                <Dialog
                  onOpenChange={setIsDepartmentDialogOpen}
                  open={isDepartmentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                      <DialogDescription>
                        Create a new department for this branch
                      </DialogDescription>
                    </DialogHeader>
                    <AddDepartmentForm
                      onCloseDialog={() => setIsDepartmentDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorDepartments && (
                <RenderApiError error={errorDepartments} />
              )}
              {isLoadingDepartments ? (
                <SpinnerLoader description="Loading departments..." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {departments?.departments?.map((dept) => (
                    <Card key={dept?._id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {capitalizeFirstLetterOfEachWord(
                              dept?.departmentName
                            )}
                          </CardTitle>
                          <Badge
                            variant={dept?.isActive ? 'default' : 'secondary'}
                          >
                            {dept?.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardDescription>{dept.description}</CardDescription>
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
                              {/* {dept?.members || 0} */}
                              {0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Budget</span>
                            <span className="text-muted-foreground text-sm">
                              {dept?.totalBudget || 0}
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {departments?.departments?.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No branch departments found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent className="space-y-6" value="schedule">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Service Schedule</h3>
                  <p className="text-muted-foreground text-sm">
                    Regular services and meeting times
                  </p>
                </div>
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setIsServiceScheduleDialogOpen(open);
                    else handleCloseScheduleDialog();
                  }}
                  open={isServiceScheduleDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddServiceSchedule}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogMode === 'edit'
                          ? 'Edit Service Schedule'
                          : 'Add New Service Schedule'}
                      </DialogTitle>
                      <DialogDescription>
                        {dialogMode === 'edit'
                          ? 'Update the service schedule details'
                          : 'Create a new service schedule for this branch'}
                      </DialogDescription>
                    </DialogHeader>
                    <ServiceScheduleForm
                      mode={dialogMode}
                      onCloseDialog={handleCloseScheduleDialog}
                      serviceSchedule={selectedSchedule ?? undefined}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorSchedules && <RenderApiError error={errorSchedules} />}
              {isErrorDeleteSchedule && (
                <RenderApiError error={errorDeleteSchedule} />
              )}
              {isLoadingSchedules ? (
                <SpinnerLoader description="Loading service schedules..." />
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Duration (Minutes)</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Avg. Attendance</TableHead>
                          <TableHead>Facilitator</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules?.schedules?.map((service) => (
                          <TableRow key={service?._id}>
                            <TableCell className="font-medium">
                              {capitalizeFirstLetter(service?.day)}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetterOfEachWord(
                                service?.service
                              )}
                            </TableCell>
                            <TableCell>{service.time}</TableCell>
                            <TableCell>{service?.duration}</TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(service?.type)}
                            </TableCell>
                            <TableCell>{service?.attendance}</TableCell>
                            <TableCell>
                              {service?.facilitator?.firstName
                                ? `${service.facilitator.firstName} ${service.facilitator.lastName}`
                                : 'Not Assigned'}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetterOfEachWord(
                                service?.location ?? ''
                              ) || 'Not Provided'}
                            </TableCell>
                            <TableCell>
                              {service?.startDate
                                ? formatToNewDate(new Date(service.startDate))
                                : 'Not Provided'}
                            </TableCell>
                            <TableCell>
                              {service?.endDate
                                ? formatToNewDate(new Date(service.endDate))
                                : 'Not Provided'}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(service?.notes ?? '') ||
                                'Not Provided'}
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
                                    <Button
                                      onClick={() =>
                                        handleEditServiceSchedule(service)
                                      }
                                      size="sm"
                                      variant="ghost"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit Service
                                    </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() =>
                                      openScheduleDeleteDialog(service)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Service
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              {schedules?.schedules?.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No service schedules found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent className="space-y-6" value="activities">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Recent Activities</h3>
                  <p className="text-muted-foreground text-sm">
                    Latest events and activities at this branch
                  </p>
                </div>
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setIsActivityDialogOpen(open);
                    else handleCloseActivityDialog();
                  }}
                  open={isActivityDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddActivity}>
                      <Plus className="mr-2 h-4 w-4" />
                      Log Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogMode === 'edit'
                          ? 'Edit Activity'
                          : 'Add New Activity'}
                      </DialogTitle>
                      <DialogDescription>
                        {dialogMode === 'edit'
                          ? 'Update the activity details'
                          : 'Create a new activity for this branch'}
                      </DialogDescription>
                    </DialogHeader>
                    <ActivityForm
                      activity={selectedActivity ?? undefined}
                      mode={dialogMode}
                      onCloseDialog={handleCloseActivityDialog}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorActivities && <RenderApiError error={errorActivities} />}
              {isErrorDeleteActivity && (
                <RenderApiError error={errorDeleteActivity} />
              )}
              {isLoadingActivities ? (
                <SpinnerLoader description="Loading activities..." />
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Facilitator</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities?.activities?.map((activity) => (
                          <TableRow key={activity?._id}>
                            <TableCell className="font-medium">
                              {activity?.date
                                ? formatToNewDate(new Date(activity?.date))
                                : 'Not Provided'}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(activity?.activity)}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(activity?.type)}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(activity?.status)}
                            </TableCell>
                            <TableCell>{activity?.participants}</TableCell>
                            <TableCell>
                              {activity?.facilitator?.firstName
                                ? `${activity.facilitator.firstName} ${activity.facilitator.lastName}`
                                : 'Not Assigned'}
                            </TableCell>
                            <TableCell>
                              {capitalizeFirstLetterOfEachWord(
                                activity?.location ?? ''
                              ) || 'Not Provided'}
                            </TableCell>
                            <TableCell>{activity?.startTime}</TableCell>
                            <TableCell>{activity?.endTime}</TableCell>
                            <TableCell>{activity?.budget}</TableCell>
                            <TableCell>
                              {capitalizeFirstLetter(
                                activity?.description ?? ''
                              ) || 'Not Provided'}
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
                                    <Button
                                      onClick={() =>
                                        handleEditActivity(activity)
                                      }
                                      size="sm"
                                      variant="ghost"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit Activity
                                    </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() =>
                                      openActivityDeleteDialog(activity)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Activity
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              {activities?.activities?.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No activities found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      {/* Delete Schedule Dialog */}
      <DeleteScheduleDialog
        isDeleting={isPendingDeleteSchedule}
        onDelete={handleDeleteSchedule}
        onOpenChange={(open) => {
          if (!open) setSelectedSchedule(null);
        }}
        open={!!selectedSchedule}
        schedule={selectedSchedule}
      />
      {/* Delete Activity Dialog */}
      <DeleteActivityDialog
        activityId={selectedActivity?._id}
        isDeleting={isPendingDeleteActivity}
        onDelete={handleDeleteActivity}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
        open={!!selectedActivity}
      />
    </div>
  );
}
