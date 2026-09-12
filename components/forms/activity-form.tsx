'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { NumberInput } from '@/components/number-input';
import { TimeInput } from '@/components/time-input';
import { Button } from '@/components/ui/button';
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
  useCreateBranchActivity,
  useUpdateBranchActivityById,
} from '@/lib/hooks/church/activity/use-activity-queries';
import type { Activity } from '@/lib/types/activity';
import {
  ACTIVITY_STATUS_OPTIONS,
  ACTIVITY_TYPE_OPTIONS,
  getRelativeYear,
} from '@/lib/utils';
import {
  addActivitySchema,
  type AddActivityPayload,
} from '@/lib/validations/activity';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ActivityFormProps {
  onCloseDialog: () => void;
  activity?: Activity; // Optional activity for edit mode
  mode?: 'add' | 'edit'; // Form mode
}

export function ActivityForm({
  onCloseDialog,
  activity,
  mode = 'add',
}: ActivityFormProps) {
  const { id } = useParams();
  // Hooks for both create and update
  const {
    mutateAsync: createActivityMutation,
    isPending: isCreating,
    isError: isCreateError,
    error: createError,
  } = useCreateBranchActivity();
  const {
    mutateAsync: updateActivityMutation,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateBranchActivityById();
  // Determine which mutation is pending/errored
  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;
  const activityForm = useForm<AddActivityPayload>({
    resolver: zodResolver(addActivitySchema),
    defaultValues: {
      activity: '',
      participants: '',
      type: 'event',
      date: '',
      status: 'planned',
      startTime: '',
      endTime: '',
      location: '',
      facilitator: '',
      budget: '',
      description: '',
    },
  });
  const { reset } = activityForm;
  // Effect to populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && activity) {
      reset({
        activity: activity?.activity ?? '',
        participants:
          activity?.participants !== undefined
            ? String(activity.participants)
            : '',
        type: activity?.type ?? 'event',
        status: activity?.status ?? 'planned',
        date: activity?.date ?? '',
        startTime: activity?.startTime ?? '',
        endTime: activity?.endTime ?? '',
        location: activity?.location ?? '',
        facilitator:
          typeof activity?.facilitator === 'string'
            ? activity.facilitator
            : (activity?.facilitator?._id ?? ''),
        budget: activity?.budget !== undefined ? String(activity.budget) : '',
        description: activity?.description ?? '',
      });
    }
  }, [mode, activity, reset]);
  const onSubmitActivityForm = async (payload: AddActivityPayload) => {
    if (mode === 'edit' && activity) {
      await updateActivityMutation({
        branchId: id ? String(id) : '',
        activityId: activity._id,
        payload,
      });
    } else {
      await createActivityMutation({
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
      <Form {...activityForm}>
        <form
          className="space-y-4"
          onSubmit={activityForm.handleSubmit(onSubmitActivityForm)}
        >
          <FormField
            control={activityForm.control}
            name="activity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Activity Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Christmas Service Planning" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={activityForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Activity Date <span className="text-red-500">*</span>
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
              control={activityForm.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Participants <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={activityForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Activity Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_TYPE_OPTIONS.map((option) => (
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
              control={activityForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_STATUS_OPTIONS.map((option) => (
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={activityForm.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TimeInput
                      onChange={field.onChange}
                      placeholder="Select start time"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={activityForm.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TimeInput
                      onChange={field.onChange}
                      placeholder="Select end time"
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
              control={activityForm.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Sanctuary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={activityForm.control}
              name="facilitator" // Form field stores just the user ID string
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facilitator</FormLabel>
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
            control={activityForm.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Budget (KES) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <NumberInput placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={activityForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter activity description..."
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
              disabled={!activityForm.formState.isValid || isPending}
              type="submit"
            >
              {isPending
                ? mode === 'edit'
                  ? 'Updating activity...'
                  : 'Adding activity...'
                : mode === 'edit'
                  ? 'Update Activity'
                  : 'Add Activity'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
