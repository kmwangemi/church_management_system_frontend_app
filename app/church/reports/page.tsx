'use client';

import { GenerateReportForm } from '@/components/forms/generate-report-form';
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
import { Switch } from '@/components/ui/switch';
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
  type ReportTemplateItem,
  useCreateReportTemplate,
  useDeleteReport,
  useDeleteReportTemplate,
  useDownloadReport,
  useExportAllReports,
  useFetchReports,
  useFetchReportStats,
  useFetchReportTemplates,
  useGenerateReportFromTemplate,
  useGetReportPreview,
  useRetryReport,
  useUpdateReportTemplate,
} from '@/lib/hooks/church/report/use-report-queries';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('reports');
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] =
    useState(false);
  const [filterType, setFilterType] = useState('all');

  // Detail & Preview Dialog states
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [reportToDelete, setReportToDelete] = useState<any | null>(null);
  const [previewModalData, setPreviewModalData] = useState<{
    template: ReportTemplateItem;
    preview: any;
  } | null>(null);

  // Create Template Dialog state
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'Attendance',
    description: '',
    frequency: 'Monthly',
    dateRange: 'last30days',
    format: 'csv',
    isActive: true,
  });

  // Queries & Mutations
  const { data: reportsData, isLoading: isLoadingReports } = useFetchReports(
    1,
    searchTerm,
    filterType === 'all' ? '' : filterType
  );
  const { data: statsResponse, isLoading: isLoadingStats } =
    useFetchReportStats();
  const { data: templatesResponse, isLoading: isLoadingTemplates } =
    useFetchReportTemplates();

  const { mutate: deleteReport, isPending: isDeletingReport } =
    useDeleteReport();
  const { mutate: downloadReport, isPending: isDownloading } =
    useDownloadReport();
  const { mutate: retryReport, isPending: isRegenerating } = useRetryReport();
  const { mutate: exportAllReports, isPending: isExportingAll } =
    useExportAllReports();

  const { mutateAsync: createTemplate, isPending: isCreatingTemplate } =
    useCreateReportTemplate();
  const { mutate: updateTemplate } = useUpdateReportTemplate();
  const { mutate: deleteTemplate } = useDeleteReportTemplate();
  const {
    mutate: generateFromTemplate,
    isPending: isGeneratingFromTemplate,
  } = useGenerateReportFromTemplate();
  const { mutateAsync: fetchPreview, isPending: isPreviewLoading } =
    useGetReportPreview();

  const serverReports =
    (reportsData as any)?.data?.reports ||
    (reportsData as any)?.reports ||
    [];

  const activeReports = (Array.isArray(serverReports) ? serverReports : []).map(
    (r: any) => ({
      ...r,
      id: r.id || r._id,
      type: r.type
        ? r.type.charAt(0).toUpperCase() + r.type.slice(1)
        : 'Attendance',
      category: r.dateRange || 'Custom',
      generatedBy:
        typeof r.createdBy === 'object' && r.createdBy?.name
          ? r.createdBy.name
          : r.generatedBy || 'Church Admin',
      dateGenerated:
        r.dateGenerated ||
        r.generatedAt ||
        r.createdAt ||
        new Date().toISOString(),
      status: r.status
        ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
        : 'Completed',
      fileSize: r.formattedFileSize || '24 KB',
      format: (r.format || 'csv').toUpperCase(),
      downloads: Number(r.downloadCount ?? r.downloads ?? 0),
      summary: r.summary || r.reportData?.summary || {},
      columns: r.columns || r.reportData?.columns || [],
      rows: r.rows || r.reportData?.rows || [],
      parameters: r.parameters || {
        dateRange: r.dateRange || 'last30days',
        departments: Array.isArray(r.departments)
          ? r.departments.join(', ') || 'All'
          : 'All',
      },
    })
  );

  const filteredReports = activeReports.filter(
    (report: any) =>
      (filterType === 'all' ||
        (report.type || '').toLowerCase() === filterType.toLowerCase()) &&
      ((report.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.description || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (report.generatedBy || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const templates: ReportTemplateItem[] =
    templatesResponse?.data?.templates ||
    templatesResponse?.templates ||
    [];

  const statsPayload = statsResponse?.data;
  const stats = {
    totalReports: statsPayload?.totalReports ?? activeReports.length,
    completedReports:
      statsPayload?.completedReports ??
      activeReports.filter(
        (r: any) => (r.status || '').toLowerCase() === 'completed'
      ).length,
    totalDownloads:
      statsPayload?.totalDownloads ??
      activeReports.reduce(
        (sum: number, r: any) => sum + Number(r.downloads || 0),
        0
      ),
    activeTemplates:
      statsPayload?.activeTemplates ??
      templates.filter((t) => t.isActive).length,
  };

  const trends = statsPayload?.generationTrends || {
    thisMonth: activeReports.length,
    lastMonth: 0,
    twoMonthsAgo: 0,
  };
  const maxTrendCount = Math.max(
    trends.thisMonth || 0,
    trends.lastMonth || 0,
    trends.twoMonthsAgo || 0,
    1
  );

  const popularReports = statsPayload?.popularReports || [];
  const reportsByType = statsPayload?.reportsByType || [];
  const churchSummary = statsPayload?.churchSummary;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'attendance':
        return <Users className="h-4 w-4" />;
      case 'financial':
      case 'giving':
        return <DollarSign className="h-4 w-4" />;
      case 'membership':
        return <Users className="h-4 w-4" />;
      case 'events':
      case 'activities':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handlePreviewTemplate = async (template: ReportTemplateItem) => {
    const res = await fetchPreview({
      type: (template.type || 'attendance').toLowerCase(),
      dateRange: template.dateRange || 'last30days',
      departments: ['all'],
    });
    setPreviewModalData({
      template,
      preview: res?.data || {},
    });
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name.trim()) return;
    await createTemplate(newTemplate);
    setIsCreateTemplateOpen(false);
    setNewTemplate({
      name: '',
      type: 'Attendance',
      description: '',
      frequency: 'Monthly',
      dateRange: 'last30days',
      format: 'csv',
      isActive: true,
    });
  };

  const formatMetricLabel = (key: string) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());

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
          <Button
            disabled={isExportingAll || activeReports.length === 0}
            onClick={() => exportAllReports()}
            size="sm"
            variant="outline"
          >
            {isExportingAll ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
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
            <p className="mt-1 text-muted-foreground text-xs">
              Ready for download
            </p>
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
            <p className="mt-1 text-muted-foreground text-xs">
              Total downloads
            </p>
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
            <p className="mt-1 text-muted-foreground text-xs">
              Automated reports
            </p>
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
                <SelectItem value="giving">Giving</SelectItem>
                <SelectItem value="activities">Activities</SelectItem>
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

            {/* Generated Reports Tab */}
            <TabsContent className="mt-6" value="reports">
              {isLoadingReports ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading reports...
                  </span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">No reports found</h3>
                  <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                    {searchTerm || filterType !== 'all'
                      ? 'No reports match your current search or type filter.'
                      : 'Generate your first church report or use a report template to get started.'}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => setIsGenerateReportDialogOpen(true)}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button
                      onClick={() => setSelectedTab('templates')}
                      size="sm"
                      variant="outline"
                    >
                      Browse Templates
                    </Button>
                  </div>
                </div>
              ) : (
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
                      {filteredReports.map((report: any) => (
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
                              <span className="text-sm">
                                {report.downloads}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {report.dateGenerated
                                  ? new Date(
                                      report.dateGenerated
                                    ).toLocaleDateString()
                                  : 'N/A'}
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
                                  disabled={
                                    report.status.toLowerCase() !==
                                      'completed' || isDownloading
                                  }
                                  onClick={() => downloadReport(report.id)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Report
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={isRegenerating}
                                  onClick={() => retryReport(report.id)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Regenerate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setReportToDelete(report)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
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
              )}
            </TabsContent>

            {/* Report Templates Tab */}
            <TabsContent className="mt-6 space-y-4" value="templates">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base">
                    Configured Report Templates
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Use pre-configured templates to preview live data or
                    generate standard reports in one click
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateTemplateOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>

              {isLoadingTemplates ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading templates...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
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
                          <div className="flex items-center space-x-2">
                            <Badge
                              className="cursor-pointer"
                              onClick={() =>
                                updateTemplate({
                                  templateId: template.id,
                                  payload: { isActive: !template.isActive },
                                })
                              }
                              variant={
                                template.isActive ? 'default' : 'secondary'
                              }
                            >
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className="h-7 w-7 p-0" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateTemplate({
                                      templateId: template.id,
                                      payload: { isActive: !template.isActive },
                                    })
                                  }
                                >
                                  {template.isActive
                                    ? 'Mark Inactive'
                                    : 'Mark Active'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => deleteTemplate(template.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Template
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardTitle className="mt-2 text-lg">
                          {template.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground text-sm">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                          <span>Frequency: {template.frequency}</span>
                          <span>
                            Last:{' '}
                            {template.lastGenerated
                              ? new Date(
                                  template.lastGenerated
                                ).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <Button
                            className="flex-1 bg-transparent"
                            disabled={isPreviewLoading}
                            onClick={() => handlePreviewTemplate(template)}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            className="flex-1"
                            disabled={isGeneratingFromTemplate}
                            onClick={() =>
                              generateFromTemplate(template.id, {
                                onSuccess: () => setSelectedTab('reports'),
                              })
                            }
                            size="sm"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Generate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Dashboard Tab */}
            <TabsContent className="mt-6 space-y-6" value="analytics">
              {isLoadingStats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading analytics...
                  </span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Generation Trends</CardTitle>
                        <CardDescription>
                          Reports generated over the last three months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              This Month
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {trends.thisMonth} reports
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-blue-600 transition-all"
                              style={{
                                width: `${Math.round(
                                  ((trends.thisMonth || 0) / maxTrendCount) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              Last Month
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {trends.lastMonth} reports
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-green-600 transition-all"
                              style={{
                                width: `${Math.round(
                                  ((trends.lastMonth || 0) / maxTrendCount) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              Two Months Ago
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {trends.twoMonthsAgo} reports
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-purple-600 transition-all"
                              style={{
                                width: `${Math.round(
                                  ((trends.twoMonthsAgo || 0) / maxTrendCount) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Most Popular Reports</CardTitle>
                        <CardDescription>
                          Ranked by total download count
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {popularReports.length === 0 ? (
                          <div className="py-8 text-center text-muted-foreground text-sm">
                            No reports generated yet. Generate and download a
                            report to see popularity metrics.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {popularReports.map((item, idx) => {
                              const barColors = [
                                'bg-blue-600',
                                'bg-green-600',
                                'bg-purple-600',
                                'bg-orange-600',
                                'bg-teal-600',
                              ];
                              const colorClass =
                                barColors[idx % barColors.length];
                              return (
                                <div className="space-y-2" key={item.id || idx}>
                                  <div className="flex items-center justify-between">
                                    <span className="truncate font-medium text-sm">
                                      {item.name}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                      {item.downloads} downloads
                                    </span>
                                  </div>
                                  <div className="h-2 w-full rounded-full bg-secondary">
                                    <div
                                      className={`h-2 rounded-full transition-all ${colorClass}`}
                                      style={{
                                        width: `${item.percentage || 0}%`,
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

                  {/* Reports by Type & Live Church Data Summary */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reports by Category</CardTitle>
                        <CardDescription>
                          Distribution of generated reports by type
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {reportsByType.length === 0 ? (
                          <div className="py-6 text-center text-muted-foreground text-sm">
                            No categorized reports yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {reportsByType.map((entry) => (
                              <div
                                className="flex items-center justify-between rounded-lg border p-3"
                                key={entry.type}
                              >
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(entry.type)}
                                  <span className="capitalize font-medium text-sm">
                                    {entry.type}
                                  </span>
                                </div>
                                <Badge variant="secondary">{entry.count}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {churchSummary && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Live Church Data Snapshot</CardTitle>
                          <CardDescription>
                            Underlying database records available for reporting
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Total Members
                              </p>
                              <p className="mt-1 font-bold text-lg">
                                {churchSummary.totalMembers}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Active Members
                              </p>
                              <p className="mt-1 font-bold text-green-600 text-lg">
                                {churchSummary.activeMembers}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Total Events
                              </p>
                              <p className="mt-1 font-bold text-lg">
                                {churchSummary.totalEvents}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Departments
                              </p>
                              <p className="mt-1 font-bold text-lg">
                                {churchSummary.totalDepartments}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Recorded Income
                              </p>
                              <p className="mt-1 font-bold text-blue-600 text-lg">
                                {Number(
                                  churchSummary.totalIncome || 0
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-muted-foreground text-xs">
                                Recorded Expenses
                              </p>
                              <p className="mt-1 font-bold text-orange-600 text-lg">
                                {Number(
                                  churchSummary.totalExpenses || 0
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setSelectedReport(null)}
        open={!!selectedReport}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedReport && getTypeIcon(selectedReport.type)}
              <span>{selectedReport?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedReport?.description || 'Generated report details'}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium text-sm">{selectedReport.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <div className="mt-0.5">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Generated By</p>
                  <p className="font-medium text-sm">
                    {selectedReport.generatedBy}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Format / File Size
                  </p>
                  <p className="font-medium text-sm">
                    {selectedReport.format} ({selectedReport.fileSize})
                  </p>
                </div>
              </div>

              {/* Summary Metrics */}
              {selectedReport.summary &&
                Object.keys(selectedReport.summary).length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-sm">
                      Report Summary Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                      {Object.entries(selectedReport.summary).map(
                        ([key, val]) => (
                          <div
                            className="rounded-lg border p-3"
                            key={key}
                          >
                            <p className="text-muted-foreground text-xs">
                              {formatMetricLabel(key)}
                            </p>
                            <p className="mt-1 font-bold text-base">
                              {typeof val === 'number'
                                ? val.toLocaleString()
                                : String(val)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Data Rows Table */}
              <div>
                <h4 className="mb-3 font-semibold text-sm">
                  Report Records ({selectedReport.rows?.length || 0})
                </h4>
                {selectedReport.columns?.length > 0 &&
                selectedReport.rows?.length > 0 ? (
                  <div className="max-h-72 overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {selectedReport.columns.map((col: string) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReport.rows.map(
                          (row: Record<string, any>, idx: number) => (
                            <TableRow key={idx}>
                              {selectedReport.columns.map((col: string) => (
                                <TableCell className="text-sm" key={col}>
                                  {row[col] !== undefined && row[col] !== null
                                    ? String(row[col])
                                    : '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
                    No matching records were found in this date range. Click
                    Regenerate to refresh with current church data.
                  </p>
                )}
              </div>

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  disabled={isRegenerating}
                  onClick={() => {
                    retryReport(selectedReport.id, {
                      onSuccess: (res) => {
                        if (res?.data) {
                          setSelectedReport({
                            ...selectedReport,
                            ...res.data,
                            summary:
                              res.data.summary ||
                              res.data.reportData?.summary ||
                              {},
                            columns:
                              res.data.columns ||
                              res.data.reportData?.columns ||
                              [],
                            rows:
                              res.data.rows || res.data.reportData?.rows || [],
                          });
                        }
                      },
                    });
                  }}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Data
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setSelectedReport(null)}
                    variant="ghost"
                  >
                    Close
                  </Button>
                  <Button
                    disabled={isDownloading}
                    onClick={() => downloadReport(selectedReport.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setPreviewModalData(null)}
        open={!!previewModalData}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Template Preview: {previewModalData?.template.name}
            </DialogTitle>
            <DialogDescription>
              Live preview of church records matching this template
            </DialogDescription>
          </DialogHeader>
          {previewModalData && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-muted-foreground text-xs">
                    Estimated Records
                  </p>
                  <p className="font-bold text-lg">
                    {previewModalData.preview.estimatedRecords ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Estimated Size
                  </p>
                  <p className="font-medium text-sm">
                    {previewModalData.preview.estimatedSize || '12 KB'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Frequency</p>
                  <p className="font-medium text-sm">
                    {previewModalData.template.frequency}
                  </p>
                </div>
              </div>

              {previewModalData.preview.summary &&
                Object.keys(previewModalData.preview.summary).length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Object.entries(previewModalData.preview.summary).map(
                      ([k, v]) => (
                        <div className="rounded-lg border p-3" key={k}>
                          <p className="text-muted-foreground text-xs">
                            {formatMetricLabel(k)}
                          </p>
                          <p className="mt-1 font-semibold text-sm">
                            {typeof v === 'number'
                              ? v.toLocaleString()
                              : String(v)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

              {previewModalData.preview.columns?.length > 0 &&
                previewModalData.preview.sampleRows?.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-sm">
                      Sample Rows (First{' '}
                      {previewModalData.preview.sampleRows.length})
                    </h4>
                    <div className="max-h-60 overflow-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {previewModalData.preview.columns.map(
                              (col: string) => (
                                <TableHead key={col}>{col}</TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewModalData.preview.sampleRows.map(
                            (row: Record<string, any>, idx: number) => (
                              <TableRow key={idx}>
                                {previewModalData.preview.columns.map(
                                  (col: string) => (
                                    <TableCell className="text-sm" key={col}>
                                      {row[col] !== undefined &&
                                      row[col] !== null
                                        ? String(row[col])
                                        : '-'}
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              <DialogFooter>
                <Button
                  onClick={() => setPreviewModalData(null)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button
                  disabled={isGeneratingFromTemplate}
                  onClick={() => {
                    const tplId = previewModalData.template.id;
                    generateFromTemplate(tplId, {
                      onSuccess: () => {
                        setPreviewModalData(null);
                        setSelectedTab('reports');
                      },
                    });
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Generate Full Report Now
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog
        onOpenChange={setIsCreateTemplateOpen}
        open={isCreateTemplateOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Report Template</DialogTitle>
            <DialogDescription>
              Save a reusable report configuration for quick generation
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateTemplate}>
            <div className="space-y-2">
              <Label htmlFor="tpl-name">Template Name *</Label>
              <Input
                id="tpl-name"
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                placeholder="e.g., Monthly Tithes & Offerings Summary"
                required
                value={newTemplate.name}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  onValueChange={(val) =>
                    setNewTemplate({ ...newTemplate, type: val })
                  }
                  value={newTemplate.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Membership">Membership</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Giving">Giving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  onValueChange={(val) =>
                    setNewTemplate({ ...newTemplate, frequency: val })
                  }
                  value={newTemplate.frequency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tpl-desc">Description</Label>
              <Textarea
                id="tpl-desc"
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    description: e.target.value,
                  })
                }
                placeholder="Describe what this template covers..."
                rows={3}
                value={newTemplate.description}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium text-sm">Active Template</Label>
                <p className="text-muted-foreground text-xs">
                  Mark this template as active for regular reporting
                </p>
              </div>
              <Switch
                checked={newTemplate.isActive}
                onCheckedChange={(checked) =>
                  setNewTemplate({ ...newTemplate, isActive: checked })
                }
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsCreateTemplateOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isCreatingTemplate} type="submit">
                {isCreatingTemplate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Create Template'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Report Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setReportToDelete(null)}
        open={!!reportToDelete}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{reportToDelete?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setReportToDelete(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletingReport}
              onClick={() => {
                if (!reportToDelete) return;
                deleteReport(reportToDelete.id, {
                  onSuccess: () => setReportToDelete(null),
                });
              }}
              variant="destructive"
            >
              {isDeletingReport ? 'Deleting...' : 'Delete Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
