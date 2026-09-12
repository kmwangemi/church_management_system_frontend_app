'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { DeleteActivityDialog } from '@/components/dialogs/delete-activity-dialog';
import { DeleteExpenseDialog } from '@/components/dialogs/delete-expense-dialog';
import { DeleteGoalDialog } from '@/components/dialogs/delete-goals-dialog';
import { DeleteMemberDialog } from '@/components/dialogs/delete-member-dialog';
import { AddDepartmentActivityForm } from '@/components/forms/add-department-activity-form';
import { AddDepartmentExpenseForm } from '@/components/forms/add-department-expense-form';
import { AddDepartmentGoalForm } from '@/components/forms/add-department-goal-form';
import { AddDepartmentMemberForm } from '@/components/forms/add-department-member-form';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import { MultiSelect } from '@/components/multi-select';
import { NumberInput } from '@/components/number-input';
import { TimeInput } from '@/components/time-input';
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
import { Textarea } from '@/components/ui/textarea';
import { UserCombobox } from '@/components/user-combobox';
import {
  useDeleteDepartmentActivity,
  useDeleteDepartmentExpense,
  useDeleteDepartmentGoal,
  useDeleteDepartmentMember,
  useFetchDepartmentActivities,
  useFetchDepartmentById,
  useFetchDepartmentExpenses,
  useFetchDepartmentGoals,
  useFetchDepartmentMembers,
  useUpdateDepartmentById,
} from '@/lib/hooks/church/department/use-department-queries';
import type {
  DepartmentActivity,
  DepartmentExpense,
  DepartmentGoal,
  DepartmentMember,
} from '@/lib/types/department';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  DEPARTMENT_CATEGORY_OPTIONS,
  formatToNewDate,
  getFirstLetter,
  getRelativeYear,
  MEETING_DAY_OPTIONS,
} from '@/lib/utils';
import {
  type AddDepartmentPayload,
  addDepartmentSchema,
} from '@/lib/validations/department';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Activity,
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DepartmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // 👈 unwrap the promise
  const [isEditing, setIsEditing] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isDepartmentMemberDialogOpen, setIsDepartmentMemberDialogOpen] =
    useState(false);
  const PAGE_LIMIT = 10;
  const [isDepartmentExpenseDialogOpen, setIsDepartmentExpenseDialogOpen] =
    useState(false);
  const [isDepartmentActivityDialogOpen, setIsDepartmentActivityDialogOpen] =
    useState(false);
  const [isDepartmentGoalDialogOpen, setIsDepartmentGoalDialogOpen] =
    useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<DepartmentActivity | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<DepartmentGoal | null>(null);
  const [selectedExpense, setSelectedExpense] =
    useState<DepartmentExpense | null>(null);
  const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(
    null
  );
  const {
    data: department,
    isLoading: isLoadingDepartment,
    isError: isErrorDepartment,
    error: errorDepartment,
  } = useFetchDepartmentById(id);
  const {
    mutateAsync: UpdateDepartmentMutation,
    isPending: isPendingUpdateDepartment,
    isError: isErrorUpdateDepartment,
    error: errorUpdateDepartment,
  } = useUpdateDepartmentById(id);
  const onSubmitDepartmentForm = async (payload: AddDepartmentPayload) => {
    await UpdateDepartmentMutation({
      departmentId: id,
      payload,
    });
    setIsEditing(false);
  };
  const {
    data: departmentMembers,
    isLoading: isLoadingDepartmentMembers,
    isError: isErrorDepartmentMembers,
    error: errorDepartmentMembers,
  } = useFetchDepartmentMembers({
    departmentId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const {
    data: departmentActivities,
    isLoading: isLoadingDepartmentActivities,
    isError: isErrorDepartmentActivities,
    error: errorDepartmentActivities,
  } = useFetchDepartmentActivities({
    departmentId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const {
    data: departmentExpenses,
    isLoading: isLoadingDepartmentExpenses,
    isError: isErrorDepartmentExpenses,
    error: errorDepartmentExpenses,
  } = useFetchDepartmentExpenses({
    departmentId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const {
    data: departmentGoals,
    isLoading: isLoadingDepartmentGoals,
    isError: isErrorDepartmentGoals,
    error: errorDepartmentGoals,
  } = useFetchDepartmentGoals({
    departmentId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const form = useForm<AddDepartmentPayload>({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      departmentName: '',
      category: undefined,
      leaderId: undefined,
      location: '',
      establishedDate: '',
      totalBudget: '',
      meetingDay: [],
      meetingTime: [],
      description: '',
    },
  });
  useEffect(() => {
    if (department) {
      const formData: any = {
        departmentName: capitalizeFirstLetter(department?.departmentName || ''),
        category: department?.category || '',
        leaderId: department?.leaderId || '',
        location: capitalizeFirstLetter(department?.location || ''),
        totalBudget: department?.totalBudget || '',
        meetingDay: department?.meetingDay || [],
        meetingTime: department?.meetingTime || [],
        // Convert to YYYY-MM-DD format for input type="date"
        establishedDate: department?.establishedDate
          ? new Date(department.establishedDate).toISOString().split('T')[0]
          : '',
        description: department?.description || '',
      };
      form.reset(formData);
    }
  }, [form, department]);
  // Delete department activity mutation
  const {
    mutateAsync: deleteActivityMutation,
    isPending: isPendingDeleteActivity,
    isError: isErrorDeleteActivity,
    error: errorDeleteActivity,
  } = useDeleteDepartmentActivity();
  // Delete department expense mutation
  const {
    mutateAsync: deleteExpenseMutation,
    isPending: isPendingDeleteExpense,
    isError: isErrorDeleteExpense,
    error: errorDeleteExpense,
  } = useDeleteDepartmentExpense();
  // Delete goal mutation
  const {
    mutateAsync: deleteGoalMutation,
    isPending: isPendingDeleteGoal,
    isError: isErrorDeleteGoal,
    error: errorDeleteGoal,
  } = useDeleteDepartmentGoal();
  // Delete member mutation
  const {
    mutateAsync: deleteMemberMutation,
    isPending: isPendingDeleteMember,
    isError: isErrorDeleteMember,
    error: errorDeleteMember,
  } = useDeleteDepartmentMember();
  const handleDeleteActivity = async (activityId: string) => {
    await deleteActivityMutation({
      departmentId: id,
      activityId,
    });
    setSelectedActivity(null);
  };
  const openActivityDeleteDialog = (activity: DepartmentActivity) => {
    setSelectedActivity(activity);
  };
  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoalMutation({
      departmentId: id,
      goalId,
    });
    setSelectedGoal(null);
  };
  const openGoalDeleteDialog = (goal: DepartmentGoal) => {
    setSelectedGoal(goal);
  };
  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpenseMutation({
      departmentId: id,
      expenseId,
    });
    setSelectedExpense(null);
  };
  const openExpenseDeleteDialog = (expense: DepartmentExpense) => {
    setSelectedExpense(expense);
  };
  const handleDeleteMember = async (memberId: string) => {
    await deleteMemberMutation({
      departmentId: id,
      memberId,
    });
    setSelectedMember(null);
  };
  const openMemberDeleteDialog = (member: DepartmentMember) => {
    setSelectedMember(member);
  };
  // Function to open member dialog in add mode
  const handleAddDepartmentMember = () => {
    setSelectedMember(null);
    setDialogMode('add');
    setIsDepartmentMemberDialogOpen(true);
  };
  // Function to open member dialog in edit mode
  const handleEditDepartmentMember = (member: DepartmentMember) => {
    setSelectedMember(member);
    setDialogMode('edit');
    setIsDepartmentMemberDialogOpen(true);
  };
  // Function to close member dialog and reset state
  const handleCloseDepartmentMemberDialog = () => {
    setIsDepartmentMemberDialogOpen(false);
    setSelectedMember(null);
    setDialogMode('add');
  };
  // Function to open expense dialog in add mode
  const handleAddDepartmentExpense = () => {
    setSelectedExpense(null);
    setDialogMode('add');
    setIsDepartmentExpenseDialogOpen(true);
  };
  // Function to open expense dialog in edit mode
  const handleEditDepartmentExpense = (expense: DepartmentExpense) => {
    setSelectedExpense(expense);
    setDialogMode('edit');
    setIsDepartmentExpenseDialogOpen(true);
  };
  // Function to close expense dialog and reset state
  const handleCloseDepartmentExpenseDialog = () => {
    setIsDepartmentExpenseDialogOpen(false);
    setSelectedExpense(null);
    setDialogMode('add');
  };
  // Function to open activity dialog in add mode
  const handleAddDepartmentActivity = () => {
    setSelectedActivity(null);
    setDialogMode('add');
    setIsDepartmentActivityDialogOpen(true);
  };
  // Function to open activity dialog in edit mode
  const handleEditDepartmentActivity = (activity: DepartmentActivity) => {
    setSelectedActivity(activity);
    setDialogMode('edit');
    setIsDepartmentActivityDialogOpen(true);
  };
  // Function to close activity dialog and reset state
  const handleCloseDepartmentActivityDialog = () => {
    setIsDepartmentActivityDialogOpen(false);
    setSelectedActivity(null);
    setDialogMode('add');
  };
  // Function to open goal dialog in add mode
  const handleAddDepartmentGoal = () => {
    setSelectedGoal(null);
    setDialogMode('add');
    setIsDepartmentGoalDialogOpen(true);
  };
  // Function to open goal dialog in edit mode
  const handleEditDepartmentGoal = (goal: DepartmentGoal) => {
    setSelectedGoal(goal);
    setDialogMode('edit');
    setIsDepartmentGoalDialogOpen(true);
  };
  // Function to close goal dialog and reset state
  const handleCloseDepartmentGoalDialog = () => {
    setIsDepartmentGoalDialogOpen(false);
    setSelectedGoal(null);
    setDialogMode('add');
  };
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/church/departments">
              <Button size="sm" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Departments
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                {capitalizeFirstLetterOfEachWord(
                  department?.departmentName || 'Department Name'
                )}
              </h1>
              <p className="text-muted-foreground">
                Department details and management
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {isEditing && (
              <Button
                disabled={isPendingUpdateDepartment}
                onClick={form.handleSubmit(onSubmitDepartmentForm)}
                type="submit"
              >
                <Save className="mr-2 h-4 w-4" />
                {isPendingUpdateDepartment ? (
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
        {/* Department Stats */}
        {isErrorDepartment && <RenderApiError error={errorDepartment} />}
        {isErrorUpdateDepartment && (
          <RenderApiError error={errorUpdateDepartment} />
        )}
        {isLoadingDepartment ? (
          <SpinnerLoader description="Loading department data..." />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {departmentMembers?.data?.pagination?.totalMembers || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Active members
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Budget Usage
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {Math.round(
                      ((departmentExpenses?.summary?.totalSpent ?? 0) /
                        (departmentExpenses?.summary?.totalBudget ?? 0)) *
                        100
                    )}
                    %
                  </div>
                  <p className="text-muted-foreground text-xs">
                    KES{' '}
                    {departmentExpenses?.summary?.totalSpent.toLocaleString()}{' '}
                    used
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Years Active
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">4</div>
                  <p className="text-muted-foreground text-xs">
                    Since{' '}
                    {department?.establishedDate
                      ? formatToNewDate(new Date(department.establishedDate))
                      : 'Not Provided'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Activities
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {departmentActivities?.data?.pagination?.totalActivities}
                  </div>
                  <p className="text-muted-foreground text-xs">This month</p>
                </CardContent>
              </Card>
            </div>
            <Tabs className="space-y-4" defaultValue="overview">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>
              <TabsContent className="space-y-6" value="overview">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Information</CardTitle>
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
                              name="departmentName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Department Name{' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Choir" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Category{' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="cursor-pointer">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[400px] overflow-y-auto">
                                      {DEPARTMENT_CATEGORY_OPTIONS.map(
                                        (option) => (
                                          <SelectItem
                                            className="cursor-pointer"
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="leaderId" // Form field stores just the user ID string
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Leader (Optional)</FormLabel>
                                  <FormControl>
                                    <UserCombobox
                                      className="w-full"
                                      onValueChange={field.onChange} // Use onValueChange for ID
                                      placeholder="Search and select a leader"
                                      value={field.value} // Pass the ID directly
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="meetingDay"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Meeting day(s){' '}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <MultiSelect
                                        onChange={field.onChange}
                                        options={MEETING_DAY_OPTIONS}
                                        placeholder="Select meeting day(s)"
                                        selected={field.value || []}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="meetingTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Meeting Time(s){' '}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <TimeInput
                                        multiSelect
                                        onChange={field.onChange}
                                        placeholder="Select meeting times"
                                        value={field.value}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                                      maxDate={getRelativeYear(1)}
                                      minDate={getRelativeYear(-30)}
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
                            <FormField
                              control={form.control}
                              name="totalBudget"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Budget (KES){' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <NumberInput
                                      placeholder="1000"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Location{' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. Main Sanctuary or Room 101"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    className="text-right"
                                    htmlFor="description"
                                  >
                                    Description{' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      className="col-span-3"
                                      id="description"
                                      placeholder="Enter department description..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="col-span-3 col-start-2" />
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Category:{' '}
                              {capitalizeFirstLetterOfEachWord(
                                department?.category || 'Not Provided'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {capitalizeFirstLetterOfEachWord(
                                department?.location || 'Not Provided'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {department?.meetingDay
                                ?.map(
                                  (day) =>
                                    day.charAt(0).toUpperCase() + day.slice(1)
                                )
                                .join(', ')}{' '}
                              at {department?.meetingTime?.join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Budget: KES{' '}
                              {department?.totalBudget.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Established:{' '}
                              {department?.establishedDate
                                ? new Date(
                                    department.establishedDate
                                  ).toLocaleDateString()
                                : 'Not Provided'}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  {/* Department Head */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Head</CardTitle>
                      <CardDescription>
                        Leadership and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {departmentMembers?.data?.members?.map((member) => (
                        <React.Fragment key={member._id}>
                          {member?.role === 'leader' && (
                            <>
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    alt={member?.userId?.firstName || 'Member'}
                                    src={
                                      member?.userId?.profilePictureUrl || ''
                                    }
                                  />
                                  <AvatarFallback>{`${getFirstLetter(
                                    member?.userId?.firstName || ''
                                  )}${getFirstLetter(member?.userId?.lastName || '')}`}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{`${capitalizeFirstLetter(
                                    member?.userId?.firstName || ''
                                  )} ${capitalizeFirstLetter(member?.userId?.lastName || '')}`}</h3>
                                  <p className="text-muted-foreground text-sm">
                                    {capitalizeFirstLetter(member?.role)}
                                  </p>
                                  <Badge variant="outline">
                                    {member?.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {member?.userId?.phoneNumber ??
                                      'Not Provided'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {member?.userId?.email ?? 'Not Provided'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Leading since{' '}
                                    {new Date(
                                      member?.joinedDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                      {departmentMembers?.data?.members?.length === 0 &&
                        'Not Assigned'}
                    </CardContent>
                  </Card>
                </div>
                {/* Description */}
                {!isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                      <CardDescription>
                        Department mission and overview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {capitalizeFirstLetter(
                          department?.description || 'No description provided.'
                        )}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent className="space-y-6" value="members">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Members</CardTitle>
                    <CardDescription>
                      Manage department membership and roles
                    </CardDescription>
                  </div>
                  {/* <div className="relative">
                    <Input
                      className="w-64"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search members..."
                      value={searchTerm}
                    />
                  </div> */}
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) setIsDepartmentMemberDialogOpen(open);
                      else handleCloseDepartmentMemberDialog();
                    }}
                    open={isDepartmentMemberDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={handleAddDepartmentMember}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {dialogMode === 'edit'
                            ? 'Edit Department Member'
                            : 'Add Department Member'}
                        </DialogTitle>
                        <DialogDescription>
                          {dialogMode === 'edit'
                            ? 'Update a member of this department'
                            : 'Add a member to this department'}
                        </DialogDescription>
                      </DialogHeader>
                      <AddDepartmentMemberForm
                        departmentId={id}
                        member={selectedMember ?? undefined}
                        mode={dialogMode}
                        onCloseDialog={handleCloseDepartmentMemberDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {isErrorDepartmentMembers && (
                  <RenderApiError error={errorDepartmentMembers} />
                )}
                {isErrorDeleteMember && (
                  <RenderApiError error={errorDeleteMember} />
                )}
                {isLoadingDepartmentMembers ? (
                  <SpinnerLoader description="Loading department members..." />
                ) : departmentMembers?.data?.members &&
                  departmentMembers.data.members.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {departmentMembers.data.members.map((member) => (
                            <TableRow key={member?._id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      alt={
                                        member?.userId?.firstName || 'Member'
                                      }
                                      src={
                                        member?.userId?.profilePictureUrl || ''
                                      }
                                    />
                                    <AvatarFallback>{`${getFirstLetter(
                                      member?.userId?.firstName || ''
                                    )}${getFirstLetter(member?.userId?.lastName || '')}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{`${capitalizeFirstLetter(
                                      member?.userId?.firstName || ''
                                    )} ${capitalizeFirstLetter(member?.userId?.lastName || '')}`}</div>
                                    <div className="text-muted-foreground text-sm">
                                      {member?.userId?.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {capitalizeFirstLetter(member?.role)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {member?.skills.map((skill, index) => (
                                    <Badge
                                      className="text-xs"
                                      key={index}
                                      variant="outline"
                                    >
                                      {capitalizeFirstLetter(skill)}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  member?.joinedDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    member?.isActive ? 'default' : 'secondary'
                                  }
                                >
                                  {member?.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() =>
                                      handleEditDepartmentMember(member)
                                    }
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      openMemberDeleteDialog(member)
                                    }
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-medium text-foreground text-lg">
                      No members found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adding a new member or adjusting your search/filter
                      criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent className="space-y-6" value="expenses">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Budget Management</h3>
                    <p className="text-muted-foreground text-sm">
                      Track department budget allocation and usage
                    </p>
                  </div>
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) setIsDepartmentExpenseDialogOpen(open);
                      else handleCloseDepartmentExpenseDialog();
                    }}
                    open={isDepartmentExpenseDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={handleAddDepartmentExpense}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {dialogMode === 'edit'
                            ? 'Edit Department Expense'
                            : 'Add Department Expense'}
                        </DialogTitle>
                        <DialogDescription>
                          {dialogMode === 'edit'
                            ? 'Update a department expense of this department'
                            : 'Add a department expense to this department'}
                        </DialogDescription>
                      </DialogHeader>
                      <AddDepartmentExpenseForm
                        departmentId={id}
                        expense={selectedExpense ?? undefined}
                        mode={dialogMode}
                        onCloseDialog={handleCloseDepartmentExpenseDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {isErrorDepartmentExpenses && (
                  <RenderApiError error={errorDepartmentExpenses} />
                )}
                {isErrorDeleteExpense && (
                  <RenderApiError error={errorDeleteExpense} />
                )}
                {isLoadingDepartmentExpenses ? (
                  <SpinnerLoader description="Loading department expenses..." />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Overview</CardTitle>
                      <CardDescription>
                        Annual budget allocation, usage, and detailed expense
                        breakdown
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Budget Summary Section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">
                          Budget Summary
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              Total Allocated
                            </span>
                            <span className="text-sm">
                              KES {department?.totalBudget.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Used</span>
                            <span className="text-sm">
                              KES{' '}
                              {departmentExpenses?.summary?.totalSpent.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              Remaining
                            </span>
                            <span className="font-medium text-green-600 text-sm">
                              KES{' '}
                              {departmentExpenses?.summary?.remainingBudget.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            className="w-full"
                            value={
                              department?.totalBudget
                                ? ((departmentExpenses?.summary?.totalSpent ??
                                    0) /
                                    department.totalBudget) *
                                  100
                                : 0
                            }
                          />
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="border-border border-t" />
                      {/* Expense Breakdown Section */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">
                          Expense Breakdown
                        </h4>
                        <div className="overflow-x-auto">
                          {departmentExpenses?.expenses &&
                          departmentExpenses.expenses.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Receipt/Ref</TableHead>
                                  <TableHead>Vendor</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {departmentExpenses.expenses.map((expense) => (
                                  <TableRow key={expense?._id}>
                                    <TableCell className="font-medium">
                                      {new Date(
                                        expense?.date
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {capitalizeFirstLetter(
                                          expense?.category
                                        )}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                      KES {expense?.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {expense?.reference ?? 'Not Provided'}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {capitalizeFirstLetter(
                                        expense?.vendor ?? 'Not Provided'
                                      )}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-sm">
                                      {capitalizeFirstLetter(
                                        expense?.description ?? 'Not Provided'
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-1">
                                        <Button
                                          onClick={() =>
                                            handleEditDepartmentExpense(expense)
                                          }
                                          size="sm"
                                          variant="outline"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            openExpenseDeleteDialog(expense)
                                          }
                                          size="sm"
                                          variant="destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="py-12 text-center">
                              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                              <h3 className="mb-2 font-medium text-foreground text-lg">
                                No expenses recorded yet
                              </h3>
                              <p className="text-muted-foreground">
                                Add your first expense to start tracking
                                department budget usage.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent className="space-y-6" value="activities">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">
                      Department Activities
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Recent meetings, events, and activities
                    </p>
                  </div>
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) setIsDepartmentActivityDialogOpen(open);
                      else handleCloseDepartmentActivityDialog();
                    }}
                    open={isDepartmentActivityDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={handleAddDepartmentActivity}>
                        <Plus className="mr-2 h-4 w-4" />
                        Log Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {dialogMode === 'edit'
                            ? 'Edit Department Activity'
                            : 'Add Department Activity'}
                        </DialogTitle>
                        <DialogDescription>
                          {dialogMode === 'edit'
                            ? 'Update department activity of this department'
                            : 'Add department activity to this department'}
                        </DialogDescription>
                      </DialogHeader>
                      <AddDepartmentActivityForm
                        activity={selectedActivity ?? undefined}
                        departmentId={id}
                        mode={dialogMode}
                        onCloseDialog={handleCloseDepartmentActivityDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {isErrorDepartmentActivities && (
                  <RenderApiError error={errorDepartmentActivities} />
                )}
                {isErrorDeleteActivity && (
                  <RenderApiError error={errorDeleteActivity} />
                )}
                {isLoadingDepartmentActivities ? (
                  <SpinnerLoader description="Loading department activities..." />
                ) : departmentActivities?.data?.activities &&
                  departmentActivities.data.activities.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Time (Hrs)</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {departmentActivities.data.activities.map(
                            (activity) => (
                              <TableRow key={activity?._id}>
                                <TableCell className="font-medium">
                                  {new Date(
                                    activity?.date
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {capitalizeFirstLetter(activity?.type)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {capitalizeFirstLetterOfEachWord(
                                        activity?.title
                                      )}
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                      {capitalizeFirstLetter(
                                        activity?.description
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  <div className="flex space-x-2">
                                    <div className="text-sm">
                                      {activity?.startTime ?? 'N/A'} -{' '}
                                      {activity?.endTime ?? 'N/A'}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {capitalizeFirstLetterOfEachWord(
                                    activity?.location
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {activity?.participants.map(
                                      (participant) => (
                                        <Badge
                                          className="text-xs"
                                          key={participant?._id}
                                          variant="outline"
                                        >
                                          {capitalizeFirstLetterOfEachWord(
                                            participant?.fullName
                                          )}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {capitalizeFirstLetter(activity?.description)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() =>
                                        handleEditDepartmentActivity(activity)
                                      }
                                      size="sm"
                                      variant="outline"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        openActivityDeleteDialog(activity)
                                      }
                                      size="sm"
                                      variant="destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-medium text-foreground text-lg">
                      No activities found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adding a new activity or adjusting your search/filter
                      criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent className="space-y-6" value="goals">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Department Goals</h3>
                    <p className="text-muted-foreground text-sm">
                      Track progress on department objectives
                    </p>
                  </div>
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) setIsDepartmentGoalDialogOpen(open);
                      else handleCloseDepartmentGoalDialog();
                    }}
                    open={isDepartmentGoalDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={handleAddDepartmentGoal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {dialogMode === 'edit'
                            ? 'Edit Department Goal'
                            : 'Add Department Goal'}
                        </DialogTitle>
                        <DialogDescription>
                          {dialogMode === 'edit'
                            ? 'Update department goal of this department'
                            : 'Add department goal to this department'}
                        </DialogDescription>
                      </DialogHeader>
                      <AddDepartmentGoalForm
                        departmentId={id}
                        goal={selectedGoal ?? undefined}
                        mode={dialogMode}
                        onCloseDialog={handleCloseDepartmentGoalDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {isErrorDepartmentGoals && (
                  <RenderApiError error={errorDepartmentGoals} />
                )}
                {isErrorDeleteGoal && (
                  <RenderApiError error={errorDeleteGoal} />
                )}
                {isLoadingDepartmentGoals ? (
                  <SpinnerLoader description="Loading department goals..." />
                ) : departmentGoals?.data?.goals &&
                  departmentGoals.data.goals.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Target Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Success Criteria</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {departmentGoals.data.goals.map((goal) => (
                            <TableRow key={goal?._id}>
                              <TableCell className="font-medium">
                                {new Date(goal?.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {capitalizeFirstLetter(goal?.title)}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {capitalizeFirstLetter(goal?.description)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {capitalizeFirstLetter(goal?.priority)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  goal?.targetDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {capitalizeFirstLetter(goal?.category)}
                              </TableCell>
                              <TableCell>{`${capitalizeFirstLetter(goal?.assignee?.firstName ?? '')} ${capitalizeFirstLetter(goal?.assignee?.lastName ?? '')}`}</TableCell>
                              <TableCell>
                                {capitalizeFirstLetter(
                                  goal?.success ?? 'Not Provided'
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() =>
                                      handleEditDepartmentGoal(goal)
                                    }
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => openGoalDeleteDialog(goal)}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-medium text-foreground text-lg">
                      No goals found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adding a new goal or adjusting your search/filter
                      criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
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
      {/* Delete Goal Dialog */}
      <DeleteGoalDialog
        goalId={selectedGoal?._id}
        isDeleting={isPendingDeleteGoal}
        onDelete={handleDeleteGoal}
        onOpenChange={(open) => {
          if (!open) setSelectedGoal(null);
        }}
        open={!!selectedGoal}
      />
      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        expenseId={selectedExpense?._id}
        isDeleting={isPendingDeleteExpense}
        onDelete={handleDeleteExpense}
        onOpenChange={(open) => {
          if (!open) setSelectedExpense(null);
        }}
        open={!!selectedExpense}
      />
      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        isDeleting={isPendingDeleteMember}
        memberId={selectedMember?._id}
        onDelete={handleDeleteMember}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }}
        open={!!selectedMember}
      />
    </>
  );
}
