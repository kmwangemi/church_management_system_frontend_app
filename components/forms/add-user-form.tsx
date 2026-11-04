'use client';

import RenderApiError from '@/components/api-error';
import { BranchCombobox } from '@/components/branch-combobox';
import { CountrySelect } from '@/components/country-list-input';
import { PhoneInput } from '@/components/phone-number-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useAdminAddMember } from '@/lib/hooks/shared/use-organization-member-mutation';
import {
  CHURCH_POSITION_OPTIONS,
  GENDER_OPTIONS,
  MEMBER_TYPE_OPTIONS,
  SYSTEM_ACCESS_LEVEL_OPTIONS,
  getDefaultsForPosition,
  mapAccessAndTagsToRoles,
  type SystemAccessLevel,
} from '@/lib/utils';
import { type AddUserPayload, userSchema } from '@/lib/validations/users';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Calendar,
  Church,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Shield,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddUserFormProps {
  onCloseDialog: () => void;
  defaultBranchId?: string;
  lockBranch?: boolean;
  onSuccess?: () => void;
}

export function AddUserForm({
  onCloseDialog,
  defaultBranchId,
  lockBranch = false,
  onSuccess,
}: AddUserFormProps) {
  const { organizationId } = useActiveOrganization();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    mutateAsync: registerUserMutation,
    isPending,
    isError,
    error,
  } = useAdminAddMember(organizationId);

  const form = useForm<AddUserPayload>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'MALE',
      position: 'member',
      memberType: 'MEMBER',
      dateOfBirth: '',
      teamId: defaultBranchId || '',
      createLogin: false,
      password: '',
      confirmPassword: '',
      systemAccessLevel: 'NONE',
      ministryTags: ['Member'],
      role: ['MEMBER'],
      sendWelcomeEmail: false,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
    },
  });

  const { reset, watch, setValue } = form;

  useEffect(() => {
    if (defaultBranchId) {
      setValue('teamId', defaultBranchId);
    }
  }, [defaultBranchId, setValue]);

  const watchCreateLogin = watch('createLogin');
  const watchMemberType = watch('memberType');
  const watchPosition = watch('position');
  const watchAccessLevel = watch('systemAccessLevel');

  // Handle form submission
  const onSubmit = async (payload: AddUserPayload) => {
    try {
      const branchId = payload.teamId || (payload as any).branchId;
      if (!branchId) {
        toast.error('Please select a church branch');
        return;
      }

      const hasLogin = Boolean(payload.createLogin);
      const accessLevel = hasLogin
        ? payload.systemAccessLevel && payload.systemAccessLevel !== 'NONE'
          ? payload.systemAccessLevel
          : 'PORTAL'
        : 'NONE';

      const ministryTags =
        payload.ministryTags && payload.ministryTags.length > 0
          ? payload.ministryTags
          : payload.memberType === 'VISITOR'
            ? []
            : ['Member'];

      const computedRoles = mapAccessAndTagsToRoles(
        accessLevel,
        ministryTags,
        payload.position
      );

      const finalPayload: any = {
        organizationId,
        branchId,
        teamId: branchId,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        memberType: payload.memberType || 'MEMBER',
        position: payload.position || 'member',
        gender: payload.gender || 'MALE',
        phoneNumber: payload.phoneNumber?.trim() || null,
        email: payload.email?.trim() || null,
        dateOfBirth: payload.dateOfBirth || null,
        createLogin: hasLogin,
        roles: computedRoles,
        role: computedRoles,
        systemAccessLevel: accessLevel,
        ministryTags,
        isStaff: computedRoles.includes('STAFF'),
        isVolunteer: computedRoles.includes('VOLUNTEER'),
        isMember: computedRoles.includes('MEMBER'),
        sendWelcomeEmail: Boolean(payload.sendWelcomeEmail),
      };

      if (hasLogin && payload.password) {
        finalPayload.password = payload.password;
      }

      if (
        payload.address &&
        Object.values(payload.address).some((v) => Boolean(v && String(v).trim()))
      ) {
        finalPayload.address = payload.address;
      }

      const result: any = await registerUserMutation(finalPayload);
      const generatedId = result?.membershipNumber || result?.memberId;
      if (generatedId) {
        toast.success(`User created successfully with ID: ${generatedId}`);
      } else {
        toast.success('User created successfully');
      }
      onCloseDialog();
      onSuccess?.();
      reset();
    } catch (err) {
      console.error('Error adding user:', err);
    }
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
          {/* Branch & Primary Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base font-semibold">
                <User className="h-4 w-4 text-primary" />
                <span>Basic Details</span>
              </CardTitle>
              <CardDescription>
                Essential information required to add a member to the church database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Branch */}
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-medium">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Branch (Location)</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <BranchCombobox
                        className="w-full"
                        disabled={lockBranch}
                        onChange={field.onChange}
                        placeholder="Search and select a branch"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Names */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John" {...field} />
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
                        <Input placeholder="e.g. Kamau" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Member Type & Church Position */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="memberType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Type</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val === 'VISITOR') {
                            setValue('position', 'visitor');
                          } else if (watchPosition === 'visitor') {
                            setValue('position', 'member');
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MEMBER_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Church Position (Title)</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          const defaults = getDefaultsForPosition(val);
                          if (defaults.accessLevel !== 'NONE') {
                            setValue('createLogin', true);
                            setValue('systemAccessLevel', defaults.accessLevel);
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {CHURCH_POSITION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="KE"
                          onChange={field.onChange}
                          placeholder="0712 345 678"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email (Optional when no login; Required when creating login) */}
              {!watchCreateLogin && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="member@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Date of birth (Required if Child) */}
              {watchMemberType === 'CHILD' && (
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Date of Birth</span>
                        <span className="text-red-500">* (Required for Child)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* User Login & System Access (Optional Toggle) */}
          <Card className="border-primary/20 bg-primary/2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="flex items-center space-x-2 text-base font-semibold">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <span>Create User Login Account</span>
                  </CardTitle>
                  <CardDescription>
                    Enable sign-in credentials for portal or administrative software access.
                  </CardDescription>
                </div>
                <FormField
                  control={form.control}
                  name="createLogin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked && form.getValues('systemAccessLevel') === 'NONE') {
                              setValue('systemAccessLevel', 'PORTAL');
                            } else if (!checked) {
                              setValue('systemAccessLevel', 'NONE');
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {watchCreateLogin && (
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Login Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@example.com"
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
                    name="systemAccessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Level</FormLabel>
                        <Select
                          onValueChange={(val: SystemAccessLevel) => field.onChange(val)}
                          value={field.value !== 'NONE' ? field.value : 'PORTAL'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PORTAL">
                              Member Portal (Self-Service)
                            </SelectItem>
                            <SelectItem value="STAFF">
                              Staff / Ministry Operations
                            </SelectItem>
                            <SelectItem value="ADMIN">
                              Administrator (Full Church Access)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="Minimum 8 characters"
                              type={showPassword ? 'text' : 'password'}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            variant="ghost"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="Confirm password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            type="button"
                            variant="ghost"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sendWelcomeEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-xs font-normal text-muted-foreground">
                        Send welcome email with account login details
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Optional Collapsible Address */}
          <details className="group rounded-lg border border-border p-3 text-sm">
            <summary className="flex cursor-pointer select-none items-center justify-between font-medium text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Address Details (Optional)</span>
              </span>
              <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t">
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountrySelect
                        onChange={field.onChange}
                        placeholder="Select country"
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
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nairobi" {...field} />
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
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123 Church Rd" {...field} />
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
                      <Input placeholder="e.g. 00100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </details>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              onClick={handleCancelDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding User...
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
