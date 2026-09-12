import { TimeInput } from '@/components//time-input';
import { DatePicker } from '@/components/date-picker';
import { MultiSelect } from '@/components/multi-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
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
import { Switch } from '@/components/ui/switch';
import { useFetchDepartments } from '@/lib/hooks/church/department/use-department-queries';
import type { VolunteerUpdateCardProps } from '@/lib/types/index';
import {
  capitalizeFirstLetter,
  getRelativeYear,
  VOLUNTEER_STATUS_OPTIONS,
} from '@/lib/utils';

export const VolunteerUpdateCard: React.FC<VolunteerUpdateCardProps> = ({
  form,
}) => {
  const {
    data: departments,
    // isLoading: isLoadingDepartments,
    // isError: isErrorDepartments,
    // error: errorDepartments,
  } = useFetchDepartments();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volunteer Details</CardTitle>
        <CardDescription>Volunteer-specific information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Volunteer Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="volunteerUpdate.volunteerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volunteer ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="volunteerUpdate.volunteerStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volunteer Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select volunteer Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    {VOLUNTEER_STATUS_OPTIONS.map((option) => (
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
        </div>
        {/* Availability Schedule */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Availability Schedule</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="volunteerUpdate.availabilitySchedule.days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (
                        <label
                          className="flex items-center space-x-2"
                          key={day}
                        >
                          <input
                            checked={field.value?.includes(day)}
                            className="cursor-pointer rounded"
                            onChange={(e) => {
                              const currentDays = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentDays, day]);
                              } else {
                                field.onChange(
                                  currentDays.filter((d) => d !== day)
                                );
                              }
                            }}
                            type="checkbox"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volunteerUpdate.availabilitySchedule.preferredTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Times</FormLabel>
                  <FormControl>
                    <TimeInput
                      multiSelect
                      onChange={field.onChange}
                      placeholder="Select preferred times"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Departments */}
        <FormField
          control={form.control}
          name="volunteerUpdate.departments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departments</FormLabel>
              <FormControl>
                <MultiSelect
                  onChange={field.onChange}
                  options={
                    departments?.departments?.map((dept) => ({
                      label: capitalizeFirstLetter(dept?.departmentName),
                      value: dept?._id,
                    })) || []
                  }
                  placeholder="Select department(s)"
                  selected={field.value || []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Background Check */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Background Check</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="volunteerUpdate.backgroundCheck.completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Background Check Completed
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volunteerUpdate.backgroundCheck.clearanceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clearance Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select clearance level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="enhanced">Enhanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.watch('volunteerUpdate.backgroundCheck.completed') && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="volunteerUpdate.backgroundCheck.completedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={new Date()}
                        minDate={getRelativeYear(-10)}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : '')
                        }
                        placeholder="Completed date"
                        value={field.value ? new Date(field.value) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="volunteerUpdate.backgroundCheck.expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={getRelativeYear(10)}
                        minDate={new Date()}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : '')
                        }
                        placeholder="Expiry date"
                        value={field.value ? new Date(field.value) : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        {/* Hours Contributed */}
        <FormField
          control={form.control}
          name="volunteerUpdate.hoursContributed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours Contributed</FormLabel>
              <FormControl>
                <Input
                  min="0"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
