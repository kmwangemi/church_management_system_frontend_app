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
import { UserCombobox } from '@/components/user-combobox';
import {
  type CounselorItem,
  useAddPrayerRequestUpdate,
  useCreateCounselor,
  useDeleteCounselor,
  useDeletePrayerRequest,
  useFetchCounselors,
  useFetchPrayerRequestStats,
  useFetchPrayerRequests,
  useUpdateCounselor,
  useUpdatePrayerCount,
  useUpdatePrayerRequest,
} from '@/lib/hooks/church/prayer-request/use-prayer-request-queries';
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Heart,
  Loader2,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';

const CATEGORY_COLOR_MAP: Record<string, string> = {
  Health: 'bg-red-100 text-red-800',
  Financial: 'bg-green-100 text-green-800',
  Family: 'bg-pink-100 text-pink-800',
  Relationship: 'bg-blue-100 text-blue-800',
  Career: 'bg-purple-100 text-purple-800',
  Spiritual: 'bg-yellow-100 text-yellow-800',
  Thanksgiving: 'bg-emerald-100 text-emerald-800',
  Guidance: 'bg-indigo-100 text-indigo-800',
  Other: 'bg-gray-100 text-gray-800',
};

const CATEGORY_BAR_COLOR_MAP: Record<string, string> = {
  Health: 'bg-red-600',
  Family: 'bg-pink-600',
  Career: 'bg-purple-600',
  Financial: 'bg-green-600',
  Spiritual: 'bg-yellow-600',
  Thanksgiving: 'bg-emerald-600',
  Guidance: 'bg-indigo-600',
  Other: 'bg-blue-600',
};

