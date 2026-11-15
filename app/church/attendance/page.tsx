'use client';

import { AttendanceCheckInForm } from '@/components/forms/attendance-check-in-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { UserCombobox } from '@/components/user-combobox';
import {
  useApproveAttendance,
  useDeleteAttendance,
  useFetchAttendance,
  useQuickCheckIn,
  useUpdateAttendance,
} from '@/lib/hooks/church/attendance/use-attendance-queries';
import type { AttendanceResponse } from '@/lib/types/attendance';
import type { UserResponse } from '@/lib/types/user';
import { capitalizeFirstLetter, getFirstLetter } from '@/lib/utils';
import {
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Loader2,
  MoreVertical,
  Pencil,
  QrCode,
  Search,
  Trash2,
  TrendingUp,
  UserCheck,
  UserX,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingAttendance, setEditingAttendance] =
    useState<AttendanceResponse | null>(null);
  const [deletingAttendance, setDeletingAttendance] =
    useState<AttendanceResponse | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Quick / QR check-in state
  const [quickMemberId, setQuickMemberId] = useState('');
  const [quickStatus, setQuickStatus] = useState<
    'present' | 'late' | 'absent' | 'excused'
  >('present');
  const [quickNotes, setQuickNotes] = useState('');

  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0];

  // Mutations
  const { mutate: deleteAttendance, isPending: isDeleting } =
    useDeleteAttendance();
  const { mutate: updateAttendance } = useUpdateAttendance();
  const { mutate: approveAttendance } = useApproveAttendance();
  const { mutateAsync: quickCheckIn, isPending: isQuickCheckingIn } =
    useQuickCheckIn();

  // Fetch today's attendance
  const {
    data: todayData,
    isLoading: isLoadingToday,
    error: todayError,
  } = useFetchAttendance({
    page: 1,
    limit: 50,
    startDate: today,
    endDate: today,
  });

  // Fetch attendance history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useFetchAttendance({
    page: 1,
    limit: 50,
    search: historySearchTerm,
  });

  const todaySessions = todayData?.attendance || [];
  const todayAttendance = todaySessions[0];

  // Extract member attendance across today's sessions
  const memberAttendance = useMemo(() => {
    if (!todaySessions.length) return [];
    const items: any[] = [];
    for (const session of todaySessions) {
      const svcName =
        typeof session.serviceScheduleId === 'string'
          ? 'Service'
          : session.serviceScheduleId?.service ||
            (session.serviceScheduleId as any)?.name ||
            'Service';
      for (const record of session.records || []) {
        const user = record.userId as UserResponse;
        const recordId = (record as any)._id || (record as any).id;
        items.push({
          id:
            recordId ||
            (typeof record.userId === 'string' ? record.userId : user?._id),
          recordId,
          sessionId: session._id,
          session,
          serviceName: svcName,
          user,
          status: record.status,
          checkInTime: record.checkInTime
            ? new Date(record.checkInTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-',
          notes: record.notes,
        });
      }
    }
    return items;
  }, [todaySessions]);

  // Filter members based on search and status
  const filteredMembers = useMemo(() => {
    return memberAttendance.filter((member) => {
      const matchesSearch =
        !searchTerm ||
        member.user?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.user?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === 'all' || member.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [memberAttendance, searchTerm, selectedStatus]);

  // Calculate stats across today's sessions
  const stats = useMemo(() => {
    if (!todaySessions.length) {
      return {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalExcused: 0,
        attendanceRate: 0,
      };
    }
    const totalPresent = todaySessions.reduce(
      (sum, s) => sum + (s.totalPresent || 0),
      0
    );
    const totalAbsent = todaySessions.reduce(
      (sum, s) => sum + (s.totalAbsent || 0),
      0
    );
    const totalLate = todaySessions.reduce(
      (sum, s) => sum + (s.totalLate || 0),
      0
    );
    const totalExcused = todaySessions.reduce(
      (sum, s) => sum + (s.totalExcused || 0),
      0
    );
    const totalRecords =
      totalPresent + totalAbsent + totalLate + totalExcused;
    const attendanceRate =
      totalRecords > 0
        ? Math.round(((totalPresent + totalLate) / totalRecords) * 1000) / 10
        : 0;
    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalExcused,
      attendanceRate,
    };
  }, [todaySessions]);

  const getFullName = (user: UserResponse): string => {
    return `${capitalizeFirstLetter(user?.firstName || '')} ${capitalizeFirstLetter(user?.lastName || '')}`.trim();
  };

  const handleEdit = (attendance: AttendanceResponse) => {
    setEditingAttendance(attendance);
    setIsEditOpen(true);
  };

  const handleDelete = (attendance: AttendanceResponse) => {
    setDeletingAttendance(attendance);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingAttendance) {
      deleteAttendance(
        { attendanceId: deletingAttendance._id },
        {
          onSuccess: () => {
            setIsDeleteOpen(false);
            setDeletingAttendance(null);
          },
        }
      );
    }
  };

  const handleQuickCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMemberId) {
      toast.error('Please select a member to check in.');
      return;
    }
    await quickCheckIn({
      memberId: quickMemberId,
      attendanceDate: today,
      status: quickStatus,
      notes: quickNotes,
    });
    setQuickMemberId('');
    setQuickNotes('');
  };

  const handleExportReport = () => {
    const rows: string[][] = [
      [
        'Date',
        'Service',
        'Member Name',
        'Email',
        'Status',
        'Check-in Time',
        'Notes',
      ],
    ];

    const allSessions = historyData?.attendance || todaySessions;
    for (const session of allSessions) {
      const svcName =
        typeof session.serviceScheduleId === 'string'
          ? 'Service'
          : session.serviceScheduleId?.service ||
            (session.serviceScheduleId as any)?.name ||
            'Service';
      const dateStr = (session.attendanceDate || '').slice(0, 10);
      for (const rec of session.records || []) {
        const u = rec.userId as UserResponse;
        rows.push([
          dateStr,
          svcName,
          getFullName(u),
          u?.email || '',
          rec.status || '',
          rec.checkInTime || '',
          rec.notes || '',
        ]);
      }
    }

    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Attendance report exported to CSV.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge className="border-orange-200 bg-orange-100 text-orange-800">
            <Clock className="mr-1 h-3 w-3" />
            Late
          </Badge>
        );
      case 'excused':
        return (
          <Badge className="border-blue-200 bg-blue-100 text-blue-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Excused
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const checkInCode = `CHK-${today.replace(/-/g, '')}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Attendance Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track member attendance and service participation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsQrOpen(true)}
            size="sm"
            variant="outline"
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Check-in
          </Button>
          <Button onClick={handleExportReport} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog onOpenChange={setIsCheckInOpen} open={isCheckInOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className="mr-2 h-4 w-4" />
                Manual Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manual Check-in</DialogTitle>
                <DialogDescription>
                  Check in members manually for today's service
                </DialogDescription>
              </DialogHeader>
              <AttendanceCheckInForm
                mode="create"
                onSuccess={() => setIsCheckInOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Present Today
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.totalPresent}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Members checked in
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Absent Today
            </CardTitle>
            <div className="rounded-lg bg-red-100 p-2">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-red-600">
              {stats.totalAbsent}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Members absent</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Late Arrivals
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.totalLate}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Arrived after start
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Attendance Rate
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-blue-600">
              {stats.attendanceRate}%
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs className="space-y-6" defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="today">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members or service..."
                    value={searchTerm}
                  />
                </div>
                <Select
                  onValueChange={setSelectedStatus}
                  value={selectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingToday ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">
                    Loading attendance data...
                  </span>
                </div>
              ) : todayError ? (
                <div className="py-12 text-center text-destructive">
                  Error loading attendance data. Please try again.
                </div>
              ) : todayAttendance ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className="py-12 text-center text-muted-foreground"
                            colSpan={6}
                          >
                            No members found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMembers.map((member) => (
                          <TableRow
                            className="hover:bg-accent"
                            key={`${member.sessionId}-${member.id}`}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    alt={getFullName(member.user)}
                                    src={member.user?.profilePictureUrl || ''}
                                  />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {`${getFirstLetter(member.user?.firstName || '')}${getFirstLetter(member.user?.lastName || '')}`}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {getFullName(member.user)}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {member.user?.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {member.serviceName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(member.status)}
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground text-sm">
                                {member.checkInTime}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground text-sm">
                                {member.notes || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(member.session)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Session Attendance
                                  </DropdownMenuItem>
                                  {member.recordId && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateAttendance({
                                            attendanceId: member.recordId,
                                            payload: {
                                              records: [
                                                {
                                                  userId: member.user?._id,
                                                  status: 'present',
                                                },
                                              ],
                                            },
                                          })
                                        }
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        Mark Present
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateAttendance({
                                            attendanceId: member.recordId,
                                            payload: {
                                              records: [
                                                {
                                                  userId: member.user?._id,
                                                  status: 'late',
                                                },
                                              ],
                                            },
                                          })
                                        }
                                      >
                                        <Clock className="mr-2 h-4 w-4 text-orange-600" />
                                        Mark Late
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateAttendance({
                                            attendanceId: member.recordId,
                                            payload: {
                                              records: [
                                                {
                                                  userId: member.user?._id,
                                                  status: 'excused',
                                                },
                                              ],
                                            },
                                          })
                                        }
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                        Mark Excused
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() =>
                                          deleteAttendance({
                                            attendanceId: member.recordId,
                                          })
                                        }
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove Check-in
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="mb-4">No attendance record for today yet.</p>
                  <Button onClick={() => setIsCheckInOpen(true)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Start Check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="history">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Historical service attendance sessions and participation rates
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  className="pl-10"
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  placeholder="Search service or member..."
                  value={historySearchTerm}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">
                    Loading history...
                  </span>
                </div>
              ) : historyError ? (
                <div className="py-12 text-center text-destructive">
                  Error loading attendance history. Please try again.
                </div>
              ) : historyData?.attendance?.length ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.attendance.map(
                        (record: AttendanceResponse) => {
                          const service =
                            typeof record.serviceScheduleId === 'string'
                              ? 'Service'
                              : record.serviceScheduleId?.service ||
                                (record.serviceScheduleId as any)?.name ||
                                'Service';
                          return (
                            <TableRow key={record._id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {new Date(
                                      record.attendanceDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <span className="font-medium">{service}</span>
                                  {record.remarks && (
                                    <p className="text-muted-foreground text-xs">
                                      {record.remarks}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {(record.totalPresent || 0) +
                                    (record.totalLate || 0)}{' '}
                                  / {record.records?.length || 0}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    (record.attendancePercentage || 0) >= 80
                                      ? 'bg-green-100 text-green-800'
                                      : (record.attendancePercentage || 0) >= 60
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {record.attendancePercentage ?? 0}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.status === 'approved'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {capitalizeFirstLetter(record.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEdit(record)}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    {record.status !== 'approved' && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          approveAttendance(record._id)
                                        }
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        Approve
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleDelete(record)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No attendance history found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR & Quick Check-in Dialog */}
      <Dialog onOpenChange={setIsQrOpen} open={isQrOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR & Quick Check-in</DialogTitle>
            <DialogDescription>
              Display today's service check-in code or quickly check in an
              arriving member
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-6 text-center">
            <div className="mb-3 rounded-xl border-2 border-primary/20 bg-background p-4 shadow-sm">
              <QrCode className="h-24 w-24 text-foreground" />
            </div>
            <p className="font-mono font-semibold text-lg tracking-wider">
              {checkInCode}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              Service Date: {new Date(today).toLocaleDateString()}
            </p>
            <Button
              className="mt-3"
              onClick={() => {
                navigator.clipboard?.writeText(checkInCode);
                toast.success('Check-in code copied to clipboard.');
              }}
              size="sm"
              variant="outline"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Copy Check-in Code
            </Button>
          </div>

          <form className="space-y-4 pt-2" onSubmit={handleQuickCheckInSubmit}>
            <div className="space-y-2">
              <Label>Quick Member Check-in</Label>
              <UserCombobox
                className="w-full"
                onValueChange={(id) => setQuickMemberId(id || '')}
                placeholder="Search member by name or email..."
                value={quickMemberId}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(v) =>
                    setQuickStatus(
                      v as 'present' | 'late' | 'absent' | 'excused'
                    )
                  }
                  value={quickStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Optional note..."
                  value={quickNotes}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsQrOpen(false)}
                type="button"
                variant="outline"
              >
                Close
              </Button>
              <Button disabled={isQuickCheckingIn} type="submit">
                {isQuickCheckingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="mr-2 h-4 w-4" />
                )}
                Check In Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog onOpenChange={setIsEditOpen} open={isEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>
              Update attendance record for{' '}
              {editingAttendance &&
                new Date(editingAttendance.attendanceDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {editingAttendance && (
            <AttendanceCheckInForm
              existingAttendance={editingAttendance}
              mode="edit"
              onSuccess={() => {
                setIsEditOpen(false);
                setEditingAttendance(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the attendance record for{' '}
              {deletingAttendance &&
                new Date(
                  deletingAttendance.attendanceDate
                ).toLocaleDateString()}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingAttendance(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={confirmDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
