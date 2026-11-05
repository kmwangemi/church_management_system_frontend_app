'use client';

import { BranchCombobox } from '@/components/branch-combobox';
import { CountrySelect } from '@/components/country-list-input';
import { PasswordInput } from '@/components/password-input';
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
import { useFetchBranches } from '@/lib/hooks/church/branch/use-branch-queries';
import {
  useCreateChurchAdmin,
  useFetchChurchRoles,
} from '@/lib/hooks/church/settings/use-settings-queries';
import {
  ADMIN_ACCESS_LEVEL_OPTIONS,
  CHURCH_ROLE_OPTIONS,
  capitalizeFirstLetter,
  GENDER_OPTIONS,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Church, Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { MultiSelect } from '../multi-select';
import { useCreateSuperAdminUser, useSuperAdminBranches } from '@/hooks/api/use-superadmin';

const adminSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isMember: z.boolean(),
  isStaff: z.boolean(),
  isVolunteer: z.boolean(),
  sendWelcomeEmail: z.boolean(),
  address: z.object({
    street: z.string().min(2, 'Street address must be at least 2 characters'),
    city: z.string().min(2, 'City name must be at least 2 characters'),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().min(2, 'Country name must be at least 2 characters'),
  }),
  gender: z.enum(['male', 'female'], {
    error: 'Gender is required',
  }),
  role: z.string().min(1, 'Please select a role'),
  accessLevel: z.string().min(1, 'Please select an access level'),
  branchIds: z.array(z.string()).optional(),
  primaryBranchId: z.string().optional(),
});

type AdminForm = z.infer<typeof adminSchema>;

interface AddAdminFormProps {
  onCloseDialog: () => void;
  scope?: 'church' | 'superadmin';
}

export function AddAdminForm({
  onCloseDialog,
  scope = 'superadmin',
}: AddAdminFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isChurchScope = scope === 'church';

  const { data: superAdminBranchesData } = useSuperAdminBranches();
  const { data: churchBranchesData } = useFetchBranches(1, '');
  const { data: churchRolesData } = useFetchChurchRoles();

  const branches = isChurchScope
    ? (churchBranchesData as any)?.branches ||
      (churchBranchesData as any)?.data ||
      []
    : (superAdminBranchesData as any)?.data ||
      (superAdminBranchesData as any)?.branches ||
      [];

  const roleOptions =
    isChurchScope && churchRolesData?.roles?.length
      ? churchRolesData.roles
          .filter((r) => !['MEMBER', 'VISITOR'].includes(r.name.toUpperCase()))
          .map((r) => ({
            value: r.name,
            label: r.displayName || r.name,
          }))
      : CHURCH_ROLE_OPTIONS;

  const form = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: 'male',
      role: 'ADMIN',
      accessLevel: 'BRANCH',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
      isMember: true,
      isStaff: false,
      isVolunteer: false,
      branchIds: [],
      primaryBranchId: '',
      password: 'User@123',
      sendWelcomeEmail: false,
    },
  });
  const { mutateAsync: createSuperAdminUserMutation } = useCreateSuperAdminUser();
  const { mutateAsync: createChurchAdminMutation } = useCreateChurchAdmin();

  const onSubmit = async (data: AdminForm) => {
    setIsLoading(true);
    try {
      const selectedBranchId =
        data.primaryBranchId || data.branchIds?.[0] || '';
      if (isChurchScope) {
        await createChurchAdminMutation({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          role: data.role || 'ADMIN',
          accessLevel: data.accessLevel || 'BRANCH',
          branchId: selectedBranchId || undefined,
          branchIds: data.branchIds,
          primaryBranchId: data.primaryBranchId || undefined,
          address: data.address,
          isMember: data.isMember,
          isStaff: data.isStaff,
          isVolunteer: data.isVolunteer,
          password: data.password || 'User@123',
          sendWelcomeEmail: data.sendWelcomeEmail,
        });
      } else {
        const matchedBranch = branches.find(
          (b: any) => (b.id || b._id) === selectedBranchId
        );
        await createSuperAdminUserMutation({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role || 'ADMIN',
          branchId: selectedBranchId || undefined,
          churchId:
            matchedBranch?.churchId ||
            matchedBranch?.organizationId ||
            undefined,
          password: data.password || 'User@123',
        } as any);
      }
      onCloseDialog();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Admin Information</span>
            </CardTitle>
            <CardDescription>Create a new admin account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
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
                name="phoneNumber"
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
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[400px] overflow-y-auto">
                      {GENDER_OPTIONS.map((option) => (
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
            <div className="space-y-4">
              <FormLabel>Address</FormLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
            </div>
            {/* Church Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Church className="h-5 w-5" />
                  <span>Church Information</span>
                </CardTitle>
                <CardDescription>Role and branch assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {roleOptions.map((option) => (
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
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Access Level <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {ADMIN_ACCESS_LEVEL_OPTIONS.map((option) => (
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
                  name="branchIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branches</FormLabel>
                      <FormControl>
                        <MultiSelect
                          onChange={field.onChange}
                          options={
                            branches?.map((branch: any) => ({
                              label: capitalizeFirstLetter(
                                branch?.name || branch?.branchName || ''
                              ),
                              value: branch?.id || branch?._id || '',
                            })) || []
                          }
                          placeholder="Select branch(es)"
                          selected={field.value || []}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryBranchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Select primary branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] overflow-y-auto">
                          {branches?.map((branch: any) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={branch?.id || branch?._id}
                              value={branch?.id || branch?._id}
                            >
                              {capitalizeFirstLetter(
                                branch?.name || branch?.branchName || ''
                              )}
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
                  name="isMember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Church Member</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          This person is also a church member
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                {/* Secondary role flags */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="isStaff"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Staff Member</FormLabel>
                          <p className="text-muted-foreground text-sm">
                            This person is also a paid staff member
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isVolunteer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Volunteer</FormLabel>
                          <p className="text-muted-foreground text-sm">
                            This person is also a volunteer
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter temporary password"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-muted-foreground text-sm">
                        User will be prompted to change this on first login
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="sendWelcomeEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send Welcome Email</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Send login credentials and welcome information to the user
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4">
          <Button onClick={onCloseDialog} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
