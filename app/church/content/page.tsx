'use client';

import { AddContentForm } from '@/components/forms/add-content-form';
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
  BookOpen,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  ImageIcon,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteContent,
  useFetchContent,
} from '@/lib/hooks/church/content/use-content-queries';

// Mock data
const content = [
  {
    id: 1,
    title: 'Sunday Service - January 7, 2024',
    type: 'Sermon',
    category: 'Audio',
    description: "Message on 'Walking in Faith' from Hebrews 11",
    author: 'Pastor Michael Brown',
    dateCreated: '2024-01-07',
    status: 'Published',
    views: 234,
    downloads: 45,
    duration: '45 minutes',
    fileSize: '42.3 MB',
    tags: ['Faith', 'Hebrews', 'Sunday Service'],
  },
  {
    id: 2,
    title: 'Youth Conference 2024 Highlights',
    type: 'Video',
    category: 'Event',
    description:
      'Highlights from the annual youth conference with testimonies and worship',
    author: 'Sarah Johnson',
    dateCreated: '2024-01-05',
    status: 'Published',
    views: 156,
    downloads: 23,
    duration: '12 minutes',
    fileSize: '125.7 MB',
    tags: ['Youth', 'Conference', 'Testimonies'],
  },
  {
    id: 3,
    title: 'Bible Study Guide - Romans Chapter 8',
    type: 'Document',
    category: 'Study Material',
    description:
      'Comprehensive study guide for Romans 8 with discussion questions',
    author: 'David Wilson',
    dateCreated: '2024-01-03',
    status: 'Published',
    views: 89,
    downloads: 67,
    duration: 'N/A',
    fileSize: '2.1 MB',
    tags: ['Bible Study', 'Romans', 'Study Guide'],
  },
  {
    id: 4,
    title: 'Christmas Service Photos',
    type: 'Gallery',
    category: 'Photos',
    description: 'Photo gallery from Christmas Eve and Christmas Day services',
    author: 'Emily Davis',
    dateCreated: '2023-12-26',
    status: 'Published',
    views: 345,
    downloads: 89,
    duration: 'N/A',
    fileSize: '156.8 MB',
    tags: ['Christmas', 'Photos', 'Service'],
  },
  {
    id: 5,
    title: 'New Member Orientation Handbook',
    type: 'Document',
    category: 'Resource',
    description:
      'Complete handbook for new church members with policies and procedures',
    author: 'Pastor Michael Brown',
    dateCreated: '2024-01-01',
    status: 'Draft',
    views: 12,
    downloads: 3,
    duration: 'N/A',
    fileSize: '5.2 MB',
    tags: ['New Members', 'Handbook', 'Orientation'],
  },
];

