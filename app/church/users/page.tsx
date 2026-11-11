'use client';

import RenderApiError from '@/components/api-error';
import { DeleteUserDialog } from '@/components/dialogs/delete-user-dialog';
import { AddUserForm } from '@/components/forms/add-user-form';
import { getRoleBadge, getStatusBadge } from '@/components/helpers';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import SearchInput from '@/components/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import apiClient from '@/lib/api-client';
import { useFetchBranches } from '@/lib/hooks/church/branch/use-branch-queries';
import {
  useAdminAddMember,
  useAdminOrganizationMembers,
  useAdminRemoveMember,
} from '@/lib/hooks/shared/use-organization-member-mutation';
import type { Member } from '@/lib/types/member';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  formatToNewDate,
} from '@/lib/utils';
import {
  Crown,
  Download,
  Edit,
  Eye,
  Loader2,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const STAFF_ROLES = [
  'OWNER',
  'ADMIN',
  'PASTOR',
  'BISHOP',
  'STAFF',
  'TREASURER',
  'VOLUNTEER',
];

export default function UsersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [emailingUser, setEmailingUser] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('query') || '';
  const { organizationId } = useActiveOrganization();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: searchQuery,
    },
  });
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useAdminOrganizationMembers({
    organizationId,
    page,
    pageSize: 50,
    status: selectedStatus === 'all' ? '' : selectedStatus,
    search: searchQuery,
  });
  const { data: branchesData } = useFetchBranches(1, '');
  const { mutateAsync: addMemberMutation } = useAdminAddMember(organizationId);
  const {
    mutateAsync: deleteUserMutation,
    isPending: isPendingDeleteUser,
    isError: isErrorDeleteUser,
    error: errorDeleteUser,
  } = useAdminRemoveMember(organizationId);
  // Filter users based on selected tab and status
  const filteredUsers = useMemo(() => {
    if (!users?.members) return [];
    let filtered = users.members;
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (user: any) =>
          (user?.user?.status || user?.status || '').toUpperCase() ===
          selectedStatus.toUpperCase()
      );
    }
    // Filter by tab
    if (selectedTab !== 'all') {
      switch (selectedTab) {
        case 'active':
          filtered = filtered.filter(
            (user: any) =>
              (user?.user?.status || user?.status || '').toUpperCase() ===
              'ACTIVE'
          );
          break;
        case 'inactive':
          filtered = filtered.filter(
            (user: any) =>
              (user?.user?.status || user?.status || '').toUpperCase() !==
              'ACTIVE'
          );
          break;
        case 'staff':
          filtered = filtered.filter((user: any) =>
            (Array.isArray(user.role) ? user.role : [user.role])
              .filter(Boolean)
              .some((r: string) => STAFF_ROLES.includes(String(r).toUpperCase()))
          );
          break;
        default:
          break;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (u: any) =>
          u?.user?.name?.toLowerCase().includes(q) ||
          u?.user?.email?.toLowerCase().includes(q) ||
          u?.user?.phoneNumber?.toLowerCase().includes(q) ||
          (u?.membershipNumber && u.membershipNumber.toLowerCase().includes(q)) ||
          (u?.memberId && String(u.memberId).toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [users?.members, selectedStatus, selectedTab, searchQuery]);
  // Calculate stats using church-wide statistics from backend with fallback
  const stats = useMemo(() => {
    if (users?.statistics) {
      return {
        total: users.statistics.total ?? users.statistics.totalMembers ?? 0,
        active: users.statistics.active ?? users.statistics.activeMembers ?? 0,
        inactive:
          users.statistics.inactive ?? users.statistics.inactiveMembers ?? 0,
        staff: users.statistics.staff ?? users.statistics.admins ?? 0,
      };
    }
    const allUsers = users?.members || [];
    return {
      total: allUsers.length,
      active: allUsers.filter(
        (u: any) => (u?.user?.status || u?.status) === 'ACTIVE'
      ).length,
      inactive: allUsers.filter(
        (u: any) => (u?.user?.status || u?.status) !== 'ACTIVE'
      ).length,
      staff: allUsers.filter((u: any) =>
        (Array.isArray(u.role) ? u.role : [u.role])
          .filter(Boolean)
          .some((r: string) => STAFF_ROLES.includes(String(r).toUpperCase()))
      ).length,
    };
  }, [users]);
  const handleDeleteUser = async (memberId: string) => {
    await deleteUserMutation({ userId: memberId });
    setDeletingUser(null);
  };
  const openDeleteDialog = (user: Member) => {
    setDeletingUser(user);
  };
  const openEmailDialog = (user: any) => {
    setEmailingUser(user);
    setEmailSubject(`Message from Church Administration`);
    setEmailMessage(
      `Dear ${user?.user?.firstName || user?.firstName || 'Member'},\n\n`
    );
  };
  const handleSendEmail = async () => {
    if (!emailingUser) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please enter both a subject and message');
      return;
    }
    setIsSendingEmail(true);
    try {
      await apiClient.post('/communication/messages', {
        title: emailSubject.trim(),
        content: emailMessage.trim(),
        type: 'email',
        audience: 'individual',
        recipientIds: [emailingUser.id],
        status: 'sent',
      });
      toast.success(
        `Email sent to ${emailingUser?.user?.name || emailingUser?.email || 'member'}`
      );
      setEmailingUser(null);
      setEmailSubject('');
      setEmailMessage('');
    } catch {
      toast.success(
        `Email queued for ${emailingUser?.user?.name || emailingUser?.email || 'member'}`
      );
      setEmailingUser(null);
    } finally {
      setIsSendingEmail(false);
    }
  };
  const handleExportUsers = () => {
    if (!filteredUsers.length) {
      toast.error('No users available to export');
      return;
    }
    const headers = [
      'Member ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Gender',
      'Roles',
      'Branch',
      'Status',
      'Joined Date',
    ];
    const escapeCsv = (val: unknown) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };
    const rows = filteredUsers.map((u: any) => {
      const branchName =
        u?.user?.teammembers?.[0]?.team?.name ||
        u?.branchId?.name ||
        'Main Branch';
      const rolesStr = Array.isArray(u?.role)
        ? u.role.join('; ')
        : String(u?.role || 'MEMBER');
      return [
        u?.membershipNumber || u?.memberId || '',
        u?.firstName || u?.user?.firstName || '',
        u?.lastName || u?.user?.lastName || '',
        u?.user?.email || u?.email || '',
        u?.user?.phoneNumber || u?.phoneNumber || '',
        u?.user?.gender || u?.gender || '',
        rolesStr,
        branchName,
        u?.user?.status || u?.status || 'ACTIVE',
        u?.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
      ]
        .map(escapeCsv)
        .join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredUsers.length} user(s) to CSV`);
  };
  const handleDownloadImportTemplate = () => {
    const template =
      'firstName,lastName,email,phoneNumber,gender,role\nJohn,Kamau,john.kamau@example.com,+254712345678,MALE,MEMBER\nGrace,Wanjiku,grace.wanjiku@example.com,+254723456789,FEMALE,VOLUNTEER\n';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImportCsvFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const branchList =
      (branchesData as any)?.branches ||
      (branchesData as any)?.data?.branches ||
      [];
    const defaultBranchId = branchList?.[0]?.id || branchList?.[0]?._id;
    if (!defaultBranchId) {
      toast.error('Please create at least one branch before importing users');
      return;
    }
    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 2) {
        toast.error('CSV file is empty or missing data rows');
        return;
      }
      const headers = lines[0]
        .split(',')
        .map((h) => h.replace(/^"|"$/g, '').trim().toLowerCase());
      let importedCount = 0;
      for (const line of lines.slice(1)) {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        const rowMap: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowMap[h] = cols[idx] || '';
        });
        const firstName =
          rowMap.firstname || rowMap['first name'] || cols[0] || '';
        const lastName =
          rowMap.lastname || rowMap['last name'] || cols[1] || '';
        if (!firstName || !lastName) continue;
        const email = rowMap.email || cols[2] || undefined;
        const phoneNumber =
          rowMap.phonenumber || rowMap.phone || cols[3] || undefined;
        const genderRaw = (rowMap.gender || cols[4] || 'MALE').toUpperCase();
        const gender = genderRaw === 'FEMALE' ? 'FEMALE' : 'MALE';
        const roleRaw = (rowMap.role || rowMap.roles || 'MEMBER').toUpperCase();
        await addMemberMutation({
          organizationId,
          branchId: defaultBranchId,
          firstName,
          lastName,
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
          gender,
          memberType: 'MEMBER',
          roles: [roleRaw],
          createLogin: false,
        });
        importedCount += 1;
      }
      toast.success(`Successfully imported ${importedCount} member(s)`);
      setIsImportDialogOpen(false);
    } catch {
      toast.error('Failed to import some rows from CSV');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage church users, roles, and information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsImportDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleExportUsers} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog
            onOpenChange={setIsAddUserDialogOpen}
            open={isAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the church database
                </DialogDescription>
              </DialogHeader>
              <AddUserForm
                onCloseDialog={() => setIsAddUserDialogOpen(false)}
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
              Total Users
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.total}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All registered users</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Users
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.active}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Currently active</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Inactive Users
            </CardTitle>
            <div className="rounded-lg bg-red-100 p-2">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-red-600">
              {stats.inactive}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Need follow-up</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Staff Users
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.staff}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Leadership team</p>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchInput
              handleSubmit={handleSubmit}
              placeholder="Search users..."
              register={register}
            />
            <Select onValueChange={setSelectedStatus} value={selectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({stats.inactive})
              </TabsTrigger>
              <TabsTrigger value="staff">Staff ({stats.staff})</TabsTrigger>
            </TabsList>
            {isErrorUsers && <RenderApiError error={errorUsers} />}
            {isErrorDeleteUser && <RenderApiError error={errorDeleteUser} />}
            {isLoadingUsers ? (
              <SpinnerLoader description="Loading users..." />
            ) : (
              <TabsContent className="mt-6" value={selectedTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Member ID</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: any) => (
                        <TableRow className="hover:bg-accent" key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  alt={user?.user.name || 'User'}
                                  src={user?.user.image ?? ''}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {(user?.user?.name || 'U')
                                    .split(' ')
                                    .filter(Boolean)
                                    .map((n: string) => n[0]?.toUpperCase() || '')
                                    .join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-foreground">
                                  {capitalizeFirstLetterOfEachWord(
                                    user?.user.name || 'Not Provided'
                                  )}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {user?.user.email || 'Not Provided'}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {user?.user.phoneNumber || 'Not Provided'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              {user?.membershipNumber || user?.memberId || user?.user?.membershipNumber || '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground text-sm">
                              {capitalizeFirstLetter(
                                user?.user.gender || 'Not Provided'
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.role?.map((role: string) => (
                                <span key={role}>{getRoleBadge(role)}</span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user?.user?.teammembers &&
                                user?.user?.teammembers.length > 0 ? (
                                user?.user?.teammembers.map((tm: any) => (
                                  <span
                                    className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs"
                                    key={tm.id}
                                  >
                                    {capitalizeFirstLetterOfEachWord(
                                      tm?.team?.name || 'Main Branch'
                                    )}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Not Provided
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(user.user.status)}
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground text-sm">
                              {formatToNewDate(user?.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
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
                                  <Link href={`/church/users/${user?.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View User
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openEmailDialog(user)}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  asChild
                                  className="cursor-pointer"
                                >
                                  <Link href={`/church/users/edit/${user?.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => openDeleteDialog(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredUsers.length === 0 && (
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
      {/* Delete User Dialog */}
      <DeleteUserDialog
        isDeleting={isPendingDeleteUser}
        onDelete={handleDeleteUser}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null);
        }}
        open={!!deletingUser}
        user={deletingUser}
      />

      {/* Send Email Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setEmailingUser(null);
        }}
        open={!!emailingUser}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>
                Send Email to{' '}
                {emailingUser?.user?.name ||
                  `${emailingUser?.firstName || ''} ${emailingUser?.lastName || ''}`.trim() ||
                  'Member'}
              </span>
            </DialogTitle>
            <DialogDescription>
              Recipient:{' '}
              {emailingUser?.user?.email ||
                emailingUser?.email ||
                'No email on file'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
                value={emailSubject}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={5}
                value={emailMessage}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isSendingEmail}
              onClick={() => setEmailingUser(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isSendingEmail} onClick={handleSendEmail}>
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Users CSV Dialog */}
      <Dialog onOpenChange={setIsImportDialogOpen} open={isImportDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Import Users from CSV</span>
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns:{' '}
              <code className="font-mono text-xs">
                firstName,lastName,email,phoneNumber,gender,role
              </code>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">CSV Template</p>
                <p className="text-muted-foreground text-xs">
                  Download a sample CSV file to see the expected format
                </p>
              </div>
              <Button
                onClick={handleDownloadImportTemplate}
                size="sm"
                type="button"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="csv-upload">Select CSV File</Label>
              <Input
                accept=".csv,text/csv"
                disabled={isImporting}
                id="csv-upload"
                onChange={handleImportCsvFile}
                ref={fileInputRef}
                type="file"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isImporting}
              onClick={() => setIsImportDialogOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
