'use client';

import RenderApiError from '@/components/api-error';
import { BranchCombobox } from '@/components/branch-combobox';
import { CountrySelect } from '@/components/country-list-input';
import { getRoleBadge, getStatusBadge } from '@/components/helpers';
import { MultiSelect } from '@/components/multi-select';
import { PasswordInput } from '@/components/password-input';
import { PhoneInput } from '@/components/phone-number-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  useAdminAddMember,
  useAdminOrganizationMembers,
  useAdminRemoveMember,
  useAdminUpdateMember,
} from '@/lib/hooks/shared/use-organization-member-mutation';
import { useDebounce } from '@/lib/hooks/shared/usedebounce/use-debounce';
import type { ChurchListResponse } from '@/lib/types/church';
import {
  capitalizeFirstLetterOfEachWord,
  CHURCH_POSITION_OPTIONS,
  GENDER_OPTIONS,
  getRolesForPosition,
} from '@/lib/utils';
import {
  adminDataSchema,
  adminEditSchema,
  type AdminPayload,
  type AdminEditPayload,
} from '@/lib/validations/users';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Church,
  Edit,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
export interface MemberWithUser {
  id: string;
  role: string[];
  createdAt: string;
  organizationId: string;
  position?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    image?: string;
    status: string;
    gender?: string;
  };
}

interface ManageChurchUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: ChurchListResponse | null;
}

