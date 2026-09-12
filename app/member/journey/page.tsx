'use client';

import {
  Award,
  BookOpen,
  CalendarIcon,
  CheckCircle,
  Clock,
  Flame,
  Plus,
  Target,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import { cn } from '@/lib/utils';

interface SpiritualGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  createdDate: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  significance: 'low' | 'medium' | 'high';
}

interface BibleReading {
  id: string;
  book: string;
  chapter: number;
  verses?: string;
  date: string;
  notes?: string;
  duration: number; // in minutes
}

interface SpiritualStats {
  totalGoals: number;
  completedGoals: number;
  currentStreak: number;
  longestStreak: number;
  booksRead: number;
  chaptersRead: number;
  prayerMinutes: number;
  milestonesRecorded: number;
}

export default function SpiritualJourneyPage() {
  const [goals, setGoals] = useState<SpiritualGoal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [bibleReadings, setBibleReadings] = useState<BibleReading[]>([]);
  const [stats, setStats] = useState<SpiritualStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [selectedDate, setSelectedDate] = useState<Date>();

  // Form states
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    significance: 'medium' as const,
  });
  const [newReading, setNewReading] = useState({
    book: '',
    chapter: '',
    verses: '',
    notes: '',
    duration: '',
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockGoals: SpiritualGoal[] = [
      {
        id: '1',
        title: 'Read the Bible Daily',
        description:
          'Commit to reading at least one chapter of the Bible every day',
        category: 'Bible Study',
        targetDate: '2024-12-31',
        progress: 75,
        status: 'active',
        createdDate: '2024-01-01',
      },
      {
        id: '2',
        title: 'Memorize 12 Verses',
        description: 'Memorize one Bible verse each month throughout the year',
        category: 'Scripture Memory',
        targetDate: '2024-12-31',
        progress: 33,
        status: 'active',
        createdDate: '2024-01-01',
      },
      {
        id: '3',
        title: 'Pray for 30 Minutes Daily',
        description:
          'Establish a consistent prayer routine of 30 minutes each day',
        category: 'Prayer',
        targetDate: '2024-06-30',
        progress: 100,
        status: 'completed',
        createdDate: '2024-01-01',
      },
      {
        id: '4',
        title: 'Serve Monthly',
        description: 'Volunteer in church ministry at least once per month',
        category: 'Service',
        targetDate: '2024-12-31',
        progress: 60,
        status: 'active',
        createdDate: '2024-01-01',
      },
    ];

    const mockMilestones: Milestone[] = [
      {
        id: '1',
        title: 'Baptism',
        description: 'Public declaration of faith through water baptism',
        category: 'Sacrament',
        date: '2023-04-15',
        significance: 'high',
      },
      {
        id: '2',
        title: 'First Time Leading Prayer',
        description: 'Led opening prayer during Sunday service',
        category: 'Leadership',
        date: '2023-08-20',
        significance: 'medium',
      },
      {
        id: '3',
        title: 'Completed Bible Study Course',
        description: 'Finished 12-week foundational Bible study program',
        category: 'Education',
        date: '2023-11-30',
        significance: 'high',
      },
      {
        id: '4',
        title: 'Joined Small Group',
        description: 'Became an active member of Young Adults Bible Study',
        category: 'Fellowship',
        date: '2024-01-10',
        significance: 'medium',
      },
      {
        id: '5',
        title: 'First Mission Trip',
        description: 'Participated in local community outreach mission',
        category: 'Mission',
        date: '2024-03-15',
        significance: 'high',
      },
    ];

    const mockReadings: BibleReading[] = [
      {
        id: '1',
        book: 'Matthew',
        chapter: 5,
        verses: '1-12',
        date: '2024-01-08',
        notes: 'The Beatitudes - powerful teaching on kingdom values',
        duration: 15,
      },
      {
        id: '2',
        book: 'Psalms',
        chapter: 23,
        date: '2024-01-07',
        notes: "Comforting reminder of God's shepherding care",
        duration: 10,
      },
      {
        id: '3',
        book: 'Romans',
        chapter: 8,
        verses: '28-39',
        date: '2024-01-06',
        notes: "Nothing can separate us from God's love",
        duration: 20,
      },
    ];

    const mockStats: SpiritualStats = {
      totalGoals: 4,
      completedGoals: 1,
      currentStreak: 15,
      longestStreak: 45,
      booksRead: 8,
      chaptersRead: 156,
      prayerMinutes: 2340,
      milestonesRecorded: 5,
    };

    setGoals(mockGoals);
    setMilestones(mockMilestones);
    setBibleReadings(mockReadings);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.category && newGoal.targetDate) {
      const goal: SpiritualGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        targetDate: newGoal.targetDate,
        progress: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', category: '', targetDate: '' });
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.category && newMilestone.date) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.title,
        description: newMilestone.description,
        category: newMilestone.category,
        date: newMilestone.date,
        significance: newMilestone.significance,
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({
        title: '',
        description: '',
        category: '',
        date: '',
        significance: 'medium',
      });
    }
  };

  const handleAddReading = () => {
    if (newReading.book && newReading.chapter) {
      const reading: BibleReading = {
        id: Date.now().toString(),
        book: newReading.book,
        chapter: Number.parseInt(newReading.chapter, 10),
        verses: newReading.verses || undefined,
        date: new Date().toISOString().split('T')[0],
        notes: newReading.notes || undefined,
        duration: Number.parseInt(newReading.duration, 10) || 10,
      };
      setBibleReadings([reading, ...bibleReadings]);
      setNewReading({
        book: '',
        chapter: '',
        verses: '',
        notes: '',
        duration: '',
      });
    }
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              progress,
              status: progress >= 100 ? 'completed' : 'active',
            }
          : goal
      )
    );
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  // Chart data
  const progressData = goals.map((goal) => ({
    name: `${goal.title.substring(0, 15)}...`,
    progress: goal.progress,
  }));

  const categoryData = milestones.reduce(
    (acc, milestone) => {
      acc[milestone.category] = (acc[milestone.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...new Array(4)].map((_, i) => (
            <div
              className="h-32 animate-pulse rounded-lg bg-secondary"
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
          <h1 className="font-bold text-3xl text-foreground">
            Spiritual Journey
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your spiritual growth and celebrate milestones
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl">
                    {stats.completedGoals}/{stats.totalGoals}
                  </p>
                  <p className="text-muted-foreground text-sm">Goals Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl">{stats.currentStreak}</p>
                  <p className="text-muted-foreground text-sm">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-green-100 p-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl">{stats.chaptersRead}</p>
                  <p className="text-muted-foreground text-sm">Chapters Read</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl">
                    {stats.milestonesRecorded}
                  </p>
                  <p className="text-muted-foreground text-sm">Milestones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs className="space-y-6" defaultValue="goals">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="bible-reading">Bible Reading</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="goals">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Spiritual Goals</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Spiritual Goal</DialogTitle>
                  <DialogDescription>
                    Set a new goal for your spiritual growth
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      placeholder="e.g., Read through the New Testament"
                      value={newGoal.title}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea
                      id="goal-description"
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                      placeholder="Describe your goal in detail..."
                      value={newGoal.description}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewGoal({ ...newGoal, category: value })
                      }
                      value={newGoal.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bible Study">Bible Study</SelectItem>
                        <SelectItem value="Prayer">Prayer</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Fellowship">Fellowship</SelectItem>
                        <SelectItem value="Scripture Memory">
                          Scripture Memory
                        </SelectItem>
                        <SelectItem value="Discipleship">
                          Discipleship
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal-date">Target Date</Label>
                    <Input
                      id="goal-date"
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetDate: e.target.value })
                      }
                      type="date"
                      value={newGoal.targetDate}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddGoal}>
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge
                        className={cn('mt-1', getStatusColor(goal.status))}
                        variant="secondary"
                      >
                        {goal.status}
                      </Badge>
                    </div>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{goal.description}</p>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress className="h-2" value={goal.progress} />
                  </div>

                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                    <span>
                      Started: {new Date(goal.createdDate).toLocaleDateString()}
                    </span>
                  </div>

                  {goal.status === 'active' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            Math.min(goal.progress + 10, 100)
                          )
                        }
                        size="sm"
                        variant="outline"
                      >
                        +10%
                      </Button>
                      <Button
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            Math.min(goal.progress + 25, 100)
                          )
                        }
                        size="sm"
                        variant="outline"
                      >
                        +25%
                      </Button>
                      {goal.progress < 100 && (
                        <Button
                          onClick={() => updateGoalProgress(goal.id, 100)}
                          size="sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  )}

                  {goal.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        Goal Completed!
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="milestones">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Spiritual Milestones</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Milestone</DialogTitle>
                  <DialogDescription>
                    Document a significant moment in your spiritual journey
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="milestone-title">Milestone Title</Label>
                    <Input
                      id="milestone-title"
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g., First Time Sharing Testimony"
                      value={newMilestone.title}
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestone-description">Description</Label>
                    <Textarea
                      id="milestone-description"
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe what happened and why it's significant..."
                      value={newMilestone.description}
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestone-category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewMilestone({ ...newMilestone, category: value })
                      }
                      value={newMilestone.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sacrament">Sacrament</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Fellowship">Fellowship</SelectItem>
                        <SelectItem value="Mission">Mission</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="milestone-significance">Significance</Label>
                    <Select
                      // onValueChange={(value: 'low' | 'medium' | 'high') =>
                      //   setNewMilestone({
                      //     ...newMilestone,
                      //     significance: value,
                      //   })
                      // }
                      value={newMilestone.significance}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select significance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="milestone-date">Date</Label>
                    <Input
                      id="milestone-date"
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          date: e.target.value,
                        })
                      }
                      type="date"
                      value={newMilestone.date}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddMilestone}>
                    Record Milestone
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <p className="mt-1 text-muted-foreground text-sm">
                            {milestone.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">{milestone.category}</Badge>
                          <Badge
                            className={getSignificanceColor(
                              milestone.significance
                            )}
                            variant="secondary"
                          >
                            {milestone.significance}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-2 text-muted-foreground text-sm">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="bible-reading">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Bible Reading Log</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Reading
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Bible Reading</DialogTitle>
                  <DialogDescription>
                    Record your daily Bible reading
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reading-book">Book</Label>
                    <Input
                      id="reading-book"
                      onChange={(e) =>
                        setNewReading({ ...newReading, book: e.target.value })
                      }
                      placeholder="e.g., Matthew"
                      value={newReading.book}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading-chapter">Chapter</Label>
                    <Input
                      id="reading-chapter"
                      onChange={(e) =>
                        setNewReading({
                          ...newReading,
                          chapter: e.target.value,
                        })
                      }
                      placeholder="e.g., 5"
                      type="number"
                      value={newReading.chapter}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading-verses">Verses (optional)</Label>
                    <Input
                      id="reading-verses"
                      onChange={(e) =>
                        setNewReading({ ...newReading, verses: e.target.value })
                      }
                      placeholder="e.g., 1-12"
                      value={newReading.verses}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading-duration">Duration (minutes)</Label>
                    <Input
                      id="reading-duration"
                      onChange={(e) =>
                        setNewReading({
                          ...newReading,
                          duration: e.target.value,
                        })
                      }
                      placeholder="e.g., 15"
                      type="number"
                      value={newReading.duration}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading-notes">Notes (optional)</Label>
                    <Textarea
                      id="reading-notes"
                      onChange={(e) =>
                        setNewReading({ ...newReading, notes: e.target.value })
                      }
                      placeholder="Key insights, reflections, or questions..."
                      value={newReading.notes}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddReading}>
                    Log Reading
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {bibleReadings.map((reading) => (
              <Card key={reading.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-green-100 p-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {reading.book} {reading.chapter}
                            {reading.verses && `:${reading.verses}`}
                          </h3>
                          {reading.notes && (
                            <p className="mt-1 text-muted-foreground text-sm">
                              {reading.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{reading.duration} min</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-2 text-muted-foreground text-sm">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {new Date(reading.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="analytics">
          <h2 className="font-semibold text-xl">Spiritual Growth Analytics</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>
                  Track your spiritual goal completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    progress: {
                      label: 'Progress',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="progress" fill="var(--color-progress)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestone Categories</CardTitle>
                <CardDescription>
                  Distribution of your spiritual milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    value: {
                      label: 'Count',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={pieData}
                        dataKey="value"
                        fill="#8884d8"
                        // label={({ name, percent }) =>
                        //   `${name} ${(percent * 100).toFixed(0)}%`
                        // }
                        labelLine={false}
                        outerRadius={80}
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            fill={COLORS[index % COLORS.length]}
                            key={`cell-${index}`}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Summary</CardTitle>
              <CardDescription>
                Your spiritual journey at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="font-bold text-2xl text-blue-600">
                    {stats?.longestStreak}
                  </div>
                  <div className="text-blue-800 text-sm">
                    Longest Streak (days)
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="font-bold text-2xl text-green-600">
                    {stats?.booksRead}
                  </div>
                  <div className="text-green-800 text-sm">Books Completed</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="font-bold text-2xl text-purple-600">
                    {Math.floor((stats?.prayerMinutes || 0) / 60)}
                  </div>
                  <div className="text-purple-800 text-sm">Hours in Prayer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
