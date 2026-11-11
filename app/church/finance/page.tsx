'use client';

import { AddOfferingForm } from '@/components/forms/add-offering-form';
import { AddPledgeForm } from '@/components/forms/add-pledge-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateExpense,
  useDeleteExpense,
  useDeleteOffering,
  useFetchExpenses,
  useFetchFinancialSummary,
  useFetchOfferings,
  useUpdateMonthlyGoal,
  useUpdateOffering,
} from '@/lib/hooks/church/offering/use-offering-queries';
import {
  useDeletePledge,
  useFetchPledges,
  useRecordPledgePayment,
  useUpdatePledge,
} from '@/lib/hooks/church/pledge/use-pledge-queries';
import {
  CONTRIBUTION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PLEDGE_FREQUENCY_OPTIONS,
  PLEDGE_PURPOSE_OPTIONS,
} from '@/lib/utils';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Loader2,
  PiggyBank,
  Plus,
  Receipt,
  Search,
  Smartphone,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const EXPENSE_CATEGORIES = [
  'Utilities',
  'Maintenance',
  'Ministry Programs',
  'Staff & Salaries',
  'Outreach & Missions',
  'Equipment & Supplies',
  'Events & Hospitality',
  'Other',
];

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pledgeSearchTerm, setPledgeSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isOfferingOpen, setIsOfferingOpen] = useState(false);
  const [isPledgeOpen, setIsPledgeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  // Edit / Payment Dialog states
  const [editingOffering, setEditingOffering] = useState<any | null>(null);
  const [editingPledge, setEditingPledge] = useState<any | null>(null);
  const [payingPledge, setPayingPledge] = useState<any | null>(null);

  // Expense form state
  const [expenseCategory, setExpenseCategory] = useState('Utilities');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [expenseDescription, setExpenseDescription] = useState('');

  // Goal form state
  const [goalInput, setGoalInput] = useState('');

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Queries & Mutations
  const { data: summaryData, isLoading: isSummaryLoading } =
    useFetchFinancialSummary();
  const { data: offeringsData, isLoading: isOfferingsLoading } =
    useFetchOfferings(1, searchTerm, selectedPeriod);
  const { mutate: deleteOffering } = useDeleteOffering();
  const { mutateAsync: updateOffering, isPending: isUpdatingOffering } =
    useUpdateOffering();

  const { data: pledgesData, isLoading: isPledgesLoading } = useFetchPledges(
    1,
    pledgeSearchTerm
  );
  const { mutate: deletePledge } = useDeletePledge();
  const { mutateAsync: updatePledge, isPending: isUpdatingPledge } =
    useUpdatePledge();
  const {
    mutateAsync: recordPledgePayment,
    isPending: isRecordingPayment,
  } = useRecordPledgePayment();

  const { data: expensesData, isLoading: isExpensesLoading } =
    useFetchExpenses();
  const { mutateAsync: createExpense, isPending: isCreatingExpense } =
    useCreateExpense();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutateAsync: updateMonthlyGoal, isPending: isUpdatingGoal } =
    useUpdateMonthlyGoal();

  const transactions: any[] =
    (offeringsData as any)?.offerings || (offeringsData as any)?.data || [];
  const pledgesList: any[] =
    (pledgesData as any)?.pledges || (pledgesData as any)?.data || [];
  const expensesList: any[] =
    (expensesData as any)?.expenses || (expensesData as any)?.data || [];

  const summary = {
    totalOfferings: summaryData?.totalOfferings ?? 0,
    totalTithes: summaryData?.totalTithes ?? 0,
    regularOfferings: summaryData?.regularOfferings ?? 0,
    specialOfferings: summaryData?.specialOfferings ?? 0,
    totalPledges: summaryData?.totalPledges ?? 0,
    monthlyGoal: summaryData?.monthlyGoal ?? 50_000,
    expenses: summaryData?.expenses ?? 0,
    netIncome: summaryData?.netIncome ?? 0,
    incomeBreakdown: summaryData?.incomeBreakdown ?? [],
    expenseBreakdown: summaryData?.expenseBreakdown ?? [],
  };

  const goalPercentage =
    summary.monthlyGoal > 0
      ? Math.min(
          100,
          Math.round((summary.totalOfferings / summary.monthlyGoal) * 100)
        )
      : 0;

  const getMethodIcon = (method: string) => {
    const normalized = (method || '').toLowerCase();
    if (normalized.includes('pesa') || normalized.includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (normalized.includes('card')) {
      return <CreditCard className="h-4 w-4" />;
    }
    return <DollarSign className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const normalized = (status || 'Completed').toLowerCase();
    return normalized === 'completed' ? (
      <Badge className="bg-green-100 text-green-800">Completed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
    );
  };

  const handleExportReport = () => {
    const rows: string[][] = [
      ['Section', 'Date', 'Category/Type', 'Member/Source', 'Method', 'Amount (KES)', 'Status', 'Reference/Notes'],
    ];

    for (const t of transactions) {
      rows.push([
        'Transaction',
        t.date || '',
        t.type || '',
        t.member || '',
        t.method || '',
        String(t.amount ?? 0),
        t.status || 'Completed',
        t.reference || '',
      ]);
    }

    for (const p of pledgesList) {
      rows.push([
        'Pledge',
        p.dueDate || '',
        p.purpose || '',
        p.member || '',
        p.paymentSchedule || '',
        `${p.paid ?? 0} / ${p.amount ?? 0}`,
        p.status || 'Active',
        p.notes || '',
      ]);
    }

    for (const e of expensesList) {
      rows.push([
        'Expense',
        e.date || '',
        e.category || '',
        'Church Expense',
        '-',
        String(e.amount ?? 0),
        'Recorded',
        e.description || '',
      ]);
    }

    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `financial_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Financial report exported to CSV');
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseCategory || !expenseAmount || Number(expenseAmount) <= 0) {
      toast.error('Please enter a valid expense category and amount');
      return;
    }
    await createExpense({
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: expenseDate,
      description: expenseDescription,
    });
    setExpenseAmount('');
    setExpenseDescription('');
    setIsExpenseOpen(false);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput || Number(goalInput) <= 0) {
      toast.error('Please enter a valid monthly goal amount');
      return;
    }
    await updateMonthlyGoal(Number(goalInput));
    setIsGoalOpen(false);
  };

  const handleSaveOfferingEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffering) return;
    await updateOffering({
      id: editingOffering._id || editingOffering.id,
      amount: editingOffering.amount,
      type: editingOffering.typeValue || editingOffering.type,
      method: editingOffering.methodValue || editingOffering.method,
      date: editingOffering.date,
      reference: editingOffering.reference,
      notes: editingOffering.notes,
      status: editingOffering.status,
    });
    setEditingOffering(null);
  };

  const handleSavePledgeEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPledge) return;
    await updatePledge({
      id: editingPledge._id || editingPledge.id,
      amount: editingPledge.amount,
      purpose: editingPledge.purposeValue || editingPledge.purpose,
      dueDate: editingPledge.dueDate,
      paymentSchedule: editingPledge.paymentSchedule,
      status: editingPledge.status,
      notes: editingPledge.notes,
    });
    setEditingPledge(null);
  };

  const handleSavePledgePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPledge || !paymentAmount || Number(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    await recordPledgePayment({
      pledgeId: payingPledge._id || payingPledge.id,
      amount: Number(paymentAmount),
      method: paymentMethod,
      date: paymentDate,
      reference: paymentReference,
      notes: paymentNotes,
    });
    setPayingPledge(null);
    setPaymentAmount('');
    setPaymentReference('');
    setPaymentNotes('');
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
            Track tithes, offerings, pledges, and church expenses
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleExportReport} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog onOpenChange={setIsExpenseOpen} open={isExpenseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Church Expense</DialogTitle>
                <DialogDescription>
                  Log an operational, maintenance, or ministry expense
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSaveExpense}>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={setExpenseCategory}
                    value={expenseCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input
                    min="1"
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 8500"
                    required
                    type="number"
                    value={expenseAmount}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                    type="date"
                    value={expenseDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Details about the expense..."
                    rows={3}
                    value={expenseDescription}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsExpenseOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isCreatingExpense} type="submit">
                    {isCreatingExpense && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Expense
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
              Total Income (Offerings & Tithes)
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              KES {summary.totalOfferings.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-green-600 text-xs">
                Net Income: KES {summary.netIncome.toLocaleString()}
              </p>
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
              KES {summary.totalTithes.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Regular Offerings: KES {summary.regularOfferings.toLocaleString()}
            </p>
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
              KES {summary.totalPledges.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              {pledgesList.length} active or completed commitments
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Monthly Goal
            </CardTitle>
            <Button
              className="h-8 w-8 p-0"
              onClick={() => {
                setGoalInput(String(summary.monthlyGoal));
                setIsGoalOpen(true);
              }}
              size="sm"
              title="Edit Monthly Goal"
              variant="ghost"
            >
              <Edit className="h-4 w-4 text-orange-600" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">
              KES {summary.monthlyGoal.toLocaleString()}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-orange-600"
                style={{
                  width: `${goalPercentage}%`,
                }}
              />
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              {goalPercentage}% achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs className="space-y-6" defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports & Expenses</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent className="space-y-6" value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions by member, type, or method..."
                    value={searchTerm}
                  />
                </div>
                <Select
                  onValueChange={setSelectedPeriod}
                  value={selectedPeriod}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isOfferingsLoading ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={8}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-8 text-center text-muted-foreground"
                          colSpan={8}
                        >
                          No financial transactions found. Click "Record Offering" to add one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction: any) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={transaction.id || transaction._id}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {transaction.date
                                  ? new Date(
                                      transaction.date
                                    ).toLocaleDateString()
                                  : 'N/A'}
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
                              {getMethodIcon(transaction.method || 'Cash')}
                              <span className="text-sm">
                                {transaction.method || 'Cash'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              KES {(transaction.amount || 0).toLocaleString()}
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
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                onClick={() =>
                                  setEditingOffering({ ...transaction })
                                }
                                size="sm"
                                title="Edit Transaction"
                                variant="ghost"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  const targetId =
                                    transaction._id || transaction.id;
                                  if (targetId) deleteOffering(targetId);
                                }}
                                size="sm"
                                title="Delete Transaction"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pledges Tab */}
        <TabsContent className="space-y-6" value="pledges">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Active & Completed Pledges</CardTitle>
                <CardDescription>
                  Track member commitments and record pledge payments
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  className="pl-10"
                  onChange={(e) => setPledgeSearchTerm(e.target.value)}
                  placeholder="Search pledges..."
                  value={pledgeSearchTerm}
                />
              </div>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPledgesLoading ? (
                      <TableRow>
                        <TableCell className="py-8 text-center" colSpan={8}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : pledgesList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-8 text-center text-muted-foreground"
                          colSpan={8}
                        >
                          No pledges recorded yet. Click "Add Pledge" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pledgesList.map((pledge: any) => (
                        <TableRow
                          className="hover:bg-accent"
                          key={pledge.id || pledge._id}
                        >
                          <TableCell>
                            <span className="font-medium">{pledge.member}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{pledge.purpose}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              KES {(pledge.amount || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-green-600">
                              KES {(pledge.paid || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                (pledge.remaining || 0) > 0
                                  ? 'text-orange-600'
                                  : 'text-green-600'
                              }
                            >
                              KES {(pledge.remaining || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {pledge.dueDate
                                ? new Date(pledge.dueDate).toLocaleDateString()
                                : 'Ongoing'}
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
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {pledge.status !== 'Completed' && (
                                <Button
                                  onClick={() => {
                                    setPayingPledge(pledge);
                                    setPaymentAmount(
                                      String(pledge.remaining || '')
                                    );
                                  }}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  Record Payment
                                </Button>
                              )}
                              <Button
                                onClick={() => setEditingPledge({ ...pledge })}
                                size="sm"
                                title="Edit Pledge"
                                variant="ghost"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  const targetId = pledge._id || pledge.id;
                                  if (targetId) deletePledge(targetId);
                                }}
                                size="sm"
                                title="Delete Pledge"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Reports & Expenses Tab */}
        <TabsContent className="space-y-6" value="reports">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
                <CardDescription>
                  Total Income: KES {summary.totalOfferings.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSummaryLoading ? (
                  <div className="py-6 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : summary.incomeBreakdown.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No income data recorded yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {summary.incomeBreakdown.map((item, idx) => {
                      const barColors = [
                        'bg-blue-600',
                        'bg-green-600',
                        'bg-purple-600',
                      ];
                      const colorClass = barColors[idx % barColors.length];
                      return (
                        <div className="space-y-1.5" key={item.category}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {item.category}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              KES {item.amount.toLocaleString()} (
                              {item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className={`h-2 rounded-full ${colorClass}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>
                    Total Expenses: KES {summary.expenses.toLocaleString()}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsExpenseOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Expense
                </Button>
              </CardHeader>
              <CardContent>
                {isSummaryLoading ? (
                  <div className="py-6 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : summary.expenseBreakdown.length === 0 ? (
                  <p className="py-4 text-center text-muted-foreground text-sm">
                    No expenses recorded yet. Click "Add Expense" to log church
                    expenses.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {summary.expenseBreakdown.map((item, idx) => {
                      const barColors = [
                        'bg-red-600',
                        'bg-orange-600',
                        'bg-yellow-600',
                        'bg-rose-600',
                      ];
                      const colorClass = barColors[idx % barColors.length];
                      return (
                        <div className="space-y-1.5" key={item.category}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {item.category}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              KES {item.amount.toLocaleString()} (
                              {item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                              className={`h-2 rounded-full ${colorClass}`}
                              style={{ width: `${item.percentage}%` }}
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

          {/* Church Expenses Ledger */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recorded Church Expenses</CardTitle>
                <CardDescription>
                  Itemized ledger of all recorded church expenses
                </CardDescription>
              </div>
              <Button onClick={() => setIsExpenseOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Record Expense
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isExpensesLoading ? (
                      <TableRow>
                        <TableCell className="py-6 text-center" colSpan={5}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : expensesList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-6 text-center text-muted-foreground"
                          colSpan={5}
                        >
                          No expenses recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expensesList.map((expense: any) => (
                        <TableRow key={expense.id || expense._id}>
                          <TableCell>
                            {expense.date
                              ? new Date(expense.date).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {expense.description || '-'}
                          </TableCell>
                          <TableCell className="font-medium text-red-600">
                            KES {(expense.amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() =>
                                deleteExpense(expense._id || expense.id)
                              }
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Monthly Goal Dialog */}
      <Dialog onOpenChange={setIsGoalOpen} open={isGoalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Monthly Goal</DialogTitle>
            <DialogDescription>
              Set the target monthly offerings & tithes goal for your church
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveGoal}>
            <div className="space-y-2">
              <Label>Monthly Goal (KES)</Label>
              <Input
                min="1"
                onChange={(e) => setGoalInput(e.target.value)}
                required
                type="number"
                value={goalInput}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsGoalOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isUpdatingGoal} type="submit">
                {isUpdatingGoal && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingOffering(null)}
        open={Boolean(editingOffering)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update transaction details or status
            </DialogDescription>
          </DialogHeader>
          {editingOffering && (
            <form className="space-y-4" onSubmit={handleSaveOfferingEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input
                    min="1"
                    onChange={(e) =>
                      setEditingOffering({
                        ...editingOffering,
                        amount: Number(e.target.value),
                      })
                    }
                    required
                    type="number"
                    value={editingOffering.amount ?? ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    onChange={(e) =>
                      setEditingOffering({
                        ...editingOffering,
                        date: e.target.value,
                      })
                    }
                    required
                    type="date"
                    value={(editingOffering.date || '').slice(0, 10)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingOffering({
                        ...editingOffering,
                        typeValue: val,
                        type: val,
                      })
                    }
                    value={editingOffering.typeValue || 'tithe'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRIBUTION_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingOffering({
                        ...editingOffering,
                        methodValue: val,
                        method: val,
                      })
                    }
                    value={editingOffering.methodValue || 'cash'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingOffering({
                        ...editingOffering,
                        status: val,
                      })
                    }
                    value={editingOffering.status || 'Completed'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reference</Label>
                  <Input
                    onChange={(e) =>
                      setEditingOffering({
                        ...editingOffering,
                        reference: e.target.value,
                      })
                    }
                    value={editingOffering.reference || ''}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setEditingOffering(null)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isUpdatingOffering} type="submit">
                  {isUpdatingOffering && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Record Pledge Payment Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setPayingPledge(null)}
        open={Boolean(payingPledge)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Pledge Payment</DialogTitle>
            <DialogDescription>
              {payingPledge
                ? `Record a payment for ${payingPledge.member} (${payingPledge.purpose}) — Remaining: KES ${(payingPledge.remaining || 0).toLocaleString()}`
                : 'Record pledge installment'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSavePledgePayment}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Amount (KES)</Label>
                <Input
                  min="1"
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  type="number"
                  value={paymentAmount}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.label}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  type="date"
                  value={paymentDate}
                />
              </div>
              <div className="space-y-2">
                <Label>Reference (Optional)</Label>
                <Input
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. MP260411"
                  value={paymentReference}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={2}
                value={paymentNotes}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setPayingPledge(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isRecordingPayment} type="submit">
                {isRecordingPayment && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Pledge Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setEditingPledge(null)}
        open={Boolean(editingPledge)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pledge</DialogTitle>
            <DialogDescription>
              Update pledge commitment details
            </DialogDescription>
          </DialogHeader>
          {editingPledge && (
            <form className="space-y-4" onSubmit={handleSavePledgeEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Pledge Amount (KES)</Label>
                  <Input
                    min="1"
                    onChange={(e) =>
                      setEditingPledge({
                        ...editingPledge,
                        amount: Number(e.target.value),
                      })
                    }
                    required
                    type="number"
                    value={editingPledge.amount ?? ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    onChange={(e) =>
                      setEditingPledge({
                        ...editingPledge,
                        dueDate: e.target.value,
                      })
                    }
                    type="date"
                    value={(editingPledge.dueDate || '').slice(0, 10)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingPledge({
                        ...editingPledge,
                        purposeValue: val,
                        purpose: val,
                      })
                    }
                    value={editingPledge.purposeValue || 'building_fund'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLEDGE_PURPOSE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Schedule</Label>
                  <Select
                    onValueChange={(val) =>
                      setEditingPledge({
                        ...editingPledge,
                        paymentSchedule: val,
                      })
                    }
                    value={editingPledge.paymentSchedule || 'monthly'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLEDGE_FREQUENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(val) =>
                    setEditingPledge({
                      ...editingPledge,
                      status: val,
                    })
                  }
                  value={editingPledge.status || 'Active'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setEditingPledge(null)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isUpdatingPledge} type="submit">
                  {isUpdatingPledge && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
