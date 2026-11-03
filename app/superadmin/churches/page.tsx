'use client';

import { EditChurchDialog } from '@/components/dialogs/edit-church-dialog';
import { ManageChurchUsersDialog } from '@/components/dialogs/manage-church-users-dialog';
import { ViewChurchDetailsDialog } from '@/components/dialogs/view-church-details-dialog';
import { AddChurchForm } from '@/components/forms/add-church-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  useAllChurches,
  useChurchActions,
  useUpdateChurch,
} from '@/lib/hooks/superadmin/use-church-management-mutation';
import type { ChurchListResponse } from '@/lib/types/church';
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  DollarSign,
  Edit,
  Eye,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ChurchesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageUsersDialogOpen, setManageUsersDialogOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] =
    useState<ChurchListResponse | null>(null);
  // Fetch all churches
  const { data: churches, isLoading, error, refetch } = useAllChurches();
  const { mutate: updateChurch } = useUpdateChurch();
  // Church actions
  const { suspend, activate, delete: deleteChurch } = useChurchActions();
  // Filter churches
  const filteredChurches = useMemo<ChurchListResponse[]>(() => {
    if (!churches?.churches) return [];
    return churches.churches.filter((church: ChurchListResponse) => {
      try {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          church.name.toLowerCase().includes(searchLower) ||
          church.denomination?.toLowerCase().includes(searchLower) ||
          church.email?.toLowerCase().includes(searchLower);
        const matchesStatus =
          statusFilter === 'all' ||
          church.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesPlan =
          planFilter === 'all' ||
          church?.subscription?.plan?.toLowerCase() ===
            planFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesPlan;
      } catch (error) {
        console.error('Error filtering church:', error);
        return false;
      }
    });
  }, [churches, searchTerm, statusFilter, planFilter]);
  // Badge helpers
  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };
  const getPlanBadge = (plan?: string) => {
    const planLower = plan?.toLowerCase();
    switch (planLower) {
      case 'CUSTOM':
        return <Badge className="bg-purple-100 text-purple-800">Custom</Badge>;
      case 'CATHEDRAL':
        return <Badge className="bg-blue-100 text-blue-800">Cathedral</Badge>;
      case 'MINISTRY':
        return <Badge className="bg-muted text-foreground">Ministry</Badge>;
      default:
        return <Badge variant="secondary">{plan || 'None'}</Badge>;
    }
  };
  // Action handlers
  const handleViewDetails = (church: ChurchListResponse) => {
    setSelectedChurch(church);
    setViewDialogOpen(true);
  };
  const handleEditChurch = (church: ChurchListResponse) => {
    setSelectedChurch(church);
    setEditDialogOpen(true);
  };
  const handleManageUsers = (church: ChurchListResponse) => {
    setSelectedChurch(church);
    setManageUsersDialogOpen(true);
  };
  const handleSaveChurch = (updatedChurch: ChurchListResponse) => {
    updateChurch({
      organizationId: updatedChurch.id,
      name: updatedChurch.name,
      slug: updatedChurch.slug,
      logo: updatedChurch.logo || undefined,
      denomination: updatedChurch.denomination,
      description: updatedChurch.description,
      email: updatedChurch.email,
      phoneNumber: updatedChurch.phoneNumber,
      website: updatedChurch.website,
      churchSize: updatedChurch.churchSize,
      numberOfBranches: updatedChurch.numberOfBranches,
      status: updatedChurch.status,
      address: updatedChurch.address,
    });
    toast.success('Church updated successfully');
    setEditDialogOpen(false);
  };
  const handleSuspendChurch = (church: ChurchListResponse) => {
    if (confirm('Are you sure you want to suspend this church?')) {
      suspend.mutate(church.id);
      toast.success('Church suspended successfully');
    }
  };
  const handleActivateChurch = (church: ChurchListResponse) => {
    activate.mutate(church.id);
    toast.success('Church activated successfully');
  };
  const handleDeleteChurch = (church: ChurchListResponse) => {
    if (
      confirm(
        'Are you sure you want to delete this church? This action cannot be undone.'
      )
    ) {
      deleteChurch.mutate(church.id);
      toast.success('Church deleted successfully');
    }
  };
  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...new Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Churches Management
            </h1>
            <p className="text-muted-foreground">
              Manage all registered churches and their information
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Churches</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error instanceof Error
                ? error.message
                : 'Failed to load churches. Please try again.'}
            </span>
            <Button onClick={() => refetch()} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // Empty State
  if (!churches || churches?.churches.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Churches Management
            </h1>
            <p className="text-muted-foreground">
              Manage all registered churches and their information
            </p>
          </div>
          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Church
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Church</DialogTitle>
                <DialogDescription>
                  Add a new church to the church database
                </DialogDescription>
              </DialogHeader>
              <AddChurchForm onCloseDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No Churches Yet</h3>
            <p className="mb-4 text-center text-muted-foreground text-sm">
              Get started by adding your first church to the system.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Church
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Churches Management
          </h1>
          <p className="text-muted-foreground">
            Manage all registered churches and their information
          </p>
        </div>
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Church
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Church</DialogTitle>
              <DialogDescription>
                Add a new church to the church database
              </DialogDescription>
            </DialogHeader>
            <AddChurchForm onCloseDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Churches
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {churches?.stats?.totalChurches}
            </div>
            <p className="text-muted-foreground text-xs">
              Active organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {(churches?.stats?.totalMembers || 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Across all churches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Branches
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {churches?.stats?.totalBranches}
            </div>
            <p className="text-muted-foreground text-xs">Branch locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${(churches?.stats?.totalRevenue || 0).toLocaleString() || 0}
            </div>
            <p className="text-muted-foreground text-xs">Total revenue</p>
          </CardContent>
        </Card>
      </div>
      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Church Directory</CardTitle>
          <CardDescription>
            Complete list of all registered churches with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search churches, denominations, or email..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setPlanFilter} value={planFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="cathedral">Cathedral</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredChurches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No Results Found</h3>
              <p className="text-center text-muted-foreground text-sm">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Church</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Branches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChurches.map((church: ChurchListResponse) => {
                    return (
                      <TableRow key={church.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={church?.logo || undefined} />
                              <AvatarFallback>
                                {(church.name || 'CH')
                                  .split(' ')
                                  .filter(Boolean)
                                  .map((n: string) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase() || 'CH'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {capitalizeFirstLetterOfEachWord(
                                  church.name || 'Not Provided'
                                )}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {capitalizeFirstLetterOfEachWord(
                                  church.denomination || 'Not Provided'
                                )}
                                {church.establishedDate &&
                                  ` • Est. ${new Date(church.establishedDate).getFullYear()}`}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {church.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                {church.email}
                              </div>
                            )}
                            {church.phoneNumber && (
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3" />
                                {church.phoneNumber}
                              </div>
                            )}
                            {church.website && (
                              <div className="flex items-center text-sm">
                                <Globe className="mr-1 h-3 w-3" />
                                {church.website}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                            {(
                              church?._count?.members ??
                              church?.subscription?.currentUsers ??
                              0
                            ).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                            {church.numberOfBranches || 0}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(church?.status)}</TableCell>
                        <TableCell>
                          {getPlanBadge(church?.subscription?.plan)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="h-8 w-8 p-0"
                                disabled={isLoading}
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleViewDetails(church)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEditChurch(church)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Church
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleManageUsers(church)}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Manage Users
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {church?.status?.toLowerCase() === 'suspended' ? (
                                <DropdownMenuItem
                                  className="cursor-pointer text-green-600"
                                  onClick={() => handleActivateChurch(church)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate Church
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="cursor-pointer text-orange-600"
                                  onClick={() => handleSuspendChurch(church)}
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Suspend Church
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteChurch(church)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Church
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialogs */}
      <ViewChurchDetailsDialog
        church={selectedChurch}
        onEdit={handleEditChurch}
        onOpenChange={setViewDialogOpen}
        open={viewDialogOpen}
      />
      <EditChurchDialog
        church={selectedChurch}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveChurch}
        open={editDialogOpen}
      />
      <ManageChurchUsersDialog
        church={selectedChurch}
        onOpenChange={setManageUsersDialogOpen}
        open={manageUsersDialogOpen}
      />
    </div>
  );
}
