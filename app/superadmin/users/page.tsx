'use client';

import {
  Activity,
  Building2,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useDeleteSuperAdminUser,
  useSuperAdminUsers,
  useToggleUserStatus,
} from '@/hooks/api/use-superadmin';
import { useAllChurches } from '@/lib/hooks/superadmin/use-church-management-mutation';
import { AddAdminForm } from '@/components/forms/add-admin-form';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [churchFilter, setChurchFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useSuperAdminUsers({
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
    churchId: churchFilter,
  });

  const { data: churchesData } = useAllChurches();
  const { mutateAsync: toggleStatusMutation } = useToggleUserStatus();
  const { mutateAsync: deleteUserMutation } = useDeleteSuperAdminUser();

  const users = usersData?.users || [];
  const churches = churchesData?.churches || [];

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.church?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === 'all' ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      user.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesChurch =
      churchFilter === 'all' ||
      user.churchId?.toString() === churchFilter.toString();
    return matchesSearch && matchesRole && matchesStatus && matchesChurch;
  });

  const getRoleBadge = (role: string) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('super')) {
      return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
    }
    if (r.includes('admin')) {
      return <Badge className="bg-blue-100 text-blue-800">Church Admin</Badge>;
    }
    if (r.includes('pastor')) {
      return <Badge className="bg-purple-100 text-purple-800">Pastor</Badge>;
    }
    if (r.includes('staff')) {
      return <Badge className="bg-amber-100 text-amber-800">Staff</Badge>;
    }
    if (r.includes('volunteer')) {
      return <Badge className="bg-green-100 text-green-800">Volunteer</Badge>;
    }
    return <Badge variant="secondary">{role || 'Member'}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Active'}</Badge>;
    }
  };

  const roleStats = {
    admin: users.filter((u: any) =>
      u.role?.toLowerCase().includes('admin')
    ).length,
    pastor: users.filter((u: any) =>
      u.role?.toLowerCase().includes('pastor')
    ).length,
    staff: users.filter((u: any) =>
      u.role?.toLowerCase().includes('staff')
    ).length,
    volunteer: users.filter((u: any) =>
      u.role?.toLowerCase().includes('volunteer')
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across churches and assign roles and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>Add New Platform User</DialogTitle>
                <DialogDescription>
                  Create an administrator, pastor, or staff user account
                </DialogDescription>
              </DialogHeader>
              <AddAdminForm onCloseDialog={() => setIsAddUserOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">{users.length}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Across all registered churches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Administrators
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">{roleStats.admin}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Church administrators
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">
                {
                  users.filter(
                    (u: any) =>
                      u.status?.toLowerCase() === 'active'
                  ).length
                }
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Currently active accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pastors
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">{roleStats.pastor}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Clergy and church leaders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Live directory of all system users fetched directly from the backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name, email, or church..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setRoleFilter} value={roleFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="pastor">Pastor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setChurchFilter} value={churchFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by church" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Churches</SelectItem>
                {churches.map((church: any) => (
                  <SelectItem key={church.id} value={church.id.toString()}>
                    {church.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {[...new Array(5)].map((_, i) => (
                <Skeleton className="h-12 w-full" key={i} />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <h3 className="font-semibold text-lg">No Users Found</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {searchTerm ||
                roleFilter !== 'all' ||
                statusFilter !== 'all' ||
                churchFilter !== 'all'
                  ? 'No users match your active filter settings.'
                  : 'Start by creating your first platform user.'}
              </p>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Church</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatar || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {user.name
                                ? user.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm font-medium">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          {user.church || 'System-wide'}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {user.phone ? (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                              {user.phone}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              No phone
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Activity className="mr-1 h-4 w-4" />
                          {user.lastLogin || 'Never'}
                        </div>
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
                              className="cursor-pointer"
                              onClick={() => toggleStatusMutation(user.id)}
                            >
                              {user.status?.toLowerCase() === 'active' ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4 text-amber-600" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => deleteUserMutation(user.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>
            Overview of platform accounts grouped by responsibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-blue-600">
                {roleStats.admin}
              </div>
              <p className="text-muted-foreground text-sm">Administrators</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-purple-600">
                {roleStats.pastor}
              </div>
              <p className="text-muted-foreground text-sm">Pastors</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-amber-600">
                {roleStats.staff}
              </div>
              <p className="text-muted-foreground text-sm">Staff Members</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-green-600">
                {roleStats.volunteer}
              </div>
              <p className="text-muted-foreground text-sm">Volunteers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
