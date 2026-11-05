'use client';

import RenderApiError from '@/components/api-error';
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
import { UserCombobox } from '@/components/user-combobox';
import { useCreatePrayerRequest } from '@/lib/hooks/church/prayer-request/use-prayer-request-queries';
import { PRAYER_CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '@/lib/utils';
import {
  type AddPrayerRequestPayload,
  AddPrayerRequestSchema,
} from '@/lib/validations/prayer-request';
import { zodResolver } from '@hookform/resolvers/zod';
import { Headphones, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface AddPrayerRequestFormProps {
  onCloseDialog: () => void;
}

export function AddPrayerRequestForm({
  onCloseDialog,
}: AddPrayerRequestFormProps) {
  const {
    mutateAsync: registerDiscipleMutation,
    isPending,
    isError,
    error,
  } = useCreatePrayerRequest();
  const form = useForm<AddPrayerRequestPayload>({
    resolver: zodResolver(AddPrayerRequestSchema),
    mode: 'onChange',
    defaultValues: {
      memberId: '',
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      isAnonymous: false,
      isPublic: true,
    },
  });
  // ✅ Watch isAnonymous to clear memberId when toggled
  const isAnonymous = form.watch('isAnonymous');
  // ✅ Clear member selection when anonymous is toggled
  useEffect(() => {
    if (isAnonymous) {
      form.setValue('memberId', '');
    }
  }, [isAnonymous, form]);
  const { reset } = form;
  // Handle form submission
  const onSubmit = async (payload: AddPrayerRequestPayload) => {
    await registerDiscipleMutation(payload);
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
                <Headphones className="h-5 w-5" />
                <span>Prayer Request Details</span>
              </CardTitle>
              <CardDescription>
                Submit a prayer request for the church community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prayer Request Title{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief title for your prayer request"
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
                        placeholder="Please provide details about your prayer request..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {PRAYER_CATEGORY_OPTIONS.map((option) => (
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
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Priority <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select priority" />
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
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Submit Anonymously</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Your name will not be shown with this request
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make Public</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Allow all church members to see and pray for this
                          request
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {!isAnonymous && (
                <FormField
                  control={form.control}
                  name="memberId" // Form field stores just the user ID string
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Member <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <UserCombobox
                          className="w-full"
                          onValueChange={(val) => field.onChange(val || '')}
                          placeholder="Search and select a member"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                  Submitting...
                </>
              ) : (
                'Submit Prayer Request'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
