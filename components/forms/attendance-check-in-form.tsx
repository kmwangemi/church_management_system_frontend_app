'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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
  useCreateAttendance,
  useUpdateAttendance,
} from '@/lib/hooks/church/attendance/use-attendance-queries';
import { useFetchServiceSchedules } from '@/lib/hooks/church/service-schedule/use-service-schedule-queries';
import { useFetchUsers } from '@/lib/hooks/church/user/use-user-queries';
import type { AttendanceResponse } from '@/lib/types/attendance';
import type { UserResponse } from '@/lib/types/user';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachWord,
  getFirstLetter,
  getRelativeYear,
} from '@/lib/utils';
import {
  type AddAttendancePayload,
  addAttendanceSchema,
} from '@/lib/validations/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Loader2, Search, UserCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '../date-picker';

interface AttendanceCheckInFormProps {
  onSuccess: () => void;
  existingAttendance?: AttendanceResponse;
  mode?: 'create' | 'edit';
}

export function AttendanceCheckInForm({
  onSuccess,
  existingAttendance,
  mode = 'create',
}: AttendanceCheckInFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, 'present' | 'late' | 'absent' | 'excused'>
  >({});
  const isEditMode = mode === 'edit' && !!existingAttendance;
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // Fetch users
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useFetchUsers(1, debouncedSearchTerm);
  // Fetch service schedules
  const { data: servicesData, isLoading: isLoadingServices } =
    useFetchServiceSchedules({ page: 1, limit: 100 });
  // Extract users array from the API response
  const members: UserResponse[] = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users;
  }, [usersData]);
  // Mutations
  const { mutate: createAttendance, isPending: isCreating } =
    useCreateAttendance();
  const { mutate: updateAttendance, isPending: isUpdating } =
    useUpdateAttendance();
  const isLoading = isCreating || isUpdating;
  // Initialize form with default or existing values
  const form = useForm<AddAttendancePayload>({
    resolver: zodResolver(addAttendanceSchema),
    defaultValues: isEditMode
      ? {
          serviceScheduleId:
            typeof existingAttendance.serviceScheduleId === 'string'
              ? existingAttendance.serviceScheduleId
              : existingAttendance.serviceScheduleId?._id || '',
          attendanceDate: new Date(existingAttendance.attendanceDate)
            .toISOString()
            .split('T')[0],
          records: existingAttendance.records.map((record) => ({
            userId:
              typeof record.userId === 'string'
                ? record.userId
                : record.userId._id,
            status: record.status,
            checkInTime: record.checkInTime,
            checkOutTime: record.checkOutTime,
            notes: record.notes,
          })),
          remarks: existingAttendance.remarks || '',
          weatherConditions: existingAttendance.weatherConditions || '',
          specialEvents: existingAttendance.specialEvents || [],
        }
      : {
          serviceScheduleId: '',
          attendanceDate: new Date().toISOString().split('T')[0],
          records: [],
          remarks: '',
          weatherConditions: '',
          specialEvents: [],
        },
  });
  // Initialize selected status from existing data
  useEffect(() => {
    if (isEditMode && existingAttendance) {
      const statusMap: Record<
        string,
        'present' | 'late' | 'absent' | 'excused'
      > = {};
      existingAttendance.records.forEach((record) => {
        const userId =
          typeof record.userId === 'string' ? record.userId : record.userId._id;
        statusMap[userId] = record.status;
      });
      setSelectedStatus(statusMap);
    }
  }, [isEditMode, existingAttendance]);

  // Auto-select first service schedule in create mode when loaded
  useEffect(() => {
    if (
      !isEditMode &&
      !form.getValues('serviceScheduleId') &&
      servicesData?.schedules?.length
    ) {
      form.setValue('serviceScheduleId', servicesData.schedules[0]._id);
    }
  }, [isEditMode, servicesData, form]);
  const getFullName = (member: UserResponse): string => {
    return `${capitalizeFirstLetter(member?.firstName || '')} ${capitalizeFirstLetter(member?.lastName || '')}`.trim();
  };
  const handleStatusChange = (
    userId: string,
    status: 'present' | 'late' | 'absent' | 'excused'
  ) => {
    setSelectedStatus((prev) => ({ ...prev, [userId]: status }));
  };
  const onSubmit = async (data: AddAttendancePayload) => {
    // Build records with status
    const records = data.records.map((record) => ({
      ...record,
      status: selectedStatus[record.userId] || 'present',
      checkInTime: record.checkInTime || new Date().toISOString(),
    }));
    const payload = {
      ...data,
      records,
    };
    if (isEditMode) {
      await updateAttendance(
        {
          attendanceId: existingAttendance._id,
          payload,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    } else {
      await createAttendance(payload, {
        onSuccess: () => {
          form.reset();
          setSelectedStatus({});
          onSuccess();
        },
      });
    }
  };
  const selectedMembers = form.watch('records') || [];
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="serviceScheduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select
                  disabled={isLoadingServices}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingServices ? (
                      <SelectItem disabled value="loading">
                        Loading services...
                      </SelectItem>
                    ) : (
                      servicesData?.schedules?.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {capitalizeFirstLetterOfEachWord(service.service)}{' '}
                          {'-'}
                          {capitalizeFirstLetter(service.day)} at {service.time}{' '}
                          in{' '}
                          {capitalizeFirstLetterOfEachWord(
                            service.branchId?.branchName
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attendanceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Attendance Date <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="w-full [&_.react-datepicker-wrapper]:w-full">
                    <DatePicker
                      disabled={isEditMode}
                      format="long"
                      maxDate={new Date()}
                      minDate={getRelativeYear(-1)}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : '')
                      }
                      placeholder="Select attendance date"
                      value={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="weatherConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather Conditions (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sunny, Rainy..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end">
            <div className="flex h-10 items-center text-muted-foreground text-sm">
              <Clock className="mr-1.5 h-4 w-4 shrink-0" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base sm:text-lg">
              <span>Select Members</span>
              <Badge className="shrink-0" variant="secondary">
                {selectedMembers.length} selected
              </Badge>
            </CardTitle>
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                value={searchTerm}
              />
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="records"
              render={() => (
                <FormItem>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center gap-2 py-6">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-muted-foreground text-sm">
                        Loading members...
                      </span>
                    </div>
                  ) : usersError ? (
                    <div className="py-6 text-center text-destructive text-sm">
                      Error loading members. Please try again.
                    </div>
                  ) : (
                    <div className="max-h-96 space-y-3 overflow-y-auto">
                      {members.length === 0 ? (
                        <div className="py-6 text-center text-muted-foreground text-sm">
                          {searchTerm
                            ? `No members found for "${searchTerm}"`
                            : 'Start typing to search members'}
                        </div>
                      ) : (
                        members.map((member) => {
                          const isSelected = selectedMembers.some(
                            (r) => r.userId === member._id
                          );
                          const currentStatus =
                            selectedStatus[member._id] || 'present';
                          return (
                            <FormField
                              control={form.control}
                              key={member._id}
                              name="records"
                              render={({ field }) => {
                                return (
                                  <div
                                    className="rounded-lg border p-3 hover:bg-accent"
                                    key={member._id}
                                  >
                                    <FormItem className="flex flex-row flex-wrap items-center gap-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={(checked) => {
                                            const newRecords = checked
                                              ? [
                                                  ...field.value,
                                                  {
                                                    userId: member._id,
                                                    status: 'present' as const,
                                                    checkInTime:
                                                      new Date().toISOString(),
                                                  },
                                                ]
                                              : field.value.filter(
                                                  (r) => r.userId !== member._id
                                                );
                                            field.onChange(newRecords);
                                            if (!checked) {
                                              setSelectedStatus((prev) => {
                                                const newStatus = { ...prev };
                                                delete newStatus[member._id];
                                                return newStatus;
                                              });
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <Avatar className="h-10 w-10 shrink-0">
                                        <AvatarImage
                                          alt={getFullName(member)}
                                          src={member?.profilePictureUrl || ''}
                                        />
                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-950/60 text-blue-600">
                                          {`${getFirstLetter(member?.firstName || '')}${getFirstLetter(member?.lastName || '')}`}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="min-w-0 flex-1">
                                        <FormLabel className="block cursor-pointer truncate font-medium text-sm">
                                          {getFullName(member)}
                                        </FormLabel>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted-foreground text-xs">
                                          {member.email && (
                                            <span className="truncate">
                                              {member.email}
                                            </span>
                                          )}
                                          {member.branchId && (
                                            <>
                                              {member.email && <span>•</span>}
                                              <span className="truncate">
                                                {member?.branchId?.name}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <div className="w-full sm:w-auto">
                                          <Select
                                            onValueChange={(value) =>
                                              handleStatusChange(
                                                member._id,
                                                value as
                                                  | 'present'
                                                  | 'late'
                                                  | 'absent'
                                                  | 'excused'
                                              )
                                            }
                                            value={currentStatus}
                                          >
                                            <SelectTrigger className="w-full sm:w-32">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="present">
                                                Present
                                              </SelectItem>
                                              <SelectItem value="late">
                                                Late
                                              </SelectItem>
                                              <SelectItem value="absent">
                                                Absent
                                              </SelectItem>
                                              <SelectItem value="excused">
                                                Excused
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                    </FormItem>
                                  </div>
                                );
                              }}
                            />
                          );
                        })
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Add any additional remarks or observations..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>Maximum 500 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            className="w-full sm:w-auto"
            onClick={onSuccess}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Attendance' : 'Save Attendance'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
