'use client';

import { AddPrayerRequestForm } from '@/components/forms/add-prayer-request-form';
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
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeletePrayerRequest,
  useFetchPrayerRequests,
  useUpdatePrayerCount,
} from '@/lib/hooks/church/prayer-request/use-prayer-request-queries';

// Mock data
const prayerRequests = [
  {
    id: 1,
    title: "Healing for John's Surgery",
    description:
      "Please pray for John Smith's upcoming heart surgery scheduled for next week. Pray for the doctors and a successful recovery.",
    category: 'Health',
    priority: 'High',
    status: 'Active',
    requester: 'Sarah Johnson',
    requesterAvatar: '/placeholder.svg?height=40&width=40',
    dateSubmitted: '2024-01-05',
    lastUpdate: '2024-01-07',
    isAnonymous: false,
    prayerCount: 23,
    updates: [
      { date: '2024-01-07', message: 'Surgery went well, now in recovery' },
    ],
  },
  {
    id: 2,
    title: 'Job Search Guidance',
    description:
      "Seeking God's guidance in finding new employment opportunities. Pray for open doors and wisdom in decision making.",
    category: 'Career',
    priority: 'Medium',
    status: 'Active',
    requester: 'Anonymous',
    requesterAvatar: null,
    dateSubmitted: '2024-01-03',
    lastUpdate: '2024-01-03',
    isAnonymous: true,
    prayerCount: 15,
    updates: [],
  },
  {
    id: 3,
    title: 'Family Reconciliation',
    description:
      "Please pray for healing and restoration in our family relationships. There has been tension and we need God's peace.",
    category: 'Family',
    priority: 'High',
    status: 'Active',
    requester: 'David Wilson',
    requesterAvatar: '/placeholder.svg?height=40&width=40',
    dateSubmitted: '2024-01-02',
    lastUpdate: '2024-01-06',
    isAnonymous: false,
    prayerCount: 31,
    updates: [
      {
        date: '2024-01-06',
        message: 'Had a good conversation with my brother, progress being made',
      },
    ],
  },
  {
    id: 4,
    title: 'Thanksgiving for New Baby',
    description:
      'Praise God for the safe arrival of our baby daughter! Thank you for all the prayers during pregnancy.',
    category: 'Thanksgiving',
    priority: 'Low',
    status: 'Answered',
    requester: 'Emily Davis',
    requesterAvatar: '/placeholder.svg?height=40&width=40',
    dateSubmitted: '2023-12-20',
    lastUpdate: '2024-01-01',
    isAnonymous: false,
    prayerCount: 45,
    updates: [
      {
        date: '2024-01-01',
        message:
          "Baby arrived safely on New Year's Day! Thank you for all prayers.",
      },
    ],
  },
];

const counselors = [
  {
    id: 1,
    name: 'Pastor John Smith',
    email: 'pastor.john@church.com',
    phone: '+1234567890',
    specialization: ['General Counseling', 'Marriage', 'Family'],
    currentCases: 8,
    maxCapacity: 12,
    status: 'Available',
    experience: '15 years',
  },
  {
    id: 2,
    name: 'Pastor Sarah Johnson',
    email: 'pastor.sarah@church.com',
    phone: '+1234567891',
    specialization: ['Youth Counseling', 'Career Guidance', "Women's Issues"],
    currentCases: 6,
    maxCapacity: 10,
    status: 'Available',
    experience: '8 years',
  },
  {
    id: 3,
    name: 'Elder Mike Wilson',
    email: 'elder.mike@church.com',
    phone: '+1234567892',
    specialization: [
      'Marriage Counseling',
      'Addiction Recovery',
      "Men's Issues",
    ],
    currentCases: 10,
    maxCapacity: 10,
    status: 'Full',
    experience: '12 years',
  },
];

