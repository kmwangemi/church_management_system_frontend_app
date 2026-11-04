'use client';

import RenderApiError from '@/components/api-error';
import { CountrySelect } from '@/components/country-list-input';
import { DatePicker } from '@/components/date-picker';
import { PhoneInput } from '@/components/phone-number-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  FormDescription,
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
import { useFileUpload } from '@/lib/hooks/shared/upload/use-file-upload';
import { useCreateChurch } from '@/lib/hooks/superadmin/use-church-management-mutation';
import { errorToastStyle } from '@/lib/toast-styles';
import {
  CHURCH_DENOMINATION_OPTIONS,
  NUMBER_OF_CHURCH_MEMBERS_OPTIONS,
  SUBSCRIPTION_PLANS,
} from '@/lib/utils';
import {
  churchDataSchema,
  type CreateChurchPayload,
} from '@/lib/validations/church';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Church, Loader2, MapPin, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { FieldPath } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddChurchFormProps {
  onCloseDialog: () => void;
}

type TabName = 'basic' | 'contact' | 'subscription';

const TABS: TabName[] = ['basic', 'contact', 'subscription'];
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/**
 * Every field belongs to exactly one tab, so validating a tab (and finding the
 * first tab with an error on submit) covers optional fields too, not just the
 * required ones.
 */
const TAB_FIELDS: Record<TabName, FieldPath<CreateChurchPayload>[]> = {
  basic: [
    'churchName',
    'denomination',
    'description',
    'establishedDate',
    'churchSize',
    'churchLogoUrl',
  ],
  contact: [
    'email',
    'phoneNumber',
    'website',
    'address.country',
    'address.city',
    'address.state',
    'address.zipCode',
    'address.street',
  ],
  subscription: ['subscriptionPlan'],
};

const INITIAL_TAB_STATE: Record<TabName, boolean> = {
  basic: false,
  contact: false,
  subscription: false,
};

/** yyyy-MM-dd in local time, so the picked day never shifts via UTC conversion. */
function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses yyyy-MM-dd (or a full ISO string) as a local date. */
function fromDateOnly(value?: string): Date | undefined {
  if (!value) {
    return;
  }
  const [datePart] = value.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  if (!(y && m && d)) {
    return;
  }
  return new Date(y, m - 1, d);
}

