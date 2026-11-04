'use client';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteVolunteer,
  useDeleteVolunteerRole,
  useFetchVolunteerRoles,
  useFetchVolunteers,
  useRegisterVolunteer,
  useRegisterVolunteerRole,
} from '@/lib/hooks/church/volunteer/use-volunteer-queries';

export default function VolunteersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volSkills, setVolSkills] = useState<string[]>([]);
  const [volAvailability, setVolAvailability] = useState<string[]>([]);
  const [volNotes, setVolNotes] = useState('');
  const [isAddVolOpen, setIsAddVolOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDepartment, setTaskDepartment] = useState('General');
  const [neededVolunteers, setNeededVolunteers] = useState('2');
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const { data: volData } = useFetchVolunteers(1, searchTerm);
  const { mutate: registerVolunteer, isPending: isRegisteringVol } = useRegisterVolunteer();
  const { mutate: deleteVolunteer } = useDeleteVolunteer();

  const { data: rolesData } = useFetchVolunteerRoles(1, '');
  const { mutate: registerVolunteerRole, isPending: isRegisteringRole } = useRegisterVolunteerRole();
  const { mutate: deleteVolunteerRole } = useDeleteVolunteerRole();

  const volunteers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '+1234567890',
      skills: ['Music', 'Teaching', 'Administration'],
      availability: ['Sunday Morning', 'Wednesday Evening'],
      currentRoles: ['Choir Member', 'Sunday School Teacher'],
      joinDate: '2023-01-15',
      status: 'Active',
      hoursThisMonth: 24,
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael@email.com',
      phone: '+1234567891',
      skills: ['Technical', 'Sound', 'Video'],
      availability: ['Sunday Morning', 'Friday Evening'],
      currentRoles: ['Sound Technician'],
      joinDate: '2022-08-20',
      status: 'Active',
      hoursThisMonth: 16,
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@email.com',
      phone: '+1234567892',
      skills: ['Hospitality', 'Cooking', 'Event Planning'],
      availability: ['Saturday', 'Sunday'],
      currentRoles: ['Event Coordinator', 'Kitchen Helper'],
      joinDate: '2023-03-10',
      status: 'Active',
      hoursThisMonth: 32,
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@email.com',
      phone: '+1234567893',
      skills: ['Security', 'Ushering', 'Parking'],
      availability: ['Sunday Morning'],
      currentRoles: ['Head Usher'],
      joinDate: '2021-11-05',
      status: 'Inactive',
      hoursThisMonth: 0,
    },
  ];
  const volunteerRoles = [
    {
      id: 1,
      title: 'Sunday School Teacher',
      department: "Children's Ministry",
      requiredSkills: ['Teaching', 'Patience', 'Child Care'],
      timeCommitment: '2 hours/week',
      currentVolunteers: 8,
      neededVolunteers: 2,
      priority: 'High',
      description: 'Teach children ages 6-12 during Sunday morning service',
    },
    {
      id: 2,
      title: 'Sound Technician',
      department: 'Technical Ministry',
      requiredSkills: ['Technical', 'Sound', 'Equipment'],
      timeCommitment: '3 hours/week',
      currentVolunteers: 4,
      neededVolunteers: 2,
      priority: 'Medium',
      description: 'Operate sound equipment during services and events',
    },
    {
      id: 3,
      title: 'Parking Attendant',
      department: 'Hospitality',
      requiredSkills: ['Customer Service', 'Organization'],
      timeCommitment: '2 hours/week',
      currentVolunteers: 6,
      neededVolunteers: 4,
      priority: 'High',
      description: 'Direct traffic and assist with parking during services',
    },
    {
      id: 4,
      title: 'Kitchen Helper',
      department: 'Hospitality',
      requiredSkills: ['Cooking', 'Food Safety', 'Teamwork'],
      timeCommitment: '4 hours/month',
      currentVolunteers: 12,
      neededVolunteers: 0,
      priority: 'Low',
      description: 'Assist with meal preparation for church events',
    },
  ];

  const serverVols = (volData as any)?.volunteers || (volData as any)?.data;
  const activeVolunteers = serverVols && serverVols.length > 0 ? serverVols : (volData ? [] : volunteers);

  const serverRoles = (rolesData as any)?.roles || (rolesData as any)?.data;
  const activeRoles = serverRoles && serverRoles.length > 0 ? serverRoles : (rolesData ? [] : volunteerRoles);
  const upcomingTasks = [
    {
      id: 1,
      title: 'Christmas Service Setup',
      date: '2024-12-24',
      time: '8:00 AM',
      assignedVolunteers: ['Sarah Johnson', 'Michael Brown', 'Emily Davis'],
      requiredVolunteers: 8,
      status: 'Scheduled',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Youth Event Cleanup',
      date: '2024-12-23',
      time: '9:00 PM',
      assignedVolunteers: ['David Wilson'],
      requiredVolunteers: 4,
      status: 'Needs Volunteers',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'New Year Service Preparation',
      date: '2024-12-31',
      time: '6:00 PM',
      assignedVolunteers: [],
      requiredVolunteers: 6,
      status: 'Open',
      priority: 'Medium',
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-muted text-foreground';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Needs Volunteers':
        return 'bg-yellow-100 text-yellow-800';
      case 'Open':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-muted text-foreground';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-foreground';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Volunteer & Service Management
          </h1>
          <p className="text-muted-foreground">
            Manage volunteers, roles, and service scheduling
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog onOpenChange={setIsAddVolOpen} open={isAddVolOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Volunteer</DialogTitle>
                <DialogDescription>
                  Register a new volunteer and their skills.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerName">
                    Name
                  </Label>
                  <Input
                    className="col-span-3"
                    id="volunteerName"
                    onChange={(e) => setVolName(e.target.value)}
                    value={volName}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerEmail">
                    Email
                  </Label>
                  <Input
                    className="col-span-3"
                    id="volunteerEmail"
                    onChange={(e) => setVolEmail(e.target.value)}
                    type="email"
                    value={volEmail}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerPhone">
                    Phone
                  </Label>
                  <Input
                    className="col-span-3"
                    id="volunteerPhone"
                    onChange={(e) => setVolPhone(e.target.value)}
                    value={volPhone}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Skills</Label>
                  <div className="col-span-3 space-y-2">
                    {[
                      'Music',
                      'Teaching',
                      'Technical',
                      'Hospitality',
                      'Administration',
                      'Security',
                    ].map((skill) => (
                      <div className="flex items-center space-x-2" key={skill}>
                        <Checkbox
                          checked={volSkills.includes(skill)}
                          id={skill}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVolSkills([...volSkills, skill]);
                            } else {
                              setVolSkills(volSkills.filter((s) => s !== skill));
                            }
                          }}
                        />
                        <Label className="text-sm" htmlFor={skill}>
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Availability</Label>
                  <div className="col-span-3 space-y-2">
                    {[
                      'Sunday Morning',
                      'Sunday Evening',
                      'Wednesday Evening',
                      'Friday Evening',
                      'Saturday',
                    ].map((time) => (
                      <div className="flex items-center space-x-2" key={time}>
                        <Checkbox
                          checked={volAvailability.includes(time)}
                          id={time}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVolAvailability([...volAvailability, time]);
                            } else {
                              setVolAvailability(
                                volAvailability.filter((t) => t !== time)
                              );
                            }
                          }}
                        />
                        <Label className="text-sm" htmlFor={time}>
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerNotes">
                    Notes
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="volunteerNotes"
                    onChange={(e) => setVolNotes(e.target.value)}
                    value={volNotes}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsAddVolOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isRegisteringVol || !volName}
                  onClick={() => {
                    registerVolunteer(
                      {
                        volunteerName: volName,
                        volunteerEmail: volEmail,
                        volunteerPhone: volPhone,
                        skills: volSkills,
                        availability: volAvailability,
                      },
                      {
                        onSuccess: () => {
                          setIsAddVolOpen(false);
                          setVolName('');
                          setVolEmail('');
                          setVolPhone('');
                          setVolSkills([]);
                          setVolAvailability([]);
                          setVolNotes('');
                        },
                      }
                    );
                  }}
                >
                  {isRegisteringVol && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Volunteer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog onOpenChange={setIsTaskOpen} open={isTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role / Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Volunteer Role / Task</DialogTitle>
                <DialogDescription>
                  Schedule a new position or service opportunity.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="taskTitle">
                    Title
                  </Label>
                  <Input
                    className="col-span-3"
                    id="taskTitle"
                    onChange={(e) => setTaskTitle(e.target.value)}
                    value={taskTitle}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="taskDepartment">
                    Ministry
                  </Label>
                  <Input
                    className="col-span-3"
                    id="taskDepartment"
                    onChange={(e) => setTaskDepartment(e.target.value)}
                    placeholder="e.g. Children's Ministry"
                    value={taskDepartment}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="requiredVolunteers">
                    Volunteers Needed
                  </Label>
                  <Input
                    className="col-span-3"
                    id="requiredVolunteers"
                    onChange={(e) => setNeededVolunteers(e.target.value)}
                    type="number"
                    value={neededVolunteers}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="taskPriority">
                    Priority
                  </Label>
                  <Select onValueChange={setTaskPriority} value={taskPriority}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="taskDescription">
                    Description
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="taskDescription"
                    onChange={(e) => setTaskDesc(e.target.value)}
                    value={taskDesc}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsTaskOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isRegisteringRole || !taskTitle}
                  onClick={() => {
                    registerVolunteerRole(
                      {
                        role: taskTitle,
                        department: taskDepartment,
                        priority: taskPriority,
                        description: taskDesc,
                        neededVolunteers: parseInt(neededVolunteers, 10) || 2,
                      },
                      {
                        onSuccess: () => {
                          setIsTaskOpen(false);
                          setTaskTitle('');
                          setTaskDesc('');
                        },
                      }
                    );
                  }}
                >
                  {isRegisteringRole && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Volunteer Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Volunteers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">156</div>
            <p className="text-muted-foreground text-xs">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Volunteers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">142</div>
            <p className="text-muted-foreground text-xs">91% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Hours This Month
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1,247</div>
            <p className="text-muted-foreground text-xs">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Open Positions
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8</div>
            <p className="text-muted-foreground text-xs">Need volunteers</p>
          </CardContent>
        </Card>
      </div>
      <Tabs className="space-y-4" defaultValue="volunteers">
        <TabsList>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="roles">Volunteer Roles</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Scheduling</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-4" value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Directory</CardTitle>
              <CardDescription>
                Manage volunteer information and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search volunteers..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Current Roles</TableHead>
                    <TableHead>Hours This Month</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeVolunteers.map((volunteer: any) => (
                    <TableRow key={volunteer.id || volunteer._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {(volunteer.name || 'V')
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">
                              {volunteer.name}
                            </span>
                            <div className="text-muted-foreground text-xs">
                              Joined {volunteer.joinDate || 'Recently'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{volunteer.email || 'N/A'}</div>
                          <div className="text-muted-foreground">
                            {volunteer.phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(volunteer.skills || []).slice(0, 2).map((skill: string) => (
                            <Badge
                              className="text-xs"
                              key={skill}
                              variant="secondary"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {(volunteer.skills || []).length > 2 && (
                            <Badge className="text-xs" variant="outline">
                              +{(volunteer.skills || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {(volunteer.currentRoles || ['Volunteer']).map((role: string) => (
                            <div className="text-sm" key={role}>
                              {role}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {volunteer.hoursThisMonth || 0}h
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(volunteer.status || 'Active')}>
                          {volunteer.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              const targetId = volunteer._id || volunteer.id;
                              if (targetId) deleteVolunteer(targetId);
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
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
        <TabsContent className="space-y-4" value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Roles</CardTitle>
              <CardDescription>
                Manage volunteer positions and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRoles.map((role: any) => (
                  <Card key={role.id || role._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{role.title}</h3>
                            <Badge variant="outline">{role.department || 'General'}</Badge>
                            <Badge className={getPriorityColor(role.priority || 'Medium')}>
                              {role.priority || 'Medium'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {role.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>Time: {role.timeCommitment || 'Flexible'}</span>
                            <span>
                              Volunteers: {role.currentVolunteers || 0}/
                              {(role.currentVolunteers || 0) + (role.neededVolunteers || 0)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(role.requiredSkills || []).map((skill: string) => (
                              <Badge
                                className="text-xs"
                                key={skill}
                                variant="secondary"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              const targetId = role._id || role.id;
                              if (targetId) deleteVolunteerRole(targetId);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-4" value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                Schedule and assign volunteer tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {task.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {task.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {task.assignedVolunteers.length}/
                              {task.requiredVolunteers} volunteers
                            </div>
                          </div>
                          {task.assignedVolunteers.length > 0 && (
                            <div className="space-y-1">
                              <span className="font-medium text-sm">
                                Assigned Volunteers:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {task.assignedVolunteers.map((volunteer) => (
                                  <Badge
                                    className="text-xs"
                                    key={volunteer}
                                    variant="secondary"
                                  >
                                    {volunteer}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Assign Volunteers
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Task
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-4" value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Statistics</CardTitle>
                <CardDescription>
                  Overview of volunteer engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Registered Volunteers</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active This Month</span>
                    <span className="font-bold">142</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Hours This Month</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Hours per Volunteer</span>
                    <span className="font-bold">8.8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Volunteer Retention Rate</span>
                    <span className="font-bold">91%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Volunteers</CardTitle>
                <CardDescription>
                  Most active volunteers this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers
                    .sort((a, b) => b.hoursThisMonth - a.hoursThisMonth)
                    .slice(0, 5)
                    .map((volunteer, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={volunteer.id}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {volunteer.currentRoles.join(', ')}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold">
                          {volunteer.hoursThisMonth}h
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