export default function PrayerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('requests');
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false);

  // Counselor Dialog states
  const [isAddCounselorOpen, setIsAddCounselorOpen] = useState(false);
  const [newCounselor, setNewCounselor] = useState({
    memberId: '',
    name: '',
    email: '',
    phone: '',
    specialization: 'General Counseling, Family',
    maxCapacity: '10',
    experience: '5 years',
  });
  const [counselorToEdit, setCounselorToEdit] = useState<CounselorItem | null>(
    null
  );
  const [editCounselorForm, setEditCounselorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    maxCapacity: '10',
    experience: '',
    status: 'Available',
  });
  const [counselorCasesModal, setCounselorCasesModal] =
    useState<CounselorItem | null>(null);

  // Prayer Request Action Dialog states
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [requestForUpdate, setRequestForUpdate] = useState<any | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [requestForAssign, setRequestForAssign] = useState<any | null>(null);
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>('none');
  const [requestToDelete, setRequestToDelete] = useState<any | null>(null);

  // Queries
  const { data: prayersData, isLoading: isLoadingPrayers } =
    useFetchPrayerRequests({
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter,
      priority: priorityFilter === 'all' ? '' : priorityFilter,
      category: categoryFilter === 'all' ? '' : categoryFilter,
    });
  const { data: statsResponse, isLoading: isLoadingStats } =
    useFetchPrayerRequestStats();
  const { data: counselorsResponse, isLoading: isLoadingCounselors } =
    useFetchCounselors();

  // Mutations
  const { mutate: updatePrayerCount } = useUpdatePrayerCount();
  const { mutate: deletePrayerRequest, isPending: isDeletingRequest } =
    useDeletePrayerRequest();
  const { mutate: updatePrayerRequest, isPending: isUpdatingRequest } =
    useUpdatePrayerRequest();
  const { mutateAsync: addRequestUpdate, isPending: isAddingUpdate } =
    useAddPrayerRequestUpdate();

  const { mutateAsync: createCounselor, isPending: isCreatingCounselor } =
    useCreateCounselor();
  const { mutateAsync: updateCounselor, isPending: isUpdatingCounselor } =
    useUpdateCounselor();
  const { mutate: deleteCounselor, isPending: isDeletingCounselor } =
    useDeleteCounselor();

  const serverPrayers =
    (prayersData as any)?.data?.prayerRequests ||
    (prayersData as any)?.prayerRequests ||
    [];
  const activePrayers = (Array.isArray(serverPrayers) ? serverPrayers : []).map(
    (r: any) => ({
      ...r,
      id: r.id || r._id,
      status: r.status
        ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
        : 'Active',
      priority: r.priority
        ? r.priority.charAt(0).toUpperCase() + r.priority.slice(1)
        : 'Medium',
      category: r.category || 'Other',
      dateSubmitted: r.dateSubmitted || r.createdAt || new Date().toISOString(),
      prayerCount: Number(r.prayerCount ?? 0),
      updates: Array.isArray(r.updates) ? r.updates : [],
    })
  );

  const filteredRequests = activePrayers.filter((request: any) => {
    const matchesSearch =
      !searchTerm ||
      (request.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.category || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.requester || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const counselors: CounselorItem[] =
    counselorsResponse?.data?.counselors ||
    counselorsResponse?.counselors ||
    [];

  const statsPayload = statsResponse?.data;
  const stats = {
    totalRequests: statsPayload?.totalRequests ?? activePrayers.length,
    activeRequests:
      statsPayload?.activeRequests ??
      activePrayers.filter((r: any) =>
        ['active', 'in progress'].includes((r.status || '').toLowerCase())
      ).length,
    answeredRequests:
      statsPayload?.answeredRequests ??
      activePrayers.filter(
        (r: any) => (r.status || '').toLowerCase() === 'answered'
      ).length,
    activeCounselors:
      statsPayload?.activeCounselors ??
      counselors.filter((c) => c.status === 'Available').length,
    totalPrayers:
      statsPayload?.totalPrayers ??
      activePrayers.reduce(
        (sum: number, r: any) => sum + Number(r.prayerCount || 0),
        0
      ),
  };

  const categoriesList = statsPayload?.categories || [
    { slug: 'health', name: 'Health', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
    { slug: 'family', name: 'Family', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
    { slug: 'career', name: 'Career', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
    { slug: 'financial', name: 'Financial', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
    { slug: 'spiritual', name: 'Spiritual', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
    { slug: 'thanksgiving', name: 'Thanksgiving', count: 0, activeCount: 0, answeredCount: 0, percentage: 0 },
  ];

  const getPriorityBadge = (priority: string) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'in progress':
      case 'progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
        );
      case 'answered':
        return <Badge className="bg-green-100 text-green-800">Answered</Badge>;
      case 'closed':
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

  const handleAddCounselorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounselor.name.trim() && !newCounselor.memberId) return;
    await createCounselor({
      memberId: newCounselor.memberId || undefined,
      name: newCounselor.name.trim(),
      email: newCounselor.email.trim(),
      phone: newCounselor.phone.trim(),
      specialization: newCounselor.specialization
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      maxCapacity: Number(newCounselor.maxCapacity) || 10,
      experience: newCounselor.experience.trim() || '3+ years',
    });
    setIsAddCounselorOpen(false);
    setNewCounselor({
      memberId: '',
      name: '',
      email: '',
      phone: '',
      specialization: 'General Counseling, Family',
      maxCapacity: '10',
      experience: '5 years',
    });
  };

  const handleOpenEditCounselor = (counselor: CounselorItem) => {
    setCounselorToEdit(counselor);
    setEditCounselorForm({
      name: counselor.name || '',
      email: counselor.email || '',
      phone: counselor.phone || '',
      specialization: Array.isArray(counselor.specialization)
        ? counselor.specialization.join(', ')
        : String(counselor.specialization || ''),
      maxCapacity: String(counselor.maxCapacity || 10),
      experience: counselor.experience || '',
      status:
        counselor.status === 'Unavailable' ? 'Unavailable' : 'Available',
    });
  };

  const handleSaveEditCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselorToEdit) return;
    await updateCounselor({
      counselorId: counselorToEdit.id,
      payload: {
        name: editCounselorForm.name.trim(),
        email: editCounselorForm.email.trim(),
        phone: editCounselorForm.phone.trim(),
        specialization: editCounselorForm.specialization
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        maxCapacity: Number(editCounselorForm.maxCapacity) || 10,
        experience: editCounselorForm.experience.trim(),
        status: editCounselorForm.status,
      },
    });
    setCounselorToEdit(null);
  };

  const handleAddUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForUpdate || !updateMessage.trim()) return;
    await addRequestUpdate({
      id: requestForUpdate.id,
      message: updateMessage.trim(),
      status: updateStatus || undefined,
    });
    setRequestForUpdate(null);
    setUpdateMessage('');
    setUpdateStatus('');
  };

  const handleAssignCounselorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForAssign) return;
    updatePrayerRequest(
      {
        id: requestForAssign.id,
        payload: {
          counselorId:
            selectedCounselorId === 'none' ? '' : selectedCounselorId,
        },
      },
      {
        onSuccess: () => {
          setRequestForAssign(null);
        },
      }
    );
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
          <Dialog
            onOpenChange={setIsAddCounselorOpen}
            open={isAddCounselorOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Counselor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add New Counselor</DialogTitle>
                <DialogDescription>
                  Register a church leader or counselor for prayer and guidance
                  ministry.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4 py-2" onSubmit={handleAddCounselorSubmit}>
                <div className="space-y-2">
                  <Label>Select Church Member (Optional)</Label>
                  <UserCombobox
                    onChange={(member: any) => {
                      if (member) {
                        const fullName =
                          member.name ||
                          `${member.firstName || ''} ${member.lastName || ''}`.trim();
                        setNewCounselor((prev) => ({
                          ...prev,
                          memberId: member.id || member._id || '',
                          name: fullName || prev.name,
                          email: member.email || prev.email,
                          phone:
                            member.phoneNumber ||
                            member.phone ||
                            prev.phone,
                        }));
                      }
                    }}
                    onValueChange={(val) =>
                      setNewCounselor((prev) => ({
                        ...prev,
                        memberId: val || '',
                      }))
                    }
                    placeholder="Search member to prefill details..."
                    value={newCounselor.memberId}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="counselorName">Name *</Label>
                  <Input
                    id="counselorName"
                    onChange={(e) =>
                      setNewCounselor({ ...newCounselor, name: e.target.value })
                    }
                    placeholder="e.g., Pastor John Smith"
                    required
                    value={newCounselor.name}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="counselorEmail">Email</Label>
                    <Input
                      id="counselorEmail"
                      onChange={(e) =>
                        setNewCounselor({
                          ...newCounselor,
                          email: e.target.value,
                        })
                      }
                      placeholder="pastor@church.org"
                      type="email"
                      value={newCounselor.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="counselorPhone">Phone</Label>
                    <Input
                      id="counselorPhone"
                      onChange={(e) =>
                        setNewCounselor({
                          ...newCounselor,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+254700000000"
                      value={newCounselor.phone}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">
                    Specializations (comma-separated)
                  </Label>
                  <Input
                    id="specialization"
                    onChange={(e) =>
                      setNewCounselor({
                        ...newCounselor,
                        specialization: e.target.value,
                      })
                    }
                    placeholder="e.g., Marriage, Youth, Family"
                    value={newCounselor.specialization}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Max Cases</Label>
                    <Input
                      id="maxCapacity"
                      min={1}
                      onChange={(e) =>
                        setNewCounselor({
                          ...newCounselor,
                          maxCapacity: e.target.value,
                        })
                      }
                      type="number"
                      value={newCounselor.maxCapacity}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      onChange={(e) =>
                        setNewCounselor({
                          ...newCounselor,
                          experience: e.target.value,
                        })
                      }
                      placeholder="e.g., 8 years"
                      value={newCounselor.experience}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsAddCounselorOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isCreatingCounselor} type="submit">
                    {isCreatingCounselor ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Counselor'
                    )}
                  </Button>
                </DialogFooter>
              </form>
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
            <p className="mt-1 text-muted-foreground text-xs">
              {stats.totalPrayers} total prayers offered
            </p>
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
              <User className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.activeCounselors}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Available for counseling
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests">Prayer Requests</TabsTrigger>
              <TabsTrigger value="counselors">Counselors</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Prayer Requests Tab */}
            <TabsContent className="mt-6" value="requests">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Prayer Requests</CardTitle>
                <CardDescription>
                  Manage and assign prayer requests to counselors
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                    <Input
                      className="pl-10"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search prayer requests..."
                      value={searchTerm}
                    />
                  </div>
                  <Select
                    onValueChange={setCategoryFilter}
                    value={categoryFilter}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Spiritual">Spiritual</SelectItem>
                      <SelectItem value="Thanksgiving">Thanksgiving</SelectItem>
                      <SelectItem value="Guidance">Guidance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setStatusFilter} value={statusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={setPriorityFilter}
                    value={priorityFilter}
                  >
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

                {isLoadingPrayers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      Loading prayer requests...
                    </span>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
                    <Heart className="mb-3 h-10 w-10 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">
                      No prayer requests found
                    </h3>
                    <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                      {searchTerm ||
                      statusFilter !== 'all' ||
                      priorityFilter !== 'all' ||
                      categoryFilter !== 'all'
                        ? 'No prayer requests match your current filters.'
                        : 'Submit the first prayer request for your church community.'}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsAddRequestDialogOpen(true)}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Prayer Request
                    </Button>
                  </div>
                ) : (
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
                          <TableRow
                            className="hover:bg-accent"
                            key={request.id}
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-foreground">
                                  {request.title}
                                </div>
                                <div className="max-w-xs truncate text-muted-foreground text-sm">
                                  {request.description}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {!request.isAnonymous &&
                                    request.requesterAvatar && (
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          alt={request.requester}
                                          src={request.requesterAvatar}
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
                                  {request.counselorName && (
                                    <Badge
                                      className="text-xs"
                                      variant="secondary"
                                    >
                                      Counselor: {request.counselorName}
                                    </Badge>
                                  )}
                                  {request.updates?.length > 0 && (
                                    <Badge
                                      className="text-xs"
                                      variant="outline"
                                    >
                                      {request.updates.length} update
                                      {request.updates.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {request.category}
                              </Badge>
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
                                  {request.dateSubmitted
                                    ? new Date(
                                        request.dateSubmitted
                                      ).toLocaleDateString()
                                    : 'N/A'}
                                </span>
                              </div>
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
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const targetId =
                                        request._id || request.id;
                                      if (targetId) updatePrayerCount(targetId);
                                    }}
                                  >
                                    <Heart className="mr-2 h-4 w-4" />
                                    Pray for This
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setRequestForUpdate(request);
                                      setUpdateMessage('');
                                      setUpdateStatus(request.status);
                                    }}
                                  >
                                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                                    Add Update
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setRequestForAssign(request);
                                      setSelectedCounselorId(
                                        request.counselorId || 'none'
                                      );
                                    }}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Assign Counselor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    disabled={
                                      (request.status || '').toLowerCase() ===
                                      'answered'
                                    }
                                    onClick={() =>
                                      updatePrayerRequest({
                                        id: request._id || request.id,
                                        payload: { status: 'Answered' },
                                      })
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Answered
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => setRequestToDelete(request)}
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
                )}
              </CardContent>
            </TabsContent>

            {/* Counselors Tab */}
            <TabsContent className="mt-6 space-y-4" value="counselors">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Counselor Management</CardTitle>
                    <CardDescription>
                      Manage counselors and their case assignments
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddCounselorOpen(true)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Counselor
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingCounselors ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Loading counselors...
                      </span>
                    </div>
                  ) : counselors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
                      <User className="mb-3 h-10 w-10 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        No counselors registered yet
                      </h3>
                      <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                        Add pastors, elders, or trained counselors to assign and
                        follow up on prayer and counseling requests.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setIsAddCounselorOpen(true)}
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Counselor
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Counselor</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Current Cases</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {counselors.map((counselor) => (
                          <TableRow key={counselor.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={counselor.avatar || ''} />
                                  <AvatarFallback>
                                    {(counselor.name || 'C')
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
                                <div>{counselor.email || '—'}</div>
                                <div className="text-muted-foreground">
                                  {counselor.phone || '—'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(counselor.specialization || [])
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
                                {(counselor.specialization || []).length >
                                  2 && (
                                  <Badge className="text-xs" variant="outline">
                                    +{counselor.specialization.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  {counselor.currentCases}/
                                  {counselor.maxCapacity} cases
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-secondary">
                                  <div
                                    className="h-1.5 rounded-full bg-blue-600 transition-all"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.round(
                                          (counselor.currentCases /
                                            Math.max(
                                              1,
                                              counselor.maxCapacity
                                            )) *
                                            100
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{counselor.experience}</TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(counselor.status)}
                              >
                                {counselor.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  onClick={() =>
                                    setCounselorCasesModal(counselor)
                                  }
                                  size="sm"
                                  variant="ghost"
                                >
                                  View Cases
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleOpenEditCounselor(counselor)
                                  }
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Edit className="mr-1 h-3.5 w-3.5" />
                                  Edit
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

            {/* Categories Tab */}
            <TabsContent className="mt-6 space-y-4" value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Prayer Categories</CardTitle>
                  <CardDescription>
                    Overview of prayer request categories and live counts (click
                    a category to view its requests)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoriesList.map((category) => {
                      const colorClass =
                        CATEGORY_COLOR_MAP[category.name] ||
                        'bg-blue-100 text-blue-800';
                      return (
                        <Card
                          className="cursor-pointer transition-shadow hover:shadow-md"
                          key={category.name}
                          onClick={() => {
                            setCategoryFilter(category.name);
                            setSelectedTab('requests');
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {category.name}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {category.answeredCount} answered •{' '}
                                  {category.activeCount} active
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-2xl">
                                  {category.count}
                                </div>
                                <Badge
                                  className={colorClass}
                                  variant="secondary"
                                >
                                  {category.activeCount} Active
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent className="mt-6" value="analytics">
              {isLoadingStats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading analytics...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Categories</CardTitle>
                      <CardDescription>
                        Distribution of prayer requests across categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoriesList.map((cat) => {
                          const barColor =
                            CATEGORY_BAR_COLOR_MAP[cat.name] || 'bg-blue-600';
                          return (
                            <div className="space-y-1.5" key={cat.name}>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {cat.name}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {cat.count} request
                                  {cat.count === 1 ? '' : 's'} ({cat.percentage}
                                  %)
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                  className={`h-2 rounded-full transition-all ${barColor}`}
                                  style={{ width: `${cat.percentage || 0}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
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
                      {counselors.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                          No counselors registered yet. Add counselors to track
                          case workload.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {counselors.map((counselor) => {
                            const pct = Math.min(
                              100,
                              Math.round(
                                (counselor.currentCases /
                                  Math.max(1, counselor.maxCapacity)) *
                                  100
                              )
                            );
                            return (
                              <div className="space-y-2" key={counselor.id}>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">
                                    {counselor.name}
                                  </span>
                                  <span className="text-muted-foreground text-sm">
                                    {counselor.currentCases}/
                                    {counselor.maxCapacity} cases ({pct}%)
                                  </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                  <div
                                    className="h-2 rounded-full bg-blue-600 transition-all"
                                    style={{
                                      width: `${pct}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Prayer Request Details Modal */}
      <Dialog
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        open={!!selectedRequest}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.title}</DialogTitle>
            <DialogDescription>
              Submitted by{' '}
              {selectedRequest?.isAnonymous
                ? 'Anonymous'
                : selectedRequest?.requester}{' '}
              on{' '}
              {selectedRequest?.dateSubmitted
                ? new Date(selectedRequest.dateSubmitted).toLocaleDateString()
                : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedRequest.category}</Badge>
                {getPriorityBadge(selectedRequest.priority)}
                {getStatusBadge(selectedRequest.status)}
                <Badge variant="secondary">
                  <Heart className="mr-1 h-3.5 w-3.5 text-red-500" />
                  {selectedRequest.prayerCount} prayers
                </Badge>
                {selectedRequest.counselorName && (
                  <Badge variant="outline">
                    Counselor: {selectedRequest.counselorName}
                  </Badge>
                )}
              </div>

              <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed">
                {selectedRequest.description}
              </div>

              {/* Updates History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    Progress & Testimony Updates (
                    {selectedRequest.updates?.length || 0})
                  </h4>
                  <Button
                    onClick={() => {
                      setRequestForUpdate(selectedRequest);
                      setUpdateMessage('');
                      setUpdateStatus(selectedRequest.status);
                      setSelectedRequest(null);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <MessageSquarePlus className="mr-1.5 h-4 w-4" />
                    Add Update
                  </Button>
                </div>
                {selectedRequest.updates?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.updates.map((upd: any, idx: number) => (
                      <div
                        className="rounded-md border p-3 text-sm"
                        key={upd.id || idx}
                      >
                        <div className="flex items-center justify-between text-muted-foreground text-xs">
                          <span>{upd.author || 'Church Admin'}</span>
                          <span>
                            {upd.date
                              ? new Date(upd.date).toLocaleDateString()
                              : ''}
                          </span>
                        </div>
                        <p className="mt-1">{upd.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-sm">
                    No updates recorded yet.
                  </p>
                )}
              </div>

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  onClick={() => {
                    updatePrayerCount(selectedRequest.id);
                    setSelectedRequest({
                      ...selectedRequest,
                      prayerCount: (selectedRequest.prayerCount || 0) + 1,
                    });
                  }}
                  variant="outline"
                >
                  <Heart className="mr-2 h-4 w-4 text-red-500" />
                  Pray for This
                </Button>
                <div className="flex space-x-2">
                  {selectedRequest.status !== 'Answered' && (
                    <Button
                      onClick={() => {
                        updatePrayerRequest(
                          {
                            id: selectedRequest.id,
                            payload: { status: 'Answered' },
                          },
                          {
                            onSuccess: () => setSelectedRequest(null),
                          }
                        );
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Answered
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedRequest(null)}
                    variant="ghost"
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Update Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setRequestForUpdate(null)}
        open={!!requestForUpdate}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Prayer Request Update</DialogTitle>
            <DialogDescription>
              Record a follow-up note or praise report for &ldquo;
              {requestForUpdate?.title}&rdquo;
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddUpdateSubmit}>
            <div className="space-y-2">
              <Label htmlFor="upd-msg">Update Message *</Label>
              <Textarea
                id="upd-msg"
                onChange={(e) => setUpdateMessage(e.target.value)}
                placeholder="Share progress, counseling notes, or how God answered this prayer..."
                required
                rows={4}
                value={updateMessage}
              />
            </div>
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select onValueChange={setUpdateStatus} value={updateStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Answered">Answered</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setRequestForUpdate(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isAddingUpdate} type="submit">
                {isAddingUpdate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Counselor Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setRequestForAssign(null)}
        open={!!requestForAssign}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Counselor</DialogTitle>
            <DialogDescription>
              Assign a counselor to follow up on &ldquo;
              {requestForAssign?.title}&rdquo;
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAssignCounselorSubmit}>
            <div className="space-y-2">
              <Label>Select Counselor</Label>
              <Select
                onValueChange={setSelectedCounselorId}
                value={selectedCounselorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a counselor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {counselors.map((c) => (
                    <SelectItem
                      disabled={
                        c.status === 'Full' &&
                        c.id !== requestForAssign?.counselorId
                      }
                      key={c.id}
                      value={c.id}
                    >
                      {c.name} ({c.currentCases}/{c.maxCapacity} cases —{' '}
                      {c.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setRequestForAssign(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isUpdatingRequest} type="submit">
                {isUpdatingRequest ? 'Saving...' : 'Save Assignment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Counselor Cases Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setCounselorCasesModal(null)}
        open={!!counselorCasesModal}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Assigned Cases — {counselorCasesModal?.name}
            </DialogTitle>
            <DialogDescription>
              Currently managing {counselorCasesModal?.currentCases || 0} of{' '}
              {counselorCasesModal?.maxCapacity || 10} maximum cases
            </DialogDescription>
          </DialogHeader>
          {counselorCasesModal && (
            <div className="space-y-4">
              {!counselorCasesModal.assignedCases ||
              counselorCasesModal.assignedCases.length === 0 ? (
                <p className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
                  No active prayer or counseling requests are currently assigned
                  to {counselorCasesModal.name}.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {counselorCasesModal.assignedCases.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            {c.title}
                          </TableCell>
                          <TableCell>{c.requester}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{c.category}</Badge>
                          </TableCell>
                          <TableCell>{getPriorityBadge(c.priority)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => {
                                updatePrayerRequest(
                                  {
                                    id: c.id,
                                    payload: { status: 'Answered' },
                                  },
                                  {
                                    onSuccess: () =>
                                      setCounselorCasesModal(null),
                                  }
                                );
                              }}
                              size="sm"
                              variant="outline"
                            >
                              Mark Answered
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <DialogFooter>
                <Button
                  onClick={() => setCounselorCasesModal(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Counselor Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setCounselorToEdit(null)}
        open={!!counselorToEdit}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Counselor</DialogTitle>
            <DialogDescription>
              Update counselor details, capacity, or availability status
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveEditCounselor}>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                onChange={(e) =>
                  setEditCounselorForm({
                    ...editCounselorForm,
                    name: e.target.value,
                  })
                }
                required
                value={editCounselorForm.name}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  onChange={(e) =>
                    setEditCounselorForm({
                      ...editCounselorForm,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  value={editCounselorForm.email}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  onChange={(e) =>
                    setEditCounselorForm({
                      ...editCounselorForm,
                      phone: e.target.value,
                    })
                  }
                  value={editCounselorForm.phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specializations (comma-separated)</Label>
              <Input
                onChange={(e) =>
                  setEditCounselorForm({
                    ...editCounselorForm,
                    specialization: e.target.value,
                  })
                }
                value={editCounselorForm.specialization}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Max Cases</Label>
                <Input
                  min={1}
                  onChange={(e) =>
                    setEditCounselorForm({
                      ...editCounselorForm,
                      maxCapacity: e.target.value,
                    })
                  }
                  type="number"
                  value={editCounselorForm.maxCapacity}
                />
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  onChange={(e) =>
                    setEditCounselorForm({
                      ...editCounselorForm,
                      experience: e.target.value,
                    })
                  }
                  value={editCounselorForm.experience}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(val) =>
                    setEditCounselorForm({
                      ...editCounselorForm,
                      status: val,
                    })
                  }
                  value={editCounselorForm.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                disabled={isDeletingCounselor}
                onClick={() => {
                  if (!counselorToEdit) return;
                  deleteCounselor(counselorToEdit.id, {
                    onSuccess: () => setCounselorToEdit(null),
                  });
                }}
                type="button"
                variant="destructive"
              >
                Remove Counselor
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCounselorToEdit(null)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isUpdatingCounselor} type="submit">
                  {isUpdatingCounselor ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Prayer Request Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setRequestToDelete(null)}
        open={!!requestToDelete}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Prayer Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{requestToDelete?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRequestToDelete(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingRequest}
              onClick={() => {
                if (!requestToDelete) return;
                deletePrayerRequest(requestToDelete.id, {
                  onSuccess: () => setRequestToDelete(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingRequest ? 'Deleting...' : 'Delete Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
