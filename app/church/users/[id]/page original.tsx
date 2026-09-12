// 'use client';

// import React from 'react';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import type { IUserModel } from '@/models/user';
// import {
//   ArrowLeft,
//   Award,
//   BookOpen,
//   Calendar,
//   Clock,
//   DollarSign,
//   Edit,
//   Eye,
//   EyeOff,
//   Gift,
//   Heart,
//   Mail,
//   MapPin,
//   MessageSquare,
//   Phone,
//   Shield,
//   Star,
//   UserCheck,
//   Users,
// } from 'lucide-react';
// import Link from 'next/link';
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts';

// type UserRole =
//   | 'visitor'
//   | 'member'
//   | 'pastor'
//   | 'bishop'
//   | 'admin'
//   | 'superadmin';

// interface CurrentUser {
//   id: string;
//   role: UserRole;
//   isStaff: boolean;
//   isVolunteer: boolean;
// }

// // Mock current user - in real app, get from auth context
// const currentUser: CurrentUser = {
//   id: 'current-user-id',
//   role: 'pastor', // Change this to test different role permissions
//   isStaff: false,
//   isVolunteer: false,
// };

// const canViewPersonalDetails = (userRole: UserRole): boolean => {
//   return ['member', 'pastor', 'bishop', 'admin', 'superadmin'].includes(
//     userRole
//   );
// };

// const canViewFinancialData = (userRole: UserRole): boolean => {
//   return ['pastor', 'bishop', 'admin', 'superadmin'].includes(userRole);
// };

// const canViewSensitiveData = (userRole: UserRole): boolean => {
//   return ['bishop', 'admin', 'superadmin'].includes(userRole);
// };

// const canEditMember = (userRole: UserRole): boolean => {
//   return ['pastor', 'bishop', 'admin', 'superadmin'].includes(userRole);
// };

// const canViewAttendanceDetails = (userRole: UserRole): boolean => {
//   return ['pastor', 'bishop', 'admin', 'superadmin'].includes(userRole);
// };

