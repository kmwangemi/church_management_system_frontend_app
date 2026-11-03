'use client';

import RenderApiError from '@/components/api-error';
import { BranchCombobox } from '@/components/branch-combobox';
import { CountrySelect } from '@/components/country-list-input';
import { PhoneInput } from '@/components/phone-number-input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
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
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useAdminAddMember } from '@/lib/hooks/shared/use-organization-member-mutation';
import {
  CHURCH_POSITION_OPTIONS,
  GENDER_OPTIONS,
  getDefaultsForPosition,
  mapAccessAndTagsToRoles,
  MINISTRY_TAG_OPTIONS,
  type MinistryTag,
  SYSTEM_ACCESS_LEVEL_OPTIONS,
  type SystemAccessLevel,
  cn,
} from '@/lib/utils';
import { type AddUserPayload, userSchema } from '@/lib/validations/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  Building2,
  Church,
  KeyRound,
  Loader2,
  MapPin,
  Shield,
  Tags,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

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
      role: ['MEMBER'],
      systemAccessLevel: 'NONE',
      ministryTags: ['Member'],
      teamId: defaultBranchId || '',
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
  const { reset, watch } = form;

  useEffect(() => {
    if (defaultBranchId) {
      form.setValue('teamId', defaultBranchId);
    }
  }, [defaultBranchId, form]);
  const watchPosition = watch('position');
  const watchRoles = watch('role') || ['MEMBER'];

  // Handle form submission
  const onSubmit = async (payload: AddUserPayload) => {
    try {
      const accessLevel = payload.systemAccessLevel || 'NONE';
      const ministryTags = payload.ministryTags || [];
      const computedRoles = mapAccessAndTagsToRoles(
        accessLevel,
        ministryTags,
        payload.position
      );
      const result: any = await registerUserMutation({
        ...payload,
        role: computedRoles as any,
        systemAccessLevel: accessLevel,
        ministryTags,
        isStaff: ministryTags.includes('Staff'),
        isVolunteer: ministryTags.includes('Volunteer'),
        isMember: ministryTags.includes('Member'),
        organizationId,
      });
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
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Basic user details and contact information
              </CardDescription>
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
                      <FormLabel>Email Address</FormLabel>
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
            </CardContent>
          </Card>
          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address Information</span>
              </CardTitle>
              <CardDescription>User address information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
          {/* Church Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Church className="h-5 w-5 text-primary" />
                <span>Church Information</span>
              </CardTitle>
              <CardDescription>
                Configure church title, branch location, software system access level, and ministry engagement tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1. Church Position & 2. Branch */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 font-medium">
                        <Church className="h-4 w-4 text-muted-foreground" />
                        <span>Church Position (Title)</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Smart default: Automatically pre-populate recommended access level and ministry tags based on title
                          const defaults = getDefaultsForPosition(val);
                          form.setValue('systemAccessLevel', defaults.accessLevel, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          form.setValue('ministryTags', defaults.tags, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          const mappedRoles = mapAccessAndTagsToRoles(
                            defaults.accessLevel,
                            defaults.tags,
                            val
                          );
                          form.setValue('role', mappedRoles as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select church position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {CHURCH_POSITION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        Ecclesiastical or congregational title within the church.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      {lockBranch ? (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          Locked to current branch.
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Physical campus or local congregation branch.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* 3. System Access Level */}
              <FormField
                control={form.control}
                name="systemAccessLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-1.5 font-medium">
                        <KeyRound className="h-4 w-4 text-primary" />
                        <span>System Access Level</span>
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <span className="text-xs text-muted-foreground">
                        Controls software dashboard & login permissions
                      </span>
                    </div>
                    <FormControl>
                      <RadioGroup
                        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
                        onValueChange={(val: SystemAccessLevel) => {
                          field.onChange(val);
                          const currentTags = form.getValues('ministryTags') || [];
                          const currentPos = form.getValues('position');
                          const mappedRoles = mapAccessAndTagsToRoles(
                            val,
                            currentTags,
                            currentPos
                          );
                          form.setValue('role', mappedRoles as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        value={field.value || 'NONE'}
                      >
                        {SYSTEM_ACCESS_LEVEL_OPTIONS.map((option) => {
                          const isSelected = (field.value || 'NONE') === option.value;
                          return (
                            <label
                              key={option.value}
                              htmlFor={`access-${option.value}`}
                              className={cn(
                                'relative flex cursor-pointer flex-col justify-between rounded-lg border p-3.5 transition-all hover:bg-accent/50 focus:outline-none',
                                isSelected
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                                  : 'border-border bg-card'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <RadioGroupItem
                                      id={`access-${option.value}`}
                                      value={option.value}
                                    />
                                    <span className="text-sm font-semibold text-foreground">
                                      {option.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-snug">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2.5">
                                <span
                                  className={cn(
                                    'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-tight',
                                    isSelected
                                      ? 'bg-primary/15 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  {option.badge}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 4. Ministry Tags */}
              <FormField
                control={form.control}
                name="ministryTags"
                render={({ field }) => {
                  const currentTags = (field.value || []) as MinistryTag[];
                  return (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1.5 font-medium">
                          <Tags className="h-4 w-4 text-primary" />
                          <span>Ministry Tags</span>
                        </FormLabel>
                        <span className="text-xs text-muted-foreground">
                          Select all ministry engagement badges that apply
                        </span>
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          {MINISTRY_TAG_OPTIONS.map((tagOpt) => {
                            const isChecked = currentTags.includes(tagOpt.value);
                            return (
                              <div
                                key={tagOpt.value}
                                onClick={() => {
                                  const next = isChecked
                                    ? currentTags.filter((t) => t !== tagOpt.value)
                                    : [...currentTags, tagOpt.value];
                                  field.onChange(next);
                                  const currentAccess =
                                    form.getValues('systemAccessLevel') || 'NONE';
                                  const currentPos = form.getValues('position');
                                  const mappedRoles = mapAccessAndTagsToRoles(
                                    currentAccess,
                                    next,
                                    currentPos
                                  );
                                  form.setValue('role', mappedRoles as any, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                className={cn(
                                  'flex cursor-pointer items-start space-x-3 rounded-lg border p-3.5 transition-all hover:bg-accent/50',
                                  isChecked
                                    ? 'border-primary/80 bg-primary/5 ring-1 ring-primary/40'
                                    : 'border-border bg-card'
                                )}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => {
                                    // Managed by card container click
                                  }}
                                  className="mt-0.5"
                                />
                                <div className="space-y-1">
                                  <span className="text-sm font-medium leading-none text-foreground block">
                                    {tagOpt.label}
                                  </span>
                                  <p className="text-xs text-muted-foreground leading-snug">
                                    {tagOpt.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Dynamic Role Mapping Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Mapped System Role(s):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {watchRoles.map((r: string) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  100% backward-compatible with system permission tiers
                </span>
              </div>
              <FormField
                control={form.control}
                name="sendWelcomeEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer text-sm font-normal">
                        Send welcome email with account details to this user
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-4 pt-6">
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
