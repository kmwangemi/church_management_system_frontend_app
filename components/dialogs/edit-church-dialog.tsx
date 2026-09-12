'use client';

import type React from 'react';

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
import type { ChurchListResponse } from '@/lib/types/church';
import { CHURCH_DENOMINATION_OPTIONS } from '@/lib/utils';
import { Building2, Edit, MapPin, Upload } from 'lucide-react';
import { useState } from 'react';

interface EditChurchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: ChurchListResponse | null;
  onSave: (church: ChurchListResponse) => void;
}

export function EditChurchDialog({
  open,
  onOpenChange,
  church,
  onSave,
}: EditChurchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: church?.name || '',
    denomination: church?.denomination || '',
    pastor: church?.metadata?.pastor || '',
    email: church?.email || '',
    phone: church?.phoneNumber || '',
    website: church?.website || '',
    address: church?.address || {},
    status: church?.status || 'ACTIVE',
    plan: church?.subscription?.plan || 'BASIC',
    established: church?.establishedDate || '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (church) {
        onSave({
          ...church,
          ...formData,
          phoneNumber: formData.phone,
        } as unknown as ChurchListResponse);
      }
      alert('Church updated successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating church:', error);
      alert('Failed to update church. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  if (!church) return null;
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Church
          </DialogTitle>
          <DialogDescription>
            Update church information and settings
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
            <TabsContent className="space-y-6" value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Basic Church Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4 flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={church?.logo || undefined} />
                      <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                        {formData.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button size="sm" type="button" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Logo
                      </Button>
                      <p className="mt-1 text-muted-foreground text-xs">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-medium text-sm" htmlFor="name">
                        Church Name *
                      </Label>
                      <Input
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Grace Community Church"
                        required
                        value={formData.name}
                      />
                    </div>
                    <div>
                      <Label
                        className="font-medium text-sm"
                        htmlFor="denomination"
                      >
                        Denomination *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleChange('denomination', value)
                        }
                        value={formData.denomination}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select denomination" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHURCH_DENOMINATION_OPTIONS.map((denomination) => (
                            <SelectItem
                              key={denomination?.value}
                              value={denomination?.value.toLowerCase()}
                            >
                              {denomination?.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-medium text-sm" htmlFor="pastor">
                        Lead Pastor *
                      </Label>
                      {/* <Input
                        onChange={(e) => handleChange('pastor', e.target.value)}
                        placeholder="Rev. John Smith"
                        required
                        value={formData?.pastor}
                      /> */}
                    </div>
                    <div>
                      <Label
                        className="font-medium text-sm"
                        htmlFor="establishedDate"
                      >
                        Established Date *
                      </Label>
                      {/* <Input
                        onChange={(e) =>
                          handleChange('established', e.target.value)
                        }
                        required
                        type="date"
                        value={formData.established}
                      /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-6" value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-medium text-sm" htmlFor="email">
                        Church Email *
                      </Label>
                      <Input
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="info@church.com"
                        required
                        type="email"
                        value={formData.email}
                      />
                    </div>
                    <div>
                      <Label
                        className="font-medium text-sm"
                        htmlFor="phoneNumber"
                      >
                        Phone Number *
                      </Label>
                      <Input
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                        value={formData.phone}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium text-sm" htmlFor="website">
                      Website
                    </Label>
                    <Input
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.church.com"
                      value={formData.website}
                    />
                  </div>
                  <div>
                    <Label className="font-medium text-sm" htmlFor="address">
                      Full Address *
                    </Label>
                    {/* <Textarea
                      className="min-h-[80px]"
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123 Faith Street, Springfield, IL 62701"
                      required
                      value={formData?.address}
                    /> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-6" value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Church Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-medium text-sm" htmlFor="status">
                        Status
                      </Label>
                      <Select
                        onValueChange={(value) => handleChange('status', value)}
                        value={formData.status}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor="branches">
                        Total Branches
                      </Label>
                      <Input
                        className="bg-accent"
                        disabled
                        type="number"
                        value={church?.numberOfBranches}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium text-sm" htmlFor="members">
                      Total Members
                    </Label>
                    {/* <Input
                      className="bg-accent"
                      disabled
                      type="number"
                      value={church?.metadata.members || 0}
                    /> */}
                    <p className="mt-1 text-muted-foreground text-xs">
                      This value is automatically calculated
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="mb-2 font-medium text-amber-900">
                      Important Settings
                    </h4>
                    <p className="text-amber-700 text-sm">
                      Changing the church status may affect access to the system
                      for all users associated with this church. Please proceed
                      with caution.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-6" value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium text-sm" htmlFor="plan">
                      Current Plan
                    </Label>
                    <Select
                      onValueChange={(value) => handleChange('plan', value)}
                      value={formData.plan}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - $29/month</SelectItem>
                        <SelectItem value="standard">
                          Standard - $79/month
                        </SelectItem>
                        <SelectItem value="premium">
                          Premium - $149/month
                        </SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise - Custom
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-medium text-sm" htmlFor="income">
                        Monthly Revenue
                      </Label>
                      {/* <Input
                        className="bg-accent"
                        disabled
                        type="number"
                        value={church?.metadata.revenue || 0}
                      /> */}
                    </div>
                    <div>
                      <Label className="font-medium text-sm" htmlFor="growth">
                        Growth Rate
                      </Label>
                      {/* <Input
                        className="bg-accent"
                        disabled
                        value={`${church?.metadata.growth || 0}%`}
                      /> */}
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-2 font-medium text-blue-900">
                      Plan Change Notice
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Changing the subscription plan will take effect
                      immediately. The church will be charged the prorated
                      amount for the remainder of the billing cycle.
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
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1]);
                }
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
                    const tabs = [
                      'basic',
                      'contact',
                      'settings',
                      'subscription',
                    ];
                    const currentIndex = tabs.indexOf(currentTab);
                    if (currentIndex < tabs.length - 1) {
                      setCurrentTab(tabs[currentIndex + 1]);
                    }
                  }}
                  type="button"
                >
                  Next
                </Button>
              ) : (
                <Button disabled={isLoading} type="submit">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
