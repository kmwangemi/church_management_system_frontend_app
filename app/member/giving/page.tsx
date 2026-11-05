'use client';

import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Gift,
  Heart,
  Plus,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useFetchOfferings } from '@/lib/hooks/church/offering/use-offering-queries';
import { useFetchPledges } from '@/lib/hooks/church/pledge/use-pledge-queries';
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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MemberGiving() {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [givingType, setGivingType] = useState('tithe');

  const { data: offeringsData } = useFetchOfferings();
  const { data: pledgesData } = useFetchPledges();
  const serverOfferings =
    (offeringsData as any)?.data?.offerings ||
    (offeringsData as any)?.offerings ||
    [];
  const serverPledges =
    (pledgesData as any)?.data?.pledges ||
    (pledgesData as any)?.pledges ||
    [];

  const recentGifts = (Array.isArray(serverOfferings) ? serverOfferings : []).map(
    (o: any) => ({
      id: o.id || o._id,
      date: o.date ? new Date(o.date).toLocaleDateString() : '',
      amount: Number(o.amount || 0),
      type: o.type || 'Offering',
      method: o.method || 'M-Pesa',
      status: o.status || 'Completed',
    })
  );

  const pledges = (Array.isArray(serverPledges) ? serverPledges : []).map(
    (p: any) => ({
      id: p.id || p._id,
      name: p.purpose || p.notes || 'Pledge Commitment',
      goal: Number(p.amount || 0),
      current: Number(p.paidAmount || 0),
      deadline: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '',
      frequency: 'Flexible',
    })
  );

  const totalGivingThisYear = recentGifts.reduce((s, g) => s + g.amount, 0);
  const totalPledgeGoal = pledges.reduce((s, p) => s + p.goal, 0);
  const totalPledgePaid = pledges.reduce((s, p) => s + p.current, 0);

  const givingStats = {
    totalThisYear: totalGivingThisYear,
    totalLifetime: totalGivingThisYear,
    averageMonthly: Math.round(totalGivingThisYear / 12),
    lastGift: recentGifts[0]?.date || 'N/A',
    streak: recentGifts.length,
    pledgeGoal: totalPledgeGoal,
    pledgeProgress: totalPledgePaid,
  };

  const _unusedRecentGifts = [
    {
      id: 1,
      date: '2024-01-01',
      amount: 250,
      type: 'Tithe',
      method: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2023-12-24',
      amount: 100,
      type: 'Christmas Offering',
      method: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 3,
      date: '2023-12-15',
      amount: 250,
      type: 'Tithe',
      method: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 4,
      date: '2023-12-01',
      amount: 250,
      type: 'Tithe',
      method: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 5,
      date: '2023-11-15',
      amount: 250,
      type: 'Tithe',
      method: 'Credit Card',
      status: 'Completed',
    },
  ];

  const quickAmounts = [25, 50, 100, 250, 500];

  const _unusedPledges = [
    {
      id: 1,
      name: 'Annual Tithe Commitment',
      goal: 3000,
      current: 2450,
      deadline: '2024-12-31',
      frequency: 'Monthly',
    },
    {
      id: 2,
      name: 'Building Fund',
      goal: 1000,
      current: 750,
      deadline: '2024-06-30',
      frequency: 'One-time',
    },
  ];

  const handleGive = () => {
    const amount = customAmount || selectedAmount;
    // biome-ignore lint/suspicious/noConsole: ignore log
    console.log(`Processing gift of KES ${amount} for ${givingType}`);
    // Process payment
  };

  return (
    <div className="space-y-6">
      {/* Giving Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Year</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {givingStats.totalThisYear.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+12% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Average
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {givingStats.averageMonthly}
            </div>
            <p className="text-muted-foreground text-xs">Based on 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Giving Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{givingStats.streak}</div>
            <p className="text-muted-foreground text-xs">Consecutive months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Lifetime Total
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              KES {givingStats.totalLifetime.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Since {new Date().getFullYear() - 4}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Give Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Give Now</span>
              </CardTitle>
              <CardDescription>
                Make a quick contribution to support the church
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Give Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Make a Contribution</DialogTitle>
                  <DialogDescription>
                    Choose an amount and giving type to make your contribution
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="givingType">Giving Type</Label>
                    <Select onValueChange={setGivingType} value={givingType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tithe">Tithe</SelectItem>
                        <SelectItem value="offering">
                          General Offering
                        </SelectItem>
                        <SelectItem value="building">Building Fund</SelectItem>
                        <SelectItem value="missions">Missions</SelectItem>
                        <SelectItem value="special">
                          Special Offering
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Quick Amounts</Label>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount.toString());
                            setCustomAmount('');
                          }}
                          size="sm"
                          variant={
                            selectedAmount === amount.toString()
                              ? 'default'
                              : 'outline'
                          }
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input
                      id="customAmount"
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount('');
                      }}
                      placeholder="Enter amount"
                      type="number"
                      value={customAmount}
                    />
                  </div>

                  <Button className="w-full" onClick={handleGive}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Give ${customAmount || selectedAmount || '0'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs className="space-y-6" defaultValue="history">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Giving History</TabsTrigger>
          <TabsTrigger value="pledges">Pledges & Goals</TabsTrigger>
          <TabsTrigger value="statements">Tax Statements</TabsTrigger>
        </TabsList>

        {/* Giving History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Contributions</CardTitle>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGifts.map((gift) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={gift.id}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{gift.type}</p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(gift.date).toLocaleDateString()} •{' '}
                          {gift.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {gift.amount}</p>
                      <Badge
                        className="bg-green-100 text-green-800"
                        variant="secondary"
                      >
                        {gift.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pledges & Goals */}
        <TabsContent value="pledges">
          <div className="space-y-6">
            {pledges.map((pledge) => (
              <Card key={pledge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>{pledge.name}</span>
                      </CardTitle>
                      <CardDescription>
                        Goal: KES {pledge.goal.toLocaleString()} • Due:{' '}
                        {new Date(pledge.deadline).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{pledge.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          KES {pledge.current.toLocaleString()} of KES{' '}
                          {pledge.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={(pledge.current / pledge.goal) * 100}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {Math.round((pledge.current / pledge.goal) * 100)}%
                        complete
                      </span>
                      <Button size="sm">Contribute to Pledge</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-medium text-lg">Create New Pledge</h3>
                <p className="mb-4 text-center text-muted-foreground">
                  Set a giving goal to track your contributions over time
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Pledge
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tax Statements */}
        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Annual Giving Statements</CardTitle>
              <CardDescription>
                Download your tax-deductible contribution statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[2023, 2022, 2021].map((year) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={year}
                  >
                    <div>
                      <p className="font-medium">{year} Annual Statement</p>
                      <p className="text-muted-foreground text-sm">
                        Total contributions: KES{' '}
                        {(
                          givingStats.totalThisYear * (year === 2023 ? 1 : 0.8)
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
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