// export default function MemberDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = React.use(params); // 👈 unwrap the promise
//   const mockMember: Partial<IUserModel> = {
//     id,
//     firstName: 'Sarah',
//     lastName: 'Johnson',
//     email: 'sarah.johnson@email.com',
//     phoneNumber: '+1 (555) 123-4567',
//     address: {
//       street: '123 Main St, Anytown, ST 12345',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: 'Kenya',
//     },
//     dateOfBirth: 'June 15, 1985',
//     joinDate: 'March 10, 2020',
//     membershipStatus: 'Active',
//     membershipType: 'Full Member',
//     maritalStatus: 'single',
//     occupation: 'Teacher',
//     emergencyDetails: {
//       emergencyContactFullName: 'John Johnson',
//       emergencyContactEmail: '',
//       emergencyContactPhoneNumber: '',
//       emergencyContactRelationship: '',
//       emergencyContactAddress: '',
//       emergencyContactNotes: '',
//     },
//     ministries: ["Children's Ministry", 'Worship Team'],
//     skills: ['Music', 'Teaching', 'Administration'],
//     notes: "Very active in children's ministry. Has leadership potential.",
//     baptized: true,
//     confirmed: true,
//     isStaff: true,
//     isVolunteer: true,
//     smallGroup: 'Young Adults Group',
//     servingAreas: ['Sunday School', 'Choir'],
//     totalGiving: 3250,
//     averageAttendance: 85,
//     volunteerHours: 120,
//     role: 'member' as UserRole,
//     // Role-specific details
//     memberDetails: {
//       memberId: 'MEM-2020-001',
//       membershipDate: new Date('2020-03-10'),
//       membershipStatus: 'active' as const,
//       departmentIds: ['children-ministry', 'worship'],
//       groupIds: ['young-adults'],
//       occupation: 'Teacher',
//       baptismDate: new Date('2020-04-15'),
//       joinedDate: new Date('2020-03-10'),
//     },
//     pastorDetails: {
//       pastorId: 'PST-2018-001',
//       ordinationDate: new Date('2018-06-15'),
//       qualifications: ['Master of Divinity', 'Biblical Counseling Certificate'],
//       specializations: ['Youth Ministry', 'Biblical Counseling'],
//       assignments: [
//         {
//           branchId: 'branch-001',
//           position: 'Associate Pastor',
//           startDate: new Date('2018-07-01'),
//           isActive: true,
//         },
//       ],
//       sermonCount: 45,
//       counselingSessions: 120,
//       biography: 'Passionate about youth ministry and biblical counseling.',
//     },
//     bishopDetails: {
//       bishopId: 'BSP-2015-001',
//       appointmentDate: new Date('2015-01-01'),
//       jurisdictionArea: 'Northern Region',
//       oversight: {
//         branchIds: ['branch-001', 'branch-002', 'branch-003'],
//         pastorIds: ['pastor-001', 'pastor-002'],
//       },
//       qualifications: ['Doctor of Theology', 'Leadership Certificate'],
//       achievements: [
//         'Church Growth Award 2022',
//         'Community Service Recognition',
//       ],
//       biography: 'Dedicated to church growth and community outreach.',
//     },
//     staffDetails: {
//       staffId: 'STF-2021-005',
//       jobTitle: 'Administrative Assistant',
//       department: 'Administration',
//       startDate: new Date('2021-01-15'),
//       salary: 35_000,
//       employmentType: 'full-time' as const,
//       isActive: true,
//     },
//     volunteerDetails: {
//       volunteerId: 'VOL-2020-025',
//       volunteerStatus: 'active' as const,
//       availabilitySchedule: {
//         days: ['Sunday', 'Wednesday'],
//         timeSlots: ['Morning', 'Evening'],
//         preferredTimes: 'Sunday mornings and Wednesday evenings',
//       },
//       skills: ['Music', 'Teaching', 'Event Planning'],
//       departments: ['children-ministry', 'worship'],
//       ministries: ['sunday-school', 'choir'],
//       volunteerRoles: [
//         {
//           role: 'Sunday School Teacher',
//           department: "Children's Ministry",
//           startDate: new Date('2020-04-01'),
//           isActive: true,
//         },
//       ],
//       backgroundCheck: {
//         completed: true,
//         completedDate: new Date('2020-03-01'),
//         expiryDate: new Date('2025-03-01'),
//         clearanceLevel: 'children_ministry' as const,
//       },
//       hoursContributed: 120,
//     },
//     adminDetails: {
//       adminId: 'ADM-2019-002',
//       accessLevel: 'branch' as const,
//       assignedBranches: ['branch-001'],
//     },
//     superAdminDetails: {
//       superAdminId: 'SA-2018-001',
//       accessLevel: 'global' as const,
//       systemSettings: {
//         canCreateChurches: true,
//         canDeleteChurches: true,
//         canManageUsers: true,
//         canAccessAnalytics: true,
//         canManageSubscriptions: true,
//         canAccessSystemLogs: true,
//       },
//       companyInfo: {
//         position: 'System Administrator',
//         department: 'IT',
//         startDate: new Date('2018-01-01'),
//       },
//     },
//     visitorDetails: {
//       visitorId: 'VIS-2024-150',
//       visitDate: new Date('2024-12-01'),
//       invitedBy: 'member-001',
//       howDidYouHear: 'friend' as const,
//       followUpStatus: 'interested' as const,
//       followUpDate: new Date('2024-12-08'),
//       followUpNotes: 'Interested in joining small group',
//       interestedInMembership: true,
//       servicesAttended: ['Sunday Service', 'Bible Study'],
//       occupation: 'Teacher',
//     },
//   };

//   const attendanceData = [
//     { month: 'Jan', attendance: 4, services: 4 },
//     { month: 'Feb', attendance: 3, services: 4 },
//     { month: 'Mar', attendance: 4, services: 5 },
//     { month: 'Apr', attendance: 4, services: 4 },
//     { month: 'May', attendance: 3, services: 4 },
//     { month: 'Jun', attendance: 4, services: 4 },
//   ];

