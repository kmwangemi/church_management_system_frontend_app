'use client';

import RenderApiError from '@/components/api-error';
import { CountrySelect } from '@/components/country-list-input';
import { DatePicker } from '@/components/date-picker';
import { NumberInput } from '@/components/number-input';
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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddChurchFormProps {
  onCloseDialog: () => void;
}

export function AddChurchForm({ onCloseDialog }: AddChurchFormProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tabValidationState, setTabValidationState] = useState({
    basic: false,
    contact: false,
    subscription: false,
  });
  const router = useRouter();
  const {
    upload,
    isUploading,
    uploadProgress,
    error: uploadError,
    clearError,
  } = useFileUpload('logo');
  const form = useForm<CreateChurchPayload>({
    resolver: zodResolver(churchDataSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      churchName: '',
      denomination: '',
      description: '',
      establishedDate: undefined,
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
      churchSize: '',
      numberOfBranches: '',
    },
  });
  const { reset, watch, setValue } = form;
  // Handle logo file selection
  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    clearError();
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', {
        style: errorToastStyle,
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB', {
        style: errorToastStyle,
      });
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile) return;
    try {
      const uploadResponse = await upload(logoFile);
      setValue('churchLogoUrl', uploadResponse || '');
      toast.success('Logo uploaded successfully');
    } catch (_error) {
      toast.error('Failed to upload logo');
    }
  };
  // Handle logo removal
  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setValue('churchLogoUrl', '');
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // Validate current tab fields
  const validateCurrentTabFields = async (tabName: string) => {
    let isValid = true;
    switch (tabName) {
      case 'basic':
        isValid = await form.trigger([
          'churchName',
          'denomination',
          'establishedDate',
        ]);
        break;
      case 'contact':
        isValid = await form.trigger([
          'email',
          'phoneNumber',
          'address.street',
          'address.city',
          'address.country',
        ]);
        break;
      case 'subscription':
        isValid = await form.trigger([
          'subscriptionPlan',
          'churchSize',
          'numberOfBranches',
        ]);
        break;
      default:
        isValid = false;
    }
    setTabValidationState((prev) => ({
      ...prev,
      [tabName]: isValid,
    }));
    return isValid;
  };
  // Handle next tab navigation
  const handleNextTab = async () => {
    const tabs = ['basic', 'contact', 'subscription'];
    const currentIndex = tabs.indexOf(currentTab);
    const isCurrentTabValid = await validateCurrentTabFields(currentTab);
    if (!isCurrentTabValid) {
      toast.error('Please fix the errors before proceeding');
      return;
    }
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };
  // Handle previous tab navigation
  const handlePreviousTab = () => {
    const tabs = ['basic', 'contact', 'subscription'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };
  const {
    mutateAsync: registerChurchMutation,
    isPending,
    isError,
    error,
  } = useCreateChurch();
  // Handle form submission
  const onSubmit = async (payload: CreateChurchPayload) => {
    // Step 1: Upload logo if selected but not uploaded yet
    if (logoFile && !payload.churchLogoUrl) {
      try {
        setLogoUploading(true);
        const churchLogoUrl = await upload(logoFile);
        payload.churchLogoUrl = churchLogoUrl || '';
      } catch (_err) {
        toast.error('Failed to upload logo');
        return;
      } finally {
        setLogoUploading(false);
      }
    }
    // Step 2: Validate payload
    const validation = churchDataSchema.safeParse(payload);
    if (!validation.success) {
      toast.error('Please fix all validation errors');
      return;
    }
    // Step 3: Call mutation to create organization
    await registerChurchMutation(payload);
    // Step 4: Success - reset form and close dialog
    // Reset form state
    reset();
    setLogoFile(null);
    setLogoPreview(null);
    setCurrentTab('basic');
    onCloseDialog();
    router.refresh();
  };
  return (
    <Form {...form}>
      {isError && <RenderApiError error={error} />}
      <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs onValueChange={setCurrentTab} value={currentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              className={tabValidationState.basic ? 'border-green-500' : ''}
              value="basic"
            >
              Basic Info
              {tabValidationState.basic && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              className={tabValidationState.contact ? 'border-green-500' : ''}
              value="contact"
            >
              Contact
              {tabValidationState.contact && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              className={
                tabValidationState.subscription ? 'border-green-500' : ''
              }
              value="subscription"
            >
              Plan
              {tabValidationState.subscription && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </TabsTrigger>
          </TabsList>
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
                            placeholder="Grace Community Church"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used to generate a unique slug
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
                          placeholder="Brief description of the church's mission and vision..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description that will appear on the church
                        profile
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
                              field.onChange(date ? date.toISOString() : '')
                            }
                            placeholder="Select established date"
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Logo Upload Section */}
                  <div className="space-y-4">
                    <FormLabel>Church Logo (Optional)</FormLabel>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          alt="Church Logo"
                          src={logoPreview || watch('churchLogoUrl') || ''}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Church className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoSelect}
                          ref={fileInputRef}
                          type="file"
                        />
                        <div className="flex space-x-2">
                          {logoFile ? (
                            <>
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
                              <Button
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
                        {!(isUploading || error) && (
                          <p className="mt-1 text-muted-foreground text-xs">
                            PNG, JPG up to 2MB
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Contact Tab */}
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
                          placeholder="https://www.church.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional church website URL
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
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
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
                        <FormLabel>Zip Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          {/* Subscription Tab */}
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
                      <FormLabel>
                        Subscription Plan{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {SUBSCRIPTION_PLANS.map((plan) => (
                            <button
                              aria-pressed={field.value === plan.value}
                              className={`w-full cursor-pointer rounded-lg border p-4 text-left transition-colors ${
                                field.value === plan.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-border hover:border-border'
                              }`}
                              key={plan.value}
                              onClick={() => field.onChange(plan.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  field.onChange(plan.value);
                                }
                              }}
                              tabIndex={0}
                              type="button"
                            >
                              <div className="mb-2 flex items-center space-x-2">
                                <input
                                  aria-hidden="true"
                                  checked={field.value === plan.value}
                                  className="text-blue-600"
                                  onChange={() => field.onChange(plan.value)}
                                  tabIndex={-1}
                                  type="radio"
                                />
                                <span className="font-medium text-sm">
                                  {plan.label}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {plan.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="churchSize"
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
                  <FormField
                    control={form.control}
                    name="numberOfBranches"
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
                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-900">
                    What happens next?
                  </h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>
                      • Church organization will be created with Better Auth
                    </li>
                    <li>• You'll be set as the organization owner</li>
                    <li>• Organization will be set as active automatically</li>
                    <li>
                      • You can then invite other members and manage roles
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between border-t pt-6">
          <Button
            disabled={currentTab === 'basic'}
            onClick={handlePreviousTab}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          {currentTab !== 'subscription' ? (
            <Button onClick={handleNextTab} type="button">
              Next
            </Button>
          ) : (
            <Button disabled={isPending || isUploading} type="submit">
              {isPending || isUploading ? 'Registering...' : 'Register Church'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
