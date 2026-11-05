'use client';

import {
  AlertCircle,
  Bookmark,
  CheckCircle,
  Clock,
  Heart,
  Info,
  MessageSquare,
  Pin,
  Search,
  Share,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFetchAnnouncements } from '@/lib/hooks/church/announcement/use-announcement-queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MemberAnnouncements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: announcementsData } = useFetchAnnouncements(1, searchTerm);
  const serverAnnouncements =
    (announcementsData as any)?.announcements ||
    (announcementsData as any)?.data ||
    [];

  const announcements = (
    Array.isArray(serverAnnouncements) ? serverAnnouncements : []
  ).map((a: any) => ({
    id: String(a.id || a._id || ''),
    title: String(a.title || ''),
    content: String(a.content || ''),
    author: String(a.author || 'Church Admin'),
    authorRole: String(a.authorRole || 'Admin'),
    date: String(a.publishDate || a.createdAt || new Date().toISOString()),
    priority: String(a.priority || 'medium').toLowerCase(),
    category: String(a.category || 'General'),
    pinned: Boolean(a.isPinned || a.pinned),
    likes: Number(a.likes || 0),
    comments: Number(a.comments || 0),
    tags: (Array.isArray(a.tags) ? a.tags : [String(a.category || 'General')]) as string[],
    readStatus: 'unread',
  }));

  const _unusedMockAnnouncements = [
    {
      id: 1,
      title: 'New Year Prayer Week - Join Us for 7 Days of Prayer',
      content:
        "We're excited to announce our New Year Prayer Week starting January 8th! Join us each evening from 7:00-8:00 PM as we seek God's guidance for the year ahead. This will be a time of corporate prayer, worship, and seeking God's heart for our church and community. Light refreshments will be provided each evening. Please bring your Bible and a heart ready to encounter God in a fresh way.",
      author: 'Pastor Michael Johnson',
      authorRole: 'Senior Pastor',
      date: '2024-01-05T10:00:00Z',
      priority: 'high',
      category: 'Prayer',
      pinned: true,
      likes: 45,
      comments: 12,
      tags: ['Prayer', 'New Year', 'Community'],
      readStatus: 'unread',
    },
    {
      id: 2,
      title: 'Volunteer Opportunity: Community Food Drive',
      content:
        "Our church is partnering with the local food bank to host a community food drive on January 20th. We need volunteers to help with setup, registration, food sorting, and distribution. This is a wonderful opportunity to serve our neighbors and show God's love in practical ways. Volunteer shifts are available from 8:00 AM to 4:00 PM. Please sign up at the welcome desk or contact the church office.",
      author: 'Sarah Williams',
      authorRole: 'Outreach Coordinator',
      date: '2024-01-04T14:30:00Z',
      priority: 'medium',
      category: 'Service',
      pinned: false,
      likes: 28,
      comments: 8,
      tags: ['Volunteer', 'Community', 'Service'],
      readStatus: 'read',
    },
    {
      id: 3,
      title: 'Youth Ministry Winter Retreat - Registration Open',
      content:
        "Calling all youth ages 13-18! Our annual winter retreat is scheduled for February 16-18 at Camp Wildwood. This year's theme is 'Unshakeable Faith' and will feature worship, teaching, small groups, and fun activities. The cost is KES 150 per person, with scholarships available for those who need financial assistance. Registration deadline is February 1st. Contact Pastor Jake for more information.",
      author: 'Jake Thompson',
      authorRole: 'Youth Pastor',
      date: '2024-01-03T16:45:00Z',
      priority: 'medium',
      category: 'Youth',
      pinned: false,
      likes: 67,
      comments: 23,
      tags: ['Youth', 'Retreat', 'Registration'],
      readStatus: 'unread',
    },
    {
      id: 4,
      title: 'Sunday Service Time Change - Starting January 14th',
      content:
        'Please note that starting Sunday, January 14th, our morning worship service will begin at 10:30 AM instead of 10:00 AM. This change will allow for better preparation time and a more relaxed atmosphere before service. Sunday School will continue to meet at 9:00 AM. We appreciate your understanding and look forward to worshipping together at our new time.',
      author: 'Church Office',
      authorRole: 'Administration',
      date: '2024-01-02T09:15:00Z',
      priority: 'high',
      category: 'Service',
      pinned: true,
      likes: 34,
      comments: 15,
      tags: ['Service', 'Schedule', 'Important'],
      readStatus: 'read',
    },
    {
      id: 5,
      title: "New Small Group Starting: 'Discovering Your Purpose'",
      content:
        "We're launching a new small group focused on discovering God's purpose for your life. This 8-week study will meet on Wednesday evenings at 7:00 PM starting January 17th. The group will be led by Mark and Lisa Chen and will use the book 'The Purpose Driven Life' by Rick Warren. All adults are welcome to join. Please register at the welcome desk or online through our church app.",
      author: 'Mark Chen',
      authorRole: 'Small Group Leader',
      date: '2024-01-01T11:20:00Z',
      priority: 'low',
      category: 'Small Groups',
      pinned: false,
      likes: 19,
      comments: 6,
      tags: ['Small Groups', 'Study', 'Purpose'],
      readStatus: 'unread',
    },
    {
      id: 6,
      title: 'Church Building Maintenance - Parking Lot Closure',
      content:
        'The church parking lot will be partially closed on January 10th and 11th for routine maintenance and repairs. Please use the overflow parking area behind the fellowship hall during this time. We apologize for any inconvenience and appreciate your patience as we maintain our facilities.',
      author: 'Facilities Team',
      authorRole: 'Maintenance',
      date: '2023-12-30T13:00:00Z',
      priority: 'medium',
      category: 'Facilities',
      pinned: false,
      likes: 8,
      comments: 2,
      tags: ['Facilities', 'Parking', 'Maintenance'],
      readStatus: 'read',
    },
  ];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesPriority =
      filterPriority === 'all' || announcement.priority === filterPriority;
    const matchesCategory =
      filterCategory === 'all' ||
      announcement.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span>Church Announcements</span>
          </CardTitle>
          <CardDescription>
            Stay updated with the latest news and announcements from your church
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search announcements..."
                value={searchTerm}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={setFilterPriority} value={filterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setFilterCategory} value={filterCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="prayer">Prayer</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="small groups">Small Groups</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <Card
            className={`transition-all hover:shadow-md ${
              announcement.readStatus === 'unread'
                ? 'border-l-4 border-l-blue-500 bg-blue-50/30'
                : ''
            } ${announcement.pinned ? 'bg-yellow-50/30 ring-2 ring-yellow-200' : ''}`}
            key={announcement.id}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-yellow-600" />
                    )}
                    {getPriorityIcon(announcement.priority)}
                    <Badge
                      className={getPriorityColor(announcement.priority)}
                      variant="outline"
                    >
                      {announcement.priority.charAt(0).toUpperCase() +
                        announcement.priority.slice(1)}
                    </Badge>
                    <Badge variant="secondary">{announcement.category}</Badge>
                    {announcement.readStatus === 'unread' && (
                      <Badge className="bg-blue-100 text-blue-800">New</Badge>
                    )}
                  </div>
                  <CardTitle className="mb-2 text-xl">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">
                          {announcement.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.authorRole}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(announcement.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                {announcement.content}
              </p>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {announcement.tags.map((tag) => (
                  <Badge className="text-xs" key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <Button
                    className="text-muted-foreground hover:text-red-500"
                    size="sm"
                    variant="ghost"
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    {announcement.likes}
                  </Button>
                  <Button
                    className="text-muted-foreground hover:text-blue-500"
                    size="sm"
                    variant="ghost"
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {announcement.comments}
                  </Button>
                  <Button
                    className="text-muted-foreground hover:text-green-500"
                    size="sm"
                    variant="ghost"
                  >
                    <Share className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button
                  className="text-muted-foreground hover:text-yellow-500"
                  size="sm"
                  variant="ghost"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-medium text-foreground text-lg">
              No announcements found
            </h3>
            <p className="text-center text-muted-foreground">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
