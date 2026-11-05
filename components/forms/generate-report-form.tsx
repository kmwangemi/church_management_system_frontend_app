'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useFetchRecipientGroups } from '@/lib/hooks/church/message/use-message-queries';
import { useCreateReport } from '@/lib/hooks/church/report/use-report-queries';
import {
  getRelativeYear,
  REPORT_DATE_RANGE_OPTIONS,
  REPORT_OUTPUT_FORMAT_OPTIONS,
  REPORT_TYPE_OPTIONS,
} from '@/lib/utils';
import {
  type AddReportPayload,
  AddReportSchema,
} from '@/lib/validations/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, Loader2, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface GenerateReportFormProps {
  onCloseDialog: () => void;
}

export function GenerateReportForm({ onCloseDialog }: GenerateReportFormProps) {
  const {
    mutateAsync: createReportMutation,
    isPending,
    isError,
    error,
  } = useCreateReport();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useFetchRecipientGroups();
  const reportDepartmentGroups = departmentsData?.data?.groups || [];
  const form = useForm<AddReportPayload>({
    resolver: zodResolver(AddReportSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: '',
      description: '',
      dateRange: 'last30days',
      format: 'csv',
      includeCharts: true,
      includeComparisons: false,
      departments: ['all'],
      customStartDate: '',
      customEndDate: '',
    },
  });
  const { reset } = form;
  // Handle form submission
  const onSubmit = async (payload: AddReportPayload) => {
    await createReportMutation(payload);
    onCloseDialog();
    reset();
  };
  const handleCancelDialog = () => {
    onCloseDialog();
    reset();
  };
  const getTotalDepartments = () => {
    const departments = form.watch('departments') || [];
    return departments.reduce((total, groupId) => {
      const group = reportDepartmentGroups.find(
        (g: { id: string }) => g.id === groupId
      );
      return total + (group?.count || 0);
    }, 0);
  };
  if (isLoadingDepartments) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading department groups...</span>
      </div>
    );
  }
  return (
    <>
      {isError && <RenderApiError error={error} />}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Report Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your custom report parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Report Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Report Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {REPORT_TYPE_OPTIONS.map((option) => (
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
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Output Format <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {REPORT_OUTPUT_FORMAT_OPTIONS.map((option) => (
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this report should include..."
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
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date Range <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {REPORT_DATE_RANGE_OPTIONS.map((option) => (
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
              {form.watch('dateRange') === 'custom' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Start Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            format="long"
                            maxDate={new Date()}
                            minDate={getRelativeYear(-5)}
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : '')
                            }
                            placeholder="Select start date"
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          End Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            format="long"
                            maxDate={new Date()}
                            minDate={getRelativeYear(-5)}
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : '')
                            }
                            placeholder="Select end date"
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Departments</span>
                      <span className="text-red-500">*</span>
                    </div>
                    <Badge variant="secondary">
                      {getTotalDepartments()} departments selected
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Select atleast one department to include to the report{' '}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="departments"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {reportDepartmentGroups.map((group) => (
                            <FormField
                              control={form.control}
                              key={group.id}
                              name="departments"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 hover:bg-accent"
                                    key={group.id}
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          group.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...field.value, group.id]
                                            : field.value?.filter(
                                                (value) => value !== group.id
                                              );
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1">
                                      <FormLabel className="cursor-pointer font-medium text-sm">
                                        {group.name}
                                      </FormLabel>
                                      <p className="text-muted-foreground text-xs">
                                        {group.count} members
                                      </p>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="includeCharts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Charts and Graphs</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Add visual representations of the data
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeComparisons"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Period Comparisons</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Compare with previous periods for trend analysis
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
            <Button
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
