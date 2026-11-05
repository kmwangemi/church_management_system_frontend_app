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
  DialogFooter,
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
import { UserCombobox, normalizeMember } from '@/components/user-combobox';
import {
  type VolunteerItem,
  type VolunteerRoleItem,
  type VolunteerTaskItem,
  useAssignVolunteersToRole,
  useAssignVolunteersToTask,
  useCreateVolunteerTask,
  useDeleteVolunteer,
  useDeleteVolunteerRole,
  useDeleteVolunteerTask,
  useFetchVolunteerRoles,
  useFetchVolunteerStats,
  useFetchVolunteerTasks,
  useFetchVolunteers,
  useRegisterVolunteer,
  useRegisterVolunteerRole,
  useUpdateVolunteer,
  useUpdateVolunteerRole,
  useUpdateVolunteerTask,
} from '@/lib/hooks/church/volunteer/use-volunteer-queries';
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const AVAILABLE_SKILLS = [
  'Music',
  'Teaching',
  'Technical',
  'Sound',
  'Video',
  'Hospitality',
  'Cooking',
  'Event Planning',
  'Administration',
  'Security',
  'Ushering',
  'Parking',
  'Child Care',
  'Counseling',
];

const AVAILABILITY_OPTIONS = [
  'Sunday Morning',
  'Sunday Evening',
  'Wednesday Evening',
  'Friday Evening',
  'Saturday',
  'Weekdays',
];

