'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  CreditCard,
  Database,
  Globe,
  Mail,
  RefreshCw,
  Save,
  Server,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

export default function GlobalSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // biome-ignore lint/suspicious/useAwait: ignore asynchronous operation
  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setIsLoading(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 2000);
  };

  const systemSettings = {
    siteName: 'ChurchHub Global',
    siteUrl: 'https://ChurchHub.com',
    adminEmail: 'admin@ChurchHub.com',
    timezone: 'America/New_York',
    language: 'en',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxChurchesPerUser: 5,
    sessionTimeout: 30,
    backupFrequency: 'daily',
  };

  const securitySettings = {
    twoFactorRequired: true,
    passwordMinLength: 8,
    passwordComplexity: true,
    loginAttempts: 5,
    lockoutDuration: 15,
    sessionSecurity: 'high',
    ipWhitelisting: false,
    auditLogging: true,
  };

  const emailSettings = {
    smtpHost: 'smtp.ChurchHub.com',
    smtpPort: 587,
    smtpUsername: 'noreply@ChurchHub.com',
    smtpSecurity: 'tls',
    fromName: 'ChurchHub System',
    fromEmail: 'noreply@ChurchHub.com',
    replyToEmail: 'support@ChurchHub.com',
  };

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 29,
      features: ['Up to 100 members', 'Basic reporting', 'Email support'],
      active: true,
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 59,
      features: [
        'Up to 500 members',
        'Advanced reporting',
        'Priority support',
        'Multiple branches',
      ],
      active: true,
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 99,
      features: [
        'Unlimited members',
        'Custom reporting',
        '24/7 support',
        'API access',
        'White-label',
      ],
      active: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Global Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {saveStatus === 'saved' && (
            <Alert className="w-auto border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Settings saved successfully
              </AlertDescription>
            </Alert>
          )}
          <Button disabled={isLoading} onClick={handleSave}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs className="space-y-6" defaultValue="general">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent className="space-y-6" value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Basic system settings and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    defaultValue={systemSettings.siteName}
                    id="siteName"
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    defaultValue={systemSettings.siteUrl}
                    id="siteUrl"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    defaultValue={systemSettings.adminEmail}
                    id="adminEmail"
                    placeholder="admin@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={systemSettings.timezone}>
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
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue={systemSettings.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxChurches">Max Churches per User</Label>
                  <Input
                    defaultValue={systemSettings.maxChurchesPerUser}
                    id="maxChurches"
                    max="10"
                    min="1"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-muted-foreground text-sm">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Switch defaultChecked={systemSettings.maintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registration Enabled</Label>
                    <p className="text-muted-foreground text-sm">
                      Allow new church registrations
                    </p>
                  </div>
                  <Switch defaultChecked={systemSettings.registrationEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification Required</Label>
                    <p className="text-muted-foreground text-sm">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    defaultChecked={systemSettings.emailVerificationRequired}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent className="space-y-6" value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">
                    Minimum Password Length
                  </Label>
                  <Input
                    defaultValue={securitySettings.passwordMinLength}
                    id="passwordLength"
                    max="20"
                    min="6"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    defaultValue={securitySettings.loginAttempts}
                    id="loginAttempts"
                    max="10"
                    min="3"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">
                    Lockout Duration (minutes)
                  </Label>
                  <Input
                    defaultValue={securitySettings.lockoutDuration}
                    id="lockoutDuration"
                    max="60"
                    min="5"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    defaultValue={systemSettings.sessionTimeout}
                    id="sessionTimeout"
                    max="120"
                    min="15"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication Required</Label>
                    <p className="text-muted-foreground text-sm">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked={securitySettings.twoFactorRequired} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-muted-foreground text-sm">
                      Require uppercase, lowercase, numbers, and symbols
                    </p>
                  </div>
                  <Switch
                    defaultChecked={securitySettings.passwordComplexity}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelisting</Label>
                    <p className="text-muted-foreground text-sm">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch defaultChecked={securitySettings.ipWhitelisting} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-muted-foreground text-sm">
                      Log all administrative actions
                    </p>
                  </div>
                  <Switch defaultChecked={securitySettings.auditLogging} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent className="space-y-6" value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    defaultValue={emailSettings.smtpHost}
                    id="smtpHost"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    defaultValue={emailSettings.smtpPort}
                    id="smtpPort"
                    placeholder="587"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    defaultValue={emailSettings.smtpUsername}
                    id="smtpUsername"
                    placeholder="username@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpSecurity">Security</Label>
                  <Select defaultValue={emailSettings.smtpSecurity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    defaultValue={emailSettings.fromName}
                    id="fromName"
                    placeholder="Your Organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    defaultValue={emailSettings.fromEmail}
                    id="fromEmail"
                    placeholder="noreply@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input
                  defaultValue={emailSettings.replyToEmail}
                  id="replyToEmail"
                  placeholder="support@example.com"
                  type="email"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent className="space-y-6" value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription Plans
              </CardTitle>
              <CardDescription>
                Manage subscription plans and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={plan.id}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{plan.name}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          ${plan.price}/month
                        </Badge>
                        {plan.active && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                      </div>
                      <ul className="mt-2 text-muted-foreground text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Switch defaultChecked={plan.active} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent className="space-y-6" value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-muted-foreground text-sm">
                      Send alerts for system issues and maintenance
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Church Registrations</Label>
                    <p className="text-muted-foreground text-sm">
                      Notify when new churches register
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Send notifications for payment events
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-muted-foreground text-sm">
                      Send weekly system usage reports
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  defaultValue="admin@ChurchHub.com"
                  id="notificationEmail"
                  placeholder="notifications@example.com"
                  type="email"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent className="space-y-6" value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>
                Advanced system settings and database configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Warning: These settings can affect system performance. Only
                  modify if you understand the implications.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select defaultValue={systemSettings.backupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  className="min-h-[100px]"
                  id="customCss"
                  placeholder="/* Add custom CSS here */"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customJs">Custom JavaScript</Label>
                <Textarea
                  className="min-h-[100px]"
                  id="customJs"
                  placeholder="// Add custom JavaScript here"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
