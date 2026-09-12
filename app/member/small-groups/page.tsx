'use client';

import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Heart,
  MapPin,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MemberSmallGroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  // Mock data for small groups
  const smallGroups = [
    {
      id: 1,
      name: 'Young Adults Bible Study',
      description:
        "A vibrant community of young adults studying God's word together and building lasting friendships.",
      category: 'bible-study',
      leader: 'Pastor Mike Johnson',
      leaderImage: '/placeholder.svg?height=40&width=40',
      meetingDay: 'Wednesday',
      meetingTime: '7:00 PM',
      location: 'Room 201, Main Building',
      members: 18,
      capacity: 25,
      ageGroup: '18-35',
      isJoined: false,
      nextMeeting: '2024-01-17',
      currentStudy: 'Book of Romans',
      tags: ['Bible Study', 'Fellowship', 'Young Adults'],
    },
    {
      id: 2,
      name: "Women's Prayer Circle",
      description:
        'A supportive group of women coming together for prayer, encouragement, and spiritual growth.',
      category: 'prayer',
      leader: 'Sarah Williams',
      leaderImage: '/placeholder.svg?height=40&width=40',
      meetingDay: 'Tuesday',
      meetingTime: '10:00 AM',
      location: 'Fellowship Hall',
      members: 12,
      capacity: 20,
      ageGroup: 'All Ages',
      isJoined: true,
      nextMeeting: '2024-01-16',
      currentStudy: 'Praying Through Scripture',
      tags: ['Prayer', 'Women', 'Support'],
    },
    {
      id: 3,
      name: "Men's Discipleship Group",
      description:
        'Men growing together in faith, accountability, and Christian brotherhood.',
      category: 'discipleship',
      leader: 'David Chen',
      leaderImage: '/placeholder.svg?height=40&width=40',
      meetingDay: 'Saturday',
      meetingTime: '8:00 AM',
      location: 'Coffee Shop Downtown',
      members: 8,
      capacity: 12,
      ageGroup: '25+',
      isJoined: false,
      nextMeeting: '2024-01-20',
      currentStudy: 'Wild at Heart',
      tags: ['Men', 'Discipleship', 'Accountability'],
    },
    {
      id: 4,
      name: 'Family Life Group',
      description:
        'Families with children learning to navigate parenting and marriage with biblical principles.',
      category: 'family',
      leader: 'Tom & Lisa Anderson',
      leaderImage: '/placeholder.svg?height=40&width=40',
      meetingDay: 'Sunday',
      meetingTime: '6:00 PM',
      location: 'Anderson Home',
      members: 16,
      capacity: 20,
      ageGroup: 'Families',
      isJoined: true,
      nextMeeting: '2024-01-21',
      currentStudy: 'Love & Respect',
      tags: ['Family', 'Parenting', 'Marriage'],
    },
  ];

  const myGroups = smallGroups.filter((group) => group.isJoined);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bible-study':
        return 'bg-blue-100 text-blue-800';
      case 'prayer':
        return 'bg-purple-100 text-purple-800';
      case 'discipleship':
        return 'bg-green-100 text-green-800';
      case 'family':
        return 'bg-orange-100 text-orange-800';
      case 'youth':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const filteredGroups = smallGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || group.category === selectedCategory;
    const matchesDay =
      selectedDay === 'all' ||
      group.meetingDay.toLowerCase() === selectedDay.toLowerCase();
    return matchesSearch && matchesCategory && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl">Small Groups</h1>
          <p className="text-muted-foreground">
            Connect, grow, and build community through small groups
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Request New Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-bold text-2xl">{myGroups.length}</p>
                <p className="text-muted-foreground text-sm">Groups Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-bold text-2xl">24</p>
                <p className="text-muted-foreground text-sm">Meetings Attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-bold text-2xl">3</p>
                <p className="text-muted-foreground text-sm">Studies Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-bold text-2xl">12</p>
                <p className="text-muted-foreground text-sm">Connections Made</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="space-y-4" defaultValue="discover">
        <TabsList>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          <TabsTrigger value="my-groups">
            My Groups ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="discover">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search small groups..."
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
                <SelectItem value="bible-study">Bible Study</SelectItem>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="discipleship">Discipleship</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedDay} value={selectedDay}>
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Meeting Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Day</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredGroups.map((group) => (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={group.id}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 text-lg">
                        {group.name}
                      </CardTitle>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge className={getCategoryColor(group.category)}>
                          {group.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">{group.ageGroup}</Badge>
                      </div>
                    </div>
                    {group.isJoined && (
                      <Badge className="bg-green-100 text-green-800">
                        Joined
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Leader Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={group.leaderImage || '/placeholder.svg'}
                      />
                      <AvatarFallback>
                        {group.leader
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{group.leader}</p>
                      <p className="text-muted-foreground text-sm">Group Leader</p>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {group.meetingDay}s at {group.meetingTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{group.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Currently studying: {group.currentStudy}</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Group Size</span>
                      <span>
                        {group.members}/{group.capacity} members
                      </span>
                    </div>
                    <Progress
                      className="h-2"
                      value={(group.members / group.capacity) * 100}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag, index) => (
                      <Badge
                        className="text-xs"
                        key={index}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    {group.isJoined ? (
                      <>
                        <Button className="flex-1">View Details</Button>
                        <Button variant="outline">Leave Group</Button>
                      </>
                    ) : (
                      <>
                        <Button className="flex-1">Join Group</Button>
                        <Button variant="outline">Learn More</Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="my-groups">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {myGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={group.leaderImage || '/placeholder.svg'}
                      />
                      <AvatarFallback>
                        {group.leader
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{group.leader}</p>
                      <p className="text-muted-foreground text-sm">Group Leader</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Next meeting: {group.nextMeeting}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {group.meetingDay}s at {group.meetingTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Studying: {group.currentStudy}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">View Group</Button>
                    <Button variant="outline">Message Leader</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Your small group meeting schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={group.id}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="font-semibold">{group.meetingDay}</p>
                        <p className="text-muted-foreground text-sm">
                          {group.meetingTime}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {group.location}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
