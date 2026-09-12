'use client';

import { AddAssetForm } from '@/components/forms/add-asset-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const assets = [
  {
    id: 1,
    name: 'Church Bus #1',
    type: 'Vehicle',
    category: 'Transportation',
    value: 45_000,
    purchaseDate: '2022-03-15',
    condition: 'Good',
    location: 'Main Campus',
    status: 'Active',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    serialNumber: 'CB001-2022',
    warranty: '3 years',
  },
  {
    id: 2,
    name: 'Grace Christian School',
    type: 'Property',
    category: 'Education',
    value: 850_000,
    purchaseDate: '2018-08-01',
    condition: 'Excellent',
    location: 'Downtown Campus',
    status: 'Active',
    lastMaintenance: '2023-12-01',
    nextMaintenance: '2024-06-01',
    serialNumber: 'GCS-2018',
    warranty: 'N/A',
  },
  {
    id: 3,
    name: 'Sound System - Main Sanctuary',
    type: 'Equipment',
    category: 'Audio/Visual',
    value: 25_000,
    purchaseDate: '2023-01-10',
    condition: 'Excellent',
    location: 'Main Sanctuary',
    status: 'Active',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01',
    serialNumber: 'SS-MS-2023',
    warranty: '2 years',
  },
  {
    id: 4,
    name: 'Church Van #2',
    type: 'Vehicle',
    category: 'Transportation',
    value: 32_000,
    purchaseDate: '2021-11-20',
    condition: 'Fair',
    location: 'Main Campus',
    status: 'Maintenance',
    lastMaintenance: '2024-02-20',
    nextMaintenance: '2024-03-20',
    serialNumber: 'CV002-2021',
    warranty: 'Expired',
  },
  {
    id: 5,
    name: 'Fellowship Hall Tables',
    type: 'Furniture',
    category: 'Furniture',
    value: 8000,
    purchaseDate: '2020-05-15',
    condition: 'Good',
    location: 'Fellowship Hall',
    status: 'Active',
    lastMaintenance: '2023-11-01',
    nextMaintenance: '2024-11-01',
    serialNumber: 'FHT-2020',
    warranty: 'N/A',
  },
];

const getAssetIcon = (type: string) => {
  switch (type.toLowerCase()) {
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
  switch (condition.toLowerCase()) {
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
      return <Badge variant="secondary">{condition}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
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
    case 'retired':
      return <Badge variant="secondary">Retired</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    // if (selectedTab === 'all') return matchesSearch;
    // if (selectedTab === 'vehicles')
    //   return matchesSearch && asset.type === 'Vehicle';
    // if (selectedTab === 'property')
    //   return matchesSearch && asset.type === 'Property';
    // if (selectedTab === 'equipment')
    //   return matchesSearch && asset.type === 'Equipment';

    return matchesSearch;
  });

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, asset) => sum + asset.value, 0),
    vehicles: assets.filter((a) => a.type === 'Vehicle').length,
    properties: assets.filter((a) => a.type === 'Property').length,
    equipment: assets.filter((a) => a.type === 'Equipment').length,
    maintenance: assets.filter((a) => a.status === 'Maintenance').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Asset Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage church assets, properties, and equipment
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" variant="outline">
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
            <p className="mt-1 text-muted-foreground text-xs">All registered assets</p>
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
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Combined asset value</p>
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
            <p className="mt-1 text-muted-foreground text-xs">Transportation assets</p>
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
            <p className="mt-1 text-muted-foreground text-xs">Needs attention</p>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assets by name, category, or location..."
                value={searchTerm}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filter
              </Button>
            </div>
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
                    {filteredAssets.map((asset) => (
                      <TableRow className="hover:bg-accent" key={asset.id}>
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
                                {asset.location}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Serial: {asset.serialNumber}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{asset.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${asset.value.toLocaleString()}
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
                              {new Date(
                                asset.nextMaintenance
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Asset
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Wrench className="mr-2 h-4 w-4" />
                                Maintenance History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Asset
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredAssets.length === 0 && (
                <div className="py-12 text-center">
                  <Building className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No assets found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
