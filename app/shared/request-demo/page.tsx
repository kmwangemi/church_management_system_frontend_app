'use client';

import RenderApiError from '@/components/api-error';
import { CountrySelect } from '@/components/country-list-input';
import { NumberInput } from '@/components/number-input';
import { PhoneInput } from '@/components/phone-number-input';
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
import { useRequestDemo } from '@/lib/hooks/shared/demo/use-demo-queries';
import {
  CHURCH_DENOMINATION_OPTIONS,
  NUMBER_OF_CHURCH_MEMBERS_OPTIONS,
} from '@/lib/utils';
import {
  type RequestDemoPayload,
  requestDemoSchema,
} from '@/lib/validations/demo';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Church, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RequestDemoPage() {
  const router = useRouter();
  const form = useForm<RequestDemoPayload>({
    resolver: zodResolver(requestDemoSchema),
    defaultValues: {
      churchData: {
        churchName: '',
        denomination: '',
        churchSize: '',
        numberOfBranches: '',
        address: {
          country: '',
          address: '',
        },
      },
      userData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        agreeToTerms: false,
      },
    },
  });
  const {
    mutateAsync: requestDemoMutation,
    isPending,
    isError,
    error,
  } = useRequestDemo();
  const { reset } = form;
  // Handle form submission
  const onSubmit = async (payload: RequestDemoPayload) => {
    const validation = requestDemoSchema.safeParse(payload);
    if (!validation.success) {
      toast.error('Please fix all validation errors');
      return;
    }
    await requestDemoMutation(payload);
    reset();
    router.push('/');
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-6 text-center">
            <div className="mb-6 flex items-center justify-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <Church className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">
                ChurchHub
              </span>
            </div>
            <CardTitle className="font-bold text-2xl text-foreground">
              Let's get acquainted!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Please fill out the form, and we’ll get back to schedule your
              demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isError && <RenderApiError error={error} />}
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="flex items-center font-semibold text-foreground text-lg">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
                      1
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="userData.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userData.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
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
                      name="userData.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userData.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              defaultCountry="KE"
                              onChange={field.onChange}
                              placeholder="Enter phone number"
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Church Information */}
                <div className="space-y-4">
                  <h3 className="flex items-center font-semibold text-foreground text-lg">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-sm">
                      2
                    </div>
                    Church Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="churchData.churchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Church Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Grace Community Church"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="churchData.denomination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Denomination <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder="Select denomination" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[400px] overflow-y-auto">
                              {CHURCH_DENOMINATION_OPTIONS.map((option) => (
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
                      name="churchData.churchSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Church Size <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder="Select church size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[400px] overflow-y-auto">
                              {NUMBER_OF_CHURCH_MEMBERS_OPTIONS.map(
                                (option) => (
                                  <SelectItem
                                    className="cursor-pointer"
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="churchData.numberOfBranches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Number of Branches{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <NumberInput placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="churchData.address.country"
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
                      control={form.control}
                      name="churchData.address.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Physical Address{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="123 Church Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="userData.agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to the{' '}
                          <Link
                            className="text-blue-600 hover:underline"
                            href="/terms"
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            className="text-blue-600 hover:underline"
                            href="/privacy"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-11 w-full"
                  disabled={!form.formState.isValid || isPending}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submiting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center">
              <Link
                className="inline-flex items-center font-medium text-blue-600 hover:underline"
                href="/"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
