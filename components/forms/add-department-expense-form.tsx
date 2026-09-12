'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { NumberInput } from '@/components/number-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddDepartmentExpense,
  useUpdateDepartmentExpense,
} from '@/lib/hooks/church/department/use-department-queries';
import type { DepartmentExpense } from '@/lib/types/department';
import {
  capitalizeFirstLetter,
  EXPENSE_CATEGORY_OPTIONS,
  getRelativeYear,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const REGEX = /^\d+(\.\d+)?$/;

export const addDepartmentExpenseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Expense amount is required')
    .refine((val) => REGEX.test(val.trim()), {
      message: 'Expense amount must be a valid number',
    })
    .refine(
      (val) => {
        const num = Number.parseFloat(val.trim());
        return num >= 1 && num <= 1_000_000;
      },
      {
        message: 'Expense amount must be between 1 and 1,000,000',
      }
    ),
  category: z.string().min(1, 'Please select expense category'),
  date: z.string().min(1, 'Expense date is required'),
  description: z.string().min(1, 'Description is required').trim(),
  reference: z.string().optional(),
  vendor: z.string().optional(),
});

export type AddDepartmentExpensePayload = z.infer<
  typeof addDepartmentExpenseSchema
>;

interface AddDepartmentExpenseFormProps {
  departmentId: string;
  onCloseDialog: () => void;
  expense?: DepartmentExpense; // Optional expense for edit mode
  mode?: 'add' | 'edit'; // Form mode
}

export function AddDepartmentExpenseForm({
  departmentId,
  onCloseDialog,
  expense,
  mode = 'add',
}: AddDepartmentExpenseFormProps) {
  // Hooks for both create and update
  const {
    mutateAsync: addDepartmentExpenseMutation,
    isPending: isPendingAddDepartmentExpense,
    isError: isErrorAddDepartmentExpense,
    error: errorAddDepartmentExpense,
  } = useAddDepartmentExpense();
  const {
    mutateAsync: UpdateDepartmentExpenseMutation,
    isPending: isPendingUpdateDepartmentExpense,
    isError: isErrorUpdateDepartmentExpense,
    error: errorUpdateDepartmentExpense,
  } = useUpdateDepartmentExpense();
  // Determine which mutation is pending/errored
  const isPending =
    isPendingAddDepartmentExpense || isPendingUpdateDepartmentExpense;
  const isError = isErrorAddDepartmentExpense || isErrorUpdateDepartmentExpense;
  const error = errorAddDepartmentExpense || errorUpdateDepartmentExpense;
  const form = useForm<AddDepartmentExpensePayload>({
    resolver: zodResolver(addDepartmentExpenseSchema),
    defaultValues: {
      amount: '',
      category: '',
      date: '',
      description: '',
      reference: '',
      vendor: '',
    },
  });
  const { reset } = form;
  // Effect to populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && expense) {
      reset({
        amount: expense?.amount ? String(expense?.amount) : '',
        category: expense?.category,
        // Convert to YYYY-MM-DD format for input type="date"
        date: expense?.date
          ? new Date(expense.date).toISOString().split('T')[0]
          : '',
        description: capitalizeFirstLetter(expense?.description ?? ''),
        reference: expense?.reference ?? '',
        vendor: expense?.vendor ?? '',
      });
    }
  }, [mode, expense, reset]);
  // Handle form submission
  const onSubmit = async (payload: AddDepartmentExpensePayload) => {
    if (mode === 'edit' && expense) {
      await UpdateDepartmentExpenseMutation({
        departmentId,
        expenseId: expense?._id,
        payload,
      });
    } else {
      await addDepartmentExpenseMutation({
        departmentId,
        payload,
      });
    }
    onCloseDialog();
    reset();
  };
  const handleCancelDialog = () => {
    onCloseDialog();
    reset();
  };
  return (
    <>
      {isError && <RenderApiError error={error} />}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Expense Information</span>
              </CardTitle>
              <CardDescription>Add a new department expense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount (KES) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <NumberInput placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select expense category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expense Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={new Date()}
                        minDate={getRelativeYear(-1)}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : '')
                        }
                        placeholder="Select expense date"
                        value={field.value ? new Date(field.value) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the expense"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt/Reference Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Receipt number or reference"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor/Supplier</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of vendor or supplier"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleCancelDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                mode === 'edit' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Expense...
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Expense...
                  </>
                )
              ) : mode === 'edit' ? (
                'Update Expense'
              ) : (
                'Add Expense'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
