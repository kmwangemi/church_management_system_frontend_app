'use client';

import RenderApiError from '@/components/api-error';
import { MultiSelect } from '@/components/multi-select';
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
import {
  useRegisterGroup,
  useUpdateGroupById,
} from '@/lib/hooks/church/group/use-group-queries';
import type { Group } from '@/lib/types/small-group';
import {
  capitalizeFirstLetter,
  getRelativeYear,
  GROUP_CATEGORY_OPTIONS,
  MEETING_DAY_OPTIONS,
} from '@/lib/utils';
import {
  type AddGroupPayload,
  addGroupSchema,
} from '@/lib/validations/small-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '../date-picker';
import { UserCombobox } from '../user-combobox';

interface AddSmallGroupFormProps {
  onCloseDialog: () => void;
  group?: Group;
  mode?: 'add' | 'edit';
}

export function AddSmallGroupForm({
  onCloseDialog,
  group,
  mode = 'add',
}: AddSmallGroupFormProps) {
  const {
    mutateAsync: registerGroupMutation,
    isPending: isPendingAdd,
    isError: isErrorAdd,
    error: errorAdd,
  } = useRegisterGroup();
  const {
    mutateAsync: updateGroupMutation,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useUpdateGroupById(group?._id || '');
  const isPending = isPendingAdd || isPendingUpdate;
  const isError = isErrorAdd || isErrorUpdate;
  const error = errorAdd || errorUpdate;
  const groupForm = useForm<AddGroupPayload>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      groupName: '',
      leaderId: '',
      establishedDate: '',
      meetingDay: [],
      meetingTime: [],
      description: '',
      category: '',
      capacity: '',
      location: '',
    },
  });
  const { reset } = groupForm;
  useEffect(() => {
    if (mode === 'edit' && group) {
      reset({
        groupName: capitalizeFirstLetter(group.groupName || ''),
        leaderId: group.leaderId?._id || '',
        establishedDate: group.establishedDate
          ? new Date(group.establishedDate).toISOString().split('T')[0]
          : '',
        meetingDay: (group.meetingDay || []).map((d) => d.toLowerCase()),
        meetingTime: group.meetingTime || [],
        description: group.description || '',
        category: (group.category || '')
          .toLowerCase()
          .replace(/\s+/g, '-'),
        capacity: String(group.capacity || ''),
        location: capitalizeFirstLetter(group.location || ''),
      });
    }
  }, [mode, group, reset]);
  const onSubmitGroupForm = async (payload: AddGroupPayload) => {
    if (mode === 'edit' && group) {
      await updateGroupMutation({
        groupId: group._id,
        payload,
      });
    } else {
      await registerGroupMutation(payload);
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
      <Form {...groupForm}>
        <form
          className="space-y-4"
          onSubmit={groupForm.handleSubmit(onSubmitGroupForm)}
        >
          <FormField
            control={groupForm.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Group Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={groupForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select group category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    {GROUP_CATEGORY_OPTIONS.map((option) => (
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
            control={groupForm.control}
            name="establishedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Established Date <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    format="long"
                    maxDate={getRelativeYear(1)}
                    minDate={getRelativeYear(-30)}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : '')
                    }
                    placeholder="Select established date"
                    value={field.value ? new Date(field.value) : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={groupForm.control}
            name="leaderId" // Form field stores just the user ID string
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leader (Optional)</FormLabel>
                <FormControl>
                  <UserCombobox
                    className="w-full"
                    onValueChange={field.onChange} // Use onValueChange for ID
                    placeholder="Search and select a leader"
                    value={field.value} // Pass the ID directly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={groupForm.control}
              name="meetingDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Meeting day(s) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      onChange={field.onChange}
                      options={MEETING_DAY_OPTIONS}
                      placeholder="Select meeting day(s)"
                      selected={field.value || []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupForm.control}
              name="meetingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Meeting Time(s) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TimeInput
                      multiSelect
                      onChange={field.onChange}
                      placeholder="Select meeting times"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={groupForm.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Meeting Location <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={groupForm.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Capacity (1-20 Members){' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={groupForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the group's purpose"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleCancelDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!groupForm.formState.isValid || isPending}
              type="submit"
            >
              {isPending
                ? mode === 'edit'
                  ? 'Updating group...'
                  : 'Adding group...'
                : mode === 'edit'
                  ? 'Update Group'
                  : 'Add Group'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
