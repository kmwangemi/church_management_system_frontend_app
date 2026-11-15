'use client';

import React from 'react';

import RenderApiError from '@/components/api-error';
import { getRoleBadge, getStatusBadge } from '@/components/helpers';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RenderMemberView,
  RenderStaffView,
  RenderViewRoleSpecificFields,
  RenderVolunteerView,
} from '@/components/view-role-specific';
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useAdminMemberDetails } from '@/lib/hooks/shared/use-organization-member-mutation';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  formatToNewDate,
} from '@/lib/utils';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Gift,
  Heart,
  Mail,
  MapPin,
  Phone,
  Star,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
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
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function MemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // 👈 unwrap the promise
  const { organizationId } = useActiveOrganization();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useAdminMemberDetails(id, organizationId);

  const attendanceData = user?.attendanceData || [];
  const givingData = user?.givingData || [];
  const involvementData = user?.involvementData || [];
  const recentActivities = user?.recentActivities || [];
  const servicePreferences = user?.servicePreferences || [];
  const recognitions = user?.recognitions || [];
  const totalGiving = Number(user?.totalGiving ?? 0);
  const averageMonthlyGiving = Number(user?.averageMonthlyGiving ?? 0);
  const givingConsistencyPct = Number(user?.givingConsistencyPct ?? 0);
  const givingMonthsActive = Number(user?.givingMonthsActive ?? 0);
  const givingGrowthPct = Number(user?.givingGrowthPct ?? 0);
  const averageAttendance = Number(user?.averageAttendance ?? 0);
  const servicesAttended = Number(user?.servicesAttended ?? 0);
  const totalServices = Number(user?.totalServices ?? 0);
  const consecutiveWeeks = Number(user?.consecutiveWeeks ?? 0);
  const bestMonth = user?.bestMonth || 'N/A';
  const volunteerHours = Number(
    user?.volunteerDetails?.hoursContributed ?? 0
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'Service':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'Giving':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'Ministry':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const availableTabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'giving', label: 'Giving' },
    { value: 'involvement', label: 'Involvement' },
    { value: 'activity', label: 'Activity' },
  ];

  const roles = user?.member?.role;
  const displayId =
    user?.membershipNumber ||
    user?.member?.membershipNumber ||
    user?.memberDetails?.memberId ||
    user?.adminDetails?.adminId ||
    user?.staffDetails?.staffId ||
    user?.volunteerDetails?.volunteerId ||
    user?.pastorDetails?.pastorId;

  return (
    <div className="space-y-6">
      {/* Header */}
      {isErrorUser && <RenderApiError error={errorUser} />}
      {isLoadingUser ? (
        <SpinnerLoader description="Loading user data..." />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/church/users">
                <Button size="sm" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Users
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-bold text-3xl tracking-tight">
                    {capitalizeFirstLetterOfEachWord(
                      user?.user?.name || 'Not Provided'
                    )}
                  </h1>
                  {displayId && (
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 border-primary/30 bg-primary/5 text-primary font-semibold">
                      {displayId}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  User profile and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/church/users/edit/${user?.member?.id || user?.id || id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
          {/* Member Overview */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    alt={user?.user?.name || 'User'}
                    src={user?.user?.image ?? ''}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {(user?.user?.name || 'User')
                      .split(' ')
                      .filter(Boolean)
                      .map((n: string) => n[0]?.toUpperCase() || '')
                      .join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg">
                    {capitalizeFirstLetterOfEachWord(
                      user?.user?.name || 'Not Provided'
                    )}
                  </h3>
                  {displayId && (
                    <div className="flex justify-center pb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border">
                        {displayId}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-1">
                    {(user?.member?.role || user?.role || ['MEMBER'])?.map((role: string) => (
                      <span key={role}>{getRoleBadge(role)}</span>
                    ))}
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(user?.user?.status || 'ACTIVE')}
                  </div>
                </div>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user?.user?.email || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.user?.phoneNumber || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">
                      {[user?.address?.street, user?.address?.city, user?.address?.country]
                        .filter((p) => Boolean(p && p !== 'N/A' && p !== 'Not Provided'))
                        .map((p) => capitalizeFirstLetter(p!))
                        .join(', ') || 'Not Provided'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Joined{' '}
                      {user?.memberDetails?.membershipDate || user?.memberDetails?.joinedDate || user?.member?.joinedDate || user?.joinedAt || user?.createdAt
                        ? formatToNewDate(
                            user?.memberDetails?.membershipDate ||
                            user?.memberDetails?.joinedDate ||
                            user?.member?.joinedDate ||
                            user?.joinedAt ||
                            user?.createdAt
                          ) || 'Not Provided'
                        : 'Not Provided'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Key Metrics */}
            <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Total Giving
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    KES {totalGiving.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-xs">This year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Attendance Rate
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">
                    {averageAttendance}%
                  </div>
                  <p className="text-muted-foreground text-xs">Last 6 months</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    Volunteer Hours
                  </CardTitle>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">{volunteerHours}</div>
                  <p className="text-muted-foreground text-xs">This year</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Tabs className="space-y-4" defaultValue="overview">
            <TabsList
              className={`grid w-full grid-cols-${availableTabs.length}`}
            >
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent className="space-y-6" value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Basic member details and role-specific information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Birth Date
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {user?.user?.dateOfBirth || user?.dateOfBirth
                            ? formatToNewDate(user?.user?.dateOfBirth || user?.dateOfBirth) || 'Not Provided'
                            : 'Not Provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Marital Status
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.user?.maritalStatus || user?.maritalStatus || 'Not Provided'
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Occupation
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.user?.occupation || user?.occupation || 'Not Provided'
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Gender
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(user?.user?.gender || user?.gender || 'Not Provided')}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Household Role
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.member?.householdRole || user?.householdRole || 'Not Provided'
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Member Type
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.memberType || user?.member?.memberType || 'Member'
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Role-Specific Information */}
                    <div className="border-t pt-4">
                      <Label
                        className="mb-3 block font-medium text-sm"
                        htmlFor={''}
                      >
                        Role-Specific Information
                      </Label>
                      <RenderMemberView position={user?.position || ''} roles={roles} user={user} />
                      <RenderViewRoleSpecificFields position={user?.position || ''} roles={roles} user={user} />
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Emergency Contact
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Name:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact?.emergencyContactFullName ||
                          'Not Provided'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Email:
                        </span>
                        {user?.emergencyContact?.emergencyContactEmail || 'Not Provided'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Phone Number:
                        </span>
                        {user?.emergencyContact?.emergencyContactPhoneNumber ||
                          'Not Provided'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Relationship:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact
                            ?.emergencyContactRelationship || 'Not Provided'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Address:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact?.emergencyContactAddress ||
                          'Not Provided'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Notes:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact?.emergencyContactNotes || 'Not Provided'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {/* Spiritual Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spiritual Status</CardTitle>
                    <CardDescription>
                      Baptism, confirmation, and membership details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Baptized</span>
                      <Badge
                        variant={
                          user?.memberDetails?.baptismDate
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {user?.memberDetails?.baptismDate
                          ? `Yes (${new Date(user.memberDetails.baptismDate).toLocaleDateString()})`
                          : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Membership Status</span>
                      <Badge
                        variant={
                          (user?.memberDetails?.membershipStatus || user?.member?.status || user?.status || 'ACTIVE').toLowerCase() === 'active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {capitalizeFirstLetter(
                          user?.memberDetails?.membershipStatus || user?.member?.status || user?.status || 'Active'
                        )}
                      </Badge>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Member Since
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {user?.memberDetails?.membershipDate || user?.memberDetails?.joinedDate || user?.member?.joinedDate || user?.joinedAt || user?.createdAt
                          ? formatToNewDate(
                              user?.memberDetails?.membershipDate ||
                              user?.memberDetails?.joinedDate ||
                              user?.member?.joinedDate ||
                              user?.joinedAt ||
                              user?.createdAt
                            ) || 'Not Provided'
                          : 'Not Provided'}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Membership Type
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {capitalizeFirstLetter(
                          user?.memberType ||
                          user?.member?.memberType ||
                          user?.position ||
                          (Array.isArray(user?.role) ? user.role[0] : user?.role) ||
                          'Member'
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Household Role
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {capitalizeFirstLetter(
                          user?.member?.householdRole || user?.householdRole || 'Not Provided'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Staff and Volunteer Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <RenderStaffView position={user?.position || ''} roles={roles} user={user} />
                <RenderVolunteerView position={user?.position || ''} roles={roles} user={user} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Ministry Involvement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ministry Involvement</CardTitle>
                    <CardDescription>
                      Current ministry participation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Active Departments
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user?.memberDetails?.departmentIds && user.memberDetails.departmentIds.length > 0 ? (
                          user.memberDetails.departmentIds.map(
                            (department: any, index: number) => (
                              <Badge key={index} variant="default">
                                {capitalizeFirstLetter(
                                  department?.departmentName || 'N/A'
                                )}
                              </Badge>
                            )
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">No active departments</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Active Groups
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user?.memberDetails?.groupIds && user.memberDetails.groupIds.length > 0 ? (
                          user.memberDetails.groupIds.map((group: any, index: number) => (
                            <Badge key={index} variant="outline">
                              {capitalizeFirstLetter(group?.groupName || 'N/A')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No active groups</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Skills & Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Notes</CardTitle>
                    <CardDescription>
                      Member skills and additional information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Skills
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user?.user?.skills && user.user.skills.length > 0 ? (
                          user.user.skills.map((skill: any, index: number) => (
                            <Badge key={index} variant="secondary">
                              {capitalizeFirstLetter(skill || 'N/A')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None listed</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Notes
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {capitalizeFirstLetter(user?.user?.notes || 'N/A')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent className="space-y-6" value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Analytics</CardTitle>
                  <CardDescription>
                    Monthly attendance patterns and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer height={300} width="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="attended"
                        fill="#8884d8"
                        name="Attended"
                      />
                      <Bar
                        dataKey="services"
                        fill="#82ca9d"
                        name="Total Services"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                    <CardDescription>
                      Overall attendance statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        Average Attendance
                      </span>
                      <span className="font-bold text-2xl">
                        {averageAttendance}%
                      </span>
                    </div>
                    <Progress className="w-full" value={averageAttendance} />
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Services Attended</span>
                        <span>
                          {servicesAttended}/{totalServices}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consecutive Weeks</span>
                        <span>{consecutiveWeeks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Month</span>
                        <span>{bestMonth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Service Preferences</CardTitle>
                    <CardDescription>
                      Most attended service types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {servicePreferences.length > 0 ? (
                      <div className="space-y-3">
                        {servicePreferences.map((pref: any, idx: number) => (
                          <div
                            className="flex items-center justify-between"
                            key={idx}
                          >
                            <span className="text-sm">{pref.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress
                                className="w-20"
                                value={pref.percentage}
                              />
                              <span className="font-medium text-sm">
                                {pref.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No attendance records yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent className="space-y-6" value="giving">
              <Card>
                <CardHeader>
                  <CardTitle>Giving History</CardTitle>
                  <CardDescription>
                    Monthly giving patterns and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer height={300} width="100%">
                    <LineChart data={givingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        dataKey="amount"
                        stroke="#8884d8"
                        strokeWidth={2}
                        type="monotone"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Giving</CardTitle>
                    <CardDescription>Year to date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-3xl">
                      KES {totalGiving.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {givingGrowthPct >= 0
                        ? `+${givingGrowthPct}% from previous period`
                        : `${givingGrowthPct}% from previous period`}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Average Monthly</CardTitle>
                    <CardDescription>Regular giving</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-3xl">
                      KES {averageMonthlyGiving.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Last 6 months
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Giving Consistency</CardTitle>
                    <CardDescription>Regular contributor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-3xl">
                      {givingConsistencyPct}%
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {givingMonthsActive}/6 months
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent className="space-y-6" value="involvement">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ministry Hours Distribution</CardTitle>
                    <CardDescription>
                      Time spent in different ministries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {involvementData.length > 0 ? (
                      <ResponsiveContainer height={300} width="100%">
                        <PieChart>
                          <Pie
                            cx="50%"
                            cy="50%"
                            data={involvementData}
                            dataKey="hours"
                            fill="#8884d8"
                            label={({ name, percent }) =>
                              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                            outerRadius={80}
                          >
                            {involvementData.map(
                              (entry: any, index: number) => (
                                <Cell
                                  fill={entry.color || '#3b82f6'}
                                  key={`cell-${index}`}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
                        No ministry hours or department assignments recorded yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Leadership & Recognition</CardTitle>
                    <CardDescription>
                      Achievements and leadership roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recognitions.length > 0 ? (
                      recognitions.map((rec: any, idx: number) => (
                        <div className="flex items-center space-x-3" key={idx}>
                          {rec.category === 'award' ? (
                            <Award className="h-5 w-5 text-yellow-500" />
                          ) : rec.category === 'department' ? (
                            <Star className="h-5 w-5 text-blue-500" />
                          ) : rec.category === 'group' ? (
                            <Users className="h-5 w-5 text-purple-500" />
                          ) : (
                            <Gift className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-muted-foreground text-sm">
                              {rec.subtitle}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No leadership recognitions recorded yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent className="space-y-6" value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest member activities and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity: any, index: number) => (
                        <div
                          className="flex items-center space-x-4 rounded-lg border p-4"
                          key={index}
                        >
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.activity}</h4>
                            <p className="text-muted-foreground text-sm">
                              {activity.date}
                            </p>
                          </div>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No recent activities recorded yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function Label({
  className,
  children,
  htmlFor,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  htmlFor: string;
  [key: string]: any;
}) {
  return (
    <label
      className={`font-medium text-sm ${className || ''}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}
