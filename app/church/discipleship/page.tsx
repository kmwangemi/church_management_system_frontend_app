'use client';

import { AddDiscipleForm } from '@/components/forms/add-disciple-form';
import { AddMentorForm } from '@/components/forms/add-mentor-form';
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
import { Progress } from '@/components/ui/progress';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Award,
  BookOpen,
  Calendar,
  Edit,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteDisciple,
  useDisciples,
} from '@/lib/hooks/church/disciple/use-disciple-queries';

// Mock data
const disciples = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    avatar: '/placeholder.svg?height=40&width=40',
    mentor: 'Pastor Michael Brown',
    startDate: '2023-06-15',
    currentLevel: 'Growing',
    progress: 65,
    completedClasses: 8,
    totalClasses: 12,
    lastActivity: '2024-01-05',
    milestones: ['Baptism', 'Bible Study Completion'],
    status: 'Active',
    followUpCount: 3,
    lastContact: '2024-12-18',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    avatar: '/placeholder.svg?height=40&width=40',
    mentor: 'David Wilson',
    startDate: '2023-09-20',
    currentLevel: 'New Convert',
    progress: 35,
    completedClasses: 4,
    totalClasses: 12,
    lastActivity: '2024-01-07',
    milestones: ['First Prayer'],
    status: 'Active',
    followUpCount: 3,
    lastContact: '2024-12-18',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    avatar: '/placeholder.svg?height=40&width=40',
    mentor: 'Sarah Johnson',
    startDate: '2022-12-10',
    currentLevel: 'Mature',
    progress: 95,
    completedClasses: 12,
    totalClasses: 12,
    lastActivity: '2024-01-06',
    milestones: [
      'Baptism',
      'Bible Study Completion',
      'Leadership Training',
      'Ministry Assignment',
    ],
    status: 'Graduated',
    followUpCount: 3,
    lastContact: '2024-12-18',
  },
];

const classes = [
  {
    id: 1,
    name: 'New Believers Class',
    instructor: 'Pastor Sarah',
    level: 'Beginner',
    duration: '8 weeks',
    currentStudents: 12,
    maxCapacity: 15,
    startDate: '2024-01-15',
    endDate: '2024-03-10',
    status: 'Active',
    progress: 75,
  },
  {
    id: 2,
    name: 'Growing in Faith',
    instructor: 'Elder Mike',
    level: 'Intermediate',
    duration: '12 weeks',
    currentStudents: 8,
    maxCapacity: 12,
    startDate: '2024-02-01',
    endDate: '2024-04-25',
    status: 'Active',
    progress: 60,
  },
  {
    id: 3,
    name: 'Leadership Development',
    instructor: 'Pastor John',
    level: 'Advanced',
    duration: '16 weeks',
    currentStudents: 6,
    maxCapacity: 10,
    startDate: '2024-03-01',
    endDate: '2024-06-20',
    status: 'Active',
    progress: 40,
  },
  {
    id: 4,
    name: 'Bible Study Foundations',
    instructor: 'Teacher Anna',
    level: 'Beginner',
    duration: '6 weeks',
    currentStudents: 0,
    maxCapacity: 20,
    startDate: '2025-01-15',
    endDate: '2025-02-25',
    status: 'Scheduled',
    progress: 0,
  },
];

const mentors = [
  {
    id: 1,
    name: 'Mary Wilson',
    email: 'mary@email.com',
    phone: '+1234567893',
    experience: '5 years',
    currentMentees: 3,
    maxCapacity: 5,
    specialization: 'New Converts',
    status: 'Active',
  },
  {
    id: 2,
    name: 'David Smith',
    email: 'david@email.com',
    phone: '+1234567894',
    experience: '8 years',
    currentMentees: 4,
    maxCapacity: 6,
    specialization: 'Youth Ministry',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Linda Johnson',
    email: 'linda@email.com',
    phone: '+1234567895',
    experience: '3 years',
    currentMentees: 2,
    maxCapacity: 4,
    specialization: "Women's Ministry",
    status: 'Active',
  },
];

