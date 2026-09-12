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
  console.log('user detail--->', JSON.stringify(user));
  const attendanceData = [
    { month: 'Jan', attendance: 4, services: 4 },
    { month: 'Feb', attendance: 3, services: 4 },
    { month: 'Mar', attendance: 4, services: 5 },
    { month: 'Apr', attendance: 4, services: 4 },
    { month: 'May', attendance: 3, services: 4 },
    { month: 'Jun', attendance: 4, services: 4 },
  ];

  const givingData = [
    { month: 'Jan', amount: 500 },
    { month: 'Feb', amount: 450 },
    { month: 'Mar', amount: 600 },
    { month: 'Apr', amount: 500 },
    { month: 'May', amount: 550 },
    { month: 'Jun', amount: 650 },
  ];

  const involvementData = [
    { name: 'Worship', hours: 40, color: '#8884d8' },
    { name: "Children's Ministry", hours: 60, color: '#82ca9d' },
    { name: 'Administration', hours: 20, color: '#ffc658' },
  ];

  const recentActivities = [
    {
      date: '2024-12-20',
      activity: 'Attended Sunday Service',
      type: 'Attendance',
    },
    {
      date: '2024-12-18',
      activity: 'Volunteered at Food Drive',
      type: 'Service',
    },
    { date: '2024-12-15', activity: 'Donated $250 (Tithe)', type: 'Giving' },
    {
      date: '2024-12-12',
      activity: "Led Children's Bible Study",
      type: 'Ministry',
    },
    {
      date: '2024-12-10',
      activity: 'Attended Prayer Meeting',
      type: 'Attendance',
    },
  ];

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
                <h1 className="font-bold text-3xl tracking-tight">
                  {capitalizeFirstLetterOfEachWord(
                    user?.user.name || 'Not Provided'
                  )}
                </h1>
                <p className="text-muted-foreground">
                  User profile and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/church/users/edit/${user?.member?.id}`}>
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
                    alt={user?.user.name || 'User'}
                    src={user?.user.image ?? ''}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user?.user.name
                      .split(' ')
                      .map((n: string) => n[0].toUpperCase())
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    {capitalizeFirstLetterOfEachWord(
                      user?.user.name || 'Not Provided'
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {user?.member?.role?.map((role: string) => (
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
                    <span className="truncate">{user?.user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.user?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{`${capitalizeFirstLetter(
                      user?.address?.country || 'N/A'
                    )}, ${capitalizeFirstLetter(user?.address?.city || 'N/A')}, ${capitalizeFirstLetter(user?.address?.street || 'N/A')}`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Joined {''}
                      {user?.memberDetails?.joinedDate
                        ? typeof user.memberDetails.joinedDate === 'string'
                          ? formatToNewDate(user.memberDetails.joinedDate)
                          : formatToNewDate(user.memberDetails.joinedDate)
                        : 'N/A'}
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
                    {/* ${user.totalGiving.toLocaleString()} */}${0}
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
                    {/* {user.averageAttendance}% */}
                    {0}%
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
                  {/* <div className="font-bold text-2xl">
                    {user?.volunteerDetails?.hoursContributed ?? 0}
                  </div> */}
                  <div className="font-bold text-2xl">{0}</div>
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
                          {user?.user?.dateOfBirth
                            ? typeof user?.user?.dateOfBirth === 'string'
                              ? formatToNewDate(user?.user?.dateOfBirth)
                              : formatToNewDate(user?.user?.dateOfBirth)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Marital Status
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.user?.maritalStatus || 'N/A'
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Occupation
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(
                            user?.user?.occupation || 'N/A'
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-sm" htmlFor={''}>
                          Gender
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {capitalizeFirstLetter(user?.user?.gender || 'N/A')}
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
                          'N/A'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Email:
                        </span>
                        {user?.emergencyContact?.emergencyContactEmail || 'N/A'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Phone Number:
                        </span>
                        {user?.emergencyContact?.emergencyContactPhoneNumber ||
                          'N/A'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Relationship:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact
                            ?.emergencyContactRelationship || 'N/A'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Address:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact?.emergencyContactAddress ||
                          'N/A'
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="mr-2 text-foreground text-sm">
                          Notes:
                        </span>
                        {capitalizeFirstLetterOfEachWord(
                          user?.emergencyContact?.emergencyContactNotes || 'N/A'
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
                      Baptism and confirmation status
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
                      <span className="font-medium text-sm">Confirmed</span>
                      <Badge
                        variant={
                          user?.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {user?.status === 'active' ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Member Since
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {user?.memberDetails?.joinedDate
                          ? typeof user?.memberDetails?.joinedDate === 'string'
                            ? formatToNewDate(user?.memberDetails?.joinedDate)
                            : formatToNewDate(user?.memberDetails?.joinedDate)
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Membership Type
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {capitalizeFirstLetter(user?.role || 'N/A')}
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
                        {user?.memberDetails?.departmentIds.map(
                          (department: any, index: number) => (
                            <Badge key={index} variant="default">
                              {capitalizeFirstLetter(
                                department?.departmentName || 'N/A'
                              )}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor={''}>
                        Active Groups
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user?.memberDetails?.groupIds.map((group: any, index: number) => (
                          <Badge key={index} variant="outline">
                            {capitalizeFirstLetter(group?.groupName || 'N/A')}
                          </Badge>
                        ))}
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
                        {user?.user?.skills?.map((skill: any, index: number) => (
                          <Badge key={index} variant="secondary">
                            {capitalizeFirstLetter(skill || 'N/A')}
                          </Badge>
                        ))}
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
                        dataKey="attendance"
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
                        {/* {user?.averageAttendance}% */}
                        {0}%
                      </span>
                    </div>
                    {/* <Progress className="w-full" value={user?.averageAttendance} /> */}
                    <Progress className="w-full" value={0} />
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Services Attended</span>
                        <span>22/26</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consecutive Weeks</span>
                        <span>4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Month</span>
                        <span>March (100%)</span>
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sunday Morning Service</span>
                        <div className="flex items-center space-x-2">
                          <Progress className="w-20" value={95} />
                          <span className="font-medium text-sm">95%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bible Study</span>
                        <div className="flex items-center space-x-2">
                          <Progress className="w-20" value={80} />
                          <span className="font-medium text-sm">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Prayer Meeting</span>
                        <div className="flex items-center space-x-2">
                          <Progress className="w-20" value={60} />
                          <span className="font-medium text-sm">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Youth Service</span>
                        <div className="flex items-center space-x-2">
                          <Progress className="w-20" value={40} />
                          <span className="font-medium text-sm">40%</span>
                        </div>
                      </div>
                    </div>
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
                      {/* ${user?.totalGiving.toLocaleString()} */}${0}$
                    </div>
                    <p className="text-muted-foreground text-sm">
                      +15% from last year
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
                      {/* ${Math.round(user?.totalGiving / 6).toLocaleString()} */}
                      $ ${0}
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
                    <div className="font-bold text-3xl">100%</div>
                    <p className="text-muted-foreground text-sm">6/6 months</p>
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
                          {involvementData.map((entry, index) => (
                            <Cell fill={entry.color} key={`cell-${index}`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
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
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <div>
                        <h4 className="font-medium">Volunteer of the Month</h4>
                        <p className="text-muted-foreground text-sm">
                          March 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">
                          Children's Ministry Leader
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Since January 2023
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Gift className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Faithful Giver</h4>
                        <p className="text-muted-foreground text-sm">
                          12 consecutive months
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Small Group Coordinator</h4>
                        <p className="text-muted-foreground text-sm">
                          Young Adults Group
                        </p>
                      </div>
                    </div>
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
                    {recentActivities.map((activity, index) => (
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
                    ))}
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
