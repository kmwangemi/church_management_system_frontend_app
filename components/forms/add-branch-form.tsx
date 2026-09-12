'use client';

import RenderApiError from '@/components/api-error';
import { CountrySelect } from '@/components/country-list-input';
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
import { UserCombobox } from '@/components/user-combobox';
import { useRegisterBranch } from '@/lib/hooks/church/branch/use-branch-queries';
import { getRelativeYear } from '@/lib/utils';
import {
  type AddBranchPayload,
  addBranchSchema,
} from '@/lib/validations/branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Church, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddBranchFormProps {
  onCloseDialog: () => void;
}

export function AddBranchForm({ onCloseDialog }: AddBranchFormProps) {
  const {
    mutateAsync: registerBranchMutation,
    isPending,
    isError,
    error,
  } = useRegisterBranch();
  const branchForm = useForm<AddBranchPayload>({
    resolver: zodResolver(addBranchSchema),
    defaultValues: {
      branchName: '',
      pastorId: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
      capacity: '',
      establishedDate: '',
    },
  });
  const { reset } = branchForm;
  // Handle form submission
  const onSubmitBranchForm = async (payload: AddBranchPayload) => {
    await registerBranchMutation(payload);
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
      <Form {...branchForm}>
        <form
          className="space-y-4"
          onSubmit={branchForm.handleSubmit(onSubmitBranchForm)}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Church className="h-5 w-5" />
                <span>Branch Information</span>
              </CardTitle>
              <CardDescription>Branch information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={branchForm.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Branch Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Kawangware" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={branchForm.control}
                name="pastorId" // Form field stores just the user ID string
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pastor (Optional)</FormLabel>
                    <FormControl>
                      <UserCombobox
                        className="w-full"
                        onValueChange={field.onChange} // Use onValueChange for ID
                        placeholder="Search and select a pastor"
                        value={field.value} // Pass the ID directly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={branchForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Capacity (1-100,000 Members){' '}
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
                control={branchForm.control}
                name="establishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Established Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        format="long"
                        maxDate={new Date()}
                        minDate={getRelativeYear(-50)}
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address Information</span>
              </CardTitle>
              <CardDescription>Branch address information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={branchForm.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <CountrySelect
                          onChange={field.onChange}
                          placeholder="Select your country"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nairobi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={branchForm.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="00100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleCancelDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!branchForm.formState.isValid || isPending}
              type="submit"
            >
              {isPending ? 'Adding branch...' : 'Add Branch'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
