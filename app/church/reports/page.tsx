'use client';

import { GenerateReportForm } from '@/components/forms/generate-report-form';
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
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const reports = [
  {
    id: 1,
    name: 'Monthly Attendance Report - December 2023',
    type: 'Attendance',
    category: 'Monthly',
    description: 'Comprehensive attendance analysis for December 2023',
    generatedBy: 'Pastor Michael Brown',
    dateGenerated: '2024-01-01',
    status: 'Completed',
    fileSize: '2.3 MB',
    format: 'PDF',
    downloads: 12,
    parameters: {
      dateRange: 'December 2023',
      departments: 'All',
      includeGraphs: true,
    },
  },
  {
    id: 2,
    name: 'Financial Summary Q4 2023',
    type: 'Financial',
    category: 'Quarterly',
    description: 'Financial overview including offerings, tithes, and expenses',
    generatedBy: 'David Wilson',
    dateGenerated: '2024-01-02',
    status: 'Completed',
    fileSize: '1.8 MB',
    format: 'Excel',
    downloads: 8,
    parameters: {
      dateRange: 'Q4 2023',
      includeComparisons: true,
      breakdown: 'Monthly',
    },
  },
  {
    id: 3,
    name: 'Member Growth Analysis 2023',
    type: 'Membership',
    category: 'Annual',
    description: 'Annual member growth trends and demographics',
    generatedBy: 'Sarah Johnson',
    dateGenerated: '2024-01-03',
    status: 'Completed',
    fileSize: '3.1 MB',
    format: 'PDF',
    downloads: 15,
    parameters: {
      dateRange: '2023',
      includeDemographics: true,
      compareYears: true,
    },
  },
  {
    id: 4,
    name: 'Event Participation Report',
    type: 'Events',
    category: 'Custom',
    description: 'Analysis of event attendance and participation rates',
    generatedBy: 'Emily Davis',
    dateGenerated: '2024-01-05',
    status: 'Processing',
    fileSize: '0 MB',
    format: 'PDF',
    downloads: 0,
    parameters: {
      dateRange: 'Last 6 months',
      eventTypes: 'All',
      includeComparisons: true,
    },
  },
];

const reportTemplates = [
  {
    id: 1,
    name: 'Monthly Attendance Summary',
    type: 'Attendance',
    description:
      'Standard monthly attendance report with trends and comparisons',
    frequency: 'Monthly',
    lastGenerated: '2024-01-01',
    isActive: true,
  },
  {
    id: 2,
    name: 'Financial Dashboard',
    type: 'Financial',
    description: 'Comprehensive financial overview with charts and breakdowns',
    frequency: 'Weekly',
    lastGenerated: '2024-01-07',
    isActive: true,
  },
  {
    id: 3,
    name: 'Member Engagement Report',
    type: 'Membership',
    description: 'Member activity and engagement metrics',
    frequency: 'Quarterly',
    lastGenerated: '2023-12-31',
    isActive: false,
  },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('reports');
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] =
    useState(false);
  const [filterType, setFilterType] = useState('all');

  const filteredReports = reports.filter(
    (report) =>
      (filterType === 'all' || report.type.toLowerCase() === filterType) &&
      (report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'attendance':
        return <Users className="h-4 w-4" />;
      case 'financial':
        return <DollarSign className="h-4 w-4" />;
      case 'membership':
        return <Users className="h-4 w-4" />;
      case 'events':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const stats = {
    totalReports: reports.length,
    completedReports: reports.filter((r) => r.status === 'Completed').length,
    totalDownloads: reports.reduce((sum, r) => sum + r.downloads, 0),
    activeTemplates: reportTemplates.filter((t) => t.isActive).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-muted-foreground">
            Generate and manage church reports and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Dialog
            onOpenChange={setIsGenerateReportDialogOpen}
            open={isGenerateReportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a custom report with specific parameters
                </DialogDescription>
              </DialogHeader>
              <GenerateReportForm
                onCloseDialog={() => setIsGenerateReportDialogOpen(false)}
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
              Total Reports
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalReports}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Completed
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.completedReports}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Ready for download</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Downloads
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Download className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.totalDownloads}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Total downloads</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Templates
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <PieChart className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.activeTemplates}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Automated reports</p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                value={searchTerm}
              />
            </div>
            <Select onValueChange={setFilterType} value={filterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Generated Reports</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value="reports">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow className="hover:bg-accent" key={report.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(report.type)}
                              <span className="font-medium text-foreground">
                                {report.name}
                              </span>
                            </div>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {report.description}
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                              <Badge variant="outline">{report.format}</Badge>
                              <span>{report.fileSize}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            {report.generatedBy}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{report.downloads}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(
                                report.dateGenerated
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
                                disabled={report.status !== 'Completed'}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <FileText className="mr-2 h-4 w-4" />
                                Delete Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="templates">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reportTemplates.map((template) => (
                  <Card
                    className="transition-shadow hover:shadow-lg"
                    key={template.id}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(template.type)}
                          <Badge variant="outline">{template.type}</Badge>
                        </div>
                        <Badge
                          variant={template.isActive ? 'default' : 'secondary'}
                        >
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-muted-foreground text-sm">
                        <span>Frequency: {template.frequency}</span>
                        <span>
                          Last:{' '}
                          {new Date(
                            template.lastGenerated
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          className="flex-1 bg-transparent"
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button className="flex-1" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="analytics">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Generation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">This Month</span>
                        <span className="text-muted-foreground text-sm">4 reports</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Last Month</span>
                        <span className="text-muted-foreground text-sm">2 reports</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '50%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Two Months Ago
                        </span>
                        <span className="text-muted-foreground text-sm">3 reports</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Member Growth Analysis
                        </span>
                        <span className="text-muted-foreground text-sm">
                          15 downloads
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Monthly Attendance
                        </span>
                        <span className="text-muted-foreground text-sm">
                          12 downloads
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '80%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Financial Summary
                        </span>
                        <span className="text-muted-foreground text-sm">
                          8 downloads
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: '53%' }}
                        />
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
