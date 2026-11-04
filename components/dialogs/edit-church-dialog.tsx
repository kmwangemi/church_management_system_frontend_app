'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { CountrySelect } from '@/components/country-list-input';
import { DatePicker } from '@/components/date-picker';
import { PhoneInput } from '@/components/phone-number-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { ChurchListResponse } from '@/lib/types/church';
import {
  CHURCH_DENOMINATION_OPTIONS,
  NUMBER_OF_CHURCH_MEMBERS_OPTIONS,
  SUBSCRIPTION_PLANS,
} from '@/lib/utils';
import { Building2, Edit, Loader2, MapPin, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditChurchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: ChurchListResponse | null;
  onSave: (church: ChurchListResponse) => void;
}

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDateOnly(value?: string): Date | undefined {
  if (!value) return;
  const [datePart] = value.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  if (!(y && m && d)) return;
  return new Date(y, m - 1, d);
}

export function EditChurchDialog({
  open,
  onOpenChange,
  church,
  onSave,
}: EditChurchDialogProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [description, setDescription] = useState('');
  const [establishedDate, setEstablishedDate] = useState('');
  const [churchSize, setChurchSize] = useState('100-500');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Kenya');

  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [plan, setPlan] = useState('BASIC');

  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, clearError } = useFileUpload('logo');

  useEffect(() => {
    if (church && open) {
      setName(church.name || '');
      setDenomination(church.denomination || '');
      setDescription(church.description || '');
      setEmail(church.email || '');
      setPhone(church.phoneNumber || '');
      setWebsite(church.website || '');
      setStatus((church.status?.toUpperCase() as any) || 'ACTIVE');
      setPlan(church.subscription?.plan?.toUpperCase() || 'BASIC');

      const addr = church.address;
      setStreet(addr?.street || '');
      setCity(addr?.city || '');
      setState(addr?.state || '');
      setZipCode(addr?.zipCode || '');
      setCountry(addr?.country || 'Kenya');

      setEstablishedDate(church.establishedDate || '');
      setChurchSize(church.churchSize || '100-500');

      setLogoUrl(church.logo || '');
      setLogoFile(null);
      setLogoPreview(null);
      setCurrentTab('basic');
    }
  }, [church, open]);

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    clearError();

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!church) return;

    if (!name.trim()) {
      toast.error('Church name is required');
      setCurrentTab('basic');
      return;
    }
    if (!denomination.trim()) {
      toast.error('Denomination is required');
      setCurrentTab('basic');
      return;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      setCurrentTab('contact');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone number is required');
      setCurrentTab('contact');
      return;
    }

    setIsSubmitting(true);
    let finalLogoUrl = logoUrl;

    if (logoFile) {
      try {
        setLogoUploading(true);
        const uploadedUrl = await upload(logoFile);
        if (uploadedUrl) {
          finalLogoUrl = uploadedUrl;
        }
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to upload logo'
        );
        setIsSubmitting(false);
        setLogoUploading(false);
        return;
      } finally {
        setLogoUploading(false);
      }
    }

    try {
      const updatedChurch: ChurchListResponse = {
        ...church,
        name: name.trim(),
        denomination: denomination.trim(),
        description: description.trim(),
        logo: finalLogoUrl,
        email: email.trim(),
        phoneNumber: phone.trim(),
        website: website.trim(),
        churchSize,
        status,
        establishedDate,
        address: {
          ...(church.address || {}),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: country.trim(),
          organizationId: church.id,
        },
        subscription: {
          ...(church.subscription || {}),
          plan,
        },
        metadata: {
          ...(church.metadata || {}),
          churchSize,
          establishedDate,
        },
      };

      onSave(updatedChurch);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating church:', error);
      toast.error('Failed to update church. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!church) return null;

  const currentLogoDisplay = logoPreview || logoUrl;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Church: {church.name}
          </DialogTitle>
          <DialogDescription>
            Update church information, contact details, settings, and subscription.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs onValueChange={setCurrentTab} value={currentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            {/* TAB 1: BASIC INFO */}
            <TabsContent className="space-y-6" value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Basic Church Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo management */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={currentLogoDisplay || undefined} />
                      <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                        {name
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || 'CH'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-2">
                      <input
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoSelect}
                        ref={fileInputRef}
                        type="file"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={logoUploading || isSubmitting}
                          onClick={() => fileInputRef.current?.click()}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {currentLogoDisplay ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        {currentLogoDisplay && (
                          <Button
                            disabled={logoUploading || isSubmitting}
                            onClick={handleLogoRemove}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        PNG or JPG up to 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="name">
                        Church Name *
                      </Label>
                      <Input
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Grace Community Church"
                        required
                        value={name}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="denomination">
                        Denomination *
                      </Label>
                      <Select onValueChange={setDenomination} value={denomination}>
                        <SelectTrigger id="denomination">
                          <SelectValue placeholder="Select denomination" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHURCH_DENOMINATION_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="established">
                        Established Date
                      </Label>
                      <DatePicker
                        format="long"
                        maxDate={new Date()}
                        onChange={(d) => setEstablishedDate(d ? toDateOnly(d) : '')}
                        value={fromDateOnly(establishedDate)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="churchSize">
                        Congregation Size
                      </Label>
                      <Select onValueChange={setChurchSize} value={churchSize}>
                        <SelectTrigger id="churchSize">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {NUMBER_OF_CHURCH_MEMBERS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-sm" htmlFor="description">
                      Church Description
                    </Label>
                    <Textarea
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief overview of church mission, vision, and background..."
                      rows={3}
                      value={description}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: CONTACT & ADDRESS */}
            <TabsContent className="space-y-6" value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Contact Information & Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="email">
                        Church Email *
                      </Label>
                      <Input
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@church.com"
                        required
                        type="email"
                        value={email}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="phone">
                        Phone Number *
                      </Label>
                      <PhoneInput
                        defaultCountry="KE"
                        onChange={(val) => setPhone(val || '')}
                        placeholder="Enter phone number"
                        value={phone}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-sm" htmlFor="website">
                      Website
                    </Label>
                    <Input
                      id="website"
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.church.com"
                      value={website}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="mb-3 font-semibold text-sm">Physical Address</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-medium text-sm" htmlFor="country">
                          Country *
                        </Label>
                        <CountrySelect
                          onChange={(val) => setCountry(val || 'Kenya')}
                          placeholder="Select country"
                          value={country}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-sm" htmlFor="city">
                          City / Town *
                        </Label>
                        <Input
                          id="city"
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Nairobi"
                          value={city}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-medium text-sm" htmlFor="state">
                          County / State / Region
                        </Label>
                        <Input
                          id="state"
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g. Nairobi County"
                          value={state}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-sm" htmlFor="zipCode">
                          Postal / Zip Code
                        </Label>
                        <Input
                          id="zipCode"
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="e.g. 00100"
                          value={zipCode}
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label className="font-medium text-sm" htmlFor="street">
                        Street Address *
                      </Label>
                      <Input
                        id="street"
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. Along Haile Selassie Avenue, Plot 42"
                        value={street}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: SETTINGS */}
            <TabsContent className="space-y-6" value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Church Status & Metadata</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-medium text-sm" htmlFor="status">
                        Church Status
                      </Label>
                      <Select
                        onValueChange={(val: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') =>
                          setStatus(val)
                        }
                        value={status}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium text-sm">
                        Total Branches (Managed via Branches page)
                      </Label>
                      <Input
                        className="bg-muted"
                        disabled
                        value={church.numberOfBranches ?? 0}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="mb-1 font-medium text-amber-900">
                      Important Status Change Notice
                    </h4>
                    <p className="text-amber-800 text-sm">
                      Suspending or deactivating a church immediately disables portal
                      access for all ministers, staff, and church members under this
                      organization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: SUBSCRIPTION */}
            <TabsContent className="space-y-6" value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-sm" htmlFor="plan">
                      Current Subscription Plan
                    </Label>
                    <Select onValueChange={setPlan} value={plan}>
                      <SelectTrigger id="plan">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-1 font-medium text-blue-900">
                      Subscription Plan Notice
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Changes made to the subscription plan update the church's billing
                      tier and tier capabilities in the backend database.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between border-t pt-6">
            <Button
              disabled={currentTab === 'basic'}
              onClick={() => {
                const tabs = ['basic', 'contact', 'settings', 'subscription'];
                const idx = tabs.indexOf(currentTab);
                if (idx > 0) setCurrentTab(tabs[idx - 1]);
              }}
              type="button"
              variant="outline"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              {currentTab !== 'subscription' ? (
                <Button
                  onClick={() => {
                    const tabs = ['basic', 'contact', 'settings', 'subscription'];
                    const idx = tabs.indexOf(currentTab);
                    if (idx < tabs.length - 1) setCurrentTab(tabs[idx + 1]);
                  }}
                  type="button"
                >
                  Next
                </Button>
              ) : (
                <Button disabled={isSubmitting || logoUploading} type="submit">
                  {isSubmitting || logoUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
