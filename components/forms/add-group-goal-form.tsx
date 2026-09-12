'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
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
import { UserCombobox } from '@/components/user-combobox';
import {
  useAddGroupGoal,
  useUpdateGroupGoal,
} from '@/lib/hooks/church/group/use-group-queries';
import type { GroupGoal } from '@/lib/types/small-group';
import {
  capitalizeFirstLetter,
  getRelativeYear,
  GOAL_CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Target } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const addGroupGoalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  priority: z.string().min(1, 'Please select priority level'),
  targetDate: z.string().min(1, 'Target date is required'),
  category: z.string().min(1, 'Please select goal category'),
  assignee: z.string().optional(),
  success: z.string().min(1, 'Success criteria is required').trim(),
});

export type AddGroupGoalPayload = z.infer<typeof addGroupGoalSchema>;

interface AddGroupGoalFormProps {
  groupId: string;
  onCloseDialog: () => void;
  goal?: GroupGoal; // Optional goal for edit mode
  mode?: 'add' | 'edit'; // Form mode
}

export function AddGroupGoalForm({
  groupId,
  onCloseDialog,
  goal,
  mode = 'add',
}: AddGroupGoalFormProps) {
  // Hooks for both create and update
  const {
    mutateAsync: addGroupGoalMutation,
    isPending: isPendingAddGroupGoal,
    isError: isErrorAddGroupGoal,
    error: errorAddGroupGoal,
  } = useAddGroupGoal();
  const {
    mutateAsync: UpdateGroupGoalMutation,
    isPending: isPendingUpdateGroupGoal,
    isError: isErrorUpdateGroupGoal,
    error: errorUpdateGroupGoal,
  } = useUpdateGroupGoal();
  // Determine which mutation is pending/errored
  const isPending = isPendingAddGroupGoal || isPendingUpdateGroupGoal;
  const isError = isErrorAddGroupGoal || isErrorUpdateGroupGoal;
  const error = errorAddGroupGoal || errorUpdateGroupGoal;
  const form = useForm<AddGroupGoalPayload>({
    resolver: zodResolver(addGroupGoalSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: '',
      targetDate: '',
      category: '',
      assignee: undefined,
      success: '',
    },
  });
  const { reset } = form;
  // Effect to populate form when in edit mode
  useEffect(() => {
    if (mode === 'edit' && goal) {
      reset({
        title: capitalizeFirstLetter(goal?.title ?? ''),
        description: capitalizeFirstLetter(goal?.description ?? ''),
        priority: goal?.priority ?? '',
        targetDate: goal?.targetDate
          ? new Date(goal.targetDate).toISOString().split('T')[0]
          : '',
        category: capitalizeFirstLetter(goal?.category ?? ''),
        assignee: goal?.assignee?._id ?? undefined,
        success: capitalizeFirstLetter(goal?.success ?? ''),
      });
    }
  }, [mode, goal, reset]);
  // Handle form submission
  const onSubmit = async (payload: AddGroupGoalPayload) => {
    if (mode === 'edit' && goal) {
      await UpdateGroupGoalMutation({
        groupId,
        goalId: goal?._id,
        payload,
      });
    } else {
      await addGroupGoalMutation({
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
                <Target className="h-5 w-5" />
                <span>Goal Information</span>
              </CardTitle>
              <CardDescription>Add a new group goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Goal Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Expand worship team to 20 members"
                        {...field}
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
                        placeholder="Detailed description of the goal"
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Priority <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {PRIORITY_OPTIONS.map((option) => (
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
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Target Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={getRelativeYear(5)}
                        minDate={new Date()}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : '')
                        }
                        placeholder="Select target date"
                        value={field.value ? new Date(field.value) : undefined}
                      />
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
                          <SelectValue placeholder="Select goal category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {GOAL_CATEGORY_OPTIONS.map((option) => (
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
                name="assignee" // Form field stores just the user ID string
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <UserCombobox
                        className="w-full"
                        onValueChange={field.onChange} // Use onValueChange for ID
                        placeholder="Search and select an assignee"
                        value={field.value} // Pass the ID directly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="success"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Success Criteria <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How will you measure success?"
                        rows={2}
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
                    Updating Goal...
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Goal...
                  </>
                )
              ) : mode === 'edit' ? (
                'Update Goal'
              ) : (
                'Add Goal'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
