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
  type DiscipleItem,
  type DiscipleshipClassItem,
  type MentorItem,
  useAssignMenteesToMentor,
  useCreateDiscipleshipClass,
  useDeleteDisciple,
  useDeleteDiscipleshipClass,
  useDeleteMentor,
  useDisciples,
  useEnrollDisciplesInClass,
  useFetchDiscipleshipClasses,
  useFetchDiscipleshipStats,
  useFetchMentors,
  useRecordDiscipleFollowUp,
  useUpdateDisciple,
  useUpdateDiscipleshipClass,
  useUpdateMentor,
} from '@/lib/hooks/church/disciple/use-disciple-queries';
import {
  Award,
  BookOpen,
  Calendar,
  Edit,
  Heart,
  Loader2,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function DiscipleshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('disciples');

  // Header Dialogs
  const [isAddDiscipleDialogOpen, setIsAddDiscipleDialogOpen] = useState(false);
  const [isAddMentorDialogOpen, setIsAddMentorDialogOpen] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);

  // Create Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassInstructor, setNewClassInstructor] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('Beginner');
  const [newClassDuration, setNewClassDuration] = useState('8 weeks');
  const [newClassCapacity, setNewClassCapacity] = useState('15');
  const [newClassStartDate, setNewClassStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newClassEndDate, setNewClassEndDate] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('Sundays, 9:00 AM');
  const [newClassDesc, setNewClassDesc] = useState('');

  // Edit Disciple Dialog State
  const [editingDisciple, setEditingDisciple] = useState<DiscipleItem | null>(
    null
  );
  const [editDiscipleLevel, setEditDiscipleLevel] = useState('New Convert');
  const [editDiscipleStatus, setEditDiscipleStatus] = useState('Active');
  const [editDiscipleMentorId, setEditDiscipleMentorId] = useState('');
  const [editDiscipleProgress, setEditDiscipleProgress] = useState('0');
  const [editDiscipleCompletedClasses, setEditDiscipleCompletedClasses] =
    useState('0');
  const [editDiscipleTotalClasses, setEditDiscipleTotalClasses] =
    useState('4');
  const [editDiscipleGoals, setEditDiscipleGoals] = useState('');
  const [editDiscipleNotes, setEditDiscipleNotes] = useState('');

  // Log Follow-up Dialog State
  const [followUpDisciple, setFollowUpDisciple] = useState<DiscipleItem | null>(
    null
  );
  const [followUpDate, setFollowUpDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpProgress, setFollowUpProgress] = useState('');
  const [followUpCompletedClasses, setFollowUpCompletedClasses] = useState('');

  // Delete Disciple Dialog State
  const [deletingDisciple, setDeletingDisciple] = useState<DiscipleItem | null>(
    null
  );

  // Class Dialog States (View Students, Schedule, Edit, Delete)
  const [viewingClassStudents, setViewingClassStudents] =
    useState<DiscipleshipClassItem | null>(null);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([]);

  const [schedulingClass, setSchedulingClass] =
    useState<DiscipleshipClassItem | null>(null);
  const [schedStartDate, setSchedStartDate] = useState('');
  const [schedEndDate, setSchedEndDate] = useState('');
  const [schedMeetingTime, setSchedMeetingTime] = useState('');
  const [schedStatus, setSchedStatus] = useState('Active');
  const [schedProgress, setSchedProgress] = useState('0');

  const [editingClass, setEditingClass] =
    useState<DiscipleshipClassItem | null>(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassInstructor, setEditClassInstructor] = useState('');
  const [editClassLevel, setEditClassLevel] = useState('Beginner');
  const [editClassDuration, setEditClassDuration] = useState('');
  const [editClassCapacity, setEditClassCapacity] = useState('15');
  const [editClassStatus, setEditClassStatus] = useState('Active');
  const [editClassProgress, setEditClassProgress] = useState('0');
  const [editClassDesc, setEditClassDesc] = useState('');

  const [deletingClass, setDeletingClass] =
    useState<DiscipleshipClassItem | null>(null);

  // Mentor Dialog States (Assign, Edit, Delete)
  const [assigningMentor, setAssigningMentor] = useState<MentorItem | null>(
    null
  );
  const [assignedMenteeIds, setAssignedMenteeIds] = useState<string[]>([]);

  const [editingMentor, setEditingMentor] = useState<MentorItem | null>(null);
  const [editMentorName, setEditMentorName] = useState('');
  const [editMentorEmail, setEditMentorEmail] = useState('');
  const [editMentorPhone, setEditMentorPhone] = useState('');
  const [editMentorExperience, setEditMentorExperience] = useState('');
  const [editMentorSpecialization, setEditMentorSpecialization] = useState('');
  const [editMentorCapacity, setEditMentorCapacity] = useState('5');
  const [editMentorStatus, setEditMentorStatus] = useState('Active');
  const [editMentorNotes, setEditMentorNotes] = useState('');

  const [deletingMentor, setDeletingMentor] = useState<MentorItem | null>(null);

  // Queries & Mutations
  const { data: statsData } = useFetchDiscipleshipStats();
  const { data: disciplesData, isLoading: isLoadingDisciples } = useDisciples({
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const { data: allDisciplesData } = useDisciples({});
  const { data: classesData, isLoading: isLoadingClasses } =
    useFetchDiscipleshipClasses();
  const { data: mentorsData, isLoading: isLoadingMentors } = useFetchMentors();

  const { mutate: updateDisciple, isPending: isUpdatingDisciple } =
    useUpdateDisciple();
  const { mutate: recordFollowUp, isPending: isRecordingFollowUp } =
    useRecordDiscipleFollowUp();
  const { mutate: deleteDisciple, isPending: isDeletingDisciple } =
    useDeleteDisciple();

  const { mutate: createClass, isPending: isCreatingClass } =
    useCreateDiscipleshipClass();
  const { mutate: updateClass, isPending: isUpdatingClass } =
    useUpdateDiscipleshipClass();
  const { mutate: enrollStudents, isPending: isEnrollingStudents } =
    useEnrollDisciplesInClass();
  const { mutate: deleteClass, isPending: isDeletingClass } =
    useDeleteDiscipleshipClass();

  const { mutate: updateMentor, isPending: isUpdatingMentor } =
    useUpdateMentor();
  const { mutate: assignMentees, isPending: isAssigningMentees } =
    useAssignMenteesToMentor();
  const { mutate: deleteMentor, isPending: isDeletingMentor } =
    useDeleteMentor();

  const activeDisciples: DiscipleItem[] =
    (disciplesData as any)?.data?.disciples ||
    (disciplesData as any)?.disciples ||
    [];
  const allDisciples: DiscipleItem[] =
    (allDisciplesData as any)?.data?.disciples ||
    (allDisciplesData as any)?.disciples ||
    activeDisciples;
  const activeClasses: DiscipleshipClassItem[] =
    (classesData as any)?.classes || (classesData as any)?.data || [];
  const activeMentors: MentorItem[] =
    (mentorsData as any)?.mentors || (mentorsData as any)?.data || [];

  const totalDisciples = statsData?.totalDisciples ?? allDisciples.length;
  const newConverts =
    statsData?.newConverts ??
    allDisciples.filter((d) => d.currentLevel === 'New Convert').length;
  const activeDisciplesCount =
    statsData?.activeDisciples ??
    allDisciples.filter((d) => (d.status || 'Active') === 'Active').length;
  const graduatedCount =
    statsData?.graduated ??
    allDisciples.filter((d) => d.status === 'Graduated').length;
  const activeClassesCount =
    statsData?.activeClasses ??
    activeClasses.filter((c) => c.status === 'Active').length;
  const activeMentorsCount =
    statsData?.activeMentors ??
    activeMentors.filter((m) => m.status === 'Active').length;
  const averageFollowUps =
    statsData?.averageFollowUps ??
    (allDisciples.length > 0
      ? Number(
          (
            allDisciples.reduce((sum, d) => sum + (d.followUpCount || 0), 0) /
            allDisciples.length
          ).toFixed(1)
        )
      : 0);
  const mentorUtilization =
    statsData?.mentorUtilization ??
    (() => {
      const cap = activeMentors.reduce((s, m) => s + (m.maxCapacity || 0), 0);
      const cur = activeMentors.reduce(
        (s, m) => s + (m.currentMentees || 0),
        0
      );
      return cap > 0 ? Math.round((cur / cap) * 100) : 0;
    })();

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      'New Convert': 'bg-blue-100 text-blue-800',
      Growing: 'bg-green-100 text-green-800',
      Mature: 'bg-purple-100 text-purple-800',
      Leader: 'bg-orange-100 text-orange-800',
    };
    return (
      <Badge className={colors[level] || 'bg-muted text-foreground'}>
        {level || 'New Convert'}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Graduated':
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Inactive':
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

  const openEditDiscipleModal = (d: DiscipleItem) => {
    setEditingDisciple(d);
    setEditDiscipleLevel(d.currentLevel || 'New Convert');
    setEditDiscipleStatus(d.status || 'Active');
    setEditDiscipleMentorId(d.mentorRefId || '');
    setEditDiscipleProgress(String(d.progress ?? 0));
    setEditDiscipleCompletedClasses(String(d.completedClasses ?? 0));
    setEditDiscipleTotalClasses(String(d.totalClasses ?? 4));
    setEditDiscipleGoals(d.goals || '');
    setEditDiscipleNotes(d.notes || '');
  };

  const openFollowUpModal = (d: DiscipleItem) => {
    setFollowUpDisciple(d);
    setFollowUpDate(new Date().toISOString().split('T')[0]);
    setFollowUpNotes('');
    setFollowUpProgress(String(d.progress ?? 0));
    setFollowUpCompletedClasses(String(d.completedClasses ?? 0));
  };

  const openViewStudentsModal = (c: DiscipleshipClassItem) => {
    setViewingClassStudents(c);
    setEnrolledStudentIds(c.studentIds || []);
  };

  const openScheduleClassModal = (c: DiscipleshipClassItem) => {
    setSchedulingClass(c);
    setSchedStartDate(c.startDate || '');
    setSchedEndDate(c.endDate || '');
    setSchedMeetingTime(c.schedule || 'Sundays, 9:00 AM');
    setSchedStatus(c.status || 'Active');
    setSchedProgress(String(c.progress ?? 0));
  };

  const openEditClassModal = (c: DiscipleshipClassItem) => {
    setEditingClass(c);
    setEditClassName(c.name || '');
    setEditClassInstructor(c.instructor || '');
    setEditClassLevel(c.level || 'Beginner');
    setEditClassDuration(c.duration || '8 weeks');
    setEditClassCapacity(String(c.maxCapacity ?? 15));
    setEditClassStatus(c.status || 'Active');
    setEditClassProgress(String(c.progress ?? 0));
    setEditClassDesc(c.description || '');
  };

  const openAssignMentorModal = (m: MentorItem) => {
    setAssigningMentor(m);
    setAssignedMenteeIds(m.menteeIds || []);
  };

  const openEditMentorModal = (m: MentorItem) => {
    setEditingMentor(m);
    setEditMentorName(m.name || '');
    setEditMentorEmail(m.email === 'N/A' ? '' : m.email || '');
    setEditMentorPhone(m.phone === 'N/A' ? '' : m.phone || '');
    setEditMentorExperience(m.experience || '3 years');
    setEditMentorSpecialization(m.specialization || 'New Converts');
    setEditMentorCapacity(String(m.maxCapacity ?? 5));
    setEditMentorStatus(m.status || 'Active');
    setEditMentorNotes(m.notes || '');
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
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Mentor Dialog */}
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
                  Register a new discipleship mentor for your church
                </DialogDescription>
              </DialogHeader>
              <AddMentorForm
                onCloseDialog={() => setIsAddMentorDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Create Class Dialog */}
          <Dialog onOpenChange={setIsCreateClassOpen} open={isCreateClassOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create Discipleship Class</DialogTitle>
                <DialogDescription>
                  Set up a new discipleship class or study program.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="className">
                    Class Name *
                  </Label>
                  <Input
                    className="col-span-3"
                    id="className"
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. New Believers Class"
                    value={newClassName}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="instructor">
                    Instructor
                  </Label>
                  <div className="col-span-3 space-y-2">
                    {activeMentors.length > 0 && (
                      <Select
                        onValueChange={(val) => setNewClassInstructor(val)}
                        value={
                          activeMentors.some(
                            (m) => m.name === newClassInstructor
                          )
                            ? newClassInstructor
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pick from mentors or type below..." />
                        </SelectTrigger>
                        <SelectContent>
                          {activeMentors.map((m) => (
                            <SelectItem key={m.id} value={m.name}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Input
                      id="instructor"
                      onChange={(e) => setNewClassInstructor(e.target.value)}
                      placeholder="Instructor name"
                      value={newClassInstructor}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Level</Label>
                  <Select
                    onValueChange={setNewClassLevel}
                    value={newClassLevel}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
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
                    onChange={(e) => setNewClassDuration(e.target.value)}
                    placeholder="e.g., 8 weeks"
                    value={newClassDuration}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="capacity">
                    Max Capacity
                  </Label>
                  <Input
                    className="col-span-3"
                    id="capacity"
                    min="1"
                    onChange={(e) => setNewClassCapacity(e.target.value)}
                    type="number"
                    value={newClassCapacity}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="startDate">
                    Start Date
                  </Label>
                  <Input
                    className="col-span-3"
                    id="startDate"
                    onChange={(e) => setNewClassStartDate(e.target.value)}
                    type="date"
                    value={newClassStartDate}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="endDate">
                    End Date
                  </Label>
                  <Input
                    className="col-span-3"
                    id="endDate"
                    onChange={(e) => setNewClassEndDate(e.target.value)}
                    type="date"
                    value={newClassEndDate}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="classSchedule">
                    Schedule
                  </Label>
                  <Input
                    className="col-span-3"
                    id="classSchedule"
                    onChange={(e) => setNewClassSchedule(e.target.value)}
                    placeholder="e.g., Sundays, 9:00 AM"
                    value={newClassSchedule}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="classDescription">
                    Description
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="classDescription"
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    placeholder="Curriculum overview and objectives..."
                    value={newClassDesc}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsCreateClassOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isCreatingClass || !newClassName.trim()}
                  onClick={() => {
                    createClass(
                      {
                        name: newClassName.trim(),
                        instructor:
                          newClassInstructor.trim() || 'Church Instructor',
                        level: newClassLevel,
                        duration: newClassDuration.trim() || '8 weeks',
                        maxCapacity: parseInt(newClassCapacity, 10) || 15,
                        startDate: newClassStartDate,
                        endDate: newClassEndDate || undefined,
                        schedule:
                          newClassSchedule.trim() || 'Sundays, 9:00 AM',
                        description: newClassDesc.trim(),
                      },
                      {
                        onSuccess: () => {
                          setIsCreateClassOpen(false);
                          setNewClassName('');
                          setNewClassInstructor('');
                          setNewClassDesc('');
                        },
                      }
                    );
                  }}
                >
                  {isCreatingClass && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Class
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Disciple Dialog */}
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
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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
              {newConverts}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              {totalDisciples} total disciples
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Classes
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {activeClassesCount}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Currently running
            </p>
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
              {activeDisciplesCount}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Currently active
            </p>
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
              {graduatedCount}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Completed program
            </p>
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
              {activeMentorsCount}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Available mentors
            </p>
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

            {/* Disciples Tab */}
            <TabsContent className="mt-6" value="disciples">
              <Card>
                <CardHeader>
                  <CardTitle>Discipleship Tracking</CardTitle>
                  <CardDescription>
                    Monitor and follow up with disciples in your church
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                      <Input
                        className="pl-10"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search disciples, mentors, or levels..."
                        value={searchTerm}
                      />
                    </div>
                    <Select
                      onValueChange={setStatusFilter}
                      value={statusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-44">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Graduated">Graduated</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoadingDisciples ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Loading disciples...
                      </span>
                    </div>
                  ) : activeDisciples.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                      <Heart className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        No disciples found
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your search or status filter.'
                          : 'Start tracking spiritual growth by adding your first disciple.'}
                      </p>
                      <Button
                        onClick={() => setIsAddDiscipleDialogOpen(true)}
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Disciple
                      </Button>
                    </div>
                  ) : (
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
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeDisciples.map((disciple) => (
                            <TableRow
                              className="hover:bg-accent"
                              key={disciple.id || disciple._id}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      alt={disciple.name}
                                      src={
                                        disciple.avatar || '/placeholder.svg'
                                      }
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
                                    {disciple.email && (
                                      <div className="text-muted-foreground text-sm">
                                        {disciple.email}
                                      </div>
                                    )}
                                    <div className="text-muted-foreground text-xs">
                                      Started: {disciple.startDate}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-sm">
                                  {disciple.mentor || 'Unassigned'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {getLevelBadge(disciple.currentLevel)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {disciple.followUpCount || 0} visits
                                </Badge>
                              </TableCell>
                              <TableCell>{disciple.lastContact}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {disciple.completedClasses || 0}/
                                    {disciple.totalClasses || 4}
                                  </span>
                                  <p className="text-muted-foreground text-xs">
                                    classes ({disciple.progress || 0}%)
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusColor(
                                    disciple.status || 'Active'
                                  )}
                                >
                                  {disciple.status || 'Active'}
                                </Badge>
                              </TableCell>
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
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openFollowUpModal(disciple)
                                      }
                                    >
                                      <MessageSquarePlus className="mr-2 h-4 w-4" />
                                      Log Follow-up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        openEditDiscipleModal(disciple)
                                      }
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Update
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="cursor-pointer text-red-600"
                                      onClick={() =>
                                        setDeletingDisciple(disciple)
                                      }
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discipleship Classes Tab */}
            <TabsContent className="space-y-4" value="classes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Discipleship Classes</CardTitle>
                    <CardDescription>
                      Manage discipleship programs and class progression
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsCreateClassOpen(true)}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Class
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingClasses ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Loading classes...
                      </span>
                    </div>
                  ) : activeClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                      <BookOpen className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        No discipleship classes yet
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Create classes such as New Believers Class or
                        Leadership Development.
                      </p>
                      <Button
                        onClick={() => setIsCreateClassOpen(true)}
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Class
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeClasses.map((classItem) => (
                        <Card key={classItem.id || classItem._id}>
                          <CardContent className="p-6">
                            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {classItem.name}
                                  </h3>
                                  <Badge
                                    className={getLevelColor(classItem.level)}
                                  >
                                    {classItem.level}
                                  </Badge>
                                  <Badge
                                    className={getStatusColor(
                                      classItem.status
                                    )}
                                  >
                                    {classItem.status}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  Instructor: {classItem.instructor} • Duration:{' '}
                                  {classItem.duration}
                                  {classItem.schedule
                                    ? ` • ${classItem.schedule}`
                                    : ''}
                                </p>
                                {classItem.description && (
                                  <p className="text-muted-foreground text-xs">
                                    {classItem.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="font-medium text-sm">
                                  {classItem.currentStudents}/
                                  {classItem.maxCapacity} students
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {classItem.startDate}
                                  {classItem.endDate
                                    ? ` - ${classItem.endDate}`
                                    : ''}
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
                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                              <Button
                                onClick={() => openViewStudentsModal(classItem)}
                                size="sm"
                                variant="outline"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Students ({classItem.currentStudents})
                              </Button>
                              <Button
                                onClick={() =>
                                  openScheduleClassModal(classItem)
                                }
                                size="sm"
                                variant="outline"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                              </Button>
                              <Button
                                onClick={() => openEditClassModal(classItem)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => setDeletingClass(classItem)}
                                size="sm"
                                variant="outline"
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentors Tab */}
            <TabsContent className="space-y-4" value="mentors">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Mentor Management</CardTitle>
                    <CardDescription>
                      Manage mentors and their disciple assignments
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddMentorDialogOpen(true)}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Mentor
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Loading mentors...
                      </span>
                    </div>
                  ) : activeMentors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                      <Award className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        No mentors registered yet
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Add mentors to guide and follow up with new converts and
                        disciples.
                      </p>
                      <Button
                        onClick={() => setIsAddMentorDialogOpen(true)}
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Mentor
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mentor</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Current Load</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeMentors.map((mentor) => (
                          <TableRow key={mentor.id || mentor._id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={mentor.avatar || '/placeholder.svg'}
                                  />
                                  <AvatarFallback>
                                    {(mentor.name || 'M')
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-medium">
                                    {mentor.name}
                                  </span>
                                  {(mentor.mentees || []).length > 0 && (
                                    <div className="text-muted-foreground text-xs">
                                      Mentees:{' '}
                                      {mentor.mentees
                                        .map((mt) => mt.name)
                                        .join(', ')}
                                    </div>
                                  )}
                                </div>
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
                                  className="h-1.5"
                                  value={Math.min(
                                    100,
                                    (mentor.currentMentees /
                                      Math.max(1, mentor.maxCapacity)) *
                                      100
                                  )}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(
                                  mentor.status || 'Active'
                                )}
                              >
                                {mentor.status || 'Active'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  onClick={() => openAssignMentorModal(mentor)}
                                  size="sm"
                                  variant="ghost"
                                >
                                  <UserPlus className="mr-1 h-3.5 w-3.5" />
                                  Assign
                                </Button>
                                <Button
                                  onClick={() => openEditMentorModal(mentor)}
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Edit className="mr-1 h-3.5 w-3.5" />
                                  Edit
                                </Button>
                                <Button
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => setDeletingMentor(mentor)}
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tracking Tab */}
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
                    {activeClasses.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground text-sm">
                        No discipleship classes created yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {activeClasses.map((classItem) => (
                          <div
                            className="space-y-2"
                            key={classItem.id || classItem._id}
                          >
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
                              {classItem.instructor} ({classItem.status})
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                        <span className="font-bold">{totalDisciples}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Follow-ups</span>
                        <span className="font-bold">
                          {activeDisciplesCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Graduated</span>
                        <span className="font-bold">{graduatedCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Average Follow-ups</span>
                        <span className="font-bold">{averageFollowUps}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mentor Utilization</span>
                        <span className="font-bold">{mentorUtilization}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Log Follow-up Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setFollowUpDisciple(null)}
        open={!!followUpDisciple}
      >
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>
              Log Follow-up — {followUpDisciple?.name}
            </DialogTitle>
            <DialogDescription>
              Record a follow-up visit and update class or spiritual progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="followUpDate">
                Visit Date
              </Label>
              <Input
                className="col-span-3"
                id="followUpDate"
                onChange={(e) => setFollowUpDate(e.target.value)}
                type="date"
                value={followUpDate}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="followUpClasses">
                Completed Classes
              </Label>
              <Input
                className="col-span-3"
                id="followUpClasses"
                min="0"
                onChange={(e) => setFollowUpCompletedClasses(e.target.value)}
                type="number"
                value={followUpCompletedClasses}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="followUpProgress">
                Progress (%)
              </Label>
              <Input
                className="col-span-3"
                id="followUpProgress"
                max="100"
                min="0"
                onChange={(e) => setFollowUpProgress(e.target.value)}
                type="number"
                value={followUpProgress}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="followUpNotes">
                Visit Notes
              </Label>
              <Textarea
                className="col-span-3"
                id="followUpNotes"
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="Summary of conversation, prayer points, or next steps..."
                rows={3}
                value={followUpNotes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setFollowUpDisciple(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isRecordingFollowUp}
              onClick={() => {
                if (!followUpDisciple) return;
                recordFollowUp(
                  {
                    id: followUpDisciple.id || followUpDisciple._id,
                    date: followUpDate,
                    notes: followUpNotes.trim() || undefined,
                    progress:
                      followUpProgress !== ''
                        ? Number(followUpProgress)
                        : undefined,
                    completedClasses:
                      followUpCompletedClasses !== ''
                        ? Number(followUpCompletedClasses)
                        : undefined,
                  },
                  {
                    onSuccess: () => setFollowUpDisciple(null),
                  }
                );
              }}
            >
              {isRecordingFollowUp && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Disciple Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingDisciple(null)}
        open={!!editingDisciple}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Update Disciple — {editingDisciple?.name}</DialogTitle>
            <DialogDescription>
              Update level, mentor assignment, class completion, and status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Mentor</Label>
              <Select
                onValueChange={setEditDiscipleMentorId}
                value={editDiscipleMentorId || 'unassigned'}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {activeMentors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.currentMentees}/{m.maxCapacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current Level</Label>
              <Select
                onValueChange={setEditDiscipleLevel}
                value={editDiscipleLevel}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Convert">New Convert</SelectItem>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Mature">Mature</SelectItem>
                  <SelectItem value="Leader">Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                onValueChange={setEditDiscipleStatus}
                value={editDiscipleStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Graduated">Graduated</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editDiscProgress">
                Progress (%)
              </Label>
              <Input
                className="col-span-3"
                id="editDiscProgress"
                max="100"
                min="0"
                onChange={(e) => setEditDiscipleProgress(e.target.value)}
                type="number"
                value={editDiscipleProgress}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editDiscCompClasses">
                Classes Completed
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="editDiscCompClasses"
                  min="0"
                  onChange={(e) =>
                    setEditDiscipleCompletedClasses(e.target.value)
                  }
                  type="number"
                  value={editDiscipleCompletedClasses}
                />
                <span className="text-muted-foreground">of</span>
                <Input
                  id="editDiscTotalClasses"
                  min="1"
                  onChange={(e) => setEditDiscipleTotalClasses(e.target.value)}
                  type="number"
                  value={editDiscipleTotalClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editDiscGoals">
                Goals
              </Label>
              <Textarea
                className="col-span-3"
                id="editDiscGoals"
                onChange={(e) => setEditDiscipleGoals(e.target.value)}
                rows={2}
                value={editDiscipleGoals}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editDiscNotes">
                Notes
              </Label>
              <Textarea
                className="col-span-3"
                id="editDiscNotes"
                onChange={(e) => setEditDiscipleNotes(e.target.value)}
                rows={3}
                value={editDiscipleNotes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setEditingDisciple(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdatingDisciple}
              onClick={() => {
                if (!editingDisciple) return;
                updateDisciple(
                  {
                    id: editingDisciple.id || editingDisciple._id,
                    mentorId:
                      editDiscipleMentorId === 'unassigned'
                        ? ''
                        : editDiscipleMentorId,
                    currentLevel: editDiscipleLevel,
                    status: editDiscipleStatus,
                    progress: Number(editDiscipleProgress) || 0,
                    completedClasses:
                      Number(editDiscipleCompletedClasses) || 0,
                    totalClasses: Number(editDiscipleTotalClasses) || 4,
                    goals: editDiscipleGoals,
                    notes: editDiscipleNotes,
                  },
                  {
                    onSuccess: () => setEditingDisciple(null),
                  }
                );
              }}
            >
              {isUpdatingDisciple && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Disciple Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingDisciple(null)}
        open={!!deletingDisciple}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove from Discipleship Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <strong>{deletingDisciple?.name}</strong> from the discipleship
              program?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDeletingDisciple(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeletingDisciple}
              onClick={() => {
                if (!deletingDisciple) return;
                deleteDisciple(deletingDisciple.id || deletingDisciple._id, {
                  onSuccess: () => setDeletingDisciple(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingDisciple && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View & Enroll Class Students Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setViewingClassStudents(null)}
        open={!!viewingClassStudents}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              Class Students — {viewingClassStudents?.name}
            </DialogTitle>
            <DialogDescription>
              Select disciples enrolled in this class (
              {enrolledStudentIds.length}/{viewingClassStudents?.maxCapacity || 15}{' '}
              capacity).
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-4">
            {allDisciples.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">
                No disciples registered yet. Add a disciple first.
              </p>
            ) : (
              allDisciples.map((d) => (
                <div
                  className="flex items-center justify-between rounded-md border p-2.5"
                  key={d.id}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={enrolledStudentIds.includes(d.id)}
                      id={`enroll-disc-${d.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEnrolledStudentIds([...enrolledStudentIds, d.id]);
                        } else {
                          setEnrolledStudentIds(
                            enrolledStudentIds.filter((id) => id !== d.id)
                          );
                        }
                      }}
                    />
                    <div>
                      <Label
                        className="cursor-pointer font-medium text-sm"
                        htmlFor={`enroll-disc-${d.id}`}
                      >
                        {d.name}
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        {d.email || d.currentLevel}
                      </p>
                    </div>
                  </div>
                  {getLevelBadge(d.currentLevel)}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setViewingClassStudents(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isEnrollingStudents}
              onClick={() => {
                if (!viewingClassStudents) return;
                enrollStudents(
                  {
                    classId:
                      viewingClassStudents.id || viewingClassStudents._id,
                    discipleIds: enrolledStudentIds,
                  },
                  {
                    onSuccess: () => setViewingClassStudents(null),
                  }
                );
              }}
            >
              {isEnrollingStudents && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Class Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setSchedulingClass(null)}
        open={!!schedulingClass}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              Class Schedule — {schedulingClass?.name}
            </DialogTitle>
            <DialogDescription>
              Update meeting schedule, start/end dates, status, and curriculum
              progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="schedMeetingTime">
                Meeting Time
              </Label>
              <Input
                className="col-span-3"
                id="schedMeetingTime"
                onChange={(e) => setSchedMeetingTime(e.target.value)}
                placeholder="e.g. Sundays, 9:00 AM"
                value={schedMeetingTime}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="schedStartDate">
                Start Date
              </Label>
              <Input
                className="col-span-3"
                id="schedStartDate"
                onChange={(e) => setSchedStartDate(e.target.value)}
                type="date"
                value={schedStartDate}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="schedEndDate">
                End Date
              </Label>
              <Input
                className="col-span-3"
                id="schedEndDate"
                onChange={(e) => setSchedEndDate(e.target.value)}
                type="date"
                value={schedEndDate}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select onValueChange={setSchedStatus} value={schedStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="schedProgress">
                Progress (%)
              </Label>
              <Input
                className="col-span-3"
                id="schedProgress"
                max="100"
                min="0"
                onChange={(e) => setSchedProgress(e.target.value)}
                type="number"
                value={schedProgress}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSchedulingClass(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isUpdatingClass}
              onClick={() => {
                if (!schedulingClass) return;
                updateClass(
                  {
                    id: schedulingClass.id || schedulingClass._id,
                    schedule: schedMeetingTime.trim(),
                    startDate: schedStartDate,
                    endDate: schedEndDate,
                    status: schedStatus,
                    progress: Number(schedProgress) || 0,
                  },
                  {
                    onSuccess: () => setSchedulingClass(null),
                  }
                );
              }}
            >
              {isUpdatingClass && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingClass(null)}
        open={!!editingClass}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Discipleship Class</DialogTitle>
            <DialogDescription>
              Update class details, instructor, capacity, and progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassName">
                Class Name *
              </Label>
              <Input
                className="col-span-3"
                id="editClassName"
                onChange={(e) => setEditClassName(e.target.value)}
                value={editClassName}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassInstructor">
                Instructor
              </Label>
              <Input
                className="col-span-3"
                id="editClassInstructor"
                onChange={(e) => setEditClassInstructor(e.target.value)}
                value={editClassInstructor}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Level</Label>
              <Select onValueChange={setEditClassLevel} value={editClassLevel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassDuration">
                Duration
              </Label>
              <Input
                className="col-span-3"
                id="editClassDuration"
                onChange={(e) => setEditClassDuration(e.target.value)}
                value={editClassDuration}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassCap">
                Max Capacity
              </Label>
              <Input
                className="col-span-3"
                id="editClassCap"
                min="1"
                onChange={(e) => setEditClassCapacity(e.target.value)}
                type="number"
                value={editClassCapacity}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                onValueChange={setEditClassStatus}
                value={editClassStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassProg">
                Progress (%)
              </Label>
              <Input
                className="col-span-3"
                id="editClassProg"
                max="100"
                min="0"
                onChange={(e) => setEditClassProgress(e.target.value)}
                type="number"
                value={editClassProgress}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editClassDesc">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="editClassDesc"
                onChange={(e) => setEditClassDesc(e.target.value)}
                value={editClassDesc}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEditingClass(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isUpdatingClass || !editClassName.trim()}
              onClick={() => {
                if (!editingClass) return;
                updateClass(
                  {
                    id: editingClass.id || editingClass._id,
                    name: editClassName.trim(),
                    instructor: editClassInstructor.trim(),
                    level: editClassLevel,
                    duration: editClassDuration.trim(),
                    maxCapacity: parseInt(editClassCapacity, 10) || 15,
                    status: editClassStatus,
                    progress: parseInt(editClassProgress, 10) || 0,
                    description: editClassDesc.trim(),
                  },
                  {
                    onSuccess: () => setEditingClass(null),
                  }
                );
              }}
            >
              {isUpdatingClass && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingClass(null)}
        open={!!deletingClass}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Discipleship Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>{deletingClass?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingClass(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingClass}
              onClick={() => {
                if (!deletingClass) return;
                deleteClass(deletingClass.id || deletingClass._id, {
                  onSuccess: () => setDeletingClass(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingClass && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Mentees to Mentor Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setAssigningMentor(null)}
        open={!!assigningMentor}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              Assign Mentees — {assigningMentor?.name}
            </DialogTitle>
            <DialogDescription>
              Select disciples to be mentored by {assigningMentor?.name} (
              {assignedMenteeIds.length}/{assigningMentor?.maxCapacity || 5}{' '}
              capacity).
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-4">
            {allDisciples.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">
                No disciples registered yet. Add a disciple first.
              </p>
            ) : (
              allDisciples.map((d) => (
                <div
                  className="flex items-center justify-between rounded-md border p-2.5"
                  key={d.id}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={assignedMenteeIds.includes(d.id)}
                      id={`assign-mentee-${d.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAssignedMenteeIds([...assignedMenteeIds, d.id]);
                        } else {
                          setAssignedMenteeIds(
                            assignedMenteeIds.filter((id) => id !== d.id)
                          );
                        }
                      }}
                    />
                    <div>
                      <Label
                        className="cursor-pointer font-medium text-sm"
                        htmlFor={`assign-mentee-${d.id}`}
                      >
                        {d.name}
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Current mentor: {d.mentor || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  {getLevelBadge(d.currentLevel)}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setAssigningMentor(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isAssigningMentees}
              onClick={() => {
                if (!assigningMentor) return;
                assignMentees(
                  {
                    mentorId: assigningMentor.id || assigningMentor._id,
                    discipleIds: assignedMenteeIds,
                  },
                  {
                    onSuccess: () => setAssigningMentor(null),
                  }
                );
              }}
            >
              {isAssigningMentees && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mentor Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingMentor(null)}
        open={!!editingMentor}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Mentor — {editingMentor?.name}</DialogTitle>
            <DialogDescription>
              Update mentor contact details, specialization, capacity, and
              status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorName">
                Name *
              </Label>
              <Input
                className="col-span-3"
                id="editMentorName"
                onChange={(e) => setEditMentorName(e.target.value)}
                value={editMentorName}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorEmail">
                Email
              </Label>
              <Input
                className="col-span-3"
                id="editMentorEmail"
                onChange={(e) => setEditMentorEmail(e.target.value)}
                type="email"
                value={editMentorEmail}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorPhone">
                Phone
              </Label>
              <Input
                className="col-span-3"
                id="editMentorPhone"
                onChange={(e) => setEditMentorPhone(e.target.value)}
                value={editMentorPhone}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorExp">
                Experience
              </Label>
              <Input
                className="col-span-3"
                id="editMentorExp"
                onChange={(e) => setEditMentorExperience(e.target.value)}
                value={editMentorExperience}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorSpec">
                Specialization
              </Label>
              <Input
                className="col-span-3"
                id="editMentorSpec"
                onChange={(e) => setEditMentorSpecialization(e.target.value)}
                value={editMentorSpecialization}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="editMentorCap">
                Max Mentees
              </Label>
              <Input
                className="col-span-3"
                id="editMentorCap"
                min="1"
                onChange={(e) => setEditMentorCapacity(e.target.value)}
                type="number"
                value={editMentorCapacity}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                onValueChange={setEditMentorStatus}
                value={editMentorStatus}
              >
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
              <Label className="text-right" htmlFor="editMentorNotes">
                Notes
              </Label>
              <Textarea
                className="col-span-3"
                id="editMentorNotes"
                onChange={(e) => setEditMentorNotes(e.target.value)}
                value={editMentorNotes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEditingMentor(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isUpdatingMentor || !editMentorName.trim()}
              onClick={() => {
                if (!editingMentor) return;
                updateMentor(
                  {
                    id: editingMentor.id || editingMentor._id,
                    name: editMentorName.trim(),
                    email: editMentorEmail.trim() || 'N/A',
                    phone: editMentorPhone.trim() || 'N/A',
                    experience: editMentorExperience.trim(),
                    specialization: editMentorSpecialization.trim(),
                    maxCapacity: parseInt(editMentorCapacity, 10) || 5,
                    status: editMentorStatus,
                    notes: editMentorNotes.trim(),
                  },
                  {
                    onSuccess: () => setEditingMentor(null),
                  }
                );
              }}
            >
              {isUpdatingMentor && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Mentor Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingMentor(null)}
        open={!!deletingMentor}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <strong>{deletingMentor?.name}</strong> from mentors? Any assigned
              disciples will become unassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingMentor(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingMentor}
              onClick={() => {
                if (!deletingMentor) return;
                deleteMentor(deletingMentor.id || deletingMentor._id, {
                  onSuccess: () => setDeletingMentor(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingMentor && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove Mentor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
