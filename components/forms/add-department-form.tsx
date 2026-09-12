'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
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
import { UserCombobox } from '@/components/user-combobox';
import { useRegisterDepartment } from '@/lib/hooks/church/department/use-department-queries';
import {
  DEPARTMENT_CATEGORY_OPTIONS,
  getRelativeYear,
  MEETING_DAY_OPTIONS,
} from '@/lib/utils';
import {
  type AddDepartmentPayload,
  addDepartmentSchema,
} from '@/lib/validations/department';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface AddDepartmentFormProps {
  onCloseDialog: () => void;
}

export function AddDepartmentForm({ onCloseDialog }: AddDepartmentFormProps) {
  const { id } = useParams();
  const {
    mutateAsync: registerDepartmentMutation,
    isPending,
    isError,
    error,
  } = useRegisterDepartment();
  const departmentForm = useForm<AddDepartmentPayload>({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      departmentName: '',
      category: undefined,
      leaderId: undefined,
      location: '',
      establishedDate: '',
      totalBudget: '',
      meetingDay: [],
      meetingTime: [],
      description: '',
    },
  });
  const { reset } = departmentForm;
  const onSubmitDepartmentForm = async (payload: AddDepartmentPayload) => {
    if (id) {
      payload.branchId = Array.isArray(id) ? id[0] : String(id); // Assign branchId as string from route params
    }
    await registerDepartmentMutation(payload);
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
      <Form {...departmentForm}>
        <form
          className="space-y-4"
          onSubmit={departmentForm.handleSubmit(onSubmitDepartmentForm)}
        >
          <FormField
            control={departmentForm.control}
            name="departmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Choir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={departmentForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    {DEPARTMENT_CATEGORY_OPTIONS.map((option) => (
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={departmentForm.control}
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
              control={departmentForm.control}
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
          <FormField
            control={departmentForm.control}
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
            control={departmentForm.control}
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
          <FormField
            control={departmentForm.control}
            name="totalBudget"
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
            control={departmentForm.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Main Sanctuary or Room 101"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={departmentForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="col-span-3"
                    id="description"
                    placeholder="Enter department description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
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
              disabled={!departmentForm.formState.isValid || isPending}
              type="submit"
            >
              {isPending ? 'Adding department...' : 'Add Department'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