export default function DiscipleshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('disciples');
  const [isAddDiscipleDialogOpen, setIsAddDiscipleDialogOpen] = useState(false);
  const [isAddMentorDialogOpen, setIsAddMentorDialogOpen] = useState(false);

  const { data: disciplesData } = useDisciples({ search: searchTerm });
  const { mutate: deleteDisciple } = useDeleteDisciple();

  const serverDisciples =
    (disciplesData as any)?.data?.disciples ||
    (disciplesData as any)?.disciples ||
    (disciplesData as any)?.data;
  const activeDisciples =
    serverDisciples && serverDisciples.length > 0
      ? serverDisciples
      : disciplesData
        ? []
        : disciples;

  const filteredDisciples = activeDisciples.filter(
    (disciple: any) =>
      (disciple.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (disciple.mentor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelBadge = (level: string) => {
    const colors = {
      'New Convert': 'bg-blue-100 text-blue-800',
      Growing: 'bg-green-100 text-green-800',
      Mature: 'bg-purple-100 text-purple-800',
      Leader: 'bg-orange-100 text-orange-800',
    };
    return (
      <Badge
        className={
          colors[level as keyof typeof colors] || 'bg-muted text-foreground'
        }
      >
        {level}
      </Badge>
    );
  };

  // const getStatusBadge = (status: string) => {
  //   return status === 'Active' ? (
  //     <Badge className="bg-green-100 text-green-800">Active</Badge>
  //   ) : status === 'Graduated' ? (
  //     <Badge className="bg-blue-100 text-blue-800">Graduated</Badge>
  //   ) : (
  //     <Badge className="bg-muted text-foreground">Inactive</Badge>
  //   );
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Graduated':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Inactive':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const stats = {
    totalDisciples: disciples.length,
    activeDisciples: disciples.filter((d) => d.status === 'Active').length,
    graduated: disciples.filter((d) => d.status === 'Graduated').length,
    averageProgress: Math.round(
      disciples.reduce((sum, d) => sum + d.progress, 0) / disciples.length
    ),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Discipleship & Follow-up
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track new converts, spiritual growth and manage discipleship
            programs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog
            onOpenChange={setIsAddMentorDialogOpen}
            open={isAddMentorDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Award className="mr-2 h-4 w-4" />
                Add Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Mentor</DialogTitle>
                <DialogDescription>
                  Create a new discipleship mentor
                </DialogDescription>
              </DialogHeader>
              <AddMentorForm
                onCloseDialog={() => setIsAddMentorDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Discipleship Class</DialogTitle>
                <DialogDescription>
                  Set up a new discipleship class or program.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="className">
                    Class Name
                  </Label>
                  <Input className="col-span-3" id="className" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="instructor">
                    Instructor
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pastor1">Pastor John</SelectItem>
                      <SelectItem value="pastor2">Pastor Sarah</SelectItem>
                      <SelectItem value="elder1">Elder Mike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="level">
                    Level
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="duration">
                    Duration
                  </Label>
                  <Input
                    className="col-span-3"
                    id="duration"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="capacity">
                    Max Capacity
                  </Label>
                  <Input className="col-span-3" id="capacity" type="number" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="startDate">
                    Start Date
                  </Label>
                  <Input className="col-span-3" id="startDate" type="date" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="classDescription">
                    Description
                  </Label>
                  <Textarea className="col-span-3" id="classDescription" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Class</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={setIsAddDiscipleDialogOpen}
            open={isAddDiscipleDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Disciple
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Disciple</DialogTitle>
                <DialogDescription>
                  Add a new person to the discipleship program
                </DialogDescription>
              </DialogHeader>
              <AddDiscipleForm
                onCloseDialog={() => setIsAddDiscipleDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              New Converts
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalDisciples}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">This year</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Classes
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalDisciples}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Currently running</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Disciples
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.activeDisciples}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Currently active</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Graduated
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.graduated}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Completed program</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Mentors
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.averageProgress}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Available mentors</p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Card>
        <CardHeader />
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="disciples">Disciples</TabsTrigger>
              <TabsTrigger value="classes">Discipleship Classes</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value="disciples">
              <Card>
                <CardHeader>
                  <CardTitle>Discipleship Tracking</CardTitle>
                  <CardDescription>
                    Monitor and follow up with discipleship
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                      <Input
                        className="pl-10"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search disciples, mentors, or classes..."
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
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Disciple</TableHead>
                          <TableHead>Mentor</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Follow-ups</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Classes</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDisciples.map((disciple: any) => (
                          <TableRow
                            className="hover:bg-accent"
                            key={disciple.id}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    alt={disciple.name}
                                    src={disciple.avatar || '/placeholder.svg'}
                                  />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {(disciple.name || 'D')
                                      .split(' ')
                                      .map((n: string) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {disciple.name}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {disciple.email}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    Started:{' '}
                                    {new Date(
                                      disciple.startDate
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-sm">
                                {disciple.mentor}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getLevelBadge(disciple.currentLevel)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {disciple.followUpCount} visits
                              </Badge>
                            </TableCell>
                            <TableCell>{disciple.lastContact}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <span className="font-medium">
                                  {disciple.completedClasses}/
                                  {disciple.totalClasses}
                                </span>
                                <p className="text-muted-foreground">
                                  classes completed
                                </p>
                              </div>
                            </TableCell>
                            {/* <TableCell>{getStatusBadge(disciple.status)}</TableCell> */}
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className="h-8 w-8 p-0"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Update
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => {
                                      const targetId = disciple._id || disciple.id;
                                      if (targetId) deleteDisciple(targetId);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove from Program
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
            </TabsContent>
            <TabsContent className="space-y-4" value="classes">
              <Card>
                <CardHeader>
                  <CardTitle>Discipleship Classes</CardTitle>
                  <CardDescription>
                    Manage discipleship programs and class progression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <Card key={classItem.id}>
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">
                                  {classItem.name}
                                </h3>
                                <Badge
                                  className={getLevelColor(classItem.level)}
                                >
                                  {classItem.level}
                                </Badge>
                                <Badge
                                  className={getStatusColor(classItem.status)}
                                >
                                  {classItem.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Instructor: {classItem.instructor} • Duration:{' '}
                                {classItem.duration}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-sm">
                                {classItem.currentStudents}/
                                {classItem.maxCapacity} students
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {classItem.startDate} - {classItem.endDate}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{classItem.progress}%</span>
                            </div>
                            <Progress
                              className="h-2"
                              value={classItem.progress}
                            />
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Users className="mr-2 h-4 w-4" />
                              View Students
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-4" value="mentors">
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Management</CardTitle>
                  <CardDescription>
                    Manage mentors and their assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Current Load</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentors.map((mentor) => (
                        <TableRow key={mentor.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {mentor.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{mentor.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>{mentor.email}</div>
                              <div className="text-muted-foreground">
                                {mentor.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{mentor.experience}</TableCell>
                          <TableCell>{mentor.specialization}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {mentor.currentMentees}/{mentor.maxCapacity}{' '}
                                mentees
                              </div>
                              <Progress
                                className="h-1"
                                value={
                                  (mentor.currentMentees / mentor.maxCapacity) *
                                  100
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(mentor.status)}>
                              {mentor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                Assign
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
            <TabsContent className="space-y-4" value="progress">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Progress Overview</CardTitle>
                    <CardDescription>
                      Track progress across all discipleship classes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classes
                        .filter((c) => c.status === 'Active')
                        .map((classItem) => (
                          <div className="space-y-2" key={classItem.id}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {classItem.name}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {classItem.progress}%
                              </span>
                            </div>
                            <Progress
                              className="h-2"
                              value={classItem.progress}
                            />
                            <div className="text-muted-foreground text-xs">
                              {classItem.currentStudents} students •{' '}
                              {classItem.instructor}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Follow-up Statistics</CardTitle>
                    <CardDescription>
                      Disciple follow-up metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Disciples</span>
                        <span className="font-bold">{disciples.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Follow-ups</span>
                        <span className="font-bold">
                          {
                            disciples.filter((c) => c.status === 'Active')
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Graduated</span>
                        <span className="font-bold">
                          {
                            disciples.filter((c) => c.status === 'Graduated')
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Average Follow-ups</span>
                        <span className="font-bold">
                          {Math.round(
                            disciples.reduce(
                              (sum, c) => sum + c.followUpCount,
                              0
                            ) / disciples.length
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mentor Utilization</span>
                        <span className="font-bold">
                          {Math.round(
                            (mentors.reduce(
                              (sum, m) => sum + m.currentMentees,
                              0
                            ) /
                              mentors.reduce(
                                (sum, m) => sum + m.maxCapacity,
                                0
                              )) *
                              100
                          )}
                          %
                        </span>
                      </div>
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