//   const givingData = [
//     { month: 'Jan', amount: 500 },
//     { month: 'Feb', amount: 450 },
//     { month: 'Mar', amount: 600 },
//     { month: 'Apr', amount: 500 },
//     { month: 'May', amount: 550 },
//     { month: 'Jun', amount: 650 },
//   ];

//   const involvementData = [
//     { name: 'Worship', hours: 40, color: '#8884d8' },
//     { name: "Children's Ministry", hours: 60, color: '#82ca9d' },
//     { name: 'Administration', hours: 20, color: '#ffc658' },
//   ];

//   const recentActivities = [
//     {
//       date: '2024-12-20',
//       activity: 'Attended Sunday Service',
//       type: 'Attendance',
//     },
//     {
//       date: '2024-12-18',
//       activity: 'Volunteered at Food Drive',
//       type: 'Service',
//     },
//     { date: '2024-12-15', activity: 'Donated $250 (Tithe)', type: 'Giving' },
//     {
//       date: '2024-12-12',
//       activity: "Led Children's Bible Study",
//       type: 'Ministry',
//     },
//     {
//       date: '2024-12-10',
//       activity: 'Attended Prayer Meeting',
//       type: 'Attendance',
//     },
//   ];

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'Attendance':
//         return <UserCheck className="h-4 w-4 text-blue-500" />;
//       case 'Service':
//         return <Heart className="h-4 w-4 text-red-500" />;
//       case 'Giving':
//         return <DollarSign className="h-4 w-4 text-green-500" />;
//       case 'Ministry':
//         return <BookOpen className="h-4 w-4 text-purple-500" />;
//       default:
//         return <Clock className="h-4 w-4 text-muted-foreground" />;
//     }
//   };

//   const getAvailableTabs = () => {
//     const baseTabs = [{ value: 'overview', label: 'Overview' }];

//     if (canViewAttendanceDetails(currentUser.role)) {
//       baseTabs.push({ value: 'attendance', label: 'Attendance' });
//     }

//     if (canViewFinancialData(currentUser.role)) {
//       baseTabs.push({ value: 'giving', label: 'Giving' });
//     }

//     if (canViewPersonalDetails(currentUser.role)) {
//       baseTabs.push({ value: 'involvement', label: 'Involvement' });
//       baseTabs.push({ value: 'activity', label: 'Activity' });
//     }

//     return baseTabs;
//   };

//   const availableTabs = getAvailableTabs();

//   const currentRole = mockMember.role;

//   const renderRoleSpecificInfo = () => {
//     switch (currentRole) {
//       case 'member':
//         return (
//           mockMember.memberDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Member ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.memberDetails.memberId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Membership Date</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.memberDetails.membershipDate?.toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Membership Status</Label>
//                 <Badge
//                   variant={
//                     mockMember.memberDetails.membershipStatus === 'active'
//                       ? 'default'
//                       : 'secondary'
//                   }
//                 >
//                   {mockMember.memberDetails.membershipStatus}
//                 </Badge>
//               </div>
//               {mockMember.memberDetails.baptismDate && (
//                 <div>
//                   <Label className="font-medium text-sm">Baptism Date</Label>
//                   <p className="text-muted-foreground text-sm">
//                     {mockMember.memberDetails.baptismDate.toLocaleDateString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )
//         );

//       case 'pastor':
//         return (
//           mockMember.pastorDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Pastor ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.pastorDetails.pastorId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Ordination Date</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.pastorDetails.ordinationDate?.toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Sermon Count</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.pastorDetails.sermonCount}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">
//                   Counseling Sessions
//                 </Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.pastorDetails.counselingSessions}
//                 </p>
//               </div>
//               <div className="md:col-span-2">
//                 <Label className="font-medium text-sm">Qualifications</Label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {mockMember.pastorDetails.qualifications?.map(
//                     (qual, index) => (
//                       <Badge key={index} variant="outline">
//                         {qual}
//                       </Badge>
//                     )
//                   )}
//                 </div>
//               </div>
//               <div className="md:col-span-2">
//                 <Label className="font-medium text-sm">Specializations</Label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {mockMember.pastorDetails.specializations?.map(
//                     (spec, index) => (
//                       <Badge key={index} variant="secondary">
//                         {spec}
//                       </Badge>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         );

