'use client';

import {
  Building2,
  Calendar,
  Edit,
  Eye,
  Mail,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: ignore
  Map,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [churchFilter, setChurchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const branches = [
    {
      id: 1,
      name: 'Grace Community - Downtown',
      church: 'Grace Community Church',
      churchId: 1,
      pastor: 'Rev. Mark Thompson',
      address: '456 Main Street, Downtown Springfield, IL 62701',
      phone: '+1 (555) 111-2222',
      email: 'downtown@gracecommunity.org',
      members: 850,
      capacity: 1200,
      established: '2010',
      status: 'active',
      services: ['Sunday 9:00 AM', 'Sunday 11:00 AM', 'Wednesday 7:00 PM'],
      growth: 12.5,
      lastActivity: '1 hour ago',
    },
    {
      id: 2,
      name: 'Grace Community - Westside',
      church: 'Grace Community Church',
      churchId: 1,
      pastor: 'Rev. Jennifer Adams',
      address: '789 West Avenue, Westside Springfield, IL 62702',
      phone: '+1 (555) 222-3333',
      email: 'westside@gracecommunity.org',
      members: 650,
      capacity: 800,
      established: '2015',
      status: 'active',
      services: ['Sunday 10:00 AM', 'Sunday 6:00 PM'],
      growth: 8.3,
      lastActivity: '2 hours ago',
    },
    {
      id: 3,
      name: 'Grace Community - Northside',
      church: 'Grace Community Church',
      churchId: 1,
      pastor: 'Rev. Robert Lee',
      address: '321 North Road, Northside Springfield, IL 62703',
      phone: '+1 (555) 333-4444',
      email: 'northside@gracecommunity.org',
      members: 420,
      capacity: 600,
      established: '2018',
      status: 'active',
      services: ['Sunday 9:30 AM', 'Sunday 11:30 AM'],
      growth: 15.7,
      lastActivity: '30 minutes ago',
    },
    {
      id: 4,
      name: 'Faith Baptist - East Campus',
      church: 'Faith Baptist Church',
      churchId: 2,
      pastor: 'Rev. Michael Davis',
      address: '654 East Boulevard, East Springfield, IL 62704',
      phone: '+1 (555) 444-5555',
      email: 'east@faithbaptist.org',
      members: 720,
      capacity: 900,
      established: '2012',
      status: 'active',
      services: ['Sunday 8:30 AM', 'Sunday 10:30 AM', 'Sunday 6:00 PM'],
      growth: 10.2,
      lastActivity: '45 minutes ago',
    },
    {
      id: 5,
      name: 'Faith Baptist - South Campus',
      church: 'Faith Baptist Church',
      churchId: 2,
      pastor: 'Rev. Lisa Wilson',
      address: '987 South Street, South Springfield, IL 62705',
      phone: '+1 (555) 555-6666',
      email: 'south@faithbaptist.org',
      members: 580,
      capacity: 750,
      established: '2016',
      status: 'active',
      services: ['Sunday 9:00 AM', 'Sunday 11:00 AM'],
      growth: 7.8,
      lastActivity: '1 hour ago',
    },
    {
      id: 6,
      name: 'Trinity Presbyterian - Branch Campus',
      church: 'Trinity Presbyterian',
      churchId: 4,
      pastor: 'Rev. James Miller',
      address: '147 Branch Avenue, Springfield, IL 62706',
      phone: '+1 (555) 666-7777',
      email: 'branch@trinitypresby.org',
      members: 380,
      capacity: 500,
      established: '2019',
      status: 'pending',
      services: ['Sunday 10:00 AM'],
      growth: 5.4,
      lastActivity: '3 hours ago',
    },
  ];

  const churches = [
    { id: 1, name: 'Grace Community Church' },
    { id: 2, name: 'Faith Baptist Church' },
    { id: 3, name: 'Hope Methodist Church' },
    { id: 4, name: 'Trinity Presbyterian' },
    { id: 5, name: 'New Life Assembly' },
  ];

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChurch =
      churchFilter === 'all' || branch.churchId.toString() === churchFilter;
    const matchesStatus =
      statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesChurch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCapacityColor = (members: number, capacity: number) => {
    const percentage = (members / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
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
            Manage all church branches and their locations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
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
            <div className="font-bold text-2xl">{branches.length}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+3</span> new this quarter
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
              {branches
                .reduce((sum, branch) => sum + branch.members, 0)
                .toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+9.8%</span> from last month
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
            <div className="font-bold text-2xl">
              {branches
                .reduce((sum, branch) => sum + branch.capacity, 0)
                .toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Across all branch locations
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
            <div className="font-bold text-2xl">
              {Math.round(
                (branches.reduce((sum, branch) => sum + branch.members, 0) /
                  branches.reduce((sum, branch) => sum + branch.capacity, 0)) *
                  100
              )}
              %
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Directory</CardTitle>
          <CardDescription>
            Complete list of all church branches with location and performance
            data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center space-x-4">
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
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
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
                  <TableHead>Growth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={'/placeholder.svg?height=40&width=40'}
                          />
                          <AvatarFallback>
                            {branch.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{branch.name}</div>
                          <div className="text-muted-foreground text-sm">
                            Est. {branch.established}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{branch.church}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{branch.pastor}</div>
                        <div className="text-muted-foreground text-sm">
                          Branch Pastor
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-2">
                        <Map className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="text-sm">{branch.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-3 w-3" />
                          {branch.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {branch.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        {branch.members.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Building2 className="mr-1 h-4 w-4 text-muted-foreground" />
                          {branch.capacity.toLocaleString()}
                        </div>
                        <div
                          className={`text-xs ${getCapacityColor(branch.members, branch.capacity)}`}
                        >
                          {Math.round((branch.members / branch.capacity) * 100)}
                          % occupied
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />+{branch.growth}%
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Members
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Services
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate Branch
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
    </div>
  );
}