export function AddChurchForm({ onCloseDialog }: AddChurchFormProps) {
  const [currentTab, setCurrentTab] = useState<TabName>('basic');
  const [isValidatingTab, setIsValidatingTab] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tabValidationState, setTabValidationState] =
    useState<Record<TabName, boolean>>(INITIAL_TAB_STATE);
  const router = useRouter();

  const {
    upload,
    isUploading,
    uploadProgress,
    error: uploadError,
    clearError,
  } = useFileUpload('logo');

  const {
    mutateAsync: registerChurchMutation,
    isPending,
    isError,
    error,
  } = useCreateChurch();

  const form = useForm<CreateChurchPayload>({
    resolver: zodResolver(churchDataSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      churchName: '',
      denomination: '',
      description: '',
      establishedDate: '',
      churchSize: '101-250',
      email: '',
      phoneNumber: '',
      website: '',
      churchLogoUrl: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kenya',
      },
      subscriptionPlan: 'BASIC',
    },
  });
  const { reset, watch, setValue } = form;

  const isBusy = isPending || isUploading || logoUploading;

  // ---------------------------------------------------------------- logo ---
  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    clearError();

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', {
        style: errorToastStyle,
      });
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('File size must be less than 2MB', {
        style: errorToastStyle,
      });
      return;
    }

    setLogoFile(file);
    // A newly selected file invalidates any previously uploaded URL.
    setValue('churchLogoUrl', '');

    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      return;
    }
    try {
      setLogoUploading(true);
      const url = await upload(logoFile);
      setValue('churchLogoUrl', url || '', { shouldValidate: true });
      toast.success('Logo uploaded successfully');
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to upload logo',
        { style: errorToastStyle }
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setValue('churchLogoUrl', '');
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const logoUrl = watch('churchLogoUrl');
  const logoIsUploaded = Boolean(logoFile && logoUrl);

  // ---------------------------------------------------------- navigation ---
  const validateTab = async (tab: TabName) => {
    const isValid = await form.trigger(TAB_FIELDS[tab]);
    setTabValidationState((prev) => ({ ...prev, [tab]: isValid }));
    return isValid;
  };

  const goToTab = async (target: TabName) => {
    if (isValidatingTab) {
      return;
    }
    const targetIndex = TABS.indexOf(target);
    const currentIndex = TABS.indexOf(currentTab);
    // Going back is always allowed.
    if (targetIndex <= currentIndex) {
      setCurrentTab(target);
      return;
    }
    try {
      setIsValidatingTab(true);
      // Going forward requires every tab before the target to be valid.
      for (let i = 0; i < targetIndex; i++) {
        const valid = await validateTab(TABS[i]);
        if (!valid) {
          setCurrentTab(TABS[i]);
          toast.error('Please fix the errors before proceeding', {
            style: errorToastStyle,
          });
          return;
        }
      }
      setCurrentTab(target);
    } finally {
      setIsValidatingTab(false);
    }
  };

  const handleNextTab = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const next = TABS[TABS.indexOf(currentTab) + 1];
    if (next) {
      goToTab(next);
    }
  };

  const handlePreviousTab = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const prev = TABS[TABS.indexOf(currentTab) - 1];
    if (prev) {
      setCurrentTab(prev);
    }
  };

  // -------------------------------------------------------------- submit ---
  const onSubmit = async (payload: CreateChurchPayload) => {
    // Strict guard: only proceed if user is intentionally on the final subscription tab
    if (currentTab !== 'subscription') {
      return;
    }

    const data: CreateChurchPayload = { ...payload };
    // Upload the logo now if it was selected but the user never clicked "Upload".
    if (logoFile && !data.churchLogoUrl) {
      try {
        setLogoUploading(true);
        data.churchLogoUrl = (await upload(logoFile)) || '';
      } catch {
        toast.error('Failed to upload logo', { style: errorToastStyle });
        return;
      } finally {
        setLogoUploading(false);
      }
    }
    try {
      await registerChurchMutation(data);
    } catch {
      // The error is surfaced by <RenderApiError /> via the mutation state.
      return;
    }
    reset();
    setTabValidationState(INITIAL_TAB_STATE);
    setLogoFile(null);
    setLogoPreview(null);
    setCurrentTab('basic');
    onCloseDialog();
    router.refresh();
  };

  /** Submit failed validation: jump to the first tab that has an error. */
  const onInvalid = (errors: typeof form.formState.errors) => {
    const firstBad = TABS.find((tab) =>
      TAB_FIELDS[tab].some((field) => {
        const [root, child] = field.split('.') as [
          keyof typeof errors,
          string | undefined,
        ];
        const err = errors[root] as Record<string, unknown> | undefined;
        return child ? Boolean(err?.[child]) : Boolean(err);
      })
    );
    if (firstBad) {
      setCurrentTab(firstBad);
    }
    toast.error('Please fix all validation errors', {
      style: errorToastStyle,
    });
  };

  const tabTrigger = (tab: TabName, label: string) => (
    <TabsTrigger
      className={tabValidationState[tab] ? 'border-green-500' : ''}
      value={tab}
    >
      {label}
      {tabValidationState[tab] && (
        <span aria-hidden="true" className="ml-1 text-green-500">
          ✓
        </span>
      )}
    </TabsTrigger>
  );

  return (
    <Form {...form}>
      {isError && <RenderApiError error={error} />}
      <form
        className="mt-6 space-y-6"
        noValidate
        onKeyDown={(e) => {
          // Prevent accidental form submission on Enter press within text/number inputs
          if (
            e.key === 'Enter' &&
            (e.target as HTMLElement).tagName !== 'TEXTAREA'
          ) {
            e.preventDefault();
          }
        }}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      >
        <Tabs onValueChange={(v) => goToTab(v as TabName)} value={currentTab}>
          <TabsList className="grid w-full grid-cols-3">
            {tabTrigger('basic', 'Basic Info')}
            {tabTrigger('contact', 'Contact')}
            {tabTrigger('subscription', 'Plan')}
          </TabsList>
          {/* ------------------------------ Basic ------------------------------ */}
          <TabsContent className="space-y-6" value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Church className="h-5 w-5" />
                  <span>Basic Church Information</span>
                </CardTitle>
                <CardDescription>
                  Enter the basic details about the church
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="churchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Church Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            maxLength={255}
                            placeholder="Grace Community Church"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used to generate the church&apos;s unique URL slug
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="denomination"
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          maxLength={1000}
                          placeholder="Brief description of the church's mission and vision..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Appears on the church profile ·{' '}
                        {(field.value ?? '').length}/1000
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="establishedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Established Date{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            format="long"
                            maxDate={new Date()}
                            onChange={(date) =>
                              field.onChange(date ? toDateOnly(date) : '')
                            }
                            placeholder="Select established date"
                            value={fromDateOnly(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="churchSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Congregation Size{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select congregation size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {NUMBER_OF_CHURCH_MEMBERS_OPTIONS.map((option) => (
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
                {/* Logo upload */}
                <div className="space-y-4">
                  <FormLabel>Church Logo (Optional)</FormLabel>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          alt="Church Logo"
                          src={logoPreview || logoUrl || ''}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Church className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={handleLogoSelect}
                          ref={fileInputRef}
                          type="file"
                        />
                        <div className="flex space-x-2">
                          {logoFile ? (
                            <>
                              {!logoIsUploaded && (
                                <Button
                                  disabled={logoUploading}
                                  onClick={handleLogoUpload}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  {logoUploading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                  )}
                                  {logoUploading ? 'Uploading...' : 'Upload'}
                                </Button>
                              )}
                              <Button
                                disabled={logoUploading}
                                onClick={handleLogoRemove}
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
                              Select Logo
                            </Button>
                          )}
                        </div>
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
                        {uploadError && (
                          <p className="mt-1 text-red-500 text-xs">
                            {uploadError}
                          </p>
                        )}
                        {!(isUploading || uploadError) && (
                          <p className="mt-1 text-muted-foreground text-xs">
                            {logoIsUploaded
                              ? 'Logo uploaded'
                              : logoFile
                                ? 'Will upload automatically when you register'
                                : 'PNG, JPG or WebP up to 2MB'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* ----------------------------- Contact ----------------------------- */}
          <TabsContent className="space-y-6" value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Church Contact Information</span>
                </CardTitle>
                <CardDescription>
                  Church contact details and address information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="email"
                            placeholder="info@church.com"
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="url"
                          placeholder="https://www.church.com"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Include https:// at the start
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County / State (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nairobi County"
                            {...field}
                            value={field.value ?? ''}
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
                        <FormLabel>Postal Code (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00100"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Physical Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Church Street" {...field} />
                      </FormControl>
                      <FormDescription>
                        Also used as the Main Branch address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          {/* --------------------------- Subscription -------------------------- */}
          <TabsContent className="space-y-6" value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Subscription Plan & Setup</span>
                </CardTitle>
                <CardDescription>
                  Choose the right plan for your church and provide initial
                  setup information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="subscriptionPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel id="subscription-plan-label">
                        Subscription Plan{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        {/* Accessible radio group: no <input> nested inside a <button>. */}
                        <div
                          aria-labelledby="subscription-plan-label"
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                          role="radiogroup"
                        >
                          {SUBSCRIPTION_PLANS.map((plan) => {
                            const selected = field.value === plan.value;
                            return (
                              <button
                                aria-checked={selected}
                                className={`w-full cursor-pointer rounded-lg border p-4 text-left transition-colors ${
                                  selected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-border hover:border-blue-300'
                                }`}
                                key={plan.value}
                                onClick={() => field.onChange(plan.value)}
                                role="radio"
                                type="button"
                              >
                                <div className="mb-2 flex items-center space-x-2">
                                  <span
                                    aria-hidden="true"
                                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                      selected
                                        ? 'border-blue-600'
                                        : 'border-muted-foreground'
                                    }`}
                                  >
                                    {selected && (
                                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                  </span>
                                  <span className="font-medium text-sm">
                                    {plan.label}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {plan.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-900">
                    What happens next?
                  </h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>
                      • The church is created and set to active, with a 30-day
                      free trial on the selected plan
                    </li>
                    <li>
                      • A &quot;Main Branch&quot; is created automatically, using
                      the church&apos;s contact details and address, so you can
                      assign users and leaders straight away
                    </li>
                    <li>
                      • A default &quot;General&quot; giving fund is set up for
                      offerings and pledges
                    </li>
                    <li>
                      • You can add more branches, manage users and configure
                      church settings anytime
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between border-t pt-6">
          <Button
            disabled={currentTab === 'basic' || isBusy || isValidatingTab}
            onClick={handlePreviousTab}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          {currentTab === 'subscription' ? (
            <Button
              key="submit-church-btn"
              disabled={isBusy}
              type="submit"
            >
              {isBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Church'
              )}
            </Button>
          ) : (
            <Button
              key="next-tab-btn"
              disabled={isValidatingTab || isBusy}
              onClick={handleNextTab}
              type="button"
            >
              {isValidatingTab ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Next'
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}