//       case 'bishop':
//         return (
//           mockMember.bishopDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Bishop ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.bishopDetails.bishopId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Appointment Date</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.bishopDetails.appointmentDate?.toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Jurisdiction Area</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.bishopDetails.jurisdictionArea}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Branches Overseen</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.bishopDetails.oversight?.branchIds?.length || 0}{' '}
//                   branches
//                 </p>
//               </div>
//               <div className="md:col-span-2">
//                 <Label className="font-medium text-sm">Achievements</Label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {mockMember.bishopDetails.achievements?.map(
//                     (achievement, index) => (
//                       <Badge key={index} variant="default">
//                         {achievement}
//                       </Badge>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         );
//       case 'admin':
//         return (
//           mockMember.adminDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Admin ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.adminDetails.adminId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Access Level</Label>
//                 <Badge variant="outline">
//                   {mockMember.adminDetails.accessLevel}
//                 </Badge>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Assigned Branches</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.adminDetails.assignedBranches?.length || 0}{' '}
//                   branches
//                 </p>
//               </div>
//             </div>
//           )
//         );

//       case 'superadmin':
//         return (
//           mockMember.superAdminDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Super Admin ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.superAdminDetails.superAdminId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Access Level</Label>
//                 <Badge variant="default">
//                   {mockMember.superAdminDetails.accessLevel}
//                 </Badge>
//               </div>
//               {mockMember.superAdminDetails.companyInfo && (
//                 <>
//                   <div>
//                     <Label className="font-medium text-sm">Position</Label>
//                     <p className="text-muted-foreground text-sm">
//                       {mockMember.superAdminDetails.companyInfo.position}
//                     </p>
//                   </div>
//                   <div>
//                     <Label className="font-medium text-sm">Department</Label>
//                     <p className="text-muted-foreground text-sm">
//                       {mockMember.superAdminDetails.companyInfo.department}
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           )
//         );

//       case 'visitor':
//         return (
//           mockMember.visitorDetails && (
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <Label className="font-medium text-sm">Visitor ID</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.visitorDetails.visitorId}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Visit Date</Label>
//                 <p className="text-muted-foreground text-sm">
//                   {mockMember.visitorDetails.visitDate?.toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">How Did You Hear</Label>
//                 <Badge variant="outline">
//                   {mockMember.visitorDetails.howDidYouHear}
//                 </Badge>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Follow-up Status</Label>
//                 <Badge
//                   variant={
//                     mockMember.visitorDetails.followUpStatus === 'interested'
//                       ? 'default'
//                       : 'secondary'
//                   }
//                 >
//                   {mockMember.visitorDetails.followUpStatus}
//                 </Badge>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">
//                   Interested in Membership
//                 </Label>
//                 <Badge
//                   variant={
//                     mockMember.visitorDetails.interestedInMembership
//                       ? 'default'
//                       : 'secondary'
//                   }
//                 >
//                   {mockMember.visitorDetails.interestedInMembership
//                     ? 'Yes'
//                     : 'No'}
//                 </Badge>
//               </div>
//               <div>
//                 <Label className="font-medium text-sm">Services Attended</Label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {mockMember.visitorDetails.servicesAttended?.map(
//                     (service, index) => (
//                       <Badge key={index} variant="outline">
//                         {service}
//                       </Badge>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         );

//       default:
//         return null;
//     }
//   };

