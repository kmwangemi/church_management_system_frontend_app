'use client';

import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Flame,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Plus,
  Search,
  Star,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFetchPrayerRequests } from '@/lib/hooks/church/prayer-request/use-prayer-request-queries';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function MemberPrayerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);

  const { data: prayersData } = useFetchPrayerRequests({ search: searchTerm });
  const serverPrayers =
    (prayersData as any)?.data?.prayerRequests ||
    (prayersData as any)?.prayerRequests ||
    [];

  const prayerRequests = (
    Array.isArray(serverPrayers) ? serverPrayers : []
  ).map((p: any) => ({
    id: String(p.id || p._id || ''),
    title: String(p.title || ''),
    description: String(p.description || ''),
    category: String(p.category || 'General'),
    priority: String(p.priority || 'normal').toLowerCase(),
    status: String(p.status || 'active').toLowerCase(),
    isPrivate: Boolean(p.isAnonymous || p.isPrivate),
    author: String(p.requester || 'Church Member'),
    authorImage: String(p.requesterAvatar || '/placeholder.svg?height=40&width=40'),
    dateSubmitted: String(p.dateSubmitted || ''),
    prayerCount: Number(p.prayerCount || 0),
    comments: 0,
    isAnswered: String(p.status || '').toLowerCase() === 'answered',
  }));

  // Mock data for prayer requests
  const _unusedPrayerRequests = [
    {
      id: 1,
      title: 'Healing for My Mother',
      description:
        'Please pray for my mother who is undergoing surgery next week. Pray for the doctors and for her quick recovery.',
      category: 'Health',
      priority: 'urgent',
      status: 'active',
      isPrivate: false,
      author: 'Sarah Johnson',
      authorImage: '/placeholder.svg?height=40&width=40',
      dateSubmitted: '2024-01-10',
      prayerCount: 24,
      comments: 8,
      isAnswered: false,
    },
    {
      id: 2,
      title: 'Job Search Guidance',
      description:
        "I've been looking for work for 3 months. Please pray for God's direction and provision in finding the right opportunity.",
      category: 'Career',
      priority: 'normal',
      status: 'active',
      isPrivate: false,
      author: 'Michael Chen',
      authorImage: '/placeholder.svg?height=40&width=40',
      dateSubmitted: '2024-01-08',
      prayerCount: 15,
      comments: 5,
      isAnswered: false,
    },
    {
      id: 3,
      title: 'Marriage Restoration',
      description:
        'My spouse and I are going through a difficult time. Please pray for healing, forgiveness, and restoration in our relationship.',
      category: 'Relationships',
      priority: 'urgent',
      status: 'active',
      isPrivate: true,
      author: 'Anonymous',
      authorImage: '/placeholder.svg?height=40&width=40',
      dateSubmitted: '2024-01-05',
      prayerCount: 32,
      comments: 12,
      isAnswered: false,
    },
    {
      id: 4,
      title: 'Thanksgiving for New Baby',
      description:
        'Praise God! Our baby was born healthy after complications during pregnancy. Thank you all for your prayers!',
      category: 'Family',
      priority: 'normal',
      status: 'answered',
      isPrivate: false,
      author: 'David & Lisa Wilson',
      authorImage: '/placeholder.svg?height=40&width=40',
      dateSubmitted: '2023-12-20',
      prayerCount: 45,
      comments: 18,
      isAnswered: true,
    },
  ];

  const myRequests = [
    {
      id: 5,
      title: 'Wisdom for Career Decision',
      description:
        "I have two job offers and need God's wisdom to choose the right path for my family and ministry calling.",
      category: 'Career',
      priority: 'normal',
      status: 'active',
      dateSubmitted: '2024-01-12',
      prayerCount: 8,
      comments: 3,
      isAnswered: false,
    },
    {
      id: 6,
      title: 'Healing from Anxiety',
      description:
        "Struggling with anxiety and fear. Please pray for God's peace and strength to overcome these challenges.",
      category: 'Mental Health',
      priority: 'urgent',
      status: 'active',
      dateSubmitted: '2024-01-01',
      prayerCount: 28,
      comments: 15,
      isAnswered: false,
    },
  ];

  const prayerStats = {
    requestsSubmitted: 12,
    prayersOffered: 156,
    answeredPrayers: 8,
    prayerStreak: 28,
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-red-100 text-red-800';
      case 'career':
        return 'bg-blue-100 text-blue-800';
      case 'relationships':
        return 'bg-purple-100 text-purple-800';
      case 'family':
        return 'bg-green-100 text-green-800';
      case 'mental health':
        return 'bg-yellow-100 text-yellow-800';
      case 'spiritual':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      request.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === 'all' || request.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl">Prayer Requests</h1>
          <p className="text-muted-foreground">
            Share your heart and pray for others in our community
          </p>
        </div>
        <Dialog onOpenChange={setIsAddRequestOpen} open={isAddRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Prayer Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Prayer Request</DialogTitle>
              <DialogDescription>
                Share your prayer need with our community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="request-title">Prayer Request Title</Label>
                <Input
                  id="request-title"
                  placeholder="Brief title for your prayer request"
                />
              </div>
              <div>
                <Label htmlFor="request-description">Description</Label>
                <Textarea
                  className="min-h-[120px]"
                  id="request-description"
                  placeholder="Share the details of your prayer request..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="request-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="relationships">
                        Relationships
                      </SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="mental-health">
                        Mental Health
                      </SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="request-priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="private-request" />
                <Label className="text-sm" htmlFor="private-request">
                  Keep this request private (only visible to prayer team)
                </Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsAddRequestOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddRequestOpen(false)}>
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prayer Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-bold text-2xl">
                  {prayerStats.requestsSubmitted}
                </p>
                <p className="text-muted-foreground text-sm">Requests Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-bold text-2xl">
                  {prayerStats.prayersOffered}
                </p>
                <p className="text-muted-foreground text-sm">Prayers Offered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-bold text-2xl">
                  {prayerStats.answeredPrayers}
                </p>
                <p className="text-muted-foreground text-sm">Answered Prayers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-bold text-2xl">{prayerStats.prayerStreak}</p>
                <p className="text-muted-foreground text-sm">Day Prayer Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="space-y-4" defaultValue="community">
        <TabsList>
          <TabsTrigger value="community">Community Prayers</TabsTrigger>
          <TabsTrigger value="my-requests">
            My Requests ({myRequests.length})
          </TabsTrigger>
          <TabsTrigger value="answered">Answered Prayers</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="community">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
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
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="mental health">Mental Health</SelectItem>
                <SelectItem value="spiritual">Spiritual</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedStatus} value={selectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prayer Requests */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={request.id}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <CardTitle className="text-lg">
                          {request.title}
                        </CardTitle>
                        {request.isPrivate && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {!request.isPrivate && (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge className={getCategoryColor(request.category)}>
                          {request.category}
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        {request.isAnswered && (
                          <Badge className="bg-green-100 text-green-800">
                            Answered
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {request.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={request.authorImage || '/placeholder.svg'}
                        />
                        <AvatarFallback>
                          {request.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.author}</p>
                        <p className="text-muted-foreground text-xs">
                          {request.dateSubmitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{request.prayerCount} prayers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{request.comments} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Pray for This
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Comment
                    </Button>
                    {request.isAnswered && (
                      <Button size="sm" variant="outline">
                        <Star className="mr-2 h-4 w-4" />
                        Praise Report
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="my-requests">
          <div className="space-y-4">
            {myRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge className={getCategoryColor(request.category)}>
                          {request.category}
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        {request.isAnswered ? (
                          <Badge className="bg-green-100 text-green-800">
                            Answered
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                  <CardDescription className="text-base">
                    {request.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted: {request.dateSubmitted}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{request.prayerCount} prayers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{request.comments} comments</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Comments
                    </Button>
                    {!request.isAnswered && (
                      <Button size="sm">Mark as Answered</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="answered">
          <div className="space-y-4">
            {prayerRequests
              .filter((request) => request.isAnswered)
              .map((request) => (
                <Card className="border-green-200 bg-green-50" key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">
                            {request.title}
                          </CardTitle>
                        </div>
                        <div className="mb-2 flex items-center space-x-2">
                          <Badge className={getCategoryColor(request.category)}>
                            {request.category}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            Answered Prayer
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {request.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={request.authorImage || '/placeholder.svg'}
                          />
                          <AvatarFallback>
                            {request.author
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {request.author}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {request.dateSubmitted}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{request.prayerCount} prayers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{request.comments} comments</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Star className="mr-2 h-4 w-4" />
                        Give Praise
                      </Button>
                      <Button size="sm" variant="outline">
                        Share Testimony
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
