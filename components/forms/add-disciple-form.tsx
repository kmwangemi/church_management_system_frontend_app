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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserCombobox } from '@/components/user-combobox';
import { useRegisterDisciple } from '@/lib/hooks/church/disciple/use-disciple-queries';
import { DISCIPLE_LEVEL_OPTIONS, getRelativeYear } from '@/lib/utils';
import {
  type AddDisciplePayload,
  AddDiscipleSchema,
} from '@/lib/validations/disciple';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddDiscipleFormProps {
  onCloseDialog: () => void;
}

export function AddDiscipleForm({ onCloseDialog }: AddDiscipleFormProps) {
  const {
    mutateAsync: registerDiscipleMutation,
    isPending,
    isError,
    error,
  } = useRegisterDisciple();
  const form = useForm<AddDisciplePayload>({
    resolver: zodResolver(AddDiscipleSchema),
    defaultValues: {
      memberId: '',
      mentorId: '',
      startDate: new Date().toISOString().split('T')[0],
      currentLevel: '',
      goals: '',
      notes: '',
    },
  });
  const { reset } = form;
  // Handle form submission
  const onSubmit = async (payload: AddDisciplePayload) => {
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
                <Heart className="h-5 w-5" />
                <span>Discipleship Information</span>
              </CardTitle>
              <CardDescription>
                Add a new person to the discipleship program
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
                  name="mentorId" // Form field stores just the user ID string
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mentor <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <UserCombobox
                          className="w-full"
                          onValueChange={field.onChange} // Use onValueChange for ID
                          placeholder="Search and select a mentor"
                          value={field.value} // Pass the ID directly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Start Date <span className="text-red-500">*</span>
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
                  name="currentLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Current Level <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select current level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {DISCIPLE_LEVEL_OPTIONS.map((option) => (
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
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discipleship Goals <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the discipleship goals and objectives..."
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or observations..."
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
                  Adding Disciple...
                </>
              ) : (
                'Add Disciple'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