const categories = [
  { name: 'Sermons', count: 45, icon: Mic },
  { name: 'Bible Studies', count: 23, icon: BookOpen },
  { name: 'Videos', count: 18, icon: Video },
  { name: 'Photos', count: 67, icon: ImageIcon },
  { name: 'Documents', count: 34, icon: FileText },
];

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);

  const { data: contentData } = useFetchContent({ search: searchTerm });
  const { mutate: deleteContent } = useDeleteContent();
  const serverContent =
    (contentData as any)?.data?.content ||
    (contentData as any)?.content ||
    [];
  const activeContent = (Array.isArray(serverContent) ? serverContent : []).map(
    (item: any) => ({
      ...item,
      id: item.id || item._id,
      dateCreated:
        item.dateCreated ||
        (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''),
      views: Number(item.views ?? item.viewCount ?? 0),
      downloads: Number(item.downloads ?? item.downloadCount ?? 0),
      fileSize: String(item.formattedFileSize || item.fileSize || 'N/A'),
      duration: String(item.duration || 'N/A'),
      tags: (Array.isArray(item.tags) ? item.tags : []) as string[],
      status: String(
        item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : 'Published'
      ),
    })
  );

  const filteredContent = activeContent.filter(
    (item: any) =>
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sermon':
        return <Mic className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'gallery':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // const getStatusBadge = (status: string) => {
  //   return status === 'Published' ? (
  //     <Badge className="bg-green-100 text-green-800">Published</Badge>
  //   ) : status === 'Draft' ? (
  //     <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
  //   ) : (
  //     <Badge className="bg-muted text-foreground">Archived</Badge>
  //   );
  // };

  const stats = {
    totalContent: activeContent.length,
    published: activeContent.filter(
      (c: any) => (c.status || '').toLowerCase() === 'published'
    ).length,
    totalViews: activeContent.reduce(
      (sum: number, c: any) => sum + Number(c.views || 0),
      0
    ),
    totalDownloads: activeContent.reduce(
      (sum: number, c: any) => sum + Number(c.downloads || 0),
      0
    ),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Content Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage sermons, videos, documents, and other church content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Dialog
            onOpenChange={setIsAddContentDialogOpen}
            open={isAddContentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
                <DialogDescription>
                  Upload and manage new church content
                </DialogDescription>
              </DialogHeader>
              <AddContentForm
                onCloseDialog={() => setIsAddContentDialogOpen(false)}
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
              Total Content
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              {stats.totalContent}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All items</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Published
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.published}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Live content</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Views
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-purple-600">
              {stats.totalViews}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">All time views</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Downloads
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Download className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-orange-600">
              {stats.totalDownloads}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Total downloads</p>
          </CardContent>
        </Card>
      </div>
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Content Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((category) => (
              <div
                className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent"
                key={category.name}
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <category.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {category.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {category.count} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content by title, author, or category..."
                value={searchTerm}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-6" value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((item) => (
                      <TableRow className="hover:bg-accent" key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(item.type)}
                              <span className="font-medium text-foreground">
                                {item.title}
                              </span>
                            </div>
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {item.description}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag: string, index: number) => (
                                <Badge
                                  className="text-xs"
                                  key={index}
                                  variant="secondary"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 2 && (
                                <Badge className="text-xs" variant="secondary">
                                  +{item.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            {item.author}
                          </span>
                        </TableCell>
                        {/* <TableCell>{getStatusBadge(item.status)}</TableCell> */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {item.views} views
                            </div>
                            <div className="text-muted-foreground">
                              {item.downloads} downloads
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(item.dateCreated).toLocaleDateString()}
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
                                <Eye className="mr-2 h-4 w-4" />
                                View Content
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
            <TabsContent className="mt-6" value="recent">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {content
                  .sort(
                    (a, b) =>
                      new Date(b.dateCreated).getTime() -
                      new Date(a.dateCreated).getTime()
                  )
                  .slice(0, 6)
                  .map((item) => (
                    <Card
                      className="transition-shadow hover:shadow-lg"
                      key={item.id}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(item.type)}
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          {/* {getStatusBadge(item.status)} */}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="line-clamp-2 text-muted-foreground text-sm">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                          <span>By {item.author}</span>
                          <span>
                            {new Date(item.dateCreated).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.views} views
                          </span>
                          <span className="text-muted-foreground">
                            {item.downloads} downloads
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent className="mt-6" value="popular">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {content
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 6)
                  .map((item) => (
                    <Card
                      className="transition-shadow hover:shadow-lg"
                      key={item.id}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(item.type)}
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">
                            {item.views} views
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="line-clamp-2 text-muted-foreground text-sm">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                          <span>By {item.author}</span>
                          <span>
                            {new Date(item.dateCreated).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.downloads} downloads
                          </span>
                          <span className="text-muted-foreground">{item.fileSize}</span>
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
                    <CardTitle>Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Sermons</span>
                        <span className="text-muted-foreground text-sm">234 views</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '70%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Videos</span>
                        <span className="text-muted-foreground text-sm">156 views</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '47%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Documents</span>
                        <span className="text-muted-foreground text-sm">101 views</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: '30%' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Uploads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          January 2024
                        </span>
                        <span className="text-muted-foreground text-sm">3 items</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: '60%' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          December 2023
                        </span>
                        <span className="text-muted-foreground text-sm">2 items</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: '40%' }}
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
