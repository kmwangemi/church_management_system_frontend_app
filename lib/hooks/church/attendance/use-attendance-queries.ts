import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  AttendanceDeleteResponse,
  AttendanceListResponse,
  AttendanceSingleResponse,
} from '@/lib/types/attendance';
import type {
  AddAttendancePayload,
  UpdateAttendancePayload,
} from '@/lib/validations/attendance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Fetch attendance records with filters
interface FetchAttendanceParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'archived';
  branchId?: string;
  serviceScheduleId?: string;
  startDate?: string;
  endDate?: string;
}

const fetchAttendance = async (
  params: FetchAttendanceParams = {}
): Promise<AttendanceListResponse> => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    branchId,
    serviceScheduleId,
    startDate,
    endDate,
  } = params;
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  if (branchId) queryParams.append('branchId', branchId);
  if (serviceScheduleId)
    queryParams.append('serviceScheduleId', serviceScheduleId);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  const { data } = await apiClient.get(
    `/church/attendance?${queryParams.toString()}`
  );
  return data;
};

export const useFetchAttendance = (params: FetchAttendanceParams = {}) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => fetchAttendance(params),
  });
};

// Fetch single attendance record by ID
const fetchAttendanceById = async (
  attendanceId: string
): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.get(`/church/attendance/${attendanceId}`);
  return data;
};

export const useFetchAttendanceById = (attendanceId: string) => {
  return useQuery({
    queryKey: ['attendance', attendanceId],
    queryFn: () => fetchAttendanceById(attendanceId),
    enabled: !!attendanceId,
  });
};

// Create attendance record
const createAttendance = async (
  payload: AddAttendancePayload
): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.post('/church/attendance', payload);
  return data;
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance record has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Update attendance record
const updateAttendance = async ({
  attendanceId,
  payload,
}: {
  attendanceId: string;
  payload: UpdateAttendancePayload;
}): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.put(
    `/church/attendance/${attendanceId}`,
    payload
  );
  return data;
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({
        queryKey: ['attendance', data.attendance._id],
      });
      toast.success(
        data.message || 'Attendance record has been updated successfully.',
        {
          style: successToastStyle,
        }
      );
    },
  });
};

// Delete attendance record (soft delete by default)
const deleteAttendance = async ({
  attendanceId,
  force = false,
}: {
  attendanceId: string;
  force?: boolean;
}): Promise<AttendanceDeleteResponse> => {
  const url = force
    ? `/church/attendance/${attendanceId}?force=true`
    : `/church/attendance/${attendanceId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(data.message || 'Attendance record has been deleted.', {
        style: successToastStyle,
      });
    },
  });
};

// Approve attendance record (admin only)
const approveAttendance = async (
  attendanceId: string
): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.put(`/church/attendance/${attendanceId}`, {
    status: 'approved',
  });
  return data;
};

export const useApproveAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({
        queryKey: ['attendance', data.attendance._id],
      });
      toast.success('Attendance record has been approved successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Submit attendance record (change from draft to submitted)
const submitAttendance = async (
  attendanceId: string
): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.put(`/church/attendance/${attendanceId}`, {
    status: 'submitted',
  });
  return data;
};

export const useSubmitAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({
        queryKey: ['attendance', data.attendance._id],
      });
      toast.success('Attendance record has been submitted for approval.', {
        style: successToastStyle,
      });
    },
  });
};

// Archive attendance record
const archiveAttendance = async (
  attendanceId: string
): Promise<AttendanceSingleResponse> => {
  const { data } = await apiClient.put(`/church/attendance/${attendanceId}`, {
    status: 'archived',
    isActive: false,
  });
  return data;
};

export const useArchiveAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveAttendance,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({
        queryKey: ['attendance', data.attendance._id],
      });
      toast.success('Attendance record has been archived successfully.', {
        style: successToastStyle,
      });
    },
  });
};
