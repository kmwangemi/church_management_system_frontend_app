'use client';

import { AddOfferingForm } from '@/components/forms/add-offering-form';
import { AddPledgeForm } from '@/components/forms/add-pledge-form';
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
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  PiggyBank,
  Plus,
  Search,
  Smartphone,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const financialSummary = {
  totalOfferings: 45_231,
  totalTithes: 32_450,
  totalPledges: 15_600,
  monthlyGoal: 50_000,
  expenses: 28_750,
  netIncome: 64_531,
};

const recentTransactions = [
  {
    id: 1,
    date: '2024-01-07',
    type: 'Tithe',
    amount: 450,
    method: 'M-Pesa',
    member: 'John Smith',
    reference: 'MP240107001',
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-01-07',
    type: 'Offering',
    amount: 2450,
    method: 'Cash',
    member: 'Sunday Service',
    reference: 'CS240107001',
    status: 'Completed',
  },
  {
    id: 3,
    date: '2024-01-06',
    type: 'Pledge',
    amount: 1000,
    method: 'Bank Transfer',
    member: 'Sarah Johnson',
    reference: 'BT240106001',
    status: 'Pending',
  },
  {
    id: 4,
    date: '2024-01-05',
    type: 'Special Offering',
    amount: 750,
    method: 'Card',
    member: 'David Wilson',
    reference: 'CD240105001',
    status: 'Completed',
  },
];

const pledges = [
  {
    id: 1,
    member: 'John Smith',
    amount: 5000,
    paid: 3500,
    remaining: 1500,
    dueDate: '2024-12-31',
    purpose: 'Building Fund',
    status: 'Active',
  },
  {
    id: 2,
    member: 'Sarah Johnson',
    amount: 3000,
    paid: 3000,
    remaining: 0,
    dueDate: '2024-06-30',
    purpose: 'Mission Trip',
    status: 'Completed',
  },
  {
    id: 3,
    member: 'Emily Davis',
    amount: 2500,
    paid: 1200,
    remaining: 1300,
    dueDate: '2024-09-30',
    purpose: 'Youth Program',
    status: 'Active',
  },
];

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isOfferingOpen, setIsOfferingOpen] = useState(false);
  const [isPledgeOpen, setIsPledgeOpen] = useState(false);

  const filteredTransactions = recentTransactions.filter(
    (transaction) =>
      transaction.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'm-pesa':
        return <Smartphone className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Completed' ? (
      <Badge className="bg-green-100 text-green-800">Completed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Financial Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track tithes, offerings, and church finances
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog onOpenChange={setIsPledgeOpen} open={isPledgeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Add Pledge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Pledge</DialogTitle>
                <DialogDescription>
                  Record a new member pledge or commitment
                </DialogDescription>
              </DialogHeader>
              <AddPledgeForm onCloseDialog={() => setIsPledgeOpen(false)} />
            </DialogContent>
          </Dialog>
          <Dialog onOpenChange={setIsOfferingOpen} open={isOfferingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Offering
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record Offering</DialogTitle>
                <DialogDescription>
                  Record tithes, offerings, and donations
                </DialogDescription>
              </DialogHeader>
              <AddOfferingForm onCloseDialog={() => setIsOfferingOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Offerings
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              ${financialSummary.totalOfferings.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-green-600 text-xs">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Tithes
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2">
              <PiggyBank className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              ${financialSummary.totalTithes.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-green-600 text-xs">+8% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pledges
            </CardTitle>
            <div className="rounded-lg bg-purple-100 p-2">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              ${financialSummary.totalPledges.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">Active commitments</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Monthly Goal
            </CardTitle>
            <div className="rounded-lg bg-orange-100 p-2">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              ${financialSummary.monthlyGoal.toLocaleString()}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-orange-600"
                style={{
                  width: `${(financialSummary.totalOfferings / financialSummary.monthlyGoal) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              {Math.round(
                (financialSummary.totalOfferings /
                  financialSummary.monthlyGoal) *
                  100
              )}
              % achieved
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Tabs className="space-y-6" defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions..."
                    value={searchTerm}
                  />
                </div>
                <Select
                  onValueChange={setSelectedPeriod}
                  value={selectedPeriod}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Member/Source</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow
                        className="hover:bg-accent"
                        key={transaction.id}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {transaction.member}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getMethodIcon(transaction.method)}
                            <span className="text-sm">
                              {transaction.method}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ${transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">
                            {transaction.reference}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="pledges">
          <Card>
            <CardHeader>
              <CardTitle>Active Pledges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pledges.map((pledge) => (
                      <TableRow className="hover:bg-accent" key={pledge.id}>
                        <TableCell>
                          <span className="font-medium">{pledge.member}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{pledge.purpose}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${pledge.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600">
                            ${pledge.paid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              pledge.remaining > 0
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }
                          >
                            ${pledge.remaining.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(pledge.dueDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pledge.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                            variant={
                              pledge.status === 'Completed'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {pledge.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="reports">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Tithes</span>
                    <span className="text-muted-foreground text-sm">$32,450 (50%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: '50%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Offerings</span>
                    <span className="text-muted-foreground text-sm">$45,231 (70%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: '70%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Special Offerings
                    </span>
                    <span className="text-muted-foreground text-sm">$8,750 (13%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: '13%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Utilities</span>
                    <span className="text-muted-foreground text-sm">$8,500</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ width: '30%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Maintenance</span>
                    <span className="text-muted-foreground text-sm">$12,250</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-orange-600"
                      style={{ width: '43%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Ministry Programs
                    </span>
                    <span className="text-muted-foreground text-sm">$8,000</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-yellow-600"
                      style={{ width: '28%' }}
                    />
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
