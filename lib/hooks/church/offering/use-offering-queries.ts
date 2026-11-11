import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddOfferingPayload } from '@/lib/validations/offering';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerOffering = async (
  payload: AddOfferingPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/offerings', payload);
  return data;
};

export const useRegisterOffering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerOffering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Offering has been recorded successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchOfferings = async (
  page = 1,
  search = '',
  period = 'all'
): Promise<DepartmentListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (search) params.set('search', search);
  if (period) params.set('period', period);
  const { data } = await apiClient.get(
    `/church/offerings?${params.toString()}`
  );
  return data;
};

export const useFetchOfferings = (
  page = 1,
  search = '',
  period = 'all'
) => {
  return useQuery({
    queryKey: ['offerings', page, search, period],
    queryFn: () => fetchOfferings(page, search, period),
  });
};

export interface UpdateOfferingPayload {
  id: string;
  amount?: number | string;
  type?: string;
  method?: string;
  date?: string;
  reference?: string;
  notes?: string;
  status?: string;
}

const updateOffering = async ({
  id,
  ...payload
}: UpdateOfferingPayload) => {
  const { data } = await apiClient.put(`/church/offerings/${id}`, payload);
  return data;
};

export const useUpdateOffering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOffering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Transaction updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteOffering = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/offerings/${id}`);
  return data;
};

export const useDeleteOffering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOffering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Transaction deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

export interface FinancialBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinancialSummaryResponse {
  totalOfferings: number;
  totalTithes: number;
  regularOfferings: number;
  specialOfferings: number;
  totalPledges: number;
  monthlyGoal: number;
  expenses: number;
  netIncome: number;
  incomeBreakdown: FinancialBreakdownItem[];
  expenseBreakdown: FinancialBreakdownItem[];
}

const fetchFinancialSummary = async (): Promise<FinancialSummaryResponse> => {
  const { data } = await apiClient.get('/church/summary');
  return data;
};

export const useFetchFinancialSummary = () => {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: fetchFinancialSummary,
  });
};

const updateMonthlyGoal = async (monthlyGoal: number | string) => {
  const { data } = await apiClient.put('/church/finance/goal', {
    monthlyGoal,
  });
  return data;
};

export const useUpdateMonthlyGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMonthlyGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Monthly goal updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

export interface ExpenseItem {
  id: string;
  _id: string;
  category: string;
  amount: number;
  date: string;
  description?: string | null;
}

export interface CreateExpensePayload {
  category: string;
  amount: number | string;
  date: string;
  description?: string;
}

const fetchExpenses = async (search = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const { data } = await apiClient.get(`/church/expenses?${params.toString()}`);
  return data;
};

export const useFetchExpenses = (search = '') => {
  return useQuery({
    queryKey: ['expenses', search],
    queryFn: () => fetchExpenses(search),
  });
};

const createExpense = async (payload: CreateExpensePayload) => {
  const { data } = await apiClient.post('/church/expenses', payload);
  return data;
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Expense recorded successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteExpense = async (id: string) => {
  const { data } = await apiClient.delete(`/church/expenses/${id}`);
  return data;
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Expense deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
