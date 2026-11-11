'use client';

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
  type ContributionCampaign,
  useAddContributionEntry,
  useCreateContribution,
  useDeleteContribution,
  useDeleteContributionEntry,
  useFetchContributionStats,
  useFetchContributions,
  useUpdateContribution,
} from '@/lib/hooks/church/contribution/use-contribution-queries';
import {
  Calendar,
  Church,
  DollarSign,
  Download,
  Edit,
  Eye,
  Gift,
  Heart,
  Loader2,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getTypeIcon = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('wedding') || t.includes('medical')) return Heart;
  if (t.includes('baby') || t.includes('dedication')) return Gift;
  return Church;
};

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState('contributions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Create campaign dialog state
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [targetAmount, setTargetAmount] = useState('');
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [eventStatus, setEventStatus] = useState('Active');
  const [eventDesc, setEventDesc] = useState('');

  // View details & entries dialog state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Edit campaign dialog state
  const [editingCampaign, setEditingCampaign] =
    useState<ContributionCampaign | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    event: '',
    type: 'Wedding',
    targetAmount: '',
    date: '',
    status: 'Active',
    description: '',
  });

  // Record donor contribution dialog state
  const [givingCampaign, setGivingCampaign] =
    useState<ContributionCampaign | null>(null);
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [entryForm, setEntryForm] = useState({
    contributorName: '',
    amount: '',
    paymentMethod: 'M-Pesa',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Queries & Mutations
  const { data: contributionsRes, isLoading } = useFetchContributions(
    1,
    searchTerm,
    selectedType,
    selectedStatus
  );
  const { data: statsRes } = useFetchContributionStats();
  const { mutateAsync: createContribution, isPending: isCreating } =
    useCreateContribution();
  const { mutateAsync: updateContribution, isPending: isUpdating } =
    useUpdateContribution();
  const { mutate: deleteContribution } = useDeleteContribution();
  const { mutateAsync: addEntry, isPending: isAddingEntry } =
    useAddContributionEntry();
  const { mutate: deleteEntry } = useDeleteContributionEntry();

  const activeContributions: ContributionCampaign[] =
    contributionsRes?.contributions ||
    (Array.isArray(contributionsRes?.data) ? contributionsRes.data : []);

  const filteredContributions = activeContributions.filter((contribution) => {
    const matchesSearch =
      !searchTerm ||
      (contribution.event || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (contribution.type || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (contribution.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' ||
      (contribution.type || '').toLowerCase() === selectedType.toLowerCase();
    const matchesStatus =
      selectedStatus === 'all' ||
      (contribution.status || '').toLowerCase() ===
        selectedStatus.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const liveStats = statsRes?.data || statsRes?.stats;
  const stats = {
    totalContributions:
      liveStats?.totalContributions ??
      activeContributions.reduce(
        (sum, c) => sum + (Number(c.amount) || 0),
        0
      ),
    totalTarget:
      liveStats?.totalTarget ??
      activeContributions.reduce(
        (sum, c) => sum + (Number(c.targetAmount) || 0),
        0
      ),
    totalEvents: liveStats?.totalEvents ?? activeContributions.length,
    activeContributions:
      liveStats?.activeContributions ??
      activeContributions.filter((c) =>
        ['active', 'ongoing'].includes((c.status || '').toLowerCase())
      ).length,
    totalContributors:
      liveStats?.totalContributors ??
      activeContributions.reduce(
        (sum, c) => sum + (Number(c.contributors) || 0),
        0
      ),
    thisMonthContributions: liveStats?.thisMonthContributions ?? 0,
    averagePerMonth: liveStats?.averagePerMonth ?? 0,
    monthlyTrends: liveStats?.monthlyTrends || [],
    topContributors: liveStats?.topContributors || [],
    byType: liveStats?.byType || [
      { type: 'Wedding', count: 0, total: 0, targetTotal: 0 },
      { type: 'Burial', count: 0, total: 0, targetTotal: 0 },
      { type: 'Baby Dedication', count: 0, total: 0, targetTotal: 0 },
      { type: 'Medical Emergency', count: 0, total: 0, targetTotal: 0 },
      { type: 'Church Building', count: 0, total: 0, targetTotal: 0 },
    ],
  };

  const selectedCampaign =
    activeContributions.find(
      (c) => c.id === selectedCampaignId || c._id === selectedCampaignId
    ) || null;

  const handleCreateCampaign = async () => {
    if (!eventTitle.trim()) {
      toast.error('Please enter an event name.');
      return;
    }
    await createContribution({
      event: eventTitle.trim(),
      type: eventType,
      targetAmount: Number(targetAmount) || 0,
      date: eventDate,
      status: eventStatus,
      description: eventDesc.trim(),
    });
    setIsNewOpen(false);
    setEventTitle('');
    setTargetAmount('');
    setEventDesc('');
  };

  const handleOpenEdit = (campaign: ContributionCampaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      event: campaign.event || '',
      type: campaign.type || 'Wedding',
      targetAmount: String(campaign.targetAmount ?? 0),
      date: campaign.date
        ? String(campaign.date).slice(0, 10)
        : new Date().toISOString().split('T')[0],
      status: campaign.status || 'Active',
      description: campaign.description || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCampaign) return;
    if (!editForm.event.trim()) {
      toast.error('Event name is required.');
      return;
    }
    await updateContribution({
      id: editingCampaign.id || editingCampaign._id,
      payload: {
        ...editForm,
        targetAmount: Number(editForm.targetAmount) || 0,
      },
    });
    setIsEditOpen(false);
    setEditingCampaign(null);
  };

  const handleOpenRecordContribution = (campaign: ContributionCampaign) => {
    setGivingCampaign(campaign);
    setEntryForm({
      contributorName: '',
      amount: '',
      paymentMethod: 'M-Pesa',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsGiveOpen(true);
  };

  const handleSaveContributionEntry = async () => {
    if (!givingCampaign) return;
    const amt = Number(entryForm.amount);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid contribution amount.');
      return;
    }
    await addEntry({
      id: givingCampaign.id || givingCampaign._id,
      payload: {
        contributorName: entryForm.contributorName.trim() || 'Anonymous',
        amount: amt,
        paymentMethod: entryForm.paymentMethod,
        date: entryForm.date,
        notes: entryForm.notes.trim(),
      },
    });
    setIsGiveOpen(false);
    setGivingCampaign(null);
  };

  const handleExportCsv = () => {
    const rows: string[][] = [
      [
        'Event',
        'Type',
        'Date',
        'Amount Raised (KES)',
        'Target Amount (KES)',
        'Contributors',
        'Status',
        'Description',
      ],
    ];
    for (const c of filteredContributions) {
      rows.push([
        c.event || '',
        c.type || '',
        c.date || '',
        String(c.amount ?? 0),
        String(c.targetAmount ?? 0),
        String(c.contributors ?? 0),
        c.status || 'Active',
        c.description || '',
      ]);
    }
    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-contributions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Contributions exported to CSV.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Contributions</h1>
          <p className="text-muted-foreground">
            Manage special event contributions and fundraising
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleExportCsv} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog onOpenChange={setIsNewOpen} open={isNewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Contribution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle>Create New Contribution</DialogTitle>
                <DialogDescription>
                  Set up a new contribution campaign
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="event">
                    Event
                  </Label>
                  <Input
                    className="col-span-3"
                    id="event"
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Youth Camp Fundraiser"
                    value={eventTitle}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="type">
                    Type
                  </Label>
                  <Select onValueChange={setEventType} value={eventType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Burial">Burial</SelectItem>
                      <SelectItem value="Baby Dedication">
                        Baby Dedication
                      </SelectItem>
                      <SelectItem value="Medical Emergency">
                        Medical Emergency
                      </SelectItem>
                      <SelectItem value="Church Building">
                        Church Building
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="target">
                    Target (KES)
                  </Label>
                  <Input
                    className="col-span-3"
                    id="target"
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    type="number"
                    value={targetAmount}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="date">
                    Event Date
                  </Label>
                  <Input
                    className="col-span-3"
                    id="date"
                    onChange={(e) => setEventDate(e.target.value)}
                    type="date"
                    value={eventDate}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="status">
                    Status
                  </Label>
                  <Select onValueChange={setEventStatus} value={eventStatus}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    className="col-span-3"
                    id="description"
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="Campaign details..."
                    value={eventDesc}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsNewOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  disabled={isCreating || !eventTitle.trim()}
                  onClick={handleCreateCampaign}
                >
                  {isCreating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Contribution
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Contributions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {Number(stats.totalContributions || 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Target: KES {Number(stats.totalTarget || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats.activeContributions}
            </div>
            <p className="text-muted-foreground text-xs">
              Out of {stats.totalEvents} total events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.totalContributors}</div>
            <p className="text-muted-foreground text-xs">
              Recorded contributors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {Number(stats.thisMonthContributions || 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Current month collections
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        className="space-y-4"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value="contributions">All Contributions</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="types">By Type</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="contributions">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Burial">Burial</SelectItem>
                <SelectItem value="Baby Dedication">Baby Dedication</SelectItem>
                <SelectItem value="Medical Emergency">
                  Medical Emergency
                </SelectItem>
                <SelectItem value="Church Building">Church Building</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedStatus} value={selectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contributions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
              <CardDescription>
                Track all contribution campaigns and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Raised / Target</TableHead>
                    <TableHead>Contributors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell className="py-8 text-center" colSpan={7}>
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredContributions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={7}
                      >
                        No contribution campaigns found. Click "New
                        Contribution" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContributions.map((contribution) => (
                      <TableRow key={contribution.id || contribution._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {contribution.event}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {contribution.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contribution.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {contribution.date
                            ? new Date(contribution.date).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            KES {Number(contribution.amount || 0).toLocaleString()}
                          </div>
                          {Number(contribution.targetAmount) > 0 && (
                            <div className="text-muted-foreground text-xs">
                              of KES{' '}
                              {Number(
                                contribution.targetAmount
                              ).toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{contribution.contributors ?? 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              contribution.status === 'Active'
                                ? 'default'
                                : contribution.status === 'Completed'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {contribution.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() =>
                                handleOpenRecordContribution(contribution)
                              }
                              size="sm"
                              variant="default"
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Record
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedCampaignId(
                                  contribution.id || contribution._id
                                );
                                setIsDetailsOpen(true);
                              }}
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleOpenEdit(contribution)}
                              size="sm"
                              variant="ghost"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                const targetId =
                                  contribution.id || contribution._id;
                                if (targetId) deleteContribution(targetId);
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="statistics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.monthlyTrends.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No monthly trend data recorded yet.
                    </p>
                  ) : (
                    stats.monthlyTrends.map((item) => (
                      <div
                        className="flex items-center justify-between"
                        key={item.month}
                      >
                        <span className="text-sm">{item.month}</span>
                        <span className="font-bold">
                          KES {Number(item.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm">Average per Month</span>
                    <span className="font-bold text-green-600">
                      KES {Number(stats.averagePerMonth || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topContributors.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No individual contributions recorded yet. Click "Record" on
                    any campaign to add contributors.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.topContributors.map((donor) => (
                      <div
                        className="flex items-center justify-between"
                        key={donor.name}
                      >
                        <span className="text-sm">{donor.name}</span>
                        <span className="font-bold">
                          KES {Number(donor.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="types">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.byType.map((typeItem) => {
              const IconComponent = getTypeIcon(typeItem.type);
              return (
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  key={typeItem.type}
                  onClick={() => {
                    setSelectedType(typeItem.type);
                    setActiveTab('contributions');
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                      {typeItem.type}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">
                      KES {Number(typeItem.total || 0).toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {typeItem.count} events
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Campaign Details & Entries Dialog */}
      <Dialog onOpenChange={setIsDetailsOpen} open={isDetailsOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.event}</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.type} •{' '}
              {selectedCampaign?.date
                ? new Date(selectedCampaign.date).toLocaleDateString()
                : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-4">
                <div>
                  <div className="text-muted-foreground text-xs">
                    Amount Raised
                  </div>
                  <div className="font-bold text-xl text-green-600">
                    KES {Number(selectedCampaign.amount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Target Goal
                  </div>
                  <div className="font-semibold text-lg">
                    KES{' '}
                    {Number(
                      selectedCampaign.targetAmount || 0
                    ).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Contributors
                  </div>
                  <div className="font-semibold text-lg">
                    {selectedCampaign.contributors ?? 0}
                  </div>
                </div>
                <Badge>{selectedCampaign.status}</Badge>
              </div>
              {selectedCampaign.description && (
                <p className="text-muted-foreground text-sm">
                  {selectedCampaign.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Contributor Entries</h4>
                <Button
                  onClick={() =>
                    handleOpenRecordContribution(selectedCampaign)
                  }
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Contribution
                </Button>
              </div>

              {!selectedCampaign.entries ||
              selectedCampaign.entries.length === 0 ? (
                <div className="rounded-md border py-6 text-center text-muted-foreground text-sm">
                  No contributor entries recorded yet for this campaign.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contributor</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCampaign.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="font-medium text-sm">
                              {entry.contributorName}
                            </div>
                            {entry.notes && (
                              <div className="text-muted-foreground text-xs">
                                {entry.notes}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {entry.paymentMethod}
                          </TableCell>
                          <TableCell className="text-sm">
                            {entry.date
                              ? new Date(entry.date).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            KES {Number(entry.amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() =>
                                deleteEntry({
                                  id:
                                    selectedCampaign.id ||
                                    selectedCampaign._id,
                                  entryId: entry.id,
                                })
                              }
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsDetailsOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Contribution Entry Dialog */}
      <Dialog onOpenChange={setIsGiveOpen} open={isGiveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Record Contribution — {givingCampaign?.event}
            </DialogTitle>
            <DialogDescription>
              Log a member or donor contribution toward this campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Contributor Name</Label>
              <Input
                onChange={(e) =>
                  setEntryForm({
                    ...entryForm,
                    contributorName: e.target.value,
                  })
                }
                placeholder="e.g., John & Mary Doe (or leave blank for Anonymous)"
                value={entryForm.contributorName}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (KES)</Label>
                <Input
                  onChange={(e) =>
                    setEntryForm({ ...entryForm, amount: e.target.value })
                  }
                  placeholder="e.g., 5000"
                  type="number"
                  value={entryForm.amount}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  onValueChange={(v) =>
                    setEntryForm({ ...entryForm, paymentMethod: v })
                  }
                  value={entryForm.paymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                onChange={(e) =>
                  setEntryForm({ ...entryForm, date: e.target.value })
                }
                type="date"
                value={entryForm.date}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                onChange={(e) =>
                  setEntryForm({ ...entryForm, notes: e.target.value })
                }
                placeholder="Reference number or remark..."
                value={entryForm.notes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsGiveOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isAddingEntry}
              onClick={handleSaveContributionEntry}
            >
              {isAddingEntry ? 'Recording...' : 'Save Contribution'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog onOpenChange={setIsEditOpen} open={isEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contribution Campaign</DialogTitle>
            <DialogDescription>
              Update campaign details, target amount, or status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input
                onChange={(e) =>
                  setEditForm({ ...editForm, event: e.target.value })
                }
                value={editForm.event}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  onValueChange={(v) => setEditForm({ ...editForm, type: v })}
                  value={editForm.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Burial">Burial</SelectItem>
                    <SelectItem value="Baby Dedication">
                      Baby Dedication
                    </SelectItem>
                    <SelectItem value="Medical Emergency">
                      Medical Emergency
                    </SelectItem>
                    <SelectItem value="Church Building">
                      Church Building
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                  value={editForm.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Amount (KES)</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, targetAmount: e.target.value })
                  }
                  type="number"
                  value={editForm.targetAmount}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                  type="date"
                  value={editForm.date}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={3}
                value={editForm.description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isUpdating} onClick={handleSaveEdit}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
