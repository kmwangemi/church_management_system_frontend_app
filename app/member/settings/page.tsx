'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  Camera,
  Download,
  Eye,
  EyeOff,
  Globe,
  Key,
  LogOut,
  Mail,
  Palette,
  Phone,
  Shield,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

export default function MemberSettingsPage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mock user data
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    dateOfBirth: '1990-05-15',
    memberSince: '2020-01-15',
    profileImage: '/placeholder.svg?height=100&width=100',
    bio: 'Passionate about serving God and building community through faith.',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
  };

  const notificationSettings = {
    emailNotifications: {
      announcements: true,
      events: true,
      prayerRequests: false,
      givingReminders: true,
      smallGroups: true,
      newsletters: true,
    },
    pushNotifications: {
      announcements: true,
      events: true,
      prayerRequests: true,
      messages: true,
      reminders: false,
    },
    smsNotifications: {
      emergencyAlerts: true,
      eventReminders: false,
      givingReminders: false,
    },
  };

  const privacySettings = {
    profileVisibility: 'members', // public, members, leaders
    showEmail: false,
    showPhone: false,
    showAddress: false,
    allowDirectMessages: true,
    showInDirectory: true,
    shareAttendanceData: true,
    shareGivingData: false,
  };

  const appPreferences = {
    theme: 'system', // light, dark, system
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    dashboardLayout: 'default',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <Tabs className="space-y-4" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger className="flex items-center space-x-2" value="profile">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center space-x-2"
            value="notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center space-x-2" value="privacy">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center space-x-2" value="security">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center space-x-2"
            value="preferences"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center space-x-2" value="data">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="profile">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={userData.profileImage || '/placeholder.svg'}
                  />
                  <AvatarFallback className="text-lg">
                    {userData.firstName[0]}
                    {userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button>
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <Button size="sm" variant="outline">
                    Remove Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input defaultValue={userData.firstName} id="firstName" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input defaultValue={userData.lastName} id="lastName" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input defaultValue={userData.email} id="email" type="email" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input defaultValue={userData.phone} id="phone" />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    defaultValue={userData.dateOfBirth}
                    id="dateOfBirth"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea defaultValue={userData.address} id="address" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  defaultValue={userData.bio}
                  id="bio"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Person to contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    defaultValue={userData.emergencyContact.name}
                    id="emergencyName"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    defaultValue={userData.emergencyContact.relationship}
                    id="emergencyRelationship"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  defaultValue={userData.emergencyContact.phone}
                  id="emergencyPhone"
                />
              </div>
              <Button>Update Emergency Contact</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="notifications">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Notifications</span>
              </CardTitle>
              <CardDescription>
                Choose what email notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.emailNotifications).map(
                ([key, value]) => (
                  <div className="flex items-center justify-between" key={key}>
                    <div>
                      <Label className="capitalize" htmlFor={`email-${key}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {key === 'announcements' &&
                          'Church announcements and updates'}
                        {key === 'events' && 'Upcoming events and activities'}
                        {key === 'prayerRequests' &&
                          'New prayer requests from the community'}
                        {key === 'givingReminders' &&
                          'Monthly giving statements and reminders'}
                        {key === 'smallGroups' &&
                          'Small group updates and activities'}
                        {key === 'newsletters' &&
                          'Weekly newsletters and devotionals'}
                      </p>
                    </div>
                    <Switch defaultChecked={value} id={`email-${key}`} />
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Push Notifications</span>
              </CardTitle>
              <CardDescription>
                Manage push notifications on your mobile device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.pushNotifications).map(
                ([key, value]) => (
                  <div className="flex items-center justify-between" key={key}>
                    <div>
                      <Label className="capitalize" htmlFor={`push-${key}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {key === 'announcements' &&
                          'Important church announcements'}
                        {key === 'events' && 'Event reminders and updates'}
                        {key === 'prayerRequests' && 'Urgent prayer requests'}
                        {key === 'messages' &&
                          'Direct messages from church leaders'}
                        {key === 'reminders' &&
                          'General reminders and notifications'}
                      </p>
                    </div>
                    <Switch defaultChecked={value} id={`push-${key}`} />
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>SMS Notifications</span>
              </CardTitle>
              <CardDescription>
                Receive important updates via text message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.smsNotifications).map(
                ([key, value]) => (
                  <div className="flex items-center justify-between" key={key}>
                    <div>
                      <Label className="capitalize" htmlFor={`sms-${key}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        {key === 'emergencyAlerts' &&
                          'Emergency alerts and urgent notifications'}
                        {key === 'eventReminders' &&
                          'Reminders for upcoming events'}
                        {key === 'givingReminders' &&
                          'Monthly giving reminders'}
                      </p>
                    </div>
                    <Switch defaultChecked={value} id={`sms-${key}`} />
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="privacy">
          {/* Profile Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <CardDescription>
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select defaultValue={privacySettings.profileVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public - Anyone can see
                    </SelectItem>
                    <SelectItem value="members">
                      Members Only - Church members can see
                    </SelectItem>
                    <SelectItem value="leaders">
                      Leaders Only - Church leaders can see
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Contact Information Visibility</h4>
                {[
                  {
                    key: 'showEmail',
                    label: 'Show Email Address',
                    value: privacySettings.showEmail,
                  },
                  {
                    key: 'showPhone',
                    label: 'Show Phone Number',
                    value: privacySettings.showPhone,
                  },
                  {
                    key: 'showAddress',
                    label: 'Show Address',
                    value: privacySettings.showAddress,
                  },
                ].map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.key}
                  >
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch defaultChecked={item.value} id={item.key} />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Communication & Directory</h4>
                {[
                  {
                    key: 'allowDirectMessages',
                    label: 'Allow Direct Messages',
                    value: privacySettings.allowDirectMessages,
                  },
                  {
                    key: 'showInDirectory',
                    label: 'Show in Member Directory',
                    value: privacySettings.showInDirectory,
                  },
                ].map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.key}
                  >
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch defaultChecked={item.value} id={item.key} />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Sharing</h4>
                {[
                  {
                    key: 'shareAttendanceData',
                    label: 'Share Attendance Data',
                    description:
                      'Allow church leaders to see your attendance patterns',
                    value: privacySettings.shareAttendanceData,
                  },
                  {
                    key: 'shareGivingData',
                    label: 'Share Giving Data',
                    description:
                      'Allow financial team to see your giving history',
                    value: privacySettings.shareGivingData,
                  },
                ].map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.key}
                  >
                    <div>
                      <Label htmlFor={item.key}>{item.label}</Label>
                      {item.description && (
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <Switch defaultChecked={item.value} id={item.key} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="security">
          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Keep your account secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-muted-foreground text-sm">
                    Last changed 3 months ago
                  </p>
                </div>
                <Dialog
                  onOpenChange={setIsChangePasswordOpen}
                  open={isChangePasswordOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            placeholder="Enter current password"
                            type={showCurrentPassword ? 'text' : 'password'}
                          />
                          <Button
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            placeholder="Enter new password"
                            type={showNewPassword ? 'text' : 'password'}
                          />
                          <Button
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          placeholder="Confirm new password"
                          type="password"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => setIsChangePasswordOpen(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => setIsChangePasswordOpen(false)}>
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-muted-foreground text-sm">
                    <Badge className="mr-2" variant="outline">
                      Disabled
                    </Badge>
                    Secure your account with 2FA
                  </p>
                </div>
                <Button>Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">iPhone 13 Pro</p>
                      <p className="text-muted-foreground text-sm">
                        Current session • New York, NY
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Current</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-muted-foreground text-sm">
                        2 hours ago • New York, NY
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="preferences">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue={appPreferences.theme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
                <Select defaultValue={appPreferences.dashboardLayout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Set your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue={appPreferences.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={appPreferences.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue={appPreferences.dateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={appPreferences.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-6" value="data">
          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download your personal data and activity history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Profile Data</p>
                    <p className="text-muted-foreground text-sm">
                      Personal information, contact details, and preferences
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Activity History</p>
                    <p className="text-muted-foreground text-sm">
                      Attendance records, event participation, and engagement
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Giving History</p>
                    <p className="text-muted-foreground text-sm">
                      Donation records and financial contributions
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Prayer Requests</p>
                    <p className="text-muted-foreground text-sm">
                      Your prayer requests and community interactions
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your stored data and cache
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Clear Cache</p>
                    <p className="text-muted-foreground text-sm">
                      Remove temporary files and cached data
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Clear Cache
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Reset Preferences</p>
                    <p className="text-muted-foreground text-sm">
                      Reset all settings to default values
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Preferences</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset all your preferences to default
                          values. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Reset Preferences</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Deletion */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start space-x-3">
                  <Trash2 className="mt-0.5 h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="mb-3 text-red-700 text-sm">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you absolutely sure you want to delete your
                            account? This will permanently remove all your data,
                            including:
                            <ul className="mt-2 list-inside list-disc space-y-1">
                              <li>Profile information and preferences</li>
                              <li>Attendance and participation history</li>
                              <li>Prayer requests and interactions</li>
                              <li>Giving history and financial records</li>
                              <li>Small group memberships and activities</li>
                            </ul>
                            <br />
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Yes, Delete My Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
