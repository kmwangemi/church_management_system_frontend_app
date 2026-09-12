'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { NumberInput } from '@/components/number-input';
import { TimeInput } from '@/components/time-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { UserCombobox } from '@/components/user-combobox';
import {
  useCreateBranchServiceSchedule,
  useUpdateBranchServiceScheduleById,
} from '@/lib/hooks/church/service-schedule/use-service-schedule-queries';
import type { ServiceSchedule } from '@/lib/types/service-schedule';
import {
  getRelativeYear,
  MEETING_DAY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from '@/lib/utils';
import {
  type AddServiceSchedulePayload,
  addServiceScheduleSchema,
} from '@/lib/validations/service-schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ServiceScheduleFormProps {
  onCloseDialog: () => void;
  serviceSchedule?: ServiceSchedule; // Optional service schedule for edit mode
  mode?: 'add' | 'edit'; // Form mode
}

export function ServiceScheduleForm({
  onCloseDialog,
  serviceSchedule,
  mode = 'add',
}: ServiceScheduleFormProps) {
  const { id } = useParams();
  // Hooks for both create and update
  const {
    mutateAsync: createServiceScheduleMutation,
    isPending: isCreating,
    isError: isCreateError,
    error: createError,
  } = useCreateBranchServiceSchedule();
  const {
    mutateAsync: updateServiceScheduleMutation,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateBranchServiceScheduleById();
  // Determine which mutation is pending/errored
  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;
  const serviceScheduleForm = useForm<AddServiceSchedulePayload>({
    resolver: zodResolver(addServiceScheduleSchema),
    defaultValues: {
      day: 'sunday',
      time: '',
      service: '',
      type: 'worship',
      duration: '',
      attendance: '',
      startDate: '',
      endDate: '',
      recurring: true,
      isActive: true,
      facilitator: undefined,
      location: '',
      notes: '',
    },
  });
  const { reset } = serviceScheduleForm;
  // Effect to populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && serviceSchedule) {
      reset({
        day: serviceSchedule?.day,
        time: serviceSchedule?.time,
        service: serviceSchedule?.service,
        type: serviceSchedule?.type,
        duration:
          serviceSchedule?.duration !== undefined
            ? String(serviceSchedule.duration)
            : '',
        attendance:
          serviceSchedule?.attendance !== undefined
            ? String(serviceSchedule.attendance)
            : '',
        startDate: serviceSchedule?.startDate,
        endDate: serviceSchedule?.endDate,
        recurring: serviceSchedule?.recurring,
        isActive: serviceSchedule?.isActive,
        facilitator:
          typeof serviceSchedule?.facilitator === 'string'
            ? serviceSchedule.facilitator
            : (serviceSchedule?.facilitator?._id ?? ''),
        location: serviceSchedule?.location,
        notes: serviceSchedule?.notes,
      });
    }
  }, [mode, serviceSchedule, reset]);
  const onSubmitServiceScheduleForm = async (
    payload: AddServiceSchedulePayload
  ) => {
    if (mode === 'edit' && serviceSchedule) {
      await updateServiceScheduleMutation({
        branchId: id ? String(id) : '',
        scheduleId: serviceSchedule._id,
        payload,
      });
    } else {
      await createServiceScheduleMutation({
        branchId: id ? String(id) : '',
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
      <Form {...serviceScheduleForm}>
        <form
          className="space-y-4"
          onSubmit={serviceScheduleForm.handleSubmit(
            onSubmitServiceScheduleForm
          )}
        >
          <FormField
            control={serviceScheduleForm.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Service Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Morning Worship" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={serviceScheduleForm.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Day <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MEETING_DAY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
              control={serviceScheduleForm.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TimeInput
                      onChange={field.onChange}
                      placeholder="Select service time"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={serviceScheduleForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Service Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
              control={serviceScheduleForm.control}
              name="attendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expected Attendance <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="180" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={serviceScheduleForm.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duration (minutes) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="90" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={serviceScheduleForm.control}
              name="facilitator" // Form field stores just the user ID string
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facilitator/Leader</FormLabel>
                  <FormControl>
                    <UserCombobox
                      className="w-full"
                      onValueChange={field.onChange} // Use onValueChange for ID
                      placeholder="Search and select a facilitator"
                      value={field.value} // Pass the ID directly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={serviceScheduleForm.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Main Sanctuary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={serviceScheduleForm.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      format="long"
                      maxDate={getRelativeYear(2)}
                      minDate={new Date()}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : '')
                      }
                      placeholder="Select start date"
                      value={field.value ? new Date(field.value) : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={serviceScheduleForm.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      format="long"
                      maxDate={getRelativeYear(2)}
                      minDate={new Date()}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : '')
                      }
                      placeholder="Select end date"
                      value={field.value ? new Date(field.value) : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={serviceScheduleForm.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Recurring Service</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={serviceScheduleForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Schedule</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={serviceScheduleForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the service schedule..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleCancelDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!serviceScheduleForm.formState.isValid || isPending}
              type="submit"
            >
              {isPending
                ? mode === 'edit'
                  ? 'Updating service schedule...'
                  : 'Adding service schedule...'
                : mode === 'edit'
                  ? 'Update Service Schedule'
                  : 'Add Service Schedule'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
