import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddPledgePayload } from '@/lib/validations/pledge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerPledge = async (
  payload: AddPledgePayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/pledges', payload);
  return data;
};

export const useRegisterPledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerPledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Pledge has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchPledges = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(
    `/church/pledges?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchPledges = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['pledges', page, search],
    queryFn: () => fetchPledges(page, search),
  });
};

export interface RecordPledgePaymentPayload {
  pledgeId: string;
  amount: number | string;
  method?: string;
  date?: string;
  reference?: string;
  notes?: string;
}

const recordPledgePayment = async ({
  pledgeId,
  ...payload
}: RecordPledgePaymentPayload) => {
  const { data } = await apiClient.post(
    `/church/pledges/${pledgeId}/payments`,
    payload
  );
  return data;
};

export const useRecordPledgePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordPledgePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Pledge payment recorded successfully.', {
        style: successToastStyle,
      });
    },
  });
};

export interface UpdatePledgePayload {
  id: string;
  amount?: number | string;
  purpose?: string;
  dueDate?: string;
  paymentSchedule?: string;
  status?: string;
  notes?: string;
}

const updatePledge = async ({ id, ...payload }: UpdatePledgePayload) => {
  const { data } = await apiClient.put(`/church/pledges/${id}`, payload);
  return data;
};

export const useUpdatePledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Pledge updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deletePledge = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/pledges/${id}`);
  return data;
};

export const useDeletePledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast.success('Pledge deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
