'use client';

import { format } from 'date-fns';
import {
  Award,
  BookOpen,
  CalendarIcon,
  CheckCircle,
  Clock,
  Flame,
  Heart,
  Plus,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function MemberSpiritualJourneyPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);

  // Mock data for spiritual journey
  const spiritualStats = {
    bibleReadingStreak: 42,
    prayerStreak: 28,
    serviceHours: 156,
    discipleshipLevel: 'Growing Believer',
    completedStudies: 8,
    mentorshipStatus: 'Being Mentored',
  };

  const goals = [
    {
      id: 1,
      title: 'Read Bible Daily',
      description: 'Complete daily Bible reading plan',
      category: 'Bible Study',
      targetDate: '2024-12-31',
      progress: 75,
      status: 'active',
      streak: 42,
    },
    {
      id: 2,
      title: 'Serve Monthly',
      description: 'Volunteer in church ministry at least once per month',
      category: 'Service',
      targetDate: '2024-12-31',
      progress: 60,
      status: 'active',
      streak: 8,
    },
    {
      id: 3,
      title: 'Complete Discipleship Course',
      description: 'Finish the Growing in Faith discipleship program',
      category: 'Discipleship',
      targetDate: '2024-06-30',
      progress: 90,
      status: 'active',
      streak: 0,
    },
  ];

  const milestones = [
    {
      id: 1,
      title: 'Baptism',
      description: 'Public declaration of faith through baptism',
      date: '2023-03-15',
      category: 'Sacrament',
      status: 'completed',
      significance: 'high',
    },
    {
      id: 2,
      title: 'First Communion',
      description: 'Participated in communion for the first time',
      date: '2023-03-22',
      category: 'Sacrament',
      status: 'completed',
      significance: 'high',
    },
    {
      id: 3,
      title: 'Small Group Leadership',
      description: 'Started co-leading a small group',
      date: '2023-09-10',
      category: 'Leadership',
      status: 'completed',
      significance: 'medium',
    },
    {
      id: 4,
      title: 'Mission Trip',
      description: 'Participated in local mission outreach',
      date: '2023-11-20',
      category: 'Service',
      status: 'completed',
      significance: 'high',
    },
  ];

  const bibleReadingPlan = [
    { week: 'Week 1', book: 'Genesis', chapters: '1-7', completed: true },
    { week: 'Week 2', book: 'Genesis', chapters: '8-14', completed: true },
    { week: 'Week 3', book: 'Genesis', chapters: '15-21', completed: true },
    { week: 'Week 4', book: 'Genesis', chapters: '22-28', completed: false },
    { week: 'Week 5', book: 'Genesis', chapters: '29-35', completed: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'high':
        return <Star className="h-4 w-4 fill-current text-yellow-500" />;
      case 'medium':
        return <Star className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl">Spiritual Journey</h1>
          <p className="text-muted-foreground">
            Track your growth and milestones in faith
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog onOpenChange={setIsAddGoalOpen} open={isAddGoalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Spiritual Goal</DialogTitle>
                <DialogDescription>
                  Set a new goal for your spiritual growth
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="Enter your spiritual goal"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-description">Description</Label>
                  <Textarea
                    id="goal-description"
                    placeholder="Describe your goal in detail"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bible-study">Bible Study</SelectItem>
                        <SelectItem value="prayer">Prayer</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="discipleship">
                          Discipleship
                        </SelectItem>
                        <SelectItem value="evangelism">Evangelism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target-date">Target Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="w-full justify-start bg-transparent text-left font-normal"
                          variant="outline"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, 'PPP')
                            : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          initialFocus
                          mode="single"
                          onSelect={setSelectedDate}
                          selected={selectedDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsAddGoalOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddGoalOpen(false)}>
                    Add Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={setIsAddMilestoneOpen}
            open={isAddMilestoneOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Milestone</DialogTitle>
                <DialogDescription>
                  Record a significant moment in your spiritual journey
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="milestone-title">Milestone Title</Label>
                  <Input
                    id="milestone-title"
                    placeholder="Enter milestone title"
                  />
                </div>
                <div>
                  <Label htmlFor="milestone-description">Description</Label>
                  <Textarea
                    id="milestone-description"
                    placeholder="Describe this milestone"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="milestone-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sacrament">Sacrament</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="milestone-significance">Significance</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select significance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsAddMilestoneOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddMilestoneOpen(false)}>
                    Add Milestone
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Spiritual Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-bold text-2xl">
                  {spiritualStats.bibleReadingStreak}
                </p>
                <p className="text-muted-foreground text-sm">Day Reading Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-bold text-2xl">
                  {spiritualStats.prayerStreak}
                </p>
                <p className="text-muted-foreground text-sm">Prayer Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-bold text-2xl">
                  {spiritualStats.serviceHours}
                </p>
                <p className="text-muted-foreground text-sm">Service Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-bold text-lg">
                  {spiritualStats.discipleshipLevel}
                </p>
                <p className="text-muted-foreground text-sm">Current Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-bold text-2xl">
                  {spiritualStats.completedStudies}
                </p>
                <p className="text-muted-foreground text-sm">Studies Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-bold text-lg">
                  {spiritualStats.mentorshipStatus}
                </p>
                <p className="text-muted-foreground text-sm">Mentorship</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="space-y-4" defaultValue="goals">
        <TabsList>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="bible-plan">Bible Reading</TabsTrigger>
          <TabsTrigger value="growth">Growth Analytics</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="goals">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress className="h-2" value={goal.progress} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{goal.category}</Badge>
                      {goal.streak > 0 && (
                        <Badge variant="secondary">
                          <Flame className="mr-1 h-3 w-3" />
                          {goal.streak} day streak
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due: {goal.targetDate}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-transparent"
                      size="sm"
                      variant="outline"
                    >
                      Update Progress
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="milestones">
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getSignificanceIcon(milestone.significance)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold text-lg">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{milestone.category}</Badge>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-3 text-muted-foreground">
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{milestone.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-4" value="bible-plan">
          <Card>
            <CardHeader>
              <CardTitle>Current Bible Reading Plan</CardTitle>
              <CardDescription>
                One Year Bible Reading Plan - Genesis to Revelation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bibleReadingPlan.map((week, index) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={index}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {week.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{week.week}</p>
                        <p className="text-muted-foreground text-sm">
                          {week.book} {week.chapters}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {week.completed ? (
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="growth">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spiritual Growth Metrics</CardTitle>
                <CardDescription>
                  Your progress over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Bible Knowledge</span>
                      <span>85%</span>
                    </div>
                    <Progress className="h-2" value={85} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Prayer Life</span>
                      <span>78%</span>
                    </div>
                    <Progress className="h-2" value={78} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Service & Ministry</span>
                      <span>92%</span>
                    </div>
                    <Progress className="h-2" value={92} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Fellowship & Community</span>
                      <span>88%</span>
                    </div>
                    <Progress className="h-2" value={88} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Milestones reached this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">30-Day Prayer Streak</p>
                      <p className="text-muted-foreground text-sm">
                        Consistent daily prayer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Completed Romans Study</p>
                      <p className="text-muted-foreground text-sm">
                        8-week Bible study
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Volunteer Recognition</p>
                      <p className="text-muted-foreground text-sm">50+ service hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
