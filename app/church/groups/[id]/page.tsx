'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { DeleteActivityDialog } from '@/components/dialogs/delete-activity-dialog';
import { DeleteGoalDialog } from '@/components/dialogs/delete-goals-dialog';
import { DeleteMemberDialog } from '@/components/dialogs/delete-member-dialog';
import { AddGroupActivityForm } from '@/components/forms/add-group-activity-form';
import { AddGroupGoalForm } from '@/components/forms/add-group-goal-form';
import { AddGroupMemberForm } from '@/components/forms/add-group-member-form';
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
import { Label } from '@/components/ui/label';
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
  useDeleteGroupActivity,
  useDeleteGroupGoal,
  useDeleteGroupMember,
  useFetchAttendanceSummary,
  useFetchGroupActivities,
  useFetchGroupById,
  useFetchGroupGoals,
  useFetchGroupMembers,
  useUpdateGroupById,
} from '@/lib/hooks/church/group/use-group-queries';
import type {
  GroupActivity,
  GroupGoal,
  GroupMember,
} from '@/lib/types/small-group';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  getFirstLetter,
  getRelativeYear,
  GROUP_CATEGORY_OPTIONS,
  MEETING_DAY_OPTIONS,
} from '@/lib/utils';
import {
  type AddGroupPayload,
  addGroupSchema,
} from '@/lib/validations/small-group';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function GroupDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // 👈 unwrap the promise
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isGroupGoalDialogOpen, setIsGroupGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GroupGoal | null>(null);
  const [isGroupActivityDialogOpen, setIsGroupActivityDialogOpen] =
    useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<GroupActivity | null>(null);
  const [isGroupMemberDialogOpen, setIsGroupMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null
  );
  const PAGE_LIMIT = 10;
  const {
    data: groupDetails,
    isLoading: isLoadingGroupDetails,
    isError: isErrorGroupDetails,
    error: errorGroupDetails,
  } = useFetchGroupById(id);
  const {
    mutateAsync: UpdateGroupMutation,
    isPending: isPendingUpdateGroup,
    isError: isErrorUpdateGroup,
    error: errorUpdateGroup,
  } = useUpdateGroupById(id);
  const groupForm = useForm<AddGroupPayload>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      groupName: '',
      leaderId: '',
      establishedDate: '',
      meetingDay: [],
      meetingTime: [],
      description: '',
      category: '',
      capacity: '',
      location: '',
    },
  });
  useEffect(() => {
    if (groupDetails) {
      const formData: any = {
        groupName: capitalizeFirstLetter(groupDetails?.groupName || ''),
        leaderId: groupDetails?.leaderId?._id || '',
        // Convert to YYYY-MM-DD format for input type="date"
        establishedDate: groupDetails?.establishedDate
          ? new Date(groupDetails.establishedDate).toISOString().split('T')[0]
          : '',
        meetingDay: groupDetails?.meetingDay || [],
        meetingTime: groupDetails?.meetingTime || [],
        description: groupDetails?.description || '',
        category: groupDetails?.category || '',
        capacity: String(groupDetails?.capacity || ''),
        location: capitalizeFirstLetter(groupDetails?.location || ''),
      };
      groupForm.reset(formData);
    }
  }, [groupForm, groupDetails]);
  const { reset } = groupForm;
  const handleCancelDialog = () => {
    setIsEditGroupDialogOpen(false);
    reset();
  };
  const onSubmitGroupForm = async (payload: AddGroupPayload) => {
    await UpdateGroupMutation({
      groupId: id,
      payload,
    });
    setIsEditGroupDialogOpen(false);
    reset();
  };
  const {
    data: groupGoals,
    isLoading: isLoadingGroupGoals,
    isError: isErrorGroupGoals,
    error: errorGroupGoals,
  } = useFetchGroupGoals({
    groupId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const {
    data: groupActivities,
    isLoading: isLoadingGroupActivities,
    isError: isErrorGroupActivities,
    error: errorGroupActivities,
  } = useFetchGroupActivities({
    groupId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  const {
    data: groupMembers,
    isLoading: isLoadingGroupMembers,
    isError: isErrorGroupMembers,
    error: errorGroupMembers,
  } = useFetchGroupMembers({
    groupId: id,
    page: 1,
    limit: PAGE_LIMIT,
  });
  // Get full attendance summary with all details
  const {
    data: AttendanceSummary,
    isLoading: isLoadingAttendanceSummary,
    isError: isErrorAttendanceSummary,
    error: errorAttendanceSummary,
  } = useFetchAttendanceSummary({
    groupId: id,
    // startDate: '2024-01-01',
    // endDate: '2024-12-31',
    // limit: 20,
    // includeRecords: true,
  });
  // Delete group activity mutation
  const {
    mutateAsync: deleteActivityMutation,
    isPending: isPendingDeleteActivity,
    isError: isErrorDeleteActivity,
    error: errorDeleteActivity,
  } = useDeleteGroupActivity();
  // Delete goal mutation
  const {
    mutateAsync: deleteGoalMutation,
    isPending: isPendingDeleteGoal,
    isError: isErrorDeleteGoal,
    error: errorDeleteGoal,
  } = useDeleteGroupGoal();
  // Delete member mutation
  const {
    mutateAsync: deleteMemberMutation,
    isPending: isPendingDeleteMember,
    isError: isErrorDeleteMember,
    error: errorDeleteMember,
  } = useDeleteGroupMember();
  const handleDeleteMember = async (memberId: string) => {
    await deleteMemberMutation({
      groupId: id,
      memberId,
    });
    setSelectedMember(null);
  };
  const openMemberDeleteDialog = (member: GroupMember) => {
    setSelectedMember(member);
  };
  // Function to open member dialog in add mode
  const handleAddGroupMember = () => {
    setSelectedMember(null);
    setDialogMode('add');
    setIsGroupMemberDialogOpen(true);
  };
  // Function to open member dialog in edit mode
  const handleEditGroupMember = (member: GroupMember) => {
    setSelectedMember(member);
    setDialogMode('edit');
    setIsGroupMemberDialogOpen(true);
  };
  // Function to close member dialog and reset state
  const handleCloseGroupMemberDialog = () => {
    setIsGroupMemberDialogOpen(false);
    setSelectedMember(null);
    setDialogMode('add');
  };
  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoalMutation({
      groupId: id,
      goalId,
    });
    setSelectedGoal(null);
  };
  const openGoalDeleteDialog = (goal: GroupGoal) => {
    setSelectedGoal(goal);
  };
  const handleDeleteActivity = async (activityId: string) => {
    await deleteActivityMutation({
      groupId: id,
      activityId,
    });
    setSelectedActivity(null);
  };
  const openActivityDeleteDialog = (activity: GroupActivity) => {
    setSelectedActivity(activity);
  };
  // Function to open activity dialog in add mode
  const handleAddGroupActivity = () => {
    setSelectedActivity(null);
    setDialogMode('add');
    setIsGroupActivityDialogOpen(true);
  };
  // Function to open activity dialog in edit mode
  const handleEditGroupActivity = (activity: GroupActivity) => {
    setSelectedActivity(activity);
    setDialogMode('edit');
    setIsGroupActivityDialogOpen(true);
  };
  // Function to close activity dialog and reset state
  const handleCloseGroupActivityDialog = () => {
    setIsGroupActivityDialogOpen(false);
    setSelectedActivity(null);
    setDialogMode('add');
  };
  // Function to open goal dialog in add mode
  const handleAddGroupGoal = () => {
    setSelectedGoal(null);
    setDialogMode('add');
    setIsGroupGoalDialogOpen(true);
  };
  // Function to open goal dialog in edit mode
  const handleEditGroupGoal = (goal: GroupGoal) => {
    setSelectedGoal(goal);
    setDialogMode('edit');
    setIsGroupGoalDialogOpen(true);
  };
  // Function to close goal dialog and reset state
  const handleCloseGroupGoalDialog = () => {
    setIsGroupGoalDialogOpen(false);
    setSelectedGoal(null);
    setDialogMode('add');
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/church/groups">
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Groups
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              {capitalizeFirstLetter(groupDetails?.groupName || '')}
            </h1>
            <p className="text-muted-foreground">
              {capitalizeFirstLetter(groupDetails?.description || '')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog
            onOpenChange={setIsEditGroupDialogOpen}
            open={isEditGroupDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Group Details</DialogTitle>
                <DialogDescription>Update group information</DialogDescription>
              </DialogHeader>
              {isErrorUpdateGroup && (
                <RenderApiError error={errorUpdateGroup} />
              )}
              <Form {...groupForm}>
                <form
                  className="space-y-4"
                  onSubmit={groupForm.handleSubmit(onSubmitGroupForm)}
                >
                  <FormField
                    control={groupForm.control}
                    name="groupName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Group Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter group name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={groupForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select group category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[400px] overflow-y-auto">
                            {GROUP_CATEGORY_OPTIONS.map((option) => (
                              <SelectItem
                                className="cursor-pointer"
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={groupForm.control}
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
                              field.onChange(date ? date.toISOString() : '')
                            }
                            placeholder="Select established date"
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={groupForm.control}
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={groupForm.control}
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
                      control={groupForm.control}
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={groupForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Meeting Location{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Room 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={groupForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Capacity (1-20 Members){' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <NumberInput placeholder="20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={groupForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the group's purpose"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      onClick={handleCancelDialog}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        !groupForm.formState.isValid || isPendingUpdateGroup
                      }
                      type="submit"
                    >
                      {isPendingUpdateGroup
                        ? 'Updating group...'
                        : 'Update Group'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {isErrorGroupDetails && <RenderApiError error={errorGroupDetails} />}
      {isLoadingGroupDetails ? (
        <SpinnerLoader description="Loading group data..." />
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="font-bold text-2xl">{groupDetails.members}</div> */}
                <div className="font-bold text-2xl">{0}</div>
                <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                  <span>of {groupDetails?.capacity ?? 0} capacity</span>
                </div>
                <Progress
                  className="mt-2 h-2"
                  // value={(groupDetails.members / groupDetails?.capacity) * 100}
                  value={0}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Avg Attendance
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {/* {groupDetails.averageAttendance}% */}
                  0%
                </div>
                <p className="text-muted-foreground text-xs">Last 6 meetings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Meeting Schedule
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-lg">
                  {groupDetails?.meetingDay
                    ?.map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                    .join(', ')}
                </div>
                <p className="text-muted-foreground text-xs">
                  {groupDetails?.meetingTime?.join(', ')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  {capitalizeFirstLetterOfEachWord(
                    groupDetails?.category || 'Not Provided'
                  )}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">2</div>
                <p className="text-muted-foreground text-xs">Years active</p>
              </CardContent>
            </Card>
          </div>
          {/* Group Information */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="mr-4 font-medium text-sm">Category</Label>
                    <Badge variant="outline">
                      {capitalizeFirstLetterOfEachWord(
                        groupDetails?.category || 'Not Provided'
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="mr-4 font-medium text-sm">Status</Label>
                    <Badge
                      variant={groupDetails?.isActive ? 'default' : 'secondary'}
                    >
                      {groupDetails?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-sm">
                      Meeting Location
                    </Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {capitalizeFirstLetterOfEachWord(
                          groupDetails?.location || 'Not Provided'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="mr-4 font-medium text-sm">
                      Meeting Schedule
                    </Label>
                    <span className="text-sm">
                      {groupDetails?.meetingDay
                        ?.map(
                          (day) => day.charAt(0).toUpperCase() + day.slice(1)
                        )
                        .join(', ')}{' '}
                      at {groupDetails?.meetingTime?.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-sm">Group Goals</Label>
                  <ul className="space-y-1">
                    {groupGoals?.data?.goals &&
                    groupGoals.data.goals.length > 0 ? (
                      groupGoals.data.goals.map((goal) => (
                        <li
                          className="flex items-center space-x-2 text-sm"
                          key={goal._id}
                        >
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span>{capitalizeFirstLetter(goal.title)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground text-sm">
                        No goals set
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Group Leader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupMembers?.data?.members?.map((member) => (
                  <React.Fragment key={member._id}>
                    {member?.role === 'leader' && (
                      <>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              alt={member?.userId?.firstName || 'Member'}
                              src={member?.userId?.profilePictureUrl || ''}
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
                              {member?.userId?.phoneNumber ?? 'Not Provided'}
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
                {groupMembers?.data?.members?.length === 0 && 'Not Assigned'}
              </CardContent>
            </Card>
          </div>
          {/* Detailed Tabs */}
          <Tabs className="space-y-4" defaultValue="members">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent className="space-y-6" value="members">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Group Members</CardTitle>
                  <CardDescription>
                    Manage group membership and roles
                  </CardDescription>
                </div>
                <div className="relative">
                  <Input
                    className="w-64"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..."
                    value={searchTerm}
                  />
                </div>
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setIsGroupMemberDialogOpen(open);
                    else handleCloseGroupMemberDialog();
                  }}
                  open={isGroupMemberDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddGroupMember}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogMode === 'edit'
                          ? 'Edit Group Member'
                          : 'Add Group Member'}
                      </DialogTitle>
                      <DialogDescription>
                        {dialogMode === 'edit'
                          ? 'Update a member of this group'
                          : 'Add a member to this group'}
                      </DialogDescription>
                    </DialogHeader>
                    <AddGroupMemberForm
                      groupId={id}
                      member={selectedMember ?? undefined}
                      mode={dialogMode}
                      onCloseDialog={handleCloseGroupMemberDialog}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorGroupMembers && (
                <RenderApiError error={errorGroupMembers} />
              )}
              {isErrorDeleteMember && (
                <RenderApiError error={errorDeleteMember} />
              )}
              {isLoadingGroupMembers ? (
                <SpinnerLoader description="Loading group members..." />
              ) : groupMembers?.data?.members &&
                groupMembers.data.members.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupMembers.data.members.map((member) => (
                          <TableRow key={member?._id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
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
                                  onClick={() => handleEditGroupMember(member)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => openMemberDeleteDialog(member)}
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
            <TabsContent className="space-y-6" value="attendance">
              {isErrorAttendanceSummary && (
                <RenderApiError error={errorAttendanceSummary} />
              )}
              {isLoadingAttendanceSummary ? (
                <SpinnerLoader description="Loading attendance summary..." />
              ) : AttendanceSummary?.data?.summaries &&
                AttendanceSummary.data.summaries.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>
                      Track meeting attendance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {AttendanceSummary.data.summaries.map(
                          (record, index) => (
                            <TableRow key={record.activityId}>
                              <TableCell>
                                {new Date(record.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {capitalizeFirstLetterOfEachWord(
                                      record.title
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {capitalizeFirstLetter(record.type)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {record.totalPresent}
                                {record.totalLate > 0 && (
                                  <span className="ml-1 text-amber-600 text-sm">
                                    (+{record.totalLate} late)
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{record.totalExpected}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {record.attendanceRate}%
                                  </span>
                                  <Progress
                                    className="h-2 w-16"
                                    value={record.attendanceRate}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.isCompleted ? 'default' : 'secondary'
                                  }
                                >
                                  {record.isCompleted ? 'Completed' : 'Pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {index <
                                  AttendanceSummary.data.summaries.length -
                                    1 && (
                                  <div className="flex items-center">
                                    {record.attendanceRate >
                                    AttendanceSummary.data.summaries[index + 1]
                                      .attendanceRate ? (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : record.attendanceRate <
                                      AttendanceSummary.data.summaries[
                                        index + 1
                                      ].attendanceRate ? (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Minus className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    {/* Overall Statistics Summary */}
                    {AttendanceSummary.data.overallStats && (
                      <div className="mt-6 space-y-4">
                        <div className="border-border border-t pt-4">
                          <h4 className="mb-3 font-semibold text-foreground text-sm">
                            Overall Statistics
                          </h4>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="text-center">
                              <div className="font-bold text-lg">
                                {
                                  AttendanceSummary.data.overallStats
                                    .averageAttendanceRate
                                }
                                %
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Average Rate
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg">
                                {
                                  AttendanceSummary.data.overallStats
                                    .totalActivities
                                }
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Total Activities
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600 text-lg">
                                {
                                  AttendanceSummary.data.overallStats
                                    .bestAttendanceRate
                                }
                                %
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Best Rate
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg text-red-600">
                                {
                                  AttendanceSummary.data.overallStats
                                    .worstAttendanceRate
                                }
                                %
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Worst Rate
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No attendance records found
                  </h3>
                  <p className="text-muted-foreground">
                    Attendance will appear here once activities are completed
                    and attendance is recorded.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent className="space-y-6" value="activities">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Group Activities</h3>
                  <p className="text-muted-foreground text-sm">
                    Recent meetings, events, and activities
                  </p>
                </div>
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setIsGroupActivityDialogOpen(open);
                    else handleCloseGroupActivityDialog();
                  }}
                  open={isGroupActivityDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddGroupActivity}>
                      <Plus className="mr-2 h-4 w-4" />
                      Log Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogMode === 'edit'
                          ? 'Edit Group Activity'
                          : 'Add Group Activity'}
                      </DialogTitle>
                      <DialogDescription>
                        {dialogMode === 'edit'
                          ? 'Update group activity of this group'
                          : 'Add group activity to this group'}
                      </DialogDescription>
                    </DialogHeader>
                    <AddGroupActivityForm
                      activity={selectedActivity ?? undefined}
                      groupId={id}
                      mode={dialogMode}
                      onCloseDialog={handleCloseGroupActivityDialog}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorGroupActivities && (
                <RenderApiError error={errorGroupActivities} />
              )}
              {isErrorDeleteActivity && (
                <RenderApiError error={errorDeleteActivity} />
              )}
              {isLoadingGroupActivities ? (
                <SpinnerLoader description="Loading group activities..." />
              ) : groupActivities?.activities &&
                groupActivities.activities.length > 0 ? (
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
                        {groupActivities.activities.map((activity) => (
                          <TableRow key={activity?._id}>
                            <TableCell className="font-medium">
                              {new Date(activity?.date).toLocaleDateString()}
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
                                  {capitalizeFirstLetter(activity?.description)}
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
                                {activity?.participants.map((participant) => (
                                  <Badge
                                    className="text-xs"
                                    key={participant?._id}
                                    variant="outline"
                                  >
                                    {capitalizeFirstLetterOfEachWord(
                                      participant?.fullName
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {capitalizeFirstLetter(activity?.description)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() =>
                                    handleEditGroupActivity(activity)
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
                        ))}
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
                  <h3 className="font-medium text-lg">Group Goals</h3>
                  <p className="text-muted-foreground text-sm">
                    Track progress on group objectives
                  </p>
                </div>
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setIsGroupGoalDialogOpen(open);
                    else handleCloseGroupGoalDialog();
                  }}
                  open={isGroupGoalDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddGroupGoal}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {dialogMode === 'edit'
                          ? 'Edit Group Goal'
                          : 'Add Group Goal'}
                      </DialogTitle>
                      <DialogDescription>
                        {dialogMode === 'edit'
                          ? 'Update group goal of this group'
                          : 'Add group goal to this group'}
                      </DialogDescription>
                    </DialogHeader>
                    <AddGroupGoalForm
                      goal={selectedGoal ?? undefined}
                      groupId={id}
                      mode={dialogMode}
                      onCloseDialog={handleCloseGroupGoalDialog}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {isErrorGroupGoals && <RenderApiError error={errorGroupGoals} />}
              {isErrorDeleteGoal && <RenderApiError error={errorDeleteGoal} />}
              {isLoadingGroupGoals ? (
                <SpinnerLoader description="Loading group goals..." />
              ) : groupGoals?.data?.goals &&
                groupGoals.data.goals.length > 0 ? (
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
                        {groupGoals.data.goals.map((goal) => (
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
                              {new Date(goal?.targetDate).toLocaleDateString()}
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
                                  onClick={() => handleEditGroupGoal(goal)}
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
    </div>
  );
}
