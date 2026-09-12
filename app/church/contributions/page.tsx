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
  Calendar,
  Church,
  DollarSign,
  Gift,
  Heart,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data for contributions
const contributions = [
  {
    id: 1,
    type: 'Wedding',
    event: 'John & Mary Wedding',
    date: '2024-01-15',
    amount: 2500,
    contributors: 45,
    status: 'Completed',
    description: 'Wedding ceremony and reception support',
  },
  {
    id: 2,
    type: 'Burial',
    event: 'Elder Smith Memorial',
    date: '2024-01-10',
    amount: 1800,
    contributors: 32,
    status: 'Completed',
    description: 'Funeral service and family support',
  },
  {
    id: 3,
    type: 'Baby Dedication',
    event: 'Baby Grace Dedication',
    date: '2024-01-20',
    amount: 450,
    contributors: 18,
    status: 'Active',
    description: 'Baby dedication ceremony support',
  },
  {
    id: 4,
    type: 'Medical Emergency',
    event: 'Sister Johnson Surgery',
    date: '2024-01-25',
    amount: 3200,
    contributors: 67,
    status: 'Active',
    description: 'Medical expenses support',
  },
  {
    id: 5,
    type: 'Church Building',
    event: 'New Sanctuary Fund',
    date: '2024-01-01',
    amount: 15_000,
    contributors: 120,
    status: 'Ongoing',
    description: 'Building fund for new sanctuary',
  },
];

const contributionStats = {
  totalContributions: 23_200,
  totalEvents: 12,
  activeContributions: 3,
  totalContributors: 156,
  thisMonthContributions: 5650,
  averagePerEvent: 1933,
};

const contributionTypes = [
  { type: 'Wedding', count: 8, total: 18_500, icon: Heart },
  { type: 'Burial', count: 5, total: 9200, icon: Church },
  { type: 'Baby Dedication', count: 12, total: 4800, icon: Gift },
  { type: 'Medical Emergency', count: 6, total: 15_600, icon: Heart },
  { type: 'Church Building', count: 2, total: 25_000, icon: Church },
];

export default function ContributionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const filteredContributions = contributions.filter((contribution) => {
    const matchesSearch =
      contribution.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'all' || contribution.type === selectedType;
    const matchesStatus =
      selectedStatus === 'all' || contribution.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Contributions</h1>
          <p className="text-muted-foreground">
            Manage special event contributions and fundraising
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Contribution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                <Input className="col-span-3" id="event" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="type">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="burial">Burial</SelectItem>
                    <SelectItem value="baby-dedication">
                      Baby Dedication
                    </SelectItem>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="building">Church Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="target">
                  Target Amount
                </Label>
                <Input className="col-span-3" id="target" type="number" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="description">
                  Description
                </Label>
                <Textarea className="col-span-3" id="description" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Contribution</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              ${contributionStats.totalContributions.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
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
              {contributionStats.activeContributions}
            </div>
            <p className="text-muted-foreground text-xs">
              Currently collecting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {contributionStats.totalContributors}
            </div>
            <p className="text-muted-foreground text-xs">Unique contributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${contributionStats.thisMonthContributions.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+8% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs className="space-y-4" defaultValue="contributions">
        <TabsList>
          <TabsTrigger value="contributions">All Contributions</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="types">By Type</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-4" value="contributions">
          {/* Search and Filter */}
          <div className="flex gap-4">
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Contributors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContributions.map((contribution) => (
                    <TableRow key={contribution.id}>
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
                        {new Date(contribution.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${contribution.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{contribution.contributors}</TableCell>
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
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm">January 2024</span>
                    <span className="font-bold">$5,650</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">December 2023</span>
                    <span className="font-bold">$4,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">November 2023</span>
                    <span className="font-bold">$3,800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average per Month</span>
                    <span className="font-bold text-green-600">$4,550</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Johnson Family</span>
                    <span className="font-bold">$1,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Smith Foundation</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Davis Group</span>
                    <span className="font-bold">$800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anonymous</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent className="space-y-4" value="types">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contributionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.type}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                      {type.type}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">
                      ${type.total.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {type.count} events
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
