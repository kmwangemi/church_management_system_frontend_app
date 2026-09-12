'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { TimeInput } from '@/components/time-input';
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
import { UserMultiSelect } from '@/components/user-multi-select-combobox';
import {
  useAddGroupActivity,
  useUpdateGroupActivity,
} from '@/lib/hooks/church/group/use-group-queries';
import type { GroupActivity } from '@/lib/types/small-group';
import {
  ACTIVITY_TYPE_OPTIONS,
  capitalizeFirstLetter,
  getRelativeYear,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const addGroupActivitySchema = z.object({
  type: z.string().min(1, 'Please select activity type'),
  title: z.string().min(1, 'Activity title is required').trim(),
  date: z.string().min(1, 'Activity date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required').trim(),
  participants: z
    .array(z.string())
    .min(1, 'At least one participant is required'),
  description: z.string().min(1, 'Description is required').trim(),
});

export type AddGroupActivityPayload = z.infer<typeof addGroupActivitySchema>;

interface AddGroupActivityFormProps {
  groupId: string;
  onCloseDialog: () => void;
  activity?: GroupActivity; // Optional activity for edit mode
  mode?: 'add' | 'edit'; // Form mode
}

export function AddGroupActivityForm({
  groupId,
  onCloseDialog,
  activity,
  mode = 'add',
}: AddGroupActivityFormProps) {
  // Hooks for both create and update
  const {
    mutateAsync: addGroupActivityMutation,
    isPending: isPendingAddGroupActivity,
    isError: isErrorAddGroupActivity,
    error: errorAddGroupActivity,
  } = useAddGroupActivity();
  const {
    mutateAsync: UpdateGroupActivityMutation,
    isPending: isPendingUpdateGroupActivity,
    isError: isErrorUpdateGroupActivity,
    error: errorUpdateGroupActivity,
  } = useUpdateGroupActivity();
  // Determine which mutation is pending/errored
  const isPending = isPendingAddGroupActivity || isPendingUpdateGroupActivity;
  const isError = isErrorAddGroupActivity || isErrorUpdateGroupActivity;
  const error = errorAddGroupActivity || errorUpdateGroupActivity;
  const form = useForm<AddGroupActivityPayload>({
    resolver: zodResolver(addGroupActivitySchema),
    defaultValues: {
      type: '',
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      participants: [],
      description: '',
    },
  });
  const { reset } = form;
  // Effect to populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && activity) {
      reset({
        type: activity?.type ?? '',
        title: capitalizeFirstLetter(activity?.title ?? ''),
        // Convert to YYYY-MM-DD format for input type="date"
        date: activity?.date
          ? new Date(activity.date).toISOString().split('T')[0]
          : '',
        startTime: activity?.startTime ?? '',
        endTime: activity?.endTime ?? '',
        location: capitalizeFirstLetter(activity?.location ?? ''),
        participants: activity?.participants?.map((p) => p._id) ?? [], // ✅ map to IDs
        description: capitalizeFirstLetter(activity?.description ?? ''),
      });
    }
  }, [mode, activity, reset]);
  // Handle form submission
  const onSubmit = async (payload: AddGroupActivityPayload) => {
    if (mode === 'edit' && activity) {
      await UpdateGroupActivityMutation({
        groupId,
        activityId: activity?._id,
        payload,
      });
    } else {
      await addGroupActivityMutation({
        groupId,
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
                <Activity className="h-5 w-5" />
                <span>Activity Information</span>
              </CardTitle>
              <CardDescription>Log a new group activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Activity Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {ACTIVITY_TYPE_OPTIONS.map((option) => (
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Activity Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Weekly Team Meeting"
                        {...field}
                      />
                    </FormControl>
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
                      Activity Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={getRelativeYear(1)}
                        minDate={new Date()}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : '')
                        }
                        placeholder="Select activity date"
                        value={field.value ? new Date(field.value) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Music Room, Main Hall"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participants" // Form field stores array of user IDs
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <UserMultiSelect
                        className="w-full"
                        maxDisplay={2} // Use onValueChange for IDs
                        onValueChange={field.onChange}
                        placeholder="Search and select participants" // Pass array of IDs
                        value={field.value} // Show max 2 badges before showing count
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
                        placeholder="Brief description of the activity"
                        rows={3}
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
                    Updating Activity...
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Activity...
                  </>
                )
              ) : mode === 'edit' ? (
                'Update Activity'
              ) : (
                'Add Activity'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
