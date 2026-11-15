'use client';

import { AddAssetForm } from '@/components/forms/add-asset-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  useCreateAssetMaintenance,
  useDeleteAsset,
  useDeleteAssetMaintenance,
  useFetchAssetMaintenance,
  useFetchAssets,
  useFetchAssetStats,
  useImportAssets,
  useUpdateAsset,
} from '@/lib/hooks/church/asset/use-asset-queries';
import {
  ASSET_CONDITION_OPTIONS,
  ASSET_MAINTENANCE_FREQUENCY_OPTIONS,
  ASSET_STATUS_OPTIONS,
  ASSET_TYPE_OPTIONS,
} from '@/lib/utils';
import {
  AlertTriangle,
  Building,
  Calendar,
  Car,
  CheckCircle,
  DollarSign,
  Download,
  Edit,
  Filter,
  Home,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getAssetIcon = (type: string) => {
  switch ((type || '').toLowerCase()) {
    case 'vehicle':
      return <Car className="h-5 w-5" />;
    case 'property':
      return <Building className="h-5 w-5" />;
    case 'equipment':
      return <Wrench className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
  }
};

const getConditionBadge = (condition: string) => {
  switch ((condition || '').toLowerCase()) {
    case 'excellent':
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800">
          Excellent
        </Badge>
      );
    case 'good':
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-800">
          Good
        </Badge>
      );
    case 'fair':
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
          Fair
        </Badge>
      );
    case 'poor':
      return (
        <Badge className="border-red-200 bg-red-100 text-red-800">Poor</Badge>
      );
    default:
      return <Badge variant="secondary">{condition || 'Good'}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge className="border-orange-200 bg-orange-100 text-orange-800">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Maintenance
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status || 'Active'}</Badge>;
  }
};

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Advanced filter state
  const [showFilters, setShowFilters] = useState(false);
  const [conditionFilter, setConditionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit asset state
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    type: 'equipment',
    value: '',
    purchaseDate: '',
    condition: 'good',
    status: 'active',
    serialNumber: '',
    warranty: '',
    supplier: '',
    maintenanceSchedule: 'monthly',
    nextMaintenance: '',
    notes: '',
  });

  // Schedule Maintenance state
  const [maintenanceAsset, setMaintenanceAsset] = useState<any | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [maintForm, setMaintForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Routine Maintenance',
    cost: '0',
    performedBy: '',
    status: 'Scheduled',
    nextMaintenanceDate: '',
    setAssetStatus: 'maintenance',
    description: '',
  });

  // Maintenance History state
  const [historyAsset, setHistoryAsset] = useState<any | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  // Import CSV dialog state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvText, setCsvText] = useState('');

  // Queries & Mutations
  const { data: assetsData, isLoading } = useFetchAssets(
    1,
    searchTerm,
    selectedTab,
    conditionFilter,
    statusFilter
  );
  const { data: statsRes } = useFetchAssetStats();
  const { mutate: deleteAsset } = useDeleteAsset();
  const { mutateAsync: updateAsset, isPending: isUpdatingAsset } =
    useUpdateAsset();
  const { mutateAsync: importAssetsMutation, isPending: isImporting } =
    useImportAssets();
  const {
    mutateAsync: createMaintenance,
    isPending: isCreatingMaintenance,
  } = useCreateAssetMaintenance();
  const { mutate: deleteMaintenance } = useDeleteAssetMaintenance();

  const historyAssetId = historyAsset?._id || historyAsset?.id || null;
  const { data: maintHistoryData, isLoading: isLoadingHistory } =
    useFetchAssetMaintenance(historyAssetId);

  const activeAssets: any[] =
    (assetsData as any)?.assets ||
    (Array.isArray((assetsData as any)?.data) ? (assetsData as any)?.data : []);

  const filteredAssets = activeAssets.filter((asset: any) => {
    const matchesSearch =
      !searchTerm ||
      (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serialNumber || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const assetType = (asset.type || '').toLowerCase();
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'vehicles' && assetType === 'vehicle') ||
      (selectedTab === 'property' && assetType === 'property') ||
      (selectedTab === 'equipment' &&
        assetType !== 'vehicle' &&
        assetType !== 'property');

    const matchesCondition =
      conditionFilter === 'all' ||
      (asset.condition || '').toLowerCase() === conditionFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      (asset.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesTab && matchesCondition && matchesStatus;
  });

  const liveStats = statsRes?.data || statsRes?.stats;
  const stats = {
    total: liveStats?.total ?? activeAssets.length,
    totalValue:
      liveStats?.totalValue ??
      activeAssets.reduce(
        (sum: number, asset: any) => sum + (Number(asset.value) || 0),
        0
      ),
    vehicles:
      liveStats?.vehicles ??
      activeAssets.filter((a: any) => (a.type || '').toLowerCase() === 'vehicle')
        .length,
    properties:
      liveStats?.properties ??
      activeAssets.filter(
        (a: any) => (a.type || '').toLowerCase() === 'property'
      ).length,
    equipment:
      liveStats?.equipment ??
      activeAssets.filter(
        (a: any) =>
          (a.type || '').toLowerCase() !== 'vehicle' &&
          (a.type || '').toLowerCase() !== 'property'
      ).length,
    maintenance:
      liveStats?.maintenance ??
      activeAssets.filter(
        (a: any) => (a.status || '').toLowerCase() === 'maintenance'
      ).length,
  };

  const handleExportAssets = () => {
    const rows: string[][] = [
      [
        'Asset Name',
        'Type',
        'Category',
        'Value (KES)',
        'Condition',
        'Status',
        'Location',
        'Serial Number',
        'Warranty',
        'Purchase Date',
        'Next Maintenance',
      ],
    ];

    for (const a of filteredAssets) {
      rows.push([
        a.name || '',
        a.type || 'Equipment',
        a.category || '',
        String(a.value ?? 0),
        a.condition || 'Good',
        a.status || 'Active',
        a.location || 'Main Campus',
        a.serialNumber || 'N/A',
        a.warranty || 'N/A',
        a.purchaseDate ? String(a.purchaseDate).slice(0, 10) : '',
        a.nextMaintenance ? String(a.nextMaintenance).slice(0, 10) : '',
      ]);
    }

    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `church-assets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Assets exported to CSV successfully.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(String(ev.target?.result || ''));
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast.error('Please upload a CSV file or paste CSV rows to import.');
      return;
    }

    const parsedAssets: Array<Record<string, any>> = [];
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i]
        .split(',')
        .map((c) => c.trim().replace(/^"|"$/g, ''));
      if (!cols[0]) continue;
      parsedAssets.push({
        name: cols[0],
        type: cols[1] || 'Equipment',
        value: Number(cols[2]) || 0,
        condition: (cols[3] || 'good').toLowerCase(),
        status: (cols[4] || 'active').toLowerCase(),
        serialNumber: cols[5] || '',
        warranty: cols[6] || '',
      });
    }

    if (parsedAssets.length === 0) {
      toast.error('No valid asset rows found in CSV.');
      return;
    }

    await importAssetsMutation(parsedAssets);
    setCsvText('');
    setIsImportDialogOpen(false);
  };

  const handleOpenEditAsset = (asset: any) => {
    setEditingAsset(asset);
    setEditForm({
      name: asset.name || '',
      type: (asset.type || 'equipment').toLowerCase(),
      value: String(asset.value ?? 0),
      purchaseDate: asset.purchaseDate
        ? String(asset.purchaseDate).slice(0, 10)
        : new Date().toISOString().split('T')[0],
      condition: (asset.condition || 'good').toLowerCase(),
      status: (asset.status || 'active').toLowerCase(),
      serialNumber:
        asset.serialNumber && asset.serialNumber !== 'N/A'
          ? asset.serialNumber
          : '',
      warranty:
        asset.warranty && asset.warranty !== 'N/A' ? asset.warranty : '',
      supplier: asset.supplier || '',
      maintenanceSchedule: asset.maintenanceSchedule || 'monthly',
      nextMaintenance: asset.nextMaintenance
        ? String(asset.nextMaintenance).slice(0, 10)
        : '',
      notes: asset.notes || asset.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEditAsset = async () => {
    if (!editingAsset) return;
    if (!editForm.name.trim()) {
      toast.error('Asset name is required.');
      return;
    }
    const id = editingAsset._id || editingAsset.id;
    await updateAsset({
      id,
      payload: {
        ...editForm,
        value: editForm.value,
      },
    });
    setIsEditDialogOpen(false);
    setEditingAsset(null);
  };

  const handleOpenScheduleMaintenance = (asset: any) => {
    setMaintenanceAsset(asset);
    setMaintForm({
      date: new Date().toISOString().split('T')[0],
      type: 'Routine Maintenance',
      cost: '0',
      performedBy: 'Church Maintenance Team',
      status: 'Scheduled',
      nextMaintenanceDate: asset.nextMaintenance
        ? String(asset.nextMaintenance).slice(0, 10)
        : '',
      setAssetStatus: 'maintenance',
      description: '',
    });
    setIsMaintenanceDialogOpen(true);
  };

  const handleSaveMaintenance = async () => {
    if (!maintenanceAsset) return;
    if (!maintForm.description.trim()) {
      toast.error('Please enter a maintenance description.');
      return;
    }
    const assetId = maintenanceAsset._id || maintenanceAsset.id;
    await createMaintenance({
      assetId,
      payload: {
        date: maintForm.date,
        type: maintForm.type,
        cost: Number(maintForm.cost) || 0,
        performedBy: maintForm.performedBy,
        status: maintForm.status,
        nextMaintenanceDate: maintForm.nextMaintenanceDate || undefined,
        setAssetStatus: maintForm.setAssetStatus,
        description: maintForm.description,
      },
    });
    setIsMaintenanceDialogOpen(false);
    setMaintenanceAsset(null);
  };

  const handleOpenMaintenanceHistory = (asset: any) => {
    setHistoryAsset(asset);
    setIsHistoryDialogOpen(true);
  };

  const maintenanceRecords =
    maintHistoryData?.data?.records || maintHistoryData?.records || [];
  const totalMaintenanceCost =
    maintHistoryData?.data?.totalCost ?? maintHistoryData?.totalCost ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Asset Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage church assets, properties, and equipment
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsImportDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleExportAssets} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Add a new asset to the church inventory
                </DialogDescription>
              </DialogHeader>
              <AddAssetForm onCloseDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Assets
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.total}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              All registered assets
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Value
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              KES {stats.totalValue.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Combined asset value
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Vehicles
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Car className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.vehicles}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Transportation assets
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Maintenance Due
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.maintenance}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  className="pl-10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assets by name, category, serial number, or location..."
                  value={searchTerm}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowFilters((prev) => !prev)}
                  size="sm"
                  variant={showFilters ? 'default' : 'outline'}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filter
                </Button>
              </div>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Condition</Label>
                  <Select
                    onValueChange={setConditionFilter}
                    value={conditionFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      {ASSET_CONDITION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select onValueChange={setStatusFilter} value={statusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {ASSET_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setConditionFilter('all');
                      setStatusFilter('all');
                      setSearchTerm('');
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="vehicles">
                Vehicles ({stats.vehicles})
              </TabsTrigger>
              <TabsTrigger value="property">
                Properties ({stats.properties})
              </TabsTrigger>
              <TabsTrigger value="equipment">
                Equipment ({stats.equipment})
              </TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value={selectedTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Maintenance</TableHead>
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
                    ) : (
                      filteredAssets.map((asset: any) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={asset.id || asset._id}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="rounded-lg bg-muted p-2">
                                {getAssetIcon(asset.type)}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {asset.name}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {asset.location || 'Main Campus'}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  Serial: {asset.serialNumber || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{asset.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              KES {Number(asset.value || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getConditionBadge(asset.condition)}
                          </TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground text-sm">
                                {asset.nextMaintenance
                                  ? new Date(
                                      asset.nextMaintenance
                                    ).toLocaleDateString()
                                  : 'Not Scheduled'}
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
                                  onClick={() => handleOpenEditAsset(asset)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Asset
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenScheduleMaintenance(asset)
                                  }
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Maintenance
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenMaintenanceHistory(asset)
                                  }
                                >
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Maintenance History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => {
                                    const targetId = asset._id || asset.id;
                                    if (targetId) deleteAsset(targetId);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Asset
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {!isLoading && filteredAssets.length === 0 && (
                <div className="py-12 text-center">
                  <Building className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No assets found
                  </h3>
                  <p className="text-muted-foreground">
                    Click "Add Asset" to register a church asset or adjust your
                    filters.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      <Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update asset details, condition, valuation, and maintenance
              schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  value={editForm.name}
                />
              </div>
              <div className="space-y-2">
                <Label>Asset Type</Label>
                <Select
                  onValueChange={(v) => setEditForm({ ...editForm, type: v })}
                  value={editForm.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value (KES)</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, value: e.target.value })
                  }
                  type="number"
                  value={editForm.value}
                />
              </div>
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, purchaseDate: e.target.value })
                  }
                  type="date"
                  value={editForm.purchaseDate}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, condition: v })
                  }
                  value={editForm.condition}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_CONDITION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
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
                    {ASSET_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Serial Number</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, serialNumber: e.target.value })
                  }
                  value={editForm.serialNumber}
                />
              </div>
              <div className="space-y-2">
                <Label>Warranty</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({ ...editForm, warranty: e.target.value })
                  }
                  value={editForm.warranty}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maintenance Frequency</Label>
                <Select
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, maintenanceSchedule: v })
                  }
                  value={editForm.maintenanceSchedule}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_MAINTENANCE_FREQUENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Next Maintenance Date</Label>
                <Input
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      nextMaintenance: e.target.value,
                    })
                  }
                  type="date"
                  value={editForm.nextMaintenance}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                rows={3}
                value={editForm.notes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isUpdatingAsset} onClick={handleSaveEditAsset}>
              {isUpdatingAsset ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule / Log Maintenance Dialog */}
      <Dialog
        onOpenChange={setIsMaintenanceDialogOpen}
        open={isMaintenanceDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Schedule / Log Maintenance — {maintenanceAsset?.name}
            </DialogTitle>
            <DialogDescription>
              Record completed maintenance or schedule upcoming maintenance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maintenance Date</Label>
                <Input
                  onChange={(e) =>
                    setMaintForm({ ...maintForm, date: e.target.value })
                  }
                  type="date"
                  value={maintForm.date}
                />
              </div>
              <div className="space-y-2">
                <Label>Maintenance Type</Label>
                <Select
                  onValueChange={(v) => setMaintForm({ ...maintForm, type: v })}
                  value={maintForm.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Maintenance">
                      Routine Maintenance
                    </SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost (KES)</Label>
                <Input
                  onChange={(e) =>
                    setMaintForm({ ...maintForm, cost: e.target.value })
                  }
                  type="number"
                  value={maintForm.cost}
                />
              </div>
              <div className="space-y-2">
                <Label>Performed By / Vendor</Label>
                <Input
                  onChange={(e) =>
                    setMaintForm({ ...maintForm, performedBy: e.target.value })
                  }
                  placeholder="e.g., AutoCare Garage"
                  value={maintForm.performedBy}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maintenance Record Status</Label>
                <Select
                  onValueChange={(v) =>
                    setMaintForm({
                      ...maintForm,
                      status: v,
                      setAssetStatus:
                        v === 'Completed' ? 'active' : 'maintenance',
                    })
                  }
                  value={maintForm.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Update Asset Status To</Label>
                <Select
                  onValueChange={(v) =>
                    setMaintForm({ ...maintForm, setAssetStatus: v })
                  }
                  value={maintForm.setAssetStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description / Work Details</Label>
              <Textarea
                onChange={(e) =>
                  setMaintForm({ ...maintForm, description: e.target.value })
                }
                placeholder="Describe the maintenance work required or completed..."
                rows={3}
                value={maintForm.description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsMaintenanceDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isCreatingMaintenance}
              onClick={handleSaveMaintenance}
            >
              {isCreatingMaintenance ? 'Saving...' : 'Save Maintenance'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance History Dialog */}
      <Dialog onOpenChange={setIsHistoryDialogOpen} open={isHistoryDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Maintenance History — {historyAsset?.name}
            </DialogTitle>
            <DialogDescription>
              Total Maintenance Spend: KES{' '}
              {Number(totalMaintenanceCost).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {isLoadingHistory ? (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : maintenanceRecords.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No maintenance records logged yet for this asset.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type & Description</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceRecords.map((rec) => (
                    <TableRow key={rec.id || rec._id}>
                      <TableCell className="text-sm">
                        {rec.date
                          ? new Date(rec.date).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{rec.type}</div>
                        <div className="text-muted-foreground text-xs">
                          {rec.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {rec.performedBy}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rec.status === 'Completed' ? 'default' : 'secondary'
                          }
                        >
                          {rec.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        KES {Number(rec.cost || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            if (historyAssetId) {
                              deleteMaintenance({
                                assetId: historyAssetId,
                                recordId: rec.id || rec._id,
                              });
                            }
                          }}
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
          <DialogFooter>
            <Button
              onClick={() => {
                setIsHistoryDialogOpen(false);
                if (historyAsset) handleOpenScheduleMaintenance(historyAsset);
              }}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Log Maintenance
            </Button>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Assets CSV Dialog */}
      <Dialog onOpenChange={setIsImportDialogOpen} open={isImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Assets from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file or paste rows in format:{' '}
              <code>Name, Type, Value, Condition, Status, SerialNumber, Warranty</code>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select CSV File</Label>
              <Input accept=".csv,text/csv" onChange={handleFileUpload} type="file" />
            </div>
            <div className="space-y-2">
              <Label>Or Paste CSV Rows</Label>
              <Textarea
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={
                  'Church Bus #1, Vehicle, 450000, Good, Active, CB001-2024, 3 years\nProjector - Sanctuary, Equipment, 85000, Excellent, Active, PJ-2024, 2 years'
                }
                rows={5}
                value={csvText}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsImportDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isImporting} onClick={handleImportSubmit}>
              {isImporting ? 'Importing...' : 'Import Assets'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
