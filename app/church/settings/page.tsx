'use client';

import { AddAdminForm } from '@/components/forms/add-admin-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  Database,
  Download,
  Edit,
  Globe,
  Key,
  Mail,
  MoreHorizontal,
  Plus,
  Save,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data
const users = [
  {
    id: 1,
    name: 'Pastor Michael Brown',
    email: 'pastor.mike@church.com',
    role: 'Super Admin',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'Active',
    lastLogin: '2024-01-07',
    permissions: ['All'],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@church.com',
    role: 'Admin',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'Active',
    lastLogin: '2024-01-06',
    permissions: ['Members', 'Events', 'Communication'],
  },
  {
    id: 3,
    name: 'David Wilson',
    email: 'david.w@church.com',
    role: 'Finance Manager',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'Active',
    lastLogin: '2024-01-05',
    permissions: ['Finance', 'Reports'],
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@church.com',
    role: 'Content Manager',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'Inactive',
    lastLogin: '2023-12-28',
    permissions: ['Content', 'Events'],
  },
];

const roles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access to all system features and settings',
    userCount: 1,
    permissions: ['All'],
  },
  {
    id: 2,
    name: 'Admin',
    description: 'Access to most features except system settings',
    userCount: 1,
    permissions: ['Members', 'Events', 'Communication', 'Content'],
  },
  {
    id: 3,
    name: 'Finance Manager',
    description: 'Access to financial features and reports',
    userCount: 1,
    permissions: ['Finance', 'Reports'],
  },
  {
    id: 4,
    name: 'Content Manager',
    description: 'Manage church content and events',
    userCount: 1,
    permissions: ['Content', 'Events'],
  },
];

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    churchName: 'Grace Community Church',
    address: '123 Church Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@gracechurch.com',
    website: 'www.gracechurch.com',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    maintenanceMode: false,
    publicRegistration: true,
    requireApproval: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      'Super Admin': 'bg-red-100 text-red-800',
      Admin: 'bg-blue-100 text-blue-800',
      'Finance Manager': 'bg-green-100 text-green-800',
      'Content Manager': 'bg-purple-100 text-purple-800',
    };
    return (
      <Badge
        className={
          colors[role as keyof typeof colors] || 'bg-muted text-foreground'
        }
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-muted text-foreground">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage system settings, users, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs onValueChange={setSelectedTab} value={selectedTab}>
            <div className="border-b">
              <TabsList className="grid h-auto w-full grid-cols-5 p-1">
                <TabsTrigger
                  className="flex items-center space-x-2 py-3"
                  value="general"
                >
                  <Settings className="h-4 w-4" />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center space-x-2 py-3"
                  value="admins"
                >
                  <Users className="h-4 w-4" />
                  <span>Admins</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center space-x-2 py-3"
                  value="roles"
                >
                  <Shield className="h-4 w-4" />
                  <span>Roles</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center space-x-2 py-3"
                  value="notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center space-x-2 py-3"
                  value="system"
                >
                  <Database className="h-4 w-4" />
                  <span>System</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent className="space-y-6 p-6" value="general">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Church Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="churchName">Church Name</Label>
                      <Input
                        id="churchName"
                        onChange={(e) =>
                          handleSettingChange('churchName', e.target.value)
                        }
                        value={settings.churchName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        onChange={(e) =>
                          handleSettingChange('address', e.target.value)
                        }
                        rows={3}
                        value={settings.address}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        onChange={(e) =>
                          handleSettingChange('phone', e.target.value)
                        }
                        value={settings.phone}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        onChange={(e) =>
                          handleSettingChange('email', e.target.value)
                        }
                        type="email"
                        value={settings.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        onChange={(e) =>
                          handleSettingChange('website', e.target.value)
                        }
                        value={settings.website}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange('timezone', value)
                        }
                        value={settings.timezone}
                      >
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
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange('currency', value)
                        }
                        value={settings.currency}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="CAD">
                            Canadian Dollar (CAD)
                          </SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">
                            British Pound (GBP)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSettingChange('dateFormat', value)
                        }
                        value={settings.dateFormat}
                      >
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
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Church Logo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        alt="Church Logo"
                        src="/placeholder.svg?height=80&width=80"
                      />
                      <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                        GCC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Logo
                      </Button>
                      <p className="mt-2 text-muted-foreground text-sm">
                        Recommended size: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="p-6" value="admins">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Admin Management</h3>
                  <p className="text-muted-foreground">
                    Manage system admins and their access
                  </p>
                </div>
                <Dialog
                  onOpenChange={setIsAddAdminDialogOpen}
                  open={isAddAdminDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                      <DialogDescription>
                        Create a new admin account with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <AddAdminForm
                      onCloseDialog={() => setIsAddAdminDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow className="hover:bg-accent" key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                alt={user.name}
                                src={user.avatar || '/placeholder.svg'}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {user.name}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions
                              .slice(0, 2)
                              .map((permission, index) => (
                                <Badge
                                  className="text-xs"
                                  key={index}
                                  variant="secondary"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            {user.permissions.length > 2 && (
                              <Badge className="text-xs" variant="secondary">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="h-8 w-8 p-0" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent className="p-6" value="roles">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Role Management</h3>
                  <p className="text-muted-foreground">
                    Define roles and permissions for different user types
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {roles.map((role) => (
                  <Card
                    className="transition-shadow hover:shadow-lg"
                    key={role.id}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <Badge variant="outline">{role.userCount} users</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        {role.description}
                      </p>
                      <div>
                        <p className="mb-2 font-medium text-muted-foreground text-sm">
                          Permissions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission, index) => (
                            <Badge
                              className="text-xs"
                              key={index}
                              variant="secondary"
                            >
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          className="flex-1 bg-transparent"
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          className="flex-1 bg-transparent"
                          size="sm"
                          variant="outline"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent className="space-y-6 p-6" value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Enable Email Notifications
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange('emailNotifications', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="SMTP Server" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input placeholder="SMTP Username" />
                    <Input placeholder="SMTP Password" type="password" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SMS Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Enable SMS Notifications
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Send SMS notifications for urgent alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange('smsNotifications', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="SMS Provider API Key" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Web Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Browser Push Notifications
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Send push notifications to web browsers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Push Service Configuration" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="space-y-6 p-6" value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-muted-foreground text-sm">
                        Enable maintenance mode to prevent user access
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange('maintenanceMode', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Automatic Backups</Label>
                      <p className="text-muted-foreground text-sm">
                        Automatically backup data daily
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) =>
                        handleSettingChange('autoBackup', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Registration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Registration</Label>
                      <p className="text-muted-foreground text-sm">
                        Allow public user registration
                      </p>
                    </div>
                    <Switch
                      checked={settings.publicRegistration}
                      onCheckedChange={(checked) =>
                        handleSettingChange('publicRegistration', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Require Admin Approval
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        New registrations require admin approval
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireApproval}
                      onCheckedChange={(checked) =>
                        handleSettingChange('requireApproval', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    <p>Last backup: January 7, 2024 at 3:00 AM</p>
                    <p>Database size: 245.7 MB</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