const prayerCategories = [
  { name: 'Health', count: 15, color: 'bg-red-100 text-red-800' },
  { name: 'Financial', count: 8, color: 'bg-green-100 text-green-800' },
  { name: 'Relationship', count: 12, color: 'bg-blue-100 text-blue-800' },
  { name: 'Career', count: 6, color: 'bg-purple-100 text-purple-800' },
  { name: 'Spiritual', count: 9, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Family', count: 11, color: 'bg-pink-100 text-pink-800' },
];

export default function PrayerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('requests');
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false);

  const { data: prayersData } = useFetchPrayerRequests({ search: searchTerm });
  const { mutate: updatePrayerCount } = useUpdatePrayerCount();
  const { mutate: deletePrayerRequest } = useDeletePrayerRequest();

  const serverPrayers =
    (prayersData as any)?.data?.prayerRequests ||
    (prayersData as any)?.prayerRequests ||
    (prayersData as any)?.data;
  const activePrayers =
    serverPrayers && serverPrayers.length > 0
      ? serverPrayers
      : prayersData
        ? []
        : prayerRequests;

  const filteredRequests = activePrayers.filter(
    (request: any) =>
      (request.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requester || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'Answered':
        return <Badge className="bg-green-100 text-green-800">Answered</Badge>;
      case 'Closed':
        return <Badge className="bg-muted text-foreground">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Answered':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-muted text-foreground';
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const stats = {
    totalRequests: prayerRequests.length,
    activeRequests: prayerRequests.filter((r) => r.status === 'Active').length,
    answeredRequests: prayerRequests.filter((r) => r.status === 'Answered')
      .length,
    totalPrayers: prayerRequests.reduce((sum, r) => sum + r.prayerCount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Prayer Requests & Counseling
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage prayer requests and counseling assignments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Counselor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Counselor</DialogTitle>
                <DialogDescription>
                  Register a new counselor for prayer and guidance ministry.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="counselorName">
                    Name
                  </Label>
                  <Input className="col-span-3" id="counselorName" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="counselorEmail">
                    Email
                  </Label>
                  <Input
                    className="col-span-3"
                    id="counselorEmail"
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="counselorPhone">
                    Phone
                  </Label>
                  <Input className="col-span-3" id="counselorPhone" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="specialization">
                    Specialization
                  </Label>
                  <Input
                    className="col-span-3"
                    id="specialization"
                    placeholder="e.g., Marriage, Youth"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="maxCapacity">
                    Max Cases
                  </Label>
                  <Input
                    className="col-span-3"
                    id="maxCapacity"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="experience">
                    Experience
                  </Label>
                  <Input
                    className="col-span-3"
                    id="experience"
                    placeholder="e.g., 5 years"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Add Counselor</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={setIsAddRequestDialogOpen}
            open={isAddRequestDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Prayer Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Prayer Request</DialogTitle>
                <DialogDescription>
                  Submit a new prayer request for the church community
                </DialogDescription>
              </DialogHeader>
              <AddPrayerRequestForm
                onCloseDialog={() => setIsAddRequestDialogOpen(false)}
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
              Total Requests
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalRequests}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Requests
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.activeRequests}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Needs prayer</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Answered Prayers
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.answeredRequests}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Praise reports</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Counselors
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.totalPrayers}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Available for counseling
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests">Prayer Requests</TabsTrigger>
              <TabsTrigger value="counselors">Counselors</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value="requests">
              <CardHeader>
                <CardTitle>Prayer Requests</CardTitle>
                <CardDescription>
                  Manage and assign prayer requests to counselors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                    <Input
                      className="pl-10"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search prayer requests..."
                      value={searchTerm}
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prayers</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request: any) => (
                        <TableRow className="hover:bg-accent" key={request.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">
                                {request.title}
                              </div>
                              <div className="max-w-xs truncate text-muted-foreground text-sm">
                                {request.description}
                              </div>
                              <div className="flex items-center space-x-2">
                                {!request.isAnonymous &&
                                  request.requesterAvatar && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        alt={request.requester}
                                        src={
                                          request.requesterAvatar ||
                                          '/placeholder.svg'
                                        }
                                      />
                                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                        {(request.requester || 'P')
                                          .split(' ')
                                          .map((n: string) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                <span className="text-muted-foreground text-sm">
                                  {request.isAnonymous
                                    ? 'Anonymous'
                                    : request.requester}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(request.priority)}
                          </TableCell>

                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="font-medium">
                                {request.prayerCount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(
                                  request.dateSubmitted
                                ).toLocaleDateString()}
                              </span>
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
                                  onClick={() => {
                                    const targetId = request._id || request.id;
                                    if (targetId) updatePrayerCount(targetId);
                                  }}
                                >
                                  <Heart className="mr-2 h-4 w-4" />
                                  Pray for This
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Add Update
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Answered
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => {
                                    const targetId = request._id || request.id;
                                    if (targetId) deletePrayerRequest(targetId);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Request
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
            </TabsContent>
            <TabsContent className="space-y-4" value="counselors">
              <Card>
                <CardHeader>
                  <CardTitle>Counselor Management</CardTitle>
                  <CardDescription>
                    Manage counselors and their case assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Counselor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Current Cases</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {counselors.map((counselor) => (
                        <TableRow key={counselor.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {counselor.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {counselor.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>{counselor.email}</div>
                              <div className="text-muted-foreground">
                                {counselor.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {counselor.specialization
                                .slice(0, 2)
                                .map((spec) => (
                                  <Badge
                                    className="text-xs"
                                    key={spec}
                                    variant="secondary"
                                  >
                                    {spec}
                                  </Badge>
                                ))}
                              {counselor.specialization.length > 2 && (
                                <Badge className="text-xs" variant="outline">
                                  +{counselor.specialization.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {counselor.currentCases}/{counselor.maxCapacity}{' '}
                                cases
                              </div>
                              <div className="h-1 w-full rounded-full bg-secondary">
                                <div
                                  className="h-1 rounded-full bg-blue-600"
                                  style={{
                                    width: `${(counselor.currentCases / counselor.maxCapacity) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{counselor.experience}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(counselor.status)}>
                              {counselor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                View Cases
                              </Button>
                              <Button size="sm" variant="ghost">
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-4" value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Prayer Categories</CardTitle>
                  <CardDescription>
                    Overview of prayer request categories and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prayerCategories.map((category) => (
                      <Card key={category.name}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-muted-foreground text-sm">
                                Prayer requests
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-2xl">
                                {category.count}
                              </div>
                              <Badge
                                className={category.color}
                                variant="secondary"
                              >
                                Active
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="mt-6" value="analytics">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Health</span>
                        <span className="text-muted-foreground text-sm">1 request</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-red-600"
                          style={{ width: '25%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Family</span>
                        <span className="text-muted-foreground text-sm">1 request</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '25%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Career</span>
                        <span className="text-muted-foreground text-sm">1 request</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '25%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Thanksgiving
                        </span>
                        <span className="text-muted-foreground text-sm">1 request</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-yellow-600"
                          style={{ width: '25%' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Counselor Workload</CardTitle>
                    <CardDescription>
                      Current case distribution among counselors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {counselors.map((counselor) => (
                        <div className="space-y-2" key={counselor.id}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {counselor.name}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {counselor.currentCases}/{counselor.maxCapacity}{' '}
                              cases
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{
                                width: `${(counselor.currentCases / counselor.maxCapacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
