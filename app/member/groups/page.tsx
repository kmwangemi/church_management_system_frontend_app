/** biome-ignore-all lint/style/useTrimStartEnd: ignore */
'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Calendar,
  CalendarIcon,
  MapPin,
  Search,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SmallGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  leader: {
    name: string;
    avatar?: string;
    phone: string;
    email: string;
  };
  meetingDay: string;
  meetingTime: string;
  location: string;
  currentStudy: string;
  capacity: number;
  currentMembers: number;
  isJoined: boolean;
  nextMeeting: string;
  tags: string[];
}

interface GroupMeeting {
  id: string;
  groupName: string;
  date: string;
  time: string;
  location: string;
  topic: string;
}

export default function SmallGroupsPage() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SmallGroup[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<GroupMeeting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  // const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockGroups: SmallGroup[] = [
      {
        id: '1',
        name: 'Young Adults Bible Study',
        description:
          "A vibrant community of young adults exploring God's word together through interactive discussions and fellowship.",
        category: 'Bible Study',
        leader: {
          name: 'Sarah Johnson',
          avatar: '/placeholder.svg?height=40&width=40',
          phone: '+1 (555) 123-4567',
          email: 'sarah.j@email.com',
        },
        meetingDay: 'Wednesday',
        meetingTime: '7:00 PM',
        location: 'Room 201, Main Building',
        currentStudy: 'Book of Romans',
        capacity: 15,
        currentMembers: 12,
        isJoined: true,
        nextMeeting: '2024-01-10',
        tags: ['Bible Study', 'Young Adults', 'Fellowship'],
      },
      {
        id: '2',
        name: "Men's Prayer Group",
        description:
          'Men gathering weekly to pray, share testimonies, and support each other in their faith journey.',
        category: 'Prayer',
        leader: {
          name: 'Michael Davis',
          avatar: '/placeholder.svg?height=40&width=40',
          phone: '+1 (555) 234-5678',
          email: 'michael.d@email.com',
        },
        meetingDay: 'Saturday',
        meetingTime: '6:30 AM',
        location: 'Fellowship Hall',
        currentStudy: 'The Power of Prayer',
        capacity: 20,
        currentMembers: 8,
        isJoined: false,
        nextMeeting: '2024-01-13',
        tags: ['Prayer', 'Men', 'Early Morning'],
      },
      {
        id: '3',
        name: "Women's Life Group",
        description:
          'A supportive community of women studying scripture and sharing life experiences together.',
        category: 'Life Group',
        leader: {
          name: 'Jennifer Wilson',
          avatar: '/placeholder.svg?height=40&width=40',
          phone: '+1 (555) 345-6789',
          email: 'jennifer.w@email.com',
        },
        meetingDay: 'Thursday',
        meetingTime: '10:00 AM',
        location: 'Room 105, Education Wing',
        currentStudy: 'Proverbs 31 Woman',
        capacity: 12,
        currentMembers: 10,
        isJoined: true,
        nextMeeting: '2024-01-11',
        tags: ['Life Group', 'Women', 'Morning'],
      },
      {
        id: '4',
        name: 'Couples Connection',
        description:
          'Married couples strengthening their relationships through biblical principles and fellowship.',
        category: 'Marriage',
        leader: {
          name: 'David & Lisa Brown',
          avatar: '/placeholder.svg?height=40&width=40',
          phone: '+1 (555) 456-7890',
          email: 'browns@email.com',
        },
        meetingDay: 'Friday',
        meetingTime: '7:30 PM',
        location: 'Room 301, Family Center',
        currentStudy: 'Love & Respect',
        capacity: 16,
        currentMembers: 14,
        isJoined: false,
        nextMeeting: '2024-01-12',
        tags: ['Marriage', 'Couples', 'Evening'],
      },
      {
        id: '5',
        name: 'Youth Discipleship',
        description:
          'High school students diving deep into discipleship and leadership development.',
        category: 'Youth',
        leader: {
          name: 'Pastor Mark Thompson',
          avatar: '/placeholder.svg?height=40&width=40',
          phone: '+1 (555) 567-8901',
          email: 'mark.t@email.com',
        },
        meetingDay: 'Sunday',
        meetingTime: '4:00 PM',
        location: 'Youth Center',
        currentStudy: 'Radical Discipleship',
        capacity: 25,
        currentMembers: 18,
        isJoined: false,
        nextMeeting: '2024-01-14',
        tags: ['Youth', 'Discipleship', 'Leadership'],
      },
    ];

    const mockMeetings: GroupMeeting[] = [
      {
        id: '1',
        groupName: 'Young Adults Bible Study',
        date: '2024-01-10',
        time: '7:00 PM',
        location: 'Room 201',
        topic: 'Romans 8: Life in the Spirit',
      },
      {
        id: '2',
        groupName: "Women's Life Group",
        date: '2024-01-11',
        time: '10:00 AM',
        location: 'Room 105',
        topic: 'Strength and Dignity',
      },
      {
        id: '3',
        groupName: "Men's Prayer Group",
        date: '2024-01-13',
        time: '6:30 AM',
        location: 'Fellowship Hall',
        topic: 'Praying for Our Families',
      },
    ];

    setGroups(mockGroups);
    setMyGroups(mockGroups.filter((group) => group.isJoined));
    setUpcomingMeetings(mockMeetings);
    setLoading(false);
  }, []);

  const handleJoinGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isJoined: true,
              currentMembers: group.currentMembers + 1,
            }
          : group
      )
    );
    const joinedGroup = groups.find((group) => group.id === groupId);
    if (joinedGroup) {
      setMyGroups([...myGroups, { ...joinedGroup, isJoined: true }]);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isJoined: false,
              currentMembers: group.currentMembers - 1,
            }
          : group
      )
    );
    setMyGroups(myGroups.filter((group) => group.id !== groupId));
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.leader.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || group.category === categoryFilter;
    const matchesDay = dayFilter === 'all' || group.meetingDay === dayFilter;

    return matchesSearch && matchesCategory && matchesDay;
  });

  const categories = [
    'all',
    ...Array.from(new Set(groups.map((group) => group.category))),
  ];
  const days = [
    'all',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...new Array(6)].map((_, i) => (
            <div
              className="h-64 animate-pulse rounded-lg bg-secondary"
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Small Groups</h1>
          <p className="mt-1 text-muted-foreground">
            Connect, grow, and build relationships in community
          </p>
        </div>
      </div>

      <Tabs className="space-y-6" defaultValue="discover">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          <TabsTrigger value="my-groups">
            My Groups ({myGroups.length})
          </TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="discover">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Label htmlFor="search">Search Groups</Label>
                  <div className="relative">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      id="search"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, description, or leader..."
                      value={searchTerm}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={setCategoryFilter}
                    value={categoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="day">Meeting Day</Label>
                  <Select onValueChange={setDayFilter} value={dayFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day === 'all' ? 'Any Day' : day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groups Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={group.id}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge className="mt-1" variant="secondary">
                        {group.category}
                      </Badge>
                    </div>
                    <div className="text-right text-muted-foreground text-sm">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {group.currentMembers}/{group.capacity}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {group.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {group.meetingDay}s at {group.meetingTime}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {group.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {group.currentStudy}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        alt={group.leader.name}
                        src={group.leader.avatar || '/placeholder.svg'}
                      />
                      <AvatarFallback>
                        {group.leader.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{group.leader.name}</p>
                      <p className="text-muted-foreground text-xs">Group Leader</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge className="text-xs" key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1 bg-transparent"
                          size="sm"
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{group.name}</DialogTitle>
                          <DialogDescription>
                            {group.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">
                                Meeting Time
                              </Label>
                              <p>
                                {group.meetingDay}s at {group.meetingTime}
                              </p>
                            </div>
                            <div>
                              <Label className="font-medium">Location</Label>
                              <p>{group.location}</p>
                            </div>
                            <div>
                              <Label className="font-medium">
                                Current Study
                              </Label>
                              <p>{group.currentStudy}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Capacity</Label>
                              <p>
                                {group.currentMembers}/{group.capacity} members
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label className="font-medium">Group Leader</Label>
                            <div className="mt-2 flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage
                                  alt={group.leader.name}
                                  src={
                                    group.leader.avatar || '/placeholder.svg'
                                  }
                                />
                                <AvatarFallback>
                                  {group.leader.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {group.leader.name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {group.leader.email}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {group.leader.phone}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {group.isJoined ? (
                              <Button
                                className="flex-1"
                                onClick={() => handleLeaveGroup(group.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Leave Group
                              </Button>
                            ) : (
                              <Button
                                className="flex-1"
                                disabled={
                                  group.currentMembers >= group.capacity
                                }
                                onClick={() => handleJoinGroup(group.id)}
                                size="sm"
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                {group.currentMembers >= group.capacity
                                  ? 'Group Full'
                                  : 'Join Group'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {group.isJoined ? (
                      <Button
                        onClick={() => handleLeaveGroup(group.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        disabled={group.currentMembers >= group.capacity}
                        onClick={() => handleJoinGroup(group.id)}
                        size="sm"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-medium text-foreground text-lg">
                  No groups found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent className="space-y-6" value="my-groups">
          {myGroups.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {myGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge className="mt-1" variant="secondary">
                          {group.category}
                        </Badge>
                      </div>
                      <Badge
                        className="bg-green-50 text-green-700"
                        variant="outline"
                      >
                        Joined
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Next: {new Date(group.nextMeeting).toLocaleDateString()}{' '}
                        at {group.meetingTime}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {group.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Currently studying: {group.currentStudy}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          alt={group.leader.name}
                          src={group.leader.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback>
                          {group.leader.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {group.leader.name}
                        </p>
                        <p className="text-muted-foreground text-xs">Group Leader</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-transparent"
                        size="sm"
                        variant="outline"
                      >
                        Contact Leader
                      </Button>
                      <Button
                        onClick={() => handleLeaveGroup(group.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-medium text-foreground text-lg">
                  No groups joined yet
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Discover and join small groups to start building community.
                </p>
                <Button
                // onClick={() =>
                //   document.querySelector('[value="discover"]')?.click()
                // }
                >
                  Discover Groups
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent className="space-y-6" value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                Your small group meeting schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      className="flex items-center space-x-4 rounded-lg border p-4"
                      key={meeting.id}
                    >
                      <div className="rounded-lg bg-blue-100 p-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{meeting.groupName}</h4>
                        <p className="text-muted-foreground text-sm">{meeting.topic}</p>
                        <div className="mt-1 flex items-center space-x-4 text-muted-foreground text-sm">
                          <span>
                            {new Date(meeting.date).toLocaleDateString()}
                          </span>
                          <span>{meeting.time}</span>
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Add to Calendar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-medium text-foreground text-lg">
                    No upcoming meetings
                  </h3>
                  <p className="text-muted-foreground">
                    Join a small group to see your meeting schedule.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
