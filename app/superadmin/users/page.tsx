'use client';

import { AddAdminForm } from '@/components/forms/add-admin-form';
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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  Building2,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [churchFilter, setChurchFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Rev. John Smith',
      email: 'john.smith@gracecommunity.org',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      church: 'Grace Community Church',
      churchId: 1,
      status: 'active',
      lastLogin: '2 hours ago',
      joinDate: '2020-01-15',
      permissions: ['manage_members', 'manage_events', 'manage_finance'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@faithbaptist.org',
      phone: '+1 (555) 234-5678',
      role: 'pastor',
      church: 'Faith Baptist Church',
      churchId: 2,
      status: 'active',
      lastLogin: '1 hour ago',
      joinDate: '2019-03-22',
      permissions: ['manage_members', 'manage_events'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@hopemethodist.org',
      phone: '+1 (555) 345-6789',
      role: 'staff',
      church: 'Hope Methodist Church',
      churchId: 3,
      status: 'active',
      lastLogin: '3 hours ago',
      joinDate: '2021-07-10',
      permissions: ['manage_events'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@trinitypresby.org',
      phone: '+1 (555) 456-7890',
      role: 'volunteer',
      church: 'Trinity Presbyterian',
      churchId: 4,
      status: 'active',
      lastLogin: '1 day ago',
      joinDate: '2022-02-28',
      permissions: ['view_members'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@newlifeassembly.org',
      phone: '+1 (555) 567-8901',
      role: 'admin',
      church: 'New Life Assembly',
      churchId: 5,
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-01-05',
      permissions: ['manage_members', 'manage_events', 'manage_finance'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 6,
      name: 'Lisa Martinez',
      email: 'lisa.martinez@gracecommunity.org',
      phone: '+1 (555) 678-9012',
      role: 'staff',
      church: 'Grace Community Church',
      churchId: 1,
      status: 'suspended',
      lastLogin: '2 weeks ago',
      joinDate: '2020-11-18',
      permissions: ['manage_events'],
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ];

  const churches = [
    { id: 1, name: 'Grace Community Church' },
    { id: 2, name: 'Faith Baptist Church' },
    { id: 3, name: 'Hope Methodist Church' },
    { id: 4, name: 'Trinity Presbyterian' },
    { id: 5, name: 'New Life Assembly' },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.church.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    const matchesChurch =
      churchFilter === 'all' || user.churchId.toString() === churchFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesChurch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'pastor':
        return <Badge className="bg-purple-100 text-purple-800">Pastor</Badge>;
      case 'staff':
        return <Badge className="bg-blue-100 text-blue-800">Staff</Badge>;
      case 'volunteer':
        return <Badge className="bg-green-100 text-green-800">Volunteer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const roleStats = {
    admin: users.filter((u) => u.role === 'admin').length,
    pastor: users.filter((u) => u.role === 'pastor').length,
    staff: users.filter((u) => u.role === 'staff').length,
    volunteer: users.filter((u) => u.role === 'volunteer').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across churches and their permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddAdminForm onCloseDialog={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{users.length}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+3</span> new this month
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
            <div className="font-bold text-2xl">{roleStats.admin}</div>
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
            <div className="font-bold text-2xl">
              {users.filter((u) => u.status === 'active').length}
            </div>
            <p className="text-muted-foreground text-xs">
              Currently active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Approval
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {users.filter((u) => u.status === 'pending').length}
            </div>
            <p className="text-muted-foreground text-xs">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Complete list of all users with roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users, emails, or churches..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setRoleFilter} value={roleFilter}>
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setChurchFilter} value={churchFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by church" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Churches</SelectItem>
                {churches.map((church) => (
                  <SelectItem key={church.id} value={church.id.toString()}>
                    {church.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Church</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar || '/placeholder.svg'}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-sm">
                            Joined{' '}
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        {user.church}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Activity className="mr-1 h-4 w-4 text-muted-foreground" />
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission) => (
                          <Badge
                            className="text-xs"
                            key={permission}
                            variant="outline"
                          >
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {user.permissions.length > 2 && (
                          <Badge className="text-xs" variant="outline">
                            +{user.permissions.length - 2} more
                          </Badge>
                        )}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem className="text-red-600">
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>
            Overview of user roles across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-red-600">
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
              <div className="font-bold text-2xl text-blue-600">
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
