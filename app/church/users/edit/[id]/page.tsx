'use client';

import RenderApiError from '@/components/api-error';
import { BranchCombobox } from '@/components/branch-combobox';
import { CountrySelect } from '@/components/country-list-input';
import { DatePicker } from '@/components/date-picker';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import { MultiSelect } from '@/components/multi-select';
import { PhoneInput } from '@/components/phone-number-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  RenderMemberUpdate,
  RenderStaffUpdate,
  RenderUpdateRoleSpecificFields,
  RenderVolunteerUpdate,
} from '@/components/update-role-specific';
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useFetchDepartments } from '@/lib/hooks/church/department/use-department-queries';
import { useFetchGroups } from '@/lib/hooks/church/group/use-group-queries';
import { useUpdateUserById } from '@/lib/hooks/church/user/use-user-queries';
import { useFileUpload } from '@/lib/hooks/shared/upload/use-file-upload';
import { useAdminMemberDetails } from '@/lib/hooks/shared/use-organization-member-mutation';
import { errorToastStyle } from '@/lib/toast-styles';
import {
  capitalizeFirstLetter,
  CHURCH_POSITION_OPTIONS,
  GENDER_OPTIONS,
  getDefaultsForPosition,
  getRelativeYear,
  getRolesForPosition,
  HOUSEHOLD_ROLE_OPTIONS,
  mapAccessAndTagsToRoles,
  mapRolesToAccessAndTags,
  MARITAL_STATUS_OPTIONS,
  MEMBER_TYPE_OPTIONS,
  MEMBERSHIP_STATUS_OPTIONS,
  MINISTRY_TAG_OPTIONS,
  type MinistryTag,
  splitFullName,
  SYSTEM_ACCESS_LEVEL_OPTIONS,
  type SystemAccessLevel,
  USER_STATUS_OPTIONS,
  cn,
} from '@/lib/utils';
import {
  type UpdateUserPayload,
  userUpdateSchema,
} from '@/lib/validations/users';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Building2,
  Church,
  KeyRound,
  Loader2,
  Save,
  Shield,
  Tags,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { organizationId } = useActiveOrganization();
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useAdminMemberDetails(id, organizationId);
  const {
    upload,
    isUploading,
    uploadProgress,
    error: uploadError,
    clearError,
  } = useFileUpload('logo');
  const {
    data: departments,
    // isLoading: isLoadingDepartments,
    // isError: isErrorDepartments,
    // error: errorDepartments,
  } = useFetchDepartments();
  const {
    data: groups,
    // isLoading: isLoadingGroups,
    // isError: isErrorGroups,
    // error: errorGroups,
  } = useFetchGroups();
  const form = useForm<UpdateUserPayload>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      dateOfBirth: undefined,
      gender: 'MALE',
      profilePictureUrl: undefined,
      occupation: '',
      householdRole: '' as any,
      memberType: 'MEMBER' as any,
      joinedAt: undefined,
      membershipNumber: '',
      branchId: undefined,
      position: '',
      role: undefined,
      systemAccessLevel: 'NONE',
      ministryTags: ['Member'],
      status: 'ACTIVE',
      lastLogin: undefined,
      maritalStatus: 'SINGLE',
      emergencyDetails: {
        emergencyContactFullName: '',
        emergencyContactEmail: '',
        emergencyContactPhoneNumber: '',
        emergencyContactRelationship: '',
        emergencyContactAddress: '',
        emergencyContactNotes: '',
      },
      notes: '',
      skills: [],
      createdAt: undefined,
      memberDetails: {
        memberId: '',
        membershipDate: undefined,
        membershipStatus: 'ACTIVE',
        departmentIds: [],
        groupIds: [],
        occupation: '',
        baptismDate: undefined,
        joinedDate: undefined,
      },
      pastorDetails: {
        pastorId: '',
        ordinationDate: undefined,
        qualifications: [],
        specializations: [],
        assignments: [],
        sermonCount: 0,
        counselingSessions: 0,
        biography: '',
      },
      bishopDetails: {
        bishopId: '',
        appointmentDate: undefined,
        jurisdictionArea: '',
        oversight: {},
        qualifications: [],
        achievements: [],
        biography: '',
      },
      staffDetails: {
        staffId: '',
        jobTitle: '',
        department: '',
        startDate: undefined,
        salary: 0,
        employmentType: 'FULL_TIME',
        isActive: false,
      },
      volunteerDetails: {
        volunteerId: '',
        volunteerStatus: 'ACTIVE',
        availabilitySchedule: {},
        departments: [],
        volunteerRoles: [],
        backgroundCheck: {},
        hoursContributed: 0,
      },
      adminDetails: {
        adminId: '',
        accessLevel: 'NATIONAL',
        assignedBranches: [],
      },
      visitorDetails: {
        visitorId: '',
        visitDate: undefined,
        invitedBy: '',
        howDidYouHear: 'FRIEND',
        followUpStatus: 'PENDING',
        followUpDate: undefined,
        followUpNotes: '',
        interestedInMembership: false,
        servicesAttended: [],
        occupation: '',
      },
    },
  });
  console.log('user detail--->', JSON.stringify(user));
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = splitFullName(user?.user?.name);
      const formData: any = {
        firstName: capitalizeFirstLetter(firstName || ''),
        lastName: capitalizeFirstLetter(lastName || ''),
        email: user?.user?.email || undefined, // undefined instead of empty string
        phoneNumber: user?.user?.phoneNumber || '',
        address: {
          street: user?.address?.street
            ? capitalizeFirstLetter(user.address.street)
            : '',
          city: user?.address?.city
            ? capitalizeFirstLetter(user.address.city)
            : '',
          state: user?.address?.state
            ? capitalizeFirstLetter(user.address.state)
            : '',
          zipCode: user?.address?.zipCode || '',
          country: user?.address?.country || 'Kenya',
        },
        dateOfBirth: user?.user?.dateOfBirth || undefined,
        gender: (user?.user?.gender || 'MALE').toUpperCase(),
        image: user?.user?.image || undefined,
        occupation: user?.user?.occupation
          ? capitalizeFirstLetter(user?.user?.occupation)
          : undefined,
        householdRole: user?.householdRole || user?.member?.householdRole || '',
        memberType: user?.memberType || user?.member?.memberType || 'MEMBER',
        joinedAt: user?.joinedAt || user?.member?.joinedDate || user?.memberDetails?.joinedDate || undefined,
        membershipNumber:
          user?.membershipNumber ||
          user?.member?.membershipNumber ||
          user?.memberDetails?.memberId ||
          '',
        branchId: user?.member?.teamId || user?.member?.branchId || undefined,
        position: user?.member?.position || '',
        role: user?.member?.role || (user?.member?.roles ? (Array.isArray(user.member.roles) ? user.member.roles : [user.member.roles]) : ['MEMBER']),
        systemAccessLevel: mapRolesToAccessAndTags(
          user?.member?.role || (user?.member?.roles ? (Array.isArray(user.member.roles) ? user.member.roles : [user.member.roles]) : ['MEMBER']),
          user?.member?.position
        ).accessLevel,
        ministryTags: mapRolesToAccessAndTags(
          user?.member?.role || (user?.member?.roles ? (Array.isArray(user.member.roles) ? user.member.roles : [user.member.roles]) : ['MEMBER']),
          user?.member?.position
        ).tags,
        status: (user?.user?.status || 'ACTIVE').toUpperCase(),
        maritalStatus: (user?.user?.maritalStatus || 'SINGLE').toUpperCase(),
        emergencyDetails: {
          emergencyContactFullName:
            user?.emergencyContact?.emergencyContactFullName || undefined,
          emergencyContactEmail:
            user?.emergencyContact?.emergencyContactEmail || undefined,
          emergencyContactPhoneNumber:
            user?.emergencyContact?.emergencyContactPhoneNumber || undefined,
          emergencyContactRelationship:
            user?.emergencyContact?.emergencyContactRelationship || undefined,
          emergencyContactAddress:
            user?.emergencyContact?.emergencyContactAddress || undefined,
          emergencyContactNotes:
            user?.emergencyContact?.emergencyContactNotes || undefined,
        },
        notes: user?.user?.notes || undefined,
        skills: user?.user?.skills || [],
      };
      // Distinct church membership identifier
      const customId =
        user?.membershipNumber ||
        user?.member?.membershipNumber ||
        user?.memberDetails?.memberId ||
        user?.adminDetails?.adminId ||
        user?.staffDetails?.staffId ||
        user?.volunteerDetails?.volunteerId ||
        user?.pastorDetails?.pastorId ||
        '';

      const toStringIds = (arr: any): string[] =>
        Array.isArray(arr)
          ? arr
              .map((item) =>
                typeof item === 'string'
                  ? item
                  : item?._id || item?.id || ''
              )
              .filter(Boolean)
          : [];

      // Only add role-specific details that actually exist
      // Member details
      formData.memberDetails = {
        memberId: customId || user?.memberDetails?.memberId || user?.member?.id || user?.id || '',
        membershipDate: user?.memberDetails?.membershipDate || undefined,
        membershipStatus: (
          user?.memberDetails?.membershipStatus || 'ACTIVE'
        ).toUpperCase(),
        departmentIds: toStringIds(
          user?.memberDetails?.departmentIds || user?.memberDetails?.departments
        ),
        groupIds: toStringIds(
          user?.memberDetails?.groupIds || user?.memberDetails?.groups
        ),
        baptismDate: user?.memberDetails?.baptismDate || undefined,
        joinedDate: user?.memberDetails?.joinedDate || undefined,
      };
      formData.memberUpdate = { ...formData.memberDetails };
      // Pastor details
      formData.pastorDetails = {
        pastorId: customId || user?.pastorDetails?.pastorId || '',
        ordinationDate: user?.pastorDetails?.ordinationDate || undefined,
        qualifications: user?.pastorDetails?.qualifications || [],
        specializations: user?.pastorDetails?.specializations || [],
        assignments: user?.pastorDetails?.assignments || [],
        sermonCount: user?.pastorDetails?.sermonCount || 0,
        counselingSessions: user?.pastorDetails?.counselingSessions || 0,
        biography: user?.pastorDetails?.biography || '',
      };
      formData.pastorUpdate = { ...formData.pastorDetails };
      // Bishop details
      if (user?.bishopDetails) {
        formData.bishopDetails = {
          bishopId: customId || user?.bishopDetails?.bishopId || '',
          appointmentDate: user?.bishopDetails?.appointmentDate || undefined,
          jurisdictionArea: user?.bishopDetails?.jurisdictionArea || '',
          oversight: user?.bishopDetails?.oversight || {},
          qualifications: user?.bishopDetails?.qualifications || [],
          achievements: user?.bishopDetails?.achievements || [],
          biography: user?.bishopDetails?.biography || '',
        };
        formData.bishopUpdate = { ...formData.bishopDetails };
      }
      // Admin details
      const adminIdVal =
        customId ||
        user?.adminDetails?.adminId ||
        user?.member?.id ||
        user?.id ||
        user?.userId ||
        '';
      const accessLevelVal = (
        user?.adminDetails?.accessLevel || 'NATIONAL'
      ).toUpperCase();
      const assignedBranchesVal = toStringIds(
        user?.adminDetails?.assignedBranches ||
          (user?.member?.branchId ? [user.member.branchId] : [])
      );

      formData.adminDetails = {
        adminId: adminIdVal,
        accessLevel: accessLevelVal,
        assignedBranches: assignedBranchesVal,
      };
      formData.adminUpdate = {
        adminId: adminIdVal,
        accessLevel: accessLevelVal,
      };
      // Visitor details
      if (user?.visitorDetails) {
        formData.visitorDetails = {
          visitorId: user?.visitorDetails?.visitorId || '',
          visitDate: user?.visitorDetails?.visitDate || undefined,
          invitedBy: user?.visitorDetails?.invitedBy || '',
          howDidYouHear: (
            user?.visitorDetails?.howDidYouHear || 'FRIEND'
          ).toUpperCase(),
          followUpStatus: (
            user?.visitorDetails?.followUpStatus || 'PENDING'
          ).toUpperCase(),
          followUpDate: user?.visitorDetails?.followUpDate || undefined,
          followUpNotes: user?.visitorDetails?.followUpNotes || '',
          interestedInMembership: Boolean(
            user?.visitorDetails?.interestedInMembership
          ),
          servicesAttended: user?.visitorDetails?.servicesAttended || [],
        };
        formData.visitorUpdate = { ...formData.visitorDetails };
      }
      // Check if member is actually staff or volunteer
      const userRoles: string[] = Array.isArray(user?.roles)
        ? user.roles
        : Array.isArray(user?.member?.roles)
        ? user.member.roles
        : user?.member?.role
        ? Array.isArray(user.member.role)
          ? user.member.role
          : [user.member.role]
        : [];

      const isStaff = Boolean(
        userRoles.some((r) => String(r).toUpperCase() === 'STAFF') ||
        (user?.staffDetails?.staffId && user?.staffDetails?.staffId !== customId)
      );

      const isVolunteer = Boolean(
        userRoles.some((r) => String(r).toUpperCase() === 'VOLUNTEER') ||
        (user?.volunteerDetails?.volunteerId && user?.volunteerDetails?.volunteerId !== customId)
      );

      // staff details
      formData.staffDetails = {
        staffId: isStaff ? (user?.staffDetails?.staffId || '') : '',
        jobTitle: capitalizeFirstLetter(user?.staffDetails?.jobTitle || ''),
        department: capitalizeFirstLetter(
          user?.staffDetails?.department || ''
        ),
        startDate: user?.staffDetails?.startDate || undefined,
        salary: user?.staffDetails?.salary || 0,
        employmentType: (
          user?.staffDetails?.employmentType || 'FULL_TIME'
        )
          .toUpperCase()
          .replace('-', '_'),
        isActive: user?.staffDetails?.isActive ?? true,
      };
      formData.staffUpdate = {
        ...formData.staffDetails,
      };
      // volunteer details
      formData.volunteerDetails = {
        volunteerId: isVolunteer ? (user?.volunteerDetails?.volunteerId || '') : '',
        volunteerStatus: (
          user?.volunteerDetails?.volunteerStatus || 'ACTIVE'
        ).toUpperCase(),
        availabilitySchedule:
          user?.volunteerDetails?.availabilitySchedule || {},
        departments: toStringIds(user?.volunteerDetails?.departments),
        volunteerRoles: user?.volunteerDetails?.volunteerRoles || [],
        backgroundCheck: user?.volunteerDetails?.backgroundCheck || {},
        hoursContributed: user?.volunteerDetails?.hoursContributed || 0,
      };
      formData.volunteerUpdate = {
        ...formData.volunteerDetails,
      };
      form.reset(formData);
    }
  }, [form, user]);
  const {
    mutateAsync: updateUserMutation,
    isPending,
    isError,
    error,
  } = useUpdateUserById(id);
  const { reset, watch, setValue } = form;
  const watchPosition = watch('position');
  const CHURCH_ROLE_OPTIONS = getRolesForPosition(watchPosition);

  // Handle profile picture file selection
  const handleProfilePictureSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Clear any previous errors
    clearError();
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB', {
        style: errorToastStyle,
      });
      return;
    }
    setProfilePicFile(file);
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  // Handle profile picture update using the hook
  const handleProfilePictureUpload = async () => {
    if (!profilePicFile) return;
    try {
      // Use the upload function from the hook
      const uploadResponse = await upload(profilePicFile);
      setValue('profilePictureUrl', uploadResponse || '');
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
      // biome-ignore lint/suspicious/noConsole: ignore console
      console.error('Profile picture update error:', error);
    }
  };
  // Handle profile picture removal
  const handleProfilePicRemove = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
    setValue('profilePictureUrl', '');
    clearError(); // Clear any upload errors
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // Handle form submission
  const onSubmit = async (payload: UpdateUserPayload) => {
    // Synchronize role array from system access level and ministry tags
    const accessLevel = payload.systemAccessLevel || 'NONE';
    const ministryTags = payload.ministryTags || [];
    const computedRoles = mapAccessAndTagsToRoles(
      accessLevel,
      ministryTags,
      payload.position
    );
    payload.role = computedRoles as any;

    // Only upload profile picture if a file was selected
    if (profilePicFile) {
      setProfilePicUploading(true);
      try {
        const profilePicUrl = await upload(profilePicFile as File);
        payload.profilePictureUrl = profilePicUrl || '';
      } catch (_error) {
        toast.error('Failed to upload profile picture');
        return;
      } finally {
        setProfilePicUploading(false);
      }
    }
    // Validate the payload
    const validation = userUpdateSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || 'Please fix all validation errors';
      toast.error(firstError);
      return;
    }
    // Update user with proper error handling
    await updateUserMutation({ userId: id, payload });
    // Reset form state with submitted values to keep state synced
    reset(payload);
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };
  const roles = form.watch('role');
  const position = form.watch('position');
  return (
    <div className="space-y-6">
      {/* Header */}
      {isErrorUser && <RenderApiError error={errorUser} />}
      {isError && <RenderApiError error={error} />}
      {isLoadingUser ? (
        <SpinnerLoader description="Loading user data..." />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/church/users">
                <Button size="sm" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Members
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-bold text-3xl tracking-tight">
                    Edit Member
                  </h1>
                  {(user?.membershipNumber || user?.member?.membershipNumber) && (
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                      {user?.membershipNumber || user?.member?.membershipNumber}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  Update member information and settings
                </p>
              </div>
            </div>
            <Button
              disabled={isPending || isUploading}
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending || isUploading ? 'Saving changes...' : ' Save Changes'}
            </Button>
          </div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs className="space-y-4" defaultValue="personal">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="role">Role Details</TabsTrigger>
                  <TabsTrigger value="staff">Staff Details</TabsTrigger>
                  <TabsTrigger value="volunteer">Volunteer Details</TabsTrigger>
                </TabsList>
                <TabsContent className="space-y-6" value="personal">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Photo */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Photo</CardTitle>
                        <CardDescription>
                          Update member's profile picture
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            alt={user?.user.name || 'User'}
                            src={
                              profilePicPreview ||
                              watch('profilePictureUrl') ||
                              ''
                            }
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {(user?.user?.name || 'User')
                              .split(' ')
                              .filter(Boolean)
                              .map((n: string) => n[0]?.toUpperCase() || '')
                              .join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <input
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureSelect}
                            ref={fileInputRef}
                            type="file"
                          />
                          <div className="flex space-x-2">
                            {profilePicFile ? (
                              <>
                                <Button
                                  disabled={profilePicUploading}
                                  onClick={handleProfilePictureUpload}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  {profilePicUploading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                  )}
                                  {profilePicUploading
                                    ? 'Uploading...'
                                    : 'Upload'}
                                </Button>
                                <Button
                                  onClick={handleProfilePicRemove}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => fileInputRef.current?.click()}
                                size="sm"
                                type="button"
                                variant="outline"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                              </Button>
                            )}
                          </div>
                          {/* Show upload progress */}
                          {isUploading && (
                            <div className="mt-2">
                              <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="mt-1 text-muted-foreground text-xs">
                                Uploading... {uploadProgress}%
                              </p>
                            </div>
                          )}
                          {/* Show error if any */}
                          {uploadError && (
                            <p className="mt-1 text-red-500 text-xs">
                              {uploadError}
                            </p>
                          )}
                          {!(isUploading || error) && (
                            <p className="mt-1 text-muted-foreground text-xs">
                              PNG, JPG up to 2MB
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Personal details and contact information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
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
                              <FormLabel>Phone Number</FormLabel>
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
                        <div className="space-y-4">
                          <FormLabel>Address</FormLabel>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="address.country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Country{' '}
                                    <span className="text-red-500">*</span>
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
                                    Street Address{' '}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="123 Main Street"
                                      {...field}
                                    />
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
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>
                          Additional personal information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Gender <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
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
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <DatePicker
                                  format="long"
                                  maxDate={getRelativeYear(1)}
                                  minDate={getRelativeYear(-100)}
                                  onChange={(date) =>
                                    field.onChange(
                                      date ? date.toISOString() : ''
                                    )
                                  }
                                  placeholder="Select date of birth"
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Marital Status{' '}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[400px] overflow-y-auto">
                                  {MARITAL_STATUS_OPTIONS.map((option) => (
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
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills (comma-separated)</FormLabel>
                              <FormControl>
                                <Input
                                  onChange={(e) => {
                                    const skillsArray = e.target.value
                                      .split(',')
                                      .map((skill) => skill.trim())
                                      .filter((skill) => skill.length > 0);
                                    field.onChange(skillsArray);
                                  }}
                                  placeholder="e.g., Teaching, Music, Administration"
                                  value={field.value?.join(', ') || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="householdRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Household Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ''}
                              >
                                <FormControl>
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select household role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {HOUSEHOLD_ROLE_OPTIONS.map((option) => (
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
                          name="memberType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Member Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'MEMBER'}
                              >
                                <FormControl>
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select member type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MEMBER_TYPE_OPTIONS.map((option) => (
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
                          name="joinedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membership / Joined Date</FormLabel>
                              <FormControl>
                                <DatePicker
                                  format="long"
                                  maxDate={getRelativeYear(1)}
                                  minDate={getRelativeYear(-50)}
                                  onChange={(date) =>
                                    field.onChange(
                                      date ? date.toISOString().split('T')[0] : ''
                                    )
                                  }
                                  placeholder="Select joined date"
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    {/* Emergency Contact */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-5 w-5" />
                          <span>Emergency Contact</span>
                        </CardTitle>
                        <CardDescription>
                          Emergency contact information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="emergencyDetails.emergencyContactFullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Contact full name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyDetails.emergencyContactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Contact email"
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
                            name="emergencyDetails.emergencyContactPhoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Phone Number</FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    defaultCountry="KE"
                                    onChange={field.onChange}
                                    placeholder="Phone number"
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyDetails.emergencyContactRelationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Spouse, Parent, Sibling"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="emergencyDetails.emergencyContactAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Physical Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Church Street, Nairobi"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyDetails.emergencyContactNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Additional emergency contact information"
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
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Ministry Involvement */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ministry Involvement</CardTitle>
                        <CardDescription>
                          Current ministry participation
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="memberDetails.departmentIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departments</FormLabel>
                              <FormControl>
                                <MultiSelect
                                  onChange={field.onChange}
                                  options={
                                    departments?.departments?.map((dept) => ({
                                      label: capitalizeFirstLetter(
                                        dept?.departmentName
                                      ),
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
                        <FormField
                          control={form.control}
                          name="memberDetails.groupIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Active Groups</FormLabel>
                              <FormControl>
                                <MultiSelect
                                  onChange={field.onChange}
                                  options={
                                    groups?.groups?.map((group) => ({
                                      label: capitalizeFirstLetter(
                                        group?.groupName
                                      ),
                                      value: group?._id,
                                    })) || []
                                  }
                                  placeholder="Select group(s)"
                                  selected={field.value || []}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    {/* Additional Notes Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                        <CardDescription>
                          General notes and status information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Additional notes about this member"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[400px] overflow-y-auto">
                                  {USER_STATUS_OPTIONS.map((option) => (
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
                  </div>
                </TabsContent>
                <TabsContent className="space-y-6" value="role">
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
                              // Auto-suggest recommended access level & ministry tags based on title
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
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                      name="branchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 font-medium">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>Branch (Location)</span>
                          </FormLabel>
                          <FormControl>
                            <BranchCombobox
                              className="w-full"
                              onChange={field.onChange}
                              placeholder="Search and select a branch"
                              value={field.value}
                            />
                          </FormControl>
                          <p className="text-[11px] text-muted-foreground">
                            Physical campus or congregation branch.
                          </p>
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
                                  htmlFor={`edit-access-${option.value}`}
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
                                          id={`edit-access-${option.value}`}
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
                                        // Handled by card click
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

                  {/* Dynamic Backend Role Mapping Preview */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span>Mapped System Role(s):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(roles || []).map((r: string) => (
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
                  <RenderMemberUpdate form={form} roles={roles} />
                  <RenderUpdateRoleSpecificFields
                    form={form}
                    position={position}
                    roles={roles}
                  />
                </TabsContent>
                <TabsContent className="space-y-6" value="staff">
                  <RenderStaffUpdate form={form} roles={roles} />
                </TabsContent>
                <TabsContent className="space-y-6" value="volunteer">
                  <RenderVolunteerUpdate form={form} roles={roles} />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