//   const renderStaffInfo = () => {
//     if (!(mockMember.staffDetails)) {
//       return null;
//     }
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Staff Information</CardTitle>
//           <CardDescription>Employment details and status</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Label className="font-medium text-sm">Staff ID</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.staffDetails.staffId}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Job Title</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.staffDetails.jobTitle}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Department</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.staffDetails.department}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Employment Type</Label>
//               <Badge variant="outline">
//                 {mockMember.staffDetails.employmentType}
//               </Badge>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Start Date</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.staffDetails.startDate?.toLocaleDateString()}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Status</Label>
//               <Badge
//                 variant={
//                   mockMember.staffDetails.isActive ? 'default' : 'secondary'
//                 }
//               >
//                 {mockMember.staffDetails.isActive ? 'Active' : 'Inactive'}
//               </Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   const renderVolunteerInfo = () => {
//     if (!mockMember.volunteerDetails) {
//       return null;
//     }

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Volunteer Information</CardTitle>
//           <CardDescription>Volunteer status and contributions</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Label className="font-medium text-sm">Volunteer ID</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.volunteerDetails.volunteerId}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Status</Label>
//               <Badge
//                 variant={
//                   mockMember.volunteerDetails.volunteerStatus === 'active'
//                     ? 'default'
//                     : 'secondary'
//                 }
//               >
//                 {mockMember.volunteerDetails.volunteerStatus}
//               </Badge>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Hours Contributed</Label>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.volunteerDetails.hoursContributed}
//               </p>
//             </div>
//             <div>
//               <Label className="font-medium text-sm">Background Check</Label>
//               <Badge
//                 variant={
//                   mockMember.volunteerDetails.backgroundCheck?.completed
//                     ? 'default'
//                     : 'secondary'
//                 }
//               >
//                 {mockMember.volunteerDetails.backgroundCheck?.completed
//                   ? 'Completed'
//                   : 'Pending'}
//               </Badge>
//             </div>
//             <div className="md:col-span-2">
//               <Label className="font-medium text-sm">Availability</Label>
//               <p className="text-muted-foreground text-sm">
//                 {
//                   mockMember.volunteerDetails.availabilitySchedule
//                     ?.preferredTimes
//                 }
//               </p>
//             </div>
//             <div className="md:col-span-2">
//               <Label className="font-medium text-sm">Current Roles</Label>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {mockMember.volunteerDetails.volunteerRoles
//                   ?.filter((role) => role.isActive)
//                   .map((role, index) => (
//                     <Badge key={index} variant="default">
//                       {role.role}
//                     </Badge>
//                   ))}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Link href="/dashboard/users">
//             <Button size="sm" variant="outline">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Users
//             </Button>
//           </Link>
//           <div>
//             <h1 className="font-bold text-3xl tracking-tight">
//               {mockMember.name}
//             </h1>
//             <p className="text-muted-foreground">
//               User profile and analytics
//               <Badge className="ml-2" variant="outline">
//                 <Shield className="mr-1 h-3 w-3" />
//                 Viewing as {currentUser.role}
//               </Badge>
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           {canViewPersonalDetails(currentUser.role) && (
//             <Button variant="outline">
//               <MessageSquare className="mr-2 h-4 w-4" />
//               Contact
//             </Button>
//           )}
//           {canEditMember(currentUser.role) && (
//             <Link href={`/dashboard/users/edit/${mockMember.id}`}>
//               <Button>
//                 <Edit className="mr-2 h-4 w-4" />
//                 Edit Profile
//               </Button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Member Overview */}
//       <div className="grid gap-6 md:grid-cols-4">
//         <Card className="md:col-span-1">
//           <CardContent className="flex flex-col items-center space-y-4 p-6">
//             <Avatar className="h-24 w-24">
//               <AvatarImage
//                 alt={mockMember.name}
//                 src="/placeholder.svg?height=96&width=96"
//               />
//               <AvatarFallback className="text-lg">SJ</AvatarFallback>
//             </Avatar>
//             <div className="text-center">
//               <h3 className="font-semibold text-lg">{mockMember.name}</h3>
//               <p className="text-muted-foreground text-sm">
//                 {mockMember.membershipType}
//               </p>
//               <Badge className="mt-2" variant="default">
//                 {mockMember.membershipStatus}
//               </Badge>
//             </div>
//             <div className="w-full space-y-2 text-sm">
//               {canViewPersonalDetails(currentUser.role) ? (
//                 <>
//                   <div className="flex items-center space-x-2">
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     <span className="truncate">{mockMember.email}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <span>{mockMember.phoneNumber}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-xs">
//                       {mockMember.address?.country}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-xs">
//                       {mockMember.address?.city}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-xs">
//                       {mockMember.address?.street}
//                     </span>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex items-center space-x-2 text-muted-foreground">
//                   <EyeOff className="h-4 w-4" />
//                   <span className="text-xs">Contact details restricted</span>
//                 </div>
//               )}
//               <div className="flex items-center space-x-2">
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                 <span>Joined {mockMember.joinDate}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Key Metrics */}
//         <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
//           {canViewFinancialData(currentUser.role) ? (
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="font-medium text-sm">
//                   Total Giving
//                 </CardTitle>
//                 <DollarSign className="h-4 w-4 text-green-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="font-bold text-2xl">
//                   ${mockMember.totalGiving.toLocaleString()}
//                 </div>
//                 <p className="text-muted-foreground text-xs">This year</p>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="font-medium text-sm">
//                   Giving Data
//                 </CardTitle>
//                 <EyeOff className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="font-bold text-2xl text-muted-foreground">
//                   Restricted
//                 </div>
//                 <p className="text-muted-foreground text-xs">
//                   Access level required
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           {canViewAttendanceDetails(currentUser.role) ? (
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="font-medium text-sm">
//                   Attendance Rate
//                 </CardTitle>
//                 <UserCheck className="h-4 w-4 text-blue-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="font-bold text-2xl">
//                   {mockMember.averageAttendance}%
//                 </div>
//                 <p className="text-muted-foreground text-xs">Last 6 months</p>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="font-medium text-sm">
//                   Attendance
//                 </CardTitle>
//                 <Eye className="h-4 w-4 text-blue-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="font-bold text-2xl">Active</div>
//                 <p className="text-muted-foreground text-xs">
//                   Regular attendee
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="font-medium text-sm">
//                 Volunteer Hours
//               </CardTitle>
//               <Heart className="h-4 w-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="font-bold text-2xl">
//                 {mockMember.volunteerHours}
//               </div>
//               <p className="text-muted-foreground text-xs">This year</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Tabs className="space-y-4" defaultValue="overview">
//         <TabsList className={`grid w-full grid-cols-${availableTabs.length}`}>
//           {availableTabs.map((tab) => (
//             <TabsTrigger key={tab.value} value={tab.value}>
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <TabsContent className="space-y-6" value="overview">
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Personal Information */}
//             {canViewPersonalDetails(currentUser.role) ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                   <CardDescription>
//                     Basic member details and role-specific information
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div>
//                       <Label className="font-medium text-sm">Birth Date</Label>
//                       <p className="text-muted-foreground text-sm">
//                         {mockMember.birthDate}
//                       </p>
//                     </div>
//                     <div>
//                       <Label className="font-medium text-sm">
//                         Marital Status
//                       </Label>
//                       <p className="text-muted-foreground text-sm">
//                         {mockMember.maritalStatus}
//                       </p>
//                     </div>
//                     <div>
//                       <Label className="font-medium text-sm">Occupation</Label>
//                       <p className="text-muted-foreground text-sm">
//                         {mockMember.occupation}
//                       </p>
//                     </div>
//                     <div>
//                       <Label className="font-medium text-sm">Small Group</Label>
//                       <p className="text-muted-foreground text-sm">
//                         {mockMember.smallGroup}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Role-Specific Information */}
//                   <div className="border-t pt-4">
//                     <Label className="mb-3 block font-medium text-sm">
//                       Role-Specific Information
//                     </Label>
//                     {renderRoleSpecificInfo()}
//                   </div>

//                   {canViewSensitiveData(currentUser.role) && (
//                     <div>
//                       <Label className="font-medium text-sm">
//                         Emergency Contact
//                       </Label>
//                       <p className="text-muted-foreground text-sm">
//                         {mockMember.emergencyContact}
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                   <CardDescription>Access restricted</CardDescription>
//                 </CardHeader>
//                 <CardContent className="flex items-center justify-center py-8">
//                   <div className="text-center">
//                     <EyeOff className="mx-auto h-12 w-12 text-muted-foreground" />
//                     <p className="mt-2 text-muted-foreground">
//                       Higher access level required to view personal details
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Spiritual Status */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Spiritual Status</CardTitle>
//                 <CardDescription>
//                   Baptism and confirmation status
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Baptized</span>
//                   <Badge
//                     variant={mockMember.baptized ? 'default' : 'secondary'}
//                   >
//                     {mockMember.baptized ? 'Yes' : 'No'}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">Confirmed</span>
//                   <Badge
//                     variant={mockMember.confirmed ? 'default' : 'secondary'}
//                   >
//                     {mockMember.confirmed ? 'Yes' : 'No'}
//                   </Badge>
//                 </div>
//                 <div>
//                   <Label className="font-medium text-sm">Member Since</Label>
//                   <p className="text-muted-foreground text-sm">
//                     {mockMember.joinDate}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="font-medium text-sm">Membership Type</Label>
//                   <p className="text-muted-foreground text-sm">
//                     {mockMember.membershipType}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Staff and Volunteer Information */}
//           <div className="grid gap-6 md:grid-cols-2">
//             {renderStaffInfo()}
//             {renderVolunteerInfo()}
//           </div>

//           <div className="grid gap-6 md:grid-cols-2">
//             {/* Ministry Involvement */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Ministry Involvement</CardTitle>
//                 <CardDescription>
//                   Current ministry participation
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="font-medium text-sm">
//                     Active Ministries
//                   </Label>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {mockMember.ministries.map((ministry, index) => (
//                       <Badge key={index} variant="default">
//                         {ministry}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="font-medium text-sm">Serving Areas</Label>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {mockMember.servingAreas.map((area, index) => (
//                       <Badge key={index} variant="outline">
//                         {area}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Skills & Notes */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Skills & Notes</CardTitle>
//                 <CardDescription>
//                   Member skills and additional information
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="font-medium text-sm">Skills</Label>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {mockMember.skills.map((skill, index) => (
//                       <Badge key={index} variant="secondary">
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//                 {canViewSensitiveData(currentUser.role) && (
//                   <div>
//                     <Label className="font-medium text-sm">Notes</Label>
//                     <p className="text-muted-foreground text-sm">
//                       {mockMember.notes}
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {canViewAttendanceDetails(currentUser.role) && (
//           <TabsContent className="space-y-6" value="attendance">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Attendance Analytics</CardTitle>
//                 <CardDescription>
//                   Monthly attendance patterns and trends
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer height={300} width="100%">
//                   <BarChart data={attendanceData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="attendance" fill="#8884d8" name="Attended" />
//                     <Bar
//                       dataKey="services"
//                       fill="#82ca9d"
//                       name="Total Services"
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <div className="grid gap-6 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Attendance Summary</CardTitle>
//                   <CardDescription>
//                     Overall attendance statistics
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-sm">
//                       Average Attendance
//                     </span>
//                     <span className="font-bold text-2xl">
//                       {mockMember.averageAttendance}%
//                     </span>
//                   </div>
//                   <Progress
//                     className="w-full"
//                     value={mockMember.averageAttendance}
//                   />
//                   <div className="grid gap-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Services Attended</span>
//                       <span>22/26</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Consecutive Weeks</span>
//                       <span>4</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Best Month</span>
//                       <span>March (100%)</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Service Preferences</CardTitle>
//                   <CardDescription>Most attended service types</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Sunday Morning Service</span>
//                       <div className="flex items-center space-x-2">
//                         <Progress className="w-20" value={95} />
//                         <span className="font-medium text-sm">95%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Bible Study</span>
//                       <div className="flex items-center space-x-2">
//                         <Progress className="w-20" value={80} />
//                         <span className="font-medium text-sm">80%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Prayer Meeting</span>
//                       <div className="flex items-center space-x-2">
//                         <Progress className="w-20" value={60} />
//                         <span className="font-medium text-sm">60%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Youth Service</span>
//                       <div className="flex items-center space-x-2">
//                         <Progress className="w-20" value={40} />
//                         <span className="font-medium text-sm">40%</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         )}

//         {canViewFinancialData(currentUser.role) && (
//           <TabsContent className="space-y-6" value="giving">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Giving History</CardTitle>
//                 <CardDescription>
//                   Monthly giving patterns and trends
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer height={300} width="100%">
//                   <LineChart data={givingData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line
//                       dataKey="amount"
//                       stroke="#8884d8"
//                       strokeWidth={2}
//                       type="monotone"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <div className="grid gap-6 md:grid-cols-3">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Total Giving</CardTitle>
//                   <CardDescription>Year to date</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="font-bold text-3xl">
//                     ${mockMember.totalGiving.toLocaleString()}
//                   </div>
//                   <p className="text-muted-foreground text-sm">
//                     +15% from last year
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Average Monthly</CardTitle>
//                   <CardDescription>Regular giving</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="font-bold text-3xl">
//                     ${Math.round(mockMember.totalGiving / 6).toLocaleString()}
//                   </div>
//                   <p className="text-muted-foreground text-sm">Last 6 months</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Giving Consistency</CardTitle>
//                   <CardDescription>Regular contributor</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="font-bold text-3xl">100%</div>
//                   <p className="text-muted-foreground text-sm">6/6 months</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         )}

//         {canViewPersonalDetails(currentUser.role) && (
//           <>
//             <TabsContent className="space-y-6" value="involvement">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Ministry Hours Distribution</CardTitle>
//                     <CardDescription>
//                       Time spent in different ministries
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer height={300} width="100%">
//                       <PieChart>
//                         <Pie
//                           cx="50%"
//                           cy="50%"
//                           data={involvementData}
//                           dataKey="hours"
//                           fill="#8884d8"
//                           label={({ name, percent }) =>
//                             `${name} ${(percent * 100).toFixed(0)}%`
//                           }
//                           labelLine={false}
//                           outerRadius={80}
//                         >
//                           {involvementData.map((entry, index) => (
//                             <Cell fill={entry.color} key={`cell-${index}`} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Leadership & Recognition</CardTitle>
//                     <CardDescription>
//                       Achievements and leadership roles
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <Award className="h-5 w-5 text-yellow-500" />
//                       <div>
//                         <h4 className="font-medium">Volunteer of the Month</h4>
//                         <p className="text-muted-foreground text-sm">
//                           March 2024
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <Star className="h-5 w-5 text-blue-500" />
//                       <div>
//                         <h4 className="font-medium">
//                           Children's Ministry Leader
//                         </h4>
//                         <p className="text-muted-foreground text-sm">
//                           Since January 2023
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <Gift className="h-5 w-5 text-green-500" />
//                       <div>
//                         <h4 className="font-medium">Faithful Giver</h4>
//                         <p className="text-muted-foreground text-sm">
//                           12 consecutive months
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <Users className="h-5 w-5 text-purple-500" />
//                       <div>
//                         <h4 className="font-medium">Small Group Coordinator</h4>
//                         <p className="text-muted-foreground text-sm">
//                           Young Adults Group
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent className="space-y-6" value="activity">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Activity</CardTitle>
//                   <CardDescription>
//                     Latest member activities and engagement
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {recentActivities.map((activity, index) => (
//                       <div
//                         className="flex items-center space-x-4 rounded-lg border p-4"
//                         key={index}
//                       >
//                         <div className="flex-shrink-0">
//                           {getActivityIcon(activity.type)}
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-medium">{activity.activity}</h4>
//                           <p className="text-muted-foreground text-sm">
//                             {activity.date}
//                           </p>
//                         </div>
//                         <Badge variant="outline">{activity.type}</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </>
//         )}
//       </Tabs>
//     </div>
//   );
// }

// function Label({
//   className,
//   children,
//   ...props
// }: {
//   className?: string;
//   children: React.ReactNode;
//   [key: string]: any;
// }) {
//   return (
//     <label className={`font-medium text-sm ${className || ''}`} {...props}>
//       {children}
//     </label>
//   );
// }