export default function VolunteersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add Volunteer Dialog State
  const [isAddVolOpen, setIsAddVolOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volSkills, setVolSkills] = useState<string[]>([]);
  const [volAvailability, setVolAvailability] = useState<string[]>([]);
  const [volRoleIds, setVolRoleIds] = useState<string[]>([]);
  const [volHours, setVolHours] = useState('0');
  const [volNotes, setVolNotes] = useState('');

  // Edit Volunteer Dialog State
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerItem | null>(null);
  const [editVolName, setEditVolName] = useState('');
  const [editVolEmail, setEditVolEmail] = useState('');
  const [editVolPhone, setEditVolPhone] = useState('');
  const [editVolSkills, setEditVolSkills] = useState<string[]>([]);
  const [editVolAvailability, setEditVolAvailability] = useState<string[]>([]);
  const [editVolRoleIds, setEditVolRoleIds] = useState<string[]>([]);
  const [editVolHours, setEditVolHours] = useState('0');
  const [editVolStatus, setEditVolStatus] = useState('Active');
  const [editVolNotes, setEditVolNotes] = useState('');

  // Delete Volunteer Confirmation State
  const [deletingVolunteer, setDeletingVolunteer] = useState<VolunteerItem | null>(null);

  // Create Role Dialog State
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDepartment, setRoleDepartment] = useState('General');
  const [roleNeededVolunteers, setRoleNeededVolunteers] = useState('2');
  const [roleTimeCommitment, setRoleTimeCommitment] = useState('2 hours/week');
  const [rolePriority, setRolePriority] = useState('Medium');
  const [roleSkills, setRoleSkills] = useState<string[]>([]);
  const [roleDesc, setRoleDesc] = useState('');

  // Edit Role Dialog State
  const [editingRole, setEditingRole] = useState<VolunteerRoleItem | null>(null);
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editRoleDepartment, setEditRoleDepartment] = useState('');
  const [editRoleNeededVolunteers, setEditRoleNeededVolunteers] = useState('0');
  const [editRoleTimeCommitment, setEditRoleTimeCommitment] = useState('');
  const [editRolePriority, setEditRolePriority] = useState('Medium');
  const [editRoleSkills, setEditRoleSkills] = useState<string[]>([]);
  const [editRoleDesc, setEditRoleDesc] = useState('');

  // Assign Volunteers to Role Dialog State
  const [assigningRole, setAssigningRole] = useState<VolunteerRoleItem | null>(null);
  const [assignedRoleVolunteerIds, setAssignedRoleVolunteerIds] = useState<string[]>([]);

  // Delete Role Confirmation State
  const [deletingRole, setDeletingRole] = useState<VolunteerRoleItem | null>(null);

  // Schedule Task Dialog State
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDepartment, setNewTaskDepartment] = useState('General');
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newTaskTime, setNewTaskTime] = useState('9:00 AM');
  const [newTaskRequiredVolunteers, setNewTaskRequiredVolunteers] = useState('4');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskVolunteerIds, setNewTaskVolunteerIds] = useState<string[]>([]);

  // Edit Task Dialog State
  const [editingTask, setEditingTask] = useState<VolunteerTaskItem | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDepartment, setEditTaskDepartment] = useState('');
  const [editTaskDate, setEditTaskDate] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');
  const [editTaskRequiredVolunteers, setEditTaskRequiredVolunteers] = useState('4');
  const [editTaskPriority, setEditTaskPriority] = useState('Medium');
  const [editTaskStatus, setEditTaskStatus] = useState('Scheduled');
  const [editTaskDesc, setEditTaskDesc] = useState('');

  // Assign Volunteers to Task Dialog State
  const [assigningTask, setAssigningTask] = useState<VolunteerTaskItem | null>(null);
  const [assignedTaskVolunteerIds, setAssignedTaskVolunteerIds] = useState<string[]>([]);

  // Delete Task Confirmation State
  const [deletingTask, setDeletingTask] = useState<VolunteerTaskItem | null>(null);

  // Queries & Mutations
  const { data: statsData, isLoading: isLoadingStats } = useFetchVolunteerStats();
  const { data: volData, isLoading: isLoadingVolunteers } = useFetchVolunteers(
    1,
    searchTerm,
    statusFilter
  );
  const { data: allVolData } = useFetchVolunteers(1, '', 'all');
  const { data: rolesData, isLoading: isLoadingRoles } = useFetchVolunteerRoles(1, '');
  const { data: tasksData, isLoading: isLoadingTasks } = useFetchVolunteerTasks('', 'all');

  const { mutate: registerVolunteer, isPending: isRegisteringVol } = useRegisterVolunteer();
  const { mutate: updateVolunteer, isPending: isUpdatingVol } = useUpdateVolunteer();
  const { mutate: deleteVolunteer, isPending: isDeletingVol } = useDeleteVolunteer();

  const { mutate: registerVolunteerRole, isPending: isRegisteringRole } =
    useRegisterVolunteerRole();
  const { mutate: updateVolunteerRole, isPending: isUpdatingRole } =
    useUpdateVolunteerRole();
  const { mutate: assignVolunteersToRole, isPending: isAssigningRole } =
    useAssignVolunteersToRole();
  const { mutate: deleteVolunteerRole, isPending: isDeletingRole } =
    useDeleteVolunteerRole();

  const { mutate: createVolunteerTask, isPending: isCreatingTask } =
    useCreateVolunteerTask();
  const { mutate: updateVolunteerTask, isPending: isUpdatingTask } =
    useUpdateVolunteerTask();
  const { mutate: assignVolunteersToTask, isPending: isAssigningTask } =
    useAssignVolunteersToTask();
  const { mutate: deleteVolunteerTask, isPending: isDeletingTask } =
    useDeleteVolunteerTask();

  const activeVolunteers: VolunteerItem[] =
    (volData as any)?.volunteers || (volData as any)?.data || [];
  const allVolunteers: VolunteerItem[] =
    (allVolData as any)?.volunteers || (allVolData as any)?.data || activeVolunteers;
  const activeRoles: VolunteerRoleItem[] =
    (rolesData as any)?.roles || (rolesData as any)?.data || [];
  const upcomingTasks: VolunteerTaskItem[] =
    (tasksData as any)?.tasks || (tasksData as any)?.data || [];

  const totalVolunteers = statsData?.totalVolunteers ?? allVolunteers.length;
  const newVolunteersThisMonth = statsData?.newVolunteersThisMonth ?? 0;
  const activeVolunteersCount =
    statsData?.activeVolunteers ??
    allVolunteers.filter((v) => v.status === 'Active').length;
  const activeRate =
    statsData?.activeRate ??
    (totalVolunteers > 0
      ? Math.round((activeVolunteersCount / totalVolunteers) * 100)
      : 0);
  const hoursThisMonth =
    statsData?.hoursThisMonth ??
    allVolunteers.reduce((sum, v) => sum + (v.hoursThisMonth || 0), 0);
  const avgHoursPerVolunteer =
    statsData?.avgHoursPerVolunteer ??
    (activeVolunteersCount > 0
      ? Number((hoursThisMonth / activeVolunteersCount).toFixed(1))
      : 0);
  const retentionRate = statsData?.retentionRate ?? activeRate;
  const openPositions =
    statsData?.openPositions ??
    activeRoles.reduce((sum, r) => sum + (r.neededVolunteers || 0), 0);
  const topVolunteers: VolunteerItem[] =
    statsData?.topVolunteers && statsData.topVolunteers.length > 0
      ? statsData.topVolunteers
      : [...allVolunteers]
          .sort((a, b) => (b.hoursThisMonth || 0) - (a.hoursThisMonth || 0))
          .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
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

  const openEditVolunteerModal = (vol: VolunteerItem) => {
    setEditingVolunteer(vol);
    setEditVolName(vol.name || '');
    setEditVolEmail(vol.email === 'N/A' ? '' : vol.email || '');
    setEditVolPhone(vol.phone === 'N/A' ? '' : vol.phone || '');
    setEditVolSkills(vol.skills || []);
    setEditVolAvailability(vol.availability || []);
    setEditVolRoleIds(vol.roleIds || []);
    setEditVolHours(String(vol.hoursThisMonth ?? 0));
    setEditVolStatus(vol.status || 'Active');
    setEditVolNotes(vol.notes || '');
  };

  const openEditRoleModal = (role: VolunteerRoleItem) => {
    setEditingRole(role);
    setEditRoleTitle(role.title || role.role || '');
    setEditRoleDepartment(role.department || 'General');
    setEditRoleNeededVolunteers(String(role.neededVolunteers ?? 0));
    setEditRoleTimeCommitment(role.timeCommitment || 'Flexible');
    setEditRolePriority(role.priority || 'Medium');
    setEditRoleSkills(role.requiredSkills || []);
    setEditRoleDesc(role.description || '');
  };

  const openAssignRoleModal = (role: VolunteerRoleItem) => {
    setAssigningRole(role);
    setAssignedRoleVolunteerIds(role.assignedVolunteerIds || []);
  };

  const openEditTaskModal = (task: VolunteerTaskItem) => {
    setEditingTask(task);
    setEditTaskTitle(task.title || '');
    setEditTaskDepartment(task.department || 'General');
    setEditTaskDate(task.date || '');
    setEditTaskTime(task.time || '9:00 AM');
    setEditTaskRequiredVolunteers(String(task.requiredVolunteers ?? 4));
    setEditTaskPriority(task.priority || 'Medium');
    setEditTaskStatus(task.status || 'Scheduled');
    setEditTaskDesc(task.description || '');
  };

  const openAssignTaskModal = (task: VolunteerTaskItem) => {
    setAssigningTask(task);
    setAssignedTaskVolunteerIds(task.assignedVolunteerIds || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Volunteer & Service Management
          </h1>
          <p className="text-muted-foreground">
            Manage volunteers, roles, and service scheduling
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Add Volunteer Dialog */}
          <Dialog onOpenChange={setIsAddVolOpen} open={isAddVolOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Volunteer</DialogTitle>
                <DialogDescription>
                  Select an existing church member or enter details to register a volunteer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Member</Label>
                  <div className="col-span-3">
                    <UserCombobox
                      onChange={(memberRaw) => {
                        if (memberRaw) {
                          const norm = normalizeMember(memberRaw);
                          setSelectedMemberId(norm.id);
                          setVolName(norm.fullName || '');
                          setVolEmail(norm.email || '');
                          setVolPhone(
                            (memberRaw as any)?.phoneNumber ||
                              (memberRaw as any)?.phone ||
                              ''
                          );
                        } else {
                          setSelectedMemberId(null);
                        }
                      }}
                      placeholder="Select church member (optional)..."
                      value={selectedMemberId}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerName">
                    Name *
                  </Label>
                  <Input
                    className="col-span-3"
                    id="volunteerName"
                    onChange={(e) => setVolName(e.target.value)}
                    placeholder="Full name"
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
                    placeholder="volunteer@example.com"
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
                    placeholder="+254..."
                    value={volPhone}
                  />
                </div>
                {activeRoles.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="pt-1 text-right">Assign Roles</Label>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      {activeRoles.map((role) => (
                        <div className="flex items-center space-x-2" key={role.id}>
                          <Checkbox
                            checked={volRoleIds.includes(role.id)}
                            id={`add-vol-role-${role.id}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setVolRoleIds([...volRoleIds, role.id]);
                              } else {
                                setVolRoleIds(volRoleIds.filter((id) => id !== role.id));
                              }
                            }}
                          />
                          <Label
                            className="cursor-pointer text-sm"
                            htmlFor={`add-vol-role-${role.id}`}
                          >
                            {role.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="pt-1 text-right">Skills</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {AVAILABLE_SKILLS.map((skill) => (
                      <div className="flex items-center space-x-2" key={skill}>
                        <Checkbox
                          checked={volSkills.includes(skill)}
                          id={`add-skill-${skill}`}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVolSkills([...volSkills, skill]);
                            } else {
                              setVolSkills(volSkills.filter((s) => s !== skill));
                            }
                          }}
                        />
                        <Label
                          className="cursor-pointer text-sm"
                          htmlFor={`add-skill-${skill}`}
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="pt-1 text-right">Availability</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {AVAILABILITY_OPTIONS.map((time) => (
                      <div className="flex items-center space-x-2" key={time}>
                        <Checkbox
                          checked={volAvailability.includes(time)}
                          id={`add-avail-${time}`}
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
                        <Label
                          className="cursor-pointer text-sm"
                          htmlFor={`add-avail-${time}`}
                        >
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerHours">
                    Hours This Month
                  </Label>
                  <Input
                    className="col-span-3"
                    id="volunteerHours"
                    min="0"
                    onChange={(e) => setVolHours(e.target.value)}
                    type="number"
                    value={volHours}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="volunteerNotes">
                    Notes
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="volunteerNotes"
                    onChange={(e) => setVolNotes(e.target.value)}
                    placeholder="Additional background or ministry preferences..."
                    value={volNotes}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsAddVolOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isRegisteringVol || (!volName.trim() && !selectedMemberId)}
                  onClick={() => {
                    registerVolunteer(
                      {
                        memberId: selectedMemberId || undefined,
                        volunteerName: volName.trim(),
                        volunteerEmail: volEmail.trim() || undefined,
                        volunteerPhone: volPhone.trim() || undefined,
                        roleIds: volRoleIds,
                        skills: volSkills,
                        availability: volAvailability,
                        hoursThisMonth: Number(volHours) || 0,
                        notes: volNotes.trim() || undefined,
                      },
                      {
                        onSuccess: () => {
                          setIsAddVolOpen(false);
                          setSelectedMemberId(null);
                          setVolName('');
                          setVolEmail('');
                          setVolPhone('');
                          setVolRoleIds([]);
                          setVolSkills([]);
                          setVolAvailability([]);
                          setVolHours('0');
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
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Role Dialog */}
          <Dialog onOpenChange={setIsCreateRoleOpen} open={isCreateRoleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Volunteer Role</DialogTitle>
                <DialogDescription>
                  Define a new ministry position and its requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="roleTitle">
                    Role Title *
                  </Label>
                  <Input
                    className="col-span-3"
                    id="roleTitle"
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Sunday School Teacher"
                    value={roleTitle}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="roleDepartment">
                    Ministry
                  </Label>
                  <Input
                    className="col-span-3"
                    id="roleDepartment"
                    onChange={(e) => setRoleDepartment(e.target.value)}
                    placeholder="e.g. Children's Ministry"
                    value={roleDepartment}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="roleNeededVolunteers">
                    Open Spots
                  </Label>
                  <Input
                    className="col-span-3"
                    id="roleNeededVolunteers"
                    min="0"
                    onChange={(e) => setRoleNeededVolunteers(e.target.value)}
                    type="number"
                    value={roleNeededVolunteers}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="roleTimeCommitment">
                    Time Commitment
                  </Label>
                  <Input
                    className="col-span-3"
                    id="roleTimeCommitment"
                    onChange={(e) => setRoleTimeCommitment(e.target.value)}
                    placeholder="e.g. 2 hours/week"
                    value={roleTimeCommitment}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Priority</Label>
                  <Select onValueChange={setRolePriority} value={rolePriority}>
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
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="pt-1 text-right">Required Skills</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {AVAILABLE_SKILLS.map((skill) => (
                      <div className="flex items-center space-x-2" key={skill}>
                        <Checkbox
                          checked={roleSkills.includes(skill)}
                          id={`role-skill-${skill}`}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRoleSkills([...roleSkills, skill]);
                            } else {
                              setRoleSkills(roleSkills.filter((s) => s !== skill));
                            }
                          }}
                        />
                        <Label
                          className="cursor-pointer text-sm"
                          htmlFor={`role-skill-${skill}`}
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="roleDescription">
                    Description
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="roleDescription"
                    onChange={(e) => setRoleDesc(e.target.value)}
                    placeholder="Describe responsibilities for this role..."
                    value={roleDesc}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsCreateRoleOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isRegisteringRole || !roleTitle.trim()}
                  onClick={() => {
                    registerVolunteerRole(
                      {
                        role: roleTitle.trim(),
                        department: roleDepartment.trim() || 'General',
                        priority: rolePriority,
                        timeCommitment: roleTimeCommitment.trim() || 'Flexible',
                        requiredSkills: roleSkills,
                        description: roleDesc.trim(),
                        neededVolunteers: parseInt(roleNeededVolunteers, 10) || 0,
                      },
                      {
                        onSuccess: () => {
                          setIsCreateRoleOpen(false);
                          setRoleTitle('');
                          setRoleDepartment('General');
                          setRoleNeededVolunteers('2');
                          setRoleTimeCommitment('2 hours/week');
                          setRolePriority('Medium');
                          setRoleSkills([]);
                          setRoleDesc('');
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
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Schedule Task Dialog */}
          <Dialog onOpenChange={setIsCreateTaskOpen} open={isCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Volunteer Task</DialogTitle>
                <DialogDescription>
                  Create a scheduled service task and optionally assign volunteers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskTitle">
                    Task Title *
                  </Label>
                  <Input
                    className="col-span-3"
                    id="newTaskTitle"
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Sunday Service Setup"
                    value={newTaskTitle}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskDepartment">
                    Ministry
                  </Label>
                  <Input
                    className="col-span-3"
                    id="newTaskDepartment"
                    onChange={(e) => setNewTaskDepartment(e.target.value)}
                    placeholder="e.g. Hospitality"
                    value={newTaskDepartment}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskDate">
                    Date
                  </Label>
                  <Input
                    className="col-span-3"
                    id="newTaskDate"
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    type="date"
                    value={newTaskDate}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskTime">
                    Time
                  </Label>
                  <Input
                    className="col-span-3"
                    id="newTaskTime"
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g. 8:00 AM"
                    value={newTaskTime}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskReqVols">
                    Volunteers Needed
                  </Label>
                  <Input
                    className="col-span-3"
                    id="newTaskReqVols"
                    min="1"
                    onChange={(e) => setNewTaskRequiredVolunteers(e.target.value)}
                    type="number"
                    value={newTaskRequiredVolunteers}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Priority</Label>
                  <Select onValueChange={setNewTaskPriority} value={newTaskPriority}>
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
                {allVolunteers.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="pt-1 text-right">Assign Volunteers</Label>
                    <div className="col-span-3 max-h-36 space-y-2 overflow-y-auto rounded-md border p-2">
                      {allVolunteers.map((v) => (
                        <div className="flex items-center space-x-2" key={v.id}>
                          <Checkbox
                            checked={newTaskVolunteerIds.includes(v.id)}
                            id={`new-task-vol-${v.id}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewTaskVolunteerIds([...newTaskVolunteerIds, v.id]);
                              } else {
                                setNewTaskVolunteerIds(
                                  newTaskVolunteerIds.filter((id) => id !== v.id)
                                );
                              }
                            }}
                          />
                          <Label
                            className="cursor-pointer text-sm"
                            htmlFor={`new-task-vol-${v.id}`}
                          >
                            {v.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="newTaskDesc">
                    Description
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="newTaskDesc"
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Task details and instructions..."
                    value={newTaskDesc}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsCreateTaskOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isCreatingTask || !newTaskTitle.trim()}
                  onClick={() => {
                    createVolunteerTask(
                      {
                        title: newTaskTitle.trim(),
                        department: newTaskDepartment.trim() || 'General',
                        date: newTaskDate,
                        time: newTaskTime.trim() || '9:00 AM',
                        requiredVolunteers:
                          parseInt(newTaskRequiredVolunteers, 10) || 1,
                        priority: newTaskPriority,
                        description: newTaskDesc.trim(),
                        assignedVolunteerIds: newTaskVolunteerIds,
                      },
                      {
                        onSuccess: () => {
                          setIsCreateTaskOpen(false);
                          setNewTaskTitle('');
                          setNewTaskDesc('');
                          setNewTaskVolunteerIds([]);
                        },
                      }
                    );
                  }}
                >
                  {isCreatingTask && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Schedule Task
                </Button>
              </DialogFooter>
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
            <div className="font-bold text-2xl">
              {isLoadingStats ? '...' : totalVolunteers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +{newVolunteersThisMonth} this month
            </p>
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
            <div className="font-bold text-2xl">
              {isLoadingStats ? '...' : activeVolunteersCount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {activeRate}% active rate
            </p>
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
            <div className="font-bold text-2xl">
              {isLoadingStats ? '...' : hoursThisMonth.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Avg {avgHoursPerVolunteer}h per active volunteer
            </p>
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
            <div className="font-bold text-2xl">
              {isLoadingStats ? '...' : openPositions.toLocaleString()}
            </div>
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

        {/* Volunteers Directory Tab */}
        <TabsContent className="space-y-4" value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Directory</CardTitle>
              <CardDescription>
                Manage volunteer information, hours, and role assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search volunteers by name, email, skill, or role..."
                    value={searchTerm}
                  />
                </div>
                <Select onValueChange={setStatusFilter} value={statusFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoadingVolunteers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Loading volunteers...
                  </span>
                </div>
              ) : activeVolunteers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <Users className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">No volunteers found</h3>
                  <p className="mb-4 text-muted-foreground text-sm">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or status filter.'
                      : 'Get started by registering your first church volunteer.'}
                  </p>
                  <Button onClick={() => setIsAddVolOpen(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Volunteer
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Skills & Availability</TableHead>
                      <TableHead>Current Roles</TableHead>
                      <TableHead>Hours This Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id || volunteer._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={volunteer.photoUrl || '/placeholder.svg'}
                              />
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
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {(volunteer.skills || []).length > 0 ? (
                                (volunteer.skills || [])
                                  .slice(0, 3)
                                  .map((skill: string) => (
                                    <Badge
                                      className="text-xs"
                                      key={skill}
                                      variant="secondary"
                                    >
                                      {skill}
                                    </Badge>
                                  ))
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  No skills listed
                                </span>
                              )}
                              {(volunteer.skills || []).length > 3 && (
                                <Badge className="text-xs" variant="outline">
                                  +{(volunteer.skills || []).length - 3}
                                </Badge>
                              )}
                            </div>
                            {(volunteer.availability || []).length > 0 && (
                              <div className="text-muted-foreground text-xs">
                                {volunteer.availability.join(', ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(volunteer.currentRoles || []).length > 0 ? (
                              volunteer.currentRoles.map((role: string) => (
                                <Badge
                                  className="text-xs"
                                  key={role}
                                  variant="outline"
                                >
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                General Volunteer
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {volunteer.hoursThisMonth || 0}h
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(
                              volunteer.status || 'Active'
                            )}
                          >
                            {volunteer.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              onClick={() => openEditVolunteerModal(volunteer)}
                              size="sm"
                              title="Edit Volunteer / Log Hours"
                              variant="ghost"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setDeletingVolunteer(volunteer)}
                              size="sm"
                              title="Delete Volunteer"
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteer Roles Tab */}
        <TabsContent className="space-y-4" value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Volunteer Roles</CardTitle>
                <CardDescription>
                  Manage volunteer positions, requirements, and assigned members
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateRoleOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingRoles ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Loading volunteer roles...
                  </span>
                </div>
              ) : activeRoles.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <UserCheck className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">
                    No volunteer roles defined
                  </h3>
                  <p className="mb-4 text-muted-foreground text-sm">
                    Create roles like Choir Member, Usher, or Sound Technician to
                    organize your volunteers.
                  </p>
                  <Button
                    onClick={() => setIsCreateRoleOpen(true)}
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Role
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRoles.map((role) => (
                    <Card key={role.id || role._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {role.title}
                              </h3>
                              <Badge variant="outline">
                                {role.department || 'General'}
                              </Badge>
                              <Badge
                                className={getPriorityColor(
                                  role.priority || 'Medium'
                                )}
                              >
                                {role.priority || 'Medium'} Priority
                              </Badge>
                            </div>
                            {role.description && (
                              <p className="text-muted-foreground text-sm">
                                {role.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span>
                                <strong>Time:</strong>{' '}
                                {role.timeCommitment || 'Flexible'}
                              </span>
                              <span>
                                <strong>Filled:</strong>{' '}
                                {role.currentVolunteers || 0}/
                                {(role.currentVolunteers || 0) +
                                  (role.neededVolunteers || 0)}
                              </span>
                              <span>
                                <strong>Open Spots:</strong>{' '}
                                {role.neededVolunteers || 0}
                              </span>
                            </div>
                            {(role.requiredSkills || []).length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="mr-1 text-muted-foreground text-xs">
                                  Skills:
                                </span>
                                {role.requiredSkills.map((skill: string) => (
                                  <Badge
                                    className="text-xs"
                                    key={skill}
                                    variant="secondary"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {(role.assignedVolunteers || []).length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="mr-1 font-medium text-xs">
                                  Assigned Volunteers:
                                </span>
                                {role.assignedVolunteers.map((vName: string) => (
                                  <Badge
                                    className="text-xs"
                                    key={vName}
                                    variant="outline"
                                  >
                                    {vName}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => openAssignRoleModal(role)}
                              size="sm"
                              variant="outline"
                            >
                              <UserPlus className="mr-1 h-3.5 w-3.5" />
                              Assign Volunteers
                            </Button>
                            <Button
                              onClick={() => openEditRoleModal(role)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="mr-1 h-3.5 w-3.5" />
                              Edit Role
                            </Button>
                            <Button
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setDeletingRole(role)}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks & Scheduling Tab */}
        <TabsContent className="space-y-4" value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks & Service Schedule</CardTitle>
                <CardDescription>
                  Schedule and assign volunteer service tasks
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateTaskOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Task
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Loading scheduled tasks...
                  </span>
                </div>
              ) : upcomingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">
                    No scheduled tasks yet
                  </h3>
                  <p className="mb-4 text-muted-foreground text-sm">
                    Schedule service tasks and assign volunteers to keep your
                    ministry running smoothly.
                  </p>
                  <Button
                    onClick={() => setIsCreateTaskOpen(true)}
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <Card key={task.id || task._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {task.title}
                              </h3>
                              {task.department && (
                                <Badge variant="outline">
                                  {task.department}
                                </Badge>
                              )}
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-muted-foreground text-sm">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
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
                                {(task.assignedVolunteers || []).length}/
                                {task.requiredVolunteers} volunteers
                              </div>
                            </div>
                            {(task.assignedVolunteers || []).length > 0 && (
                              <div className="space-y-1 pt-1">
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
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => openAssignTaskModal(task)}
                              size="sm"
                              variant="outline"
                            >
                              <UserPlus className="mr-1 h-3.5 w-3.5" />
                              Assign Volunteers
                            </Button>
                            <Button
                              onClick={() => openEditTaskModal(task)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="mr-1 h-3.5 w-3.5" />
                              Edit Task
                            </Button>
                            <Button
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setDeletingTask(task)}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
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
                    <span className="font-bold">
                      {totalVolunteers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active This Month</span>
                    <span className="font-bold">
                      {activeVolunteersCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Hours This Month</span>
                    <span className="font-bold">
                      {hoursThisMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Hours per Volunteer</span>
                    <span className="font-bold">{avgHoursPerVolunteer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Volunteer Retention Rate</span>
                    <span className="font-bold">{retentionRate}%</span>
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
                {topVolunteers.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground text-sm">
                    No volunteer hours logged yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {topVolunteers.map((volunteer, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={volunteer.id || volunteer._id}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {(volunteer.currentRoles || []).length > 0
                                ? volunteer.currentRoles.join(', ')
                                : 'General Volunteer'}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold">
                          {volunteer.hoursThisMonth || 0}h
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Volunteer Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingVolunteer(null)}
        open={!!editingVolunteer}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Volunteer & Log Hours</DialogTitle>
            <DialogDescription>
              Update volunteer contact details, skills, roles, and monthly hours.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editVolName">
                Name *
              </Label>
              <Input
                className="col-span-3"
                id="editVolName"
                onChange={(e) => setEditVolName(e.target.value)}
                value={editVolName}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editVolEmail">
                Email
              </Label>
              <Input
                className="col-span-3"
                id="editVolEmail"
                onChange={(e) => setEditVolEmail(e.target.value)}
                type="email"
                value={editVolEmail}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editVolPhone">
                Phone
              </Label>
              <Input
                className="col-span-3"
                id="editVolPhone"
                onChange={(e) => setEditVolPhone(e.target.value)}
                value={editVolPhone}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select onValueChange={setEditVolStatus} value={editVolStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editVolHours">
                Hours This Month
              </Label>
              <Input
                className="col-span-3"
                id="editVolHours"
                min="0"
                onChange={(e) => setEditVolHours(e.target.value)}
                type="number"
                value={editVolHours}
              />
            </div>
            {activeRoles.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="pt-1 text-right">Assigned Roles</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  {activeRoles.map((role) => (
                    <div className="flex items-center space-x-2" key={role.id}>
                      <Checkbox
                        checked={editVolRoleIds.includes(role.id)}
                        id={`edit-vol-role-${role.id}`}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditVolRoleIds([...editVolRoleIds, role.id]);
                          } else {
                            setEditVolRoleIds(
                              editVolRoleIds.filter((id) => id !== role.id)
                            );
                          }
                        }}
                      />
                      <Label
                        className="cursor-pointer text-sm"
                        htmlFor={`edit-vol-role-${role.id}`}
                      >
                        {role.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-1 text-right">Skills</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {AVAILABLE_SKILLS.map((skill) => (
                  <div className="flex items-center space-x-2" key={skill}>
                    <Checkbox
                      checked={editVolSkills.includes(skill)}
                      id={`edit-skill-${skill}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditVolSkills([...editVolSkills, skill]);
                        } else {
                          setEditVolSkills(
                            editVolSkills.filter((s) => s !== skill)
                          );
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={`edit-skill-${skill}`}
                    >
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-1 text-right">Availability</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {AVAILABILITY_OPTIONS.map((time) => (
                  <div className="flex items-center space-x-2" key={time}>
                    <Checkbox
                      checked={editVolAvailability.includes(time)}
                      id={`edit-avail-${time}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditVolAvailability([...editVolAvailability, time]);
                        } else {
                          setEditVolAvailability(
                            editVolAvailability.filter((t) => t !== time)
                          );
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={`edit-avail-${time}`}
                    >
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editVolNotes">
                Notes
              </Label>
              <Textarea
                className="col-span-3"
                id="editVolNotes"
                onChange={(e) => setEditVolNotes(e.target.value)}
                value={editVolNotes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setEditingVolunteer(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdatingVol || !editVolName.trim()}
              onClick={() => {
                if (!editingVolunteer) return;
                updateVolunteer(
                  {
                    id: editingVolunteer.id || editingVolunteer._id,
                    volunteerName: editVolName.trim(),
                    volunteerEmail: editVolEmail.trim() || undefined,
                    volunteerPhone: editVolPhone.trim() || undefined,
                    status: editVolStatus,
                    hoursThisMonth: Number(editVolHours) || 0,
                    roleIds: editVolRoleIds,
                    skills: editVolSkills,
                    availability: editVolAvailability,
                    notes: editVolNotes,
                  },
                  {
                    onSuccess: () => setEditingVolunteer(null),
                  }
                );
              }}
            >
              {isUpdatingVol && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Volunteer Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingVolunteer(null)}
        open={!!deletingVolunteer}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Volunteer</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <strong>{deletingVolunteer?.name}</strong> from the volunteer
              directory? Their role and task assignments will also be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDeletingVolunteer(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeletingVol}
              onClick={() => {
                if (!deletingVolunteer) return;
                deleteVolunteer(
                  deletingVolunteer.id || deletingVolunteer._id,
                  {
                    onSuccess: () => setDeletingVolunteer(null),
                  }
                );
              }}
              variant="destructive"
            >
              {isDeletingVol && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Volunteer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingRole(null)}
        open={!!editingRole}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Volunteer Role</DialogTitle>
            <DialogDescription>
              Update role requirements, time commitment, and open spots.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editRoleTitle">
                Role Title *
              </Label>
              <Input
                className="col-span-3"
                id="editRoleTitle"
                onChange={(e) => setEditRoleTitle(e.target.value)}
                value={editRoleTitle}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editRoleDepartment">
                Ministry
              </Label>
              <Input
                className="col-span-3"
                id="editRoleDepartment"
                onChange={(e) => setEditRoleDepartment(e.target.value)}
                value={editRoleDepartment}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editRoleNeeded">
                Open Spots
              </Label>
              <Input
                className="col-span-3"
                id="editRoleNeeded"
                min="0"
                onChange={(e) => setEditRoleNeededVolunteers(e.target.value)}
                type="number"
                value={editRoleNeededVolunteers}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editRoleTime">
                Time Commitment
              </Label>
              <Input
                className="col-span-3"
                id="editRoleTime"
                onChange={(e) => setEditRoleTimeCommitment(e.target.value)}
                value={editRoleTimeCommitment}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Priority</Label>
              <Select
                onValueChange={setEditRolePriority}
                value={editRolePriority}
              >
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-1 text-right">Required Skills</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {AVAILABLE_SKILLS.map((skill) => (
                  <div className="flex items-center space-x-2" key={skill}>
                    <Checkbox
                      checked={editRoleSkills.includes(skill)}
                      id={`edit-role-skill-${skill}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditRoleSkills([...editRoleSkills, skill]);
                        } else {
                          setEditRoleSkills(
                            editRoleSkills.filter((s) => s !== skill)
                          );
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={`edit-role-skill-${skill}`}
                    >
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editRoleDesc">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="editRoleDesc"
                onChange={(e) => setEditRoleDesc(e.target.value)}
                value={editRoleDesc}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEditingRole(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isUpdatingRole || !editRoleTitle.trim()}
              onClick={() => {
                if (!editingRole) return;
                updateVolunteerRole(
                  {
                    id: editingRole.id || editingRole._id,
                    role: editRoleTitle.trim(),
                    department: editRoleDepartment.trim() || 'General',
                    neededVolunteers:
                      parseInt(editRoleNeededVolunteers, 10) || 0,
                    timeCommitment:
                      editRoleTimeCommitment.trim() || 'Flexible',
                    priority: editRolePriority,
                    requiredSkills: editRoleSkills,
                    description: editRoleDesc.trim(),
                  },
                  {
                    onSuccess: () => setEditingRole(null),
                  }
                );
              }}
            >
              {isUpdatingRole && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Volunteers to Role Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setAssigningRole(null)}
        open={!!assigningRole}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              Assign Volunteers — {assigningRole?.title}
            </DialogTitle>
            <DialogDescription>
              Select volunteers to serve in this role.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-4">
            {allVolunteers.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">
                No registered volunteers available. Add a volunteer first.
              </p>
            ) : (
              allVolunteers.map((v) => (
                <div
                  className="flex items-center justify-between rounded-md border p-2.5"
                  key={v.id}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={assignedRoleVolunteerIds.includes(v.id)}
                      id={`assign-role-vol-${v.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAssignedRoleVolunteerIds([
                            ...assignedRoleVolunteerIds,
                            v.id,
                          ]);
                        } else {
                          setAssignedRoleVolunteerIds(
                            assignedRoleVolunteerIds.filter((id) => id !== v.id)
                          );
                        }
                      }}
                    />
                    <Label
                      className="cursor-pointer font-medium text-sm"
                      htmlFor={`assign-role-vol-${v.id}`}
                    >
                      {v.name}
                    </Label>
                  </div>
                  <Badge className={getStatusColor(v.status)} variant="outline">
                    {v.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setAssigningRole(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isAssigningRole}
              onClick={() => {
                if (!assigningRole) return;
                assignVolunteersToRole(
                  {
                    roleId: assigningRole.id || assigningRole._id,
                    volunteerIds: assignedRoleVolunteerIds,
                  },
                  {
                    onSuccess: () => setAssigningRole(null),
                  }
                );
              }}
            >
              {isAssigningRole && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingRole(null)}
        open={!!deletingRole}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Volunteer Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the{' '}
              <strong>{deletingRole?.title}</strong> role?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingRole(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingRole}
              onClick={() => {
                if (!deletingRole) return;
                deleteVolunteerRole(deletingRole.id || deletingRole._id, {
                  onSuccess: () => setDeletingRole(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingRole && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingTask(null)}
        open={!!editingTask}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Task</DialogTitle>
            <DialogDescription>
              Update task schedule, priority, status, and volunteer count.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskTitle">
                Title *
              </Label>
              <Input
                className="col-span-3"
                id="editTaskTitle"
                onChange={(e) => setEditTaskTitle(e.target.value)}
                value={editTaskTitle}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskDept">
                Ministry
              </Label>
              <Input
                className="col-span-3"
                id="editTaskDept"
                onChange={(e) => setEditTaskDepartment(e.target.value)}
                value={editTaskDepartment}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskDate">
                Date
              </Label>
              <Input
                className="col-span-3"
                id="editTaskDate"
                onChange={(e) => setEditTaskDate(e.target.value)}
                type="date"
                value={editTaskDate}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskTime">
                Time
              </Label>
              <Input
                className="col-span-3"
                id="editTaskTime"
                onChange={(e) => setEditTaskTime(e.target.value)}
                value={editTaskTime}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskReqVols">
                Required Volunteers
              </Label>
              <Input
                className="col-span-3"
                id="editTaskReqVols"
                min="1"
                onChange={(e) => setEditTaskRequiredVolunteers(e.target.value)}
                type="number"
                value={editTaskRequiredVolunteers}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Priority</Label>
              <Select
                onValueChange={setEditTaskPriority}
                value={editTaskPriority}
              >
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
              <Label className="text-right">Status</Label>
              <Select onValueChange={setEditTaskStatus} value={editTaskStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Needs Volunteers">
                    Needs Volunteers
                  </SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editTaskDesc">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="editTaskDesc"
                onChange={(e) => setEditTaskDesc(e.target.value)}
                value={editTaskDesc}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEditingTask(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isUpdatingTask || !editTaskTitle.trim()}
              onClick={() => {
                if (!editingTask) return;
                updateVolunteerTask(
                  {
                    id: editingTask.id || editingTask._id,
                    title: editTaskTitle.trim(),
                    department: editTaskDepartment.trim() || 'General',
                    date: editTaskDate,
                    time: editTaskTime.trim() || '9:00 AM',
                    requiredVolunteers:
                      parseInt(editTaskRequiredVolunteers, 10) || 1,
                    priority: editTaskPriority,
                    status: editTaskStatus,
                    description: editTaskDesc.trim(),
                  },
                  {
                    onSuccess: () => setEditingTask(null),
                  }
                );
              }}
            >
              {isUpdatingTask && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Volunteers to Task Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setAssigningTask(null)}
        open={!!assigningTask}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              Assign Volunteers — {assigningTask?.title}
            </DialogTitle>
            <DialogDescription>
              Select volunteers for this task ({assignedTaskVolunteerIds.length}/
              {assigningTask?.requiredVolunteers || 1} required).
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-4">
            {allVolunteers.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">
                No registered volunteers available. Add a volunteer first.
              </p>
            ) : (
              allVolunteers.map((v) => (
                <div
                  className="flex items-center justify-between rounded-md border p-2.5"
                  key={v.id}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={assignedTaskVolunteerIds.includes(v.id)}
                      id={`assign-task-vol-${v.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAssignedTaskVolunteerIds([
                            ...assignedTaskVolunteerIds,
                            v.id,
                          ]);
                        } else {
                          setAssignedTaskVolunteerIds(
                            assignedTaskVolunteerIds.filter((id) => id !== v.id)
                          );
                        }
                      }}
                    />
                    <div>
                      <Label
                        className="cursor-pointer font-medium text-sm"
                        htmlFor={`assign-task-vol-${v.id}`}
                      >
                        {v.name}
                      </Label>
                      {(v.skills || []).length > 0 && (
                        <p className="text-muted-foreground text-xs">
                          {v.skills.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(v.status)} variant="outline">
                    {v.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setAssigningTask(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isAssigningTask}
              onClick={() => {
                if (!assigningTask) return;
                assignVolunteersToTask(
                  {
                    taskId: assigningTask.id || assigningTask._id,
                    volunteerIds: assignedTaskVolunteerIds,
                  },
                  {
                    onSuccess: () => setAssigningTask(null),
                  }
                );
              }}
            >
              {isAssigningTask && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingTask(null)}
        open={!!deletingTask}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Scheduled Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>{deletingTask?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingTask(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingTask}
              onClick={() => {
                if (!deletingTask) return;
                deleteVolunteerTask(deletingTask.id || deletingTask._id, {
                  onSuccess: () => setDeletingTask(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingTask && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
