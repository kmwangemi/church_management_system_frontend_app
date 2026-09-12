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
import {
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
  Mail,
  MoreHorizontal,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UsersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [emailingUser, setEmailingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
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
    // pageSize: 20,
    status: selectedStatus === 'all' ? '' : selectedStatus,
    search: searchQuery,
    // role: 'MEMBER',
    // sortBy: 'name',
    // sortOrder: 'asc',
  });
  console.log('users--->', JSON.stringify(users));
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
        (user: any) => user?.user.status === selectedStatus
      );
    }
    // Filter by tab
    if (selectedTab !== 'all') {
      switch (selectedTab) {
        case 'active':
          filtered = filtered.filter((user: any) => user?.user.status === 'ACTIVE');
          break;
        case 'inactive':
          filtered = filtered.filter(
            (user: any) => user?.user.status === 'INACTIVE'
          );
          break;
        case 'staff':
          // Fixed: Check if 'STAFF' exists in the role array
          filtered = filtered.filter((user: any) => user.role?.includes('STAFF'));
          break;
        default:
          break;
      }
    }
    return filtered;
  }, [users?.members, selectedStatus, selectedTab]);
  // Calculate stats
  const stats = useMemo(() => {
    const allUsers = users?.members || [];
    return {
      total: allUsers.length,
      active: allUsers.filter((u: any) => u.user.status === 'ACTIVE').length,
      inactive: allUsers.filter((u: any) => u.user.status === 'INACTIVE').length,
      // Fixed: Check if 'STAFF' exists in the role array
      staff: allUsers.filter((u: any) => u.role?.includes('STAFF')).length,
    };
  }, [users]);
  const handleDeleteUser = async (memberId: string) => {
    await deleteUserMutation({ userId: memberId });
    setDeletingUser(null);
  };
  const openDeleteDialog = (user: Member) => {
    setDeletingUser(user);
  };
  const openEmailDialog = (user: Member) => {
    setEmailingUser(user);
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
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" variant="outline">
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
                                  {user?.user.name
                                    .split(' ')
                                    .map((n: string) => n[0].toUpperCase())
                                    .join('')}
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
                                      tm.team.name
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
    </div>
  );
}