export function ManageChurchUsersDialog({
  open,
  onOpenChange,
  church,
}: ManageChurchUsersDialogProps) {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MemberWithUser | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [branchId, setBranchId] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'role'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // Debounce search
  const debouncedSearch = useDebounce(search, 500);
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, status, branchId, sortBy, sortOrder]);
  // Add mutation hooks
  const { mutate: removeMember, isPending: isRemoving } = useAdminRemoveMember(
    church?.id || ''
  );
  // const { mutate: toggleStatus, isPending: isTogglingStatus } =
  //   useToggleMemberStatus(church?.id || '');
  // Fetch members
  const { data, isLoading, error, refetch } = useAdminOrganizationMembers({
    organizationId: church?.id ?? '',
    page,
    pageSize,
    search: debouncedSearch,
    // role,
    // status,
    // teamId: branchId,
    // sortBy,
    sortOrder,
  });
  // console.log('organization members --->', JSON.stringify(data));
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };
  const handleNextPage = () => {
    if (data?.pagination.hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  const { members = [] as MemberWithUser[], pagination } = data || {};

  // Updated delete handler
  const handleDeleteUser = (userId: string, deleteUser = false) => {
    if (
      !confirm(
        deleteUser
          ? 'Are you sure you want to permanently delete this user? This action cannot be undone.'
          : 'Are you sure you want to remove this member from the organization?'
      )
    )
      return;
    removeMember({ userId });
  };
  // Updated toggle status handler
  const handleToggleStatus = (member: MemberWithUser) => {
    const action = member.user.status === 'ACTIVE' ? 'suspend' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this member?`)) return;
    // toggleStatus({ memberId: member.id });
  };
  const handleEditUser = (member: MemberWithUser) => {
    setSelectedUser(member);
    setEditUserDialogOpen(true);
  };
  if (!church) return null;
  // Loading state
  if (isLoading && !data) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Users - {church.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[...new Array(5)].map((_, i) => (
              <Skeleton className="h-16 w-full" key={i} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  // Error state
  if (error) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : 'Failed to load members'}
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <>
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Users - {church.name}
            </DialogTitle>
            <DialogDescription>
              Add, edit, or remove users and manage their permissions
            </DialogDescription>
          </DialogHeader>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {pagination?.total || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {members.filter((u: any) => u.user.status === 'ACTIVE').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {members.filter((u: any) => u.role?.includes('ADMIN')).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Pending</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {members.filter((u: any) => u.user.status === 'PENDING').length}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Filters and Actions */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name or email..."
                value={search}
              />
            </div>
            {/* Role Filter */}
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="VISITOR">Visitor</SelectItem>
              </SelectContent>
            </Select>
            {/* Status Filter */}
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {/* Page Size */}
            <Select
              onValueChange={(val) => setPageSize(Number(val))}
              value={pageSize.toString()}
            >
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setAddUserDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Church Administrator
            </Button>
          </div>
          {/* Users Table */}
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No members found</p>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters or add a new user
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.user.image || undefined} />
                            <AvatarFallback>
                              {member.user.name
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <span>{member.user.name}</span>
                              {(member.membershipNumber || member.memberId) && (
                                <span className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                  {member.membershipNumber || member.memberId}
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {member.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {member.user.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3" />
                              {member.user.email}
                            </div>
                          )}
                          {member.user.phoneNumber && (
                            <div className="flex items-center text-sm">
                              <Phone className="mr-1 h-3 w-3" />
                              {member.user.phoneNumber}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.role?.map((role: string) => (
                            <span key={role}>{getRoleBadge(role)}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.user.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(member.createdAt).toLocaleDateString()}
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
                              onClick={() => handleEditUser(member)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(member)}
                            >
                              {member.user.status === 'ACTIVE' ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteUser(member.user.id)}
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
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  disabled={page === 1}
                  onClick={handlePreviousPage}
                  size="sm"
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  disabled={!pagination?.hasMore}
                  onClick={handleNextPage}
                  size="sm"
                  variant="outline"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => toast.info('Export feature coming soon')}>
              Export User List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add User Dialog */}
      <AddUserDialog
        church={church}
        onOpenChange={setAddUserDialogOpen}
        onSuccess={() => {
          refetch();
          setAddUserDialogOpen(false);
        }}
        open={addUserDialogOpen}
      />
      {/* Edit User Dialog */}
      <EditUserDialog
        member={selectedUser}
        onOpenChange={setEditUserDialogOpen}
        onSuccess={() => {
          refetch();
          setEditUserDialogOpen(false);
        }}
        open={editUserDialogOpen}
      />
    </>
  );
}

// Add User Dialog Component
interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: ChurchListResponse;
  onSuccess: () => void;
}

function AddUserDialog({
  open,
  onOpenChange,
  church,
  onSuccess,
}: AddUserDialogProps) {
  const {
    mutate: addMember,
    isPending: isLoading,
    isError,
    error,
  } = useAdminAddMember(church.id);
  const form = useForm<AdminPayload>({
    resolver: zodResolver(adminDataSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'MALE',
      position: 'Church Administrator',
      role: ['ADMIN'] as any,
      teamId: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
      password: '',
      confirmPassword: '',
    },
  });
  const { reset } = form;
  const onSubmit = (payload: AdminPayload) => {
    addMember(
      {
        organizationId: church.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        gender: payload.gender,
        position: 'Church Administrator',
        address: payload.address,
        teamId: payload.teamId || undefined,
        role: ['ADMIN'],
        sendWelcomeEmail: payload.sendWelcomeEmail,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            reset();
            onSuccess();
          }
        },
      }
    );
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Church Administrator to {capitalizeFirstLetterOfEachWord(church.name)}
          </DialogTitle>
          <DialogDescription>
            Create the primary church administrator for {church.name}. The church administrator will be assigned to the main branch and can manage other church users.
          </DialogDescription>
        </DialogHeader>
        {isError && <RenderApiError error={error} />}
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Basic user details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="KE"
                            onChange={field.onChange}
                            placeholder="Enter phone number"
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Gender <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {GENDER_OPTIONS.map((option) => (
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
              </CardContent>
            </Card>
            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Address Information</span>
                </CardTitle>
                <CardDescription>User address information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Country <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <CountrySelect
                            onChange={field.onChange}
                            placeholder="Select your country"
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          City <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nairobi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Street Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="00100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Church Information (Auto-picked) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Church className="h-5 w-5" />
                  <span>Church Information</span>
                </CardTitle>
                <CardDescription>
                  Automatically assigned role, position, and branch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <span className="font-semibold text-blue-900 block">Church:</span>
                      <span className="text-blue-700">{church.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-900 block">Assigned Role:</span>
                      <span className="text-blue-700">Church Administrator</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-900 block">Assigned Branch:</span>
                      <span className="text-blue-700">Main Branch (Headquarters)</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-blue-600">
                    * This church administrator will have full management access to create other church users, pastors, and staff.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security / Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription>Set initial login credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Temporary Password{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Create a strong password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm Password{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Administrator...
                  </>
                ) : (
                  'Create Administrator'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Edit User Dialog Component
interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberWithUser | null;
  onSuccess: () => void;
}

function EditUserDialog({ open, onOpenChange, member, onSuccess }: EditUserDialogProps) {
  const { mutate: updateMember, isPending: isLoading } = useAdminUpdateMember(
    member?.organizationId || ''
  );
   const form = useForm<AdminEditPayload>({
    resolver: zodResolver(adminEditSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'MALE',
      position: '',
      role: [],
      status: 'ACTIVE',
    },
  });
  const { reset, watch } = form;
  const watchPosition = watch('position');
  const CHURCH_ROLE_OPTIONS = getRolesForPosition(watchPosition || '');
  // Update form when member changes
  useEffect(() => {
    if (member) {
      const [firstName = '', lastName = ''] =
        member.user.name?.split(' ') || [];
      const genderValue =
        (member.user.gender as 'MALE' | 'FEMALE' | undefined) || 'MALE';
      form.reset({
        firstName,
        lastName,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber || '',
        gender: genderValue,
        position: member.position || '',
        role: (Array.isArray(member.role)
          ? member.role
          : [member.role].filter(Boolean)) as any,
        status: (member.user.status?.toUpperCase() || 'ACTIVE') as
          | 'ACTIVE'
          | 'INACTIVE'
          | 'SUSPENDED'
          | 'PENDING',
      });
    }
  }, [member, form]);
  const onSubmit = (payload: AdminEditPayload) => {
    if (!member) return;
    updateMember(
      {
        userId: member.user.id,
        organizationId: member.organizationId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        gender: payload.gender,
        role: Array.isArray(payload.role) ? payload.role[0] : payload.role,
        status: payload.status,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            onSuccess();
          }
        },
      }
    );
  };
  if (!member) return null;
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings for {member.user.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@church.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="KE"
                        onChange={field.onChange}
                        placeholder="Enter phone number"
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Church Position <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select church position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CHURCH_POSITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Roles & Permissions{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        onChange={field.onChange}
                        options={CHURCH_ROLE_OPTIONS}
                        placeholder="Select roles & permissions"
                        selected={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control as any}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
