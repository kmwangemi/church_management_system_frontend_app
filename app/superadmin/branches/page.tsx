'use client';

import {
  Building2,
  Calendar,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Users,
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
  useDeleteSuperAdminBranch,
  useSuperAdminBranches,
} from '@/hooks/api/use-superadmin';
import { useAllChurches } from '@/lib/hooks/superadmin/use-church-management-mutation';
import { AddBranchDialog } from '@/components/dialogs/add-branch-dialog';
import { DeleteBranchDialog } from '@/components/dialogs/delete-branch-dialog';
import type { Branch } from '@/lib/types/branch';

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [churchFilter, setChurchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteBranchTarget, setDeleteBranchTarget] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useSuperAdminBranches({
    search: searchTerm,
    churchId: churchFilter,
    status: statusFilter,
  });

  const { data: churchesData } = useAllChurches();
  const { mutateAsync: deleteBranchMutation, isPending: isDeleting } =
    useDeleteSuperAdminBranch();

  const branches = branchesData?.branches || [];
  const churches = churchesData?.churches || [];

  const filteredBranches = branches.filter((branch: any) => {
    const matchesSearch =
      branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.pastor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.church?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChurch =
      churchFilter === 'all' || branch.churchId?.toString() === churchFilter;
    const matchesStatus =
      statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesChurch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Active'}</Badge>;
    }
  };

  const getCapacityColor = (members: number, capacity: number) => {
    const percentage = (members / (capacity || 1)) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleDelete = async (branchId: string) => {
    await deleteBranchMutation(branchId);
    setIsDeleteOpen(false);
    setDeleteBranchTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Branch Management
          </h1>
          <p className="text-muted-foreground">
            Manage all church branches and their campus locations
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
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Branches
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">{branches.length}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Across all registered churches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">
                {branches
                  .reduce(
                    (sum: number, b: any) => sum + (b.members || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Affiliated branch members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Capacity
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">
                {branches
                  .reduce(
                    (sum: number, b: any) => sum + (b.capacity || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Combined seating capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Avg. Occupancy
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-bold text-2xl">
                {Math.round(
                  (branches.reduce(
                    (sum: number, b: any) => sum + (b.members || 0),
                    0
                  ) /
                    (branches.reduce(
                      (sum: number, b: any) => sum + (b.capacity || 0),
                      0
                    ) || 1)) *
                    100
                )}
                %
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Based on active members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Directory</CardTitle>
          <CardDescription>
            Live directory of all church branch locations fetched from the backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search branches, pastors, or locations..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setChurchFilter} value={churchFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
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
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {[...new Array(5)].map((_, i) => (
                <Skeleton className="h-12 w-full" key={i} />
              ))}
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <h3 className="font-semibold text-lg">No Branches Found</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {searchTerm || churchFilter !== 'all' || statusFilter !== 'all'
                  ? 'No branches match your active filter criteria.'
                  : 'Get started by creating your first branch campus.'}
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Church</TableHead>
                    <TableHead>Pastor</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch: any) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {branch.name
                                ? branch.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()
                                : 'BR'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-muted-foreground text-sm">
                              Est. {branch.established || '2022'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {branch.church || 'Independent'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {branch.pastor || 'Pastor in-charge'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {branch.address || 'Campus Address'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {branch.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                              {branch.phone}
                            </div>
                          )}
                          {branch.email && (
                            <div className="flex items-center">
                              <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                              {branch.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          {(branch.members || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Building2 className="mr-1 h-4 w-4 text-muted-foreground" />
                            {(branch.capacity || 500).toLocaleString()}
                          </div>
                          <div
                            className={`text-xs ${getCapacityColor(
                              branch.members || 0,
                              branch.capacity || 500
                            )}`}
                          >
                            {Math.round(
                              ((branch.members || 0) /
                                (branch.capacity || 500)) *
                                100
                            )}
                            % occupied
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(branch.status)}</TableCell>
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
                              className="cursor-pointer text-red-600"
                              onClick={() => {
                                setDeleteBranchTarget(branch);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Branch
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

      {/* Add Branch Dialog */}
      <AddBranchDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      {/* Delete Branch Dialog */}
      <DeleteBranchDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        branch={deleteBranchTarget}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
