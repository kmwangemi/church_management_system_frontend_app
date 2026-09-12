'use client';

import RenderApiError from '@/components/api-error';
import { DatePicker } from '@/components/date-picker';
import { NumberInput } from '@/components/number-input';
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
import { useRegisterOffering } from '@/lib/hooks/church/offering/use-offering-queries';
import {
  CONTRIBUTION_TYPE_OPTIONS,
  getRelativeYear,
  PAYMENT_METHOD_OPTIONS,
} from '@/lib/utils';
import {
  type AddOfferingPayload,
  AddOfferingSchema,
} from '@/lib/validations/offering';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddOfferingFormProps {
  onCloseDialog: () => void;
}

export function AddOfferingForm({ onCloseDialog }: AddOfferingFormProps) {
  const {
    mutateAsync: registerOfferingMutation,
    isPending,
    isError,
    error,
  } = useRegisterOffering();
  const form = useForm<AddOfferingPayload>({
    resolver: zodResolver(AddOfferingSchema),
    defaultValues: {
      memberId: '',
      type: '',
      amount: '',
      method: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: '',
    },
  });
  const { reset } = form;
  // Handle form submission
  const onSubmit = async (payload: AddOfferingPayload) => {
    await registerOfferingMutation(payload);
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
                <DollarSign className="h-5 w-5" />
                <span>Offering Details</span>
              </CardTitle>
              <CardDescription>
                Record tithe, offering, partnership, donation or any other
                support information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          onValueChange={field.onChange} // Use onValueChange for ID
                          placeholder="Search and select a member"
                          value={field.value} // Pass the ID directly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Offering Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select offering type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {CONTRIBUTION_TYPE_OPTIONS.map((option) => (
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Amount (KES)
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <NumberInput placeholder="300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Transaction reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment Method <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {PAYMENT_METHOD_OPTIONS.map((option) => (
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          format="long"
                          maxDate={getRelativeYear(2)}
                          minDate={getRelativeYear(-2)}
                          onChange={(date) =>
                            field.onChange(date ? date.toISOString() : '')
                          }
                          placeholder="Select payment date"
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
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes"
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
            <Button
              disabled={!form.formState.isValid || isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Offering'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
