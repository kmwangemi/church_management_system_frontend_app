'use client';

import { AddAdminForm } from '@/components/forms/add-admin-form';
import { uploadFile } from '@/components/upload-helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useFetchBranches } from '@/lib/hooks/church/branch/use-branch-queries';
import {
  type ChurchAdminUser,
  type ChurchPermissionItem,
  type ChurchRoleItem,
  useAssignChurchRole,
  useBackupChurchData,
  useCreateChurchRole,
  useDeleteChurchRole,
  useFetchChurchAdmins,
  useFetchChurchPermissions,
  useFetchChurchRoles,
  useFetchChurchSettings,
  useRemoveChurchAdmin,
  useResetChurchAdminPassword,
  useUpdateChurchAdmin,
  useUpdateChurchRole,
  useUpdateChurchSettings,
} from '@/lib/hooks/church/settings/use-settings-queries';
import { useFetchUsers } from '@/lib/hooks/church/user/use-user-queries';
import { ADMIN_ACCESS_LEVEL_OPTIONS } from '@/lib/utils';
import {
  Bell,
  Check,
  Copy,
  Database,
  Download,
  Edit,
  Globe,
  Key,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tabParam = new URLSearchParams(window.location.search).get('tab');
      if (
        tabParam &&
        ['general', 'users', 'notifications', 'integrations', 'security', 'backup'].includes(
          tabParam
        )
      ) {
        setSelectedTab(tabParam);
      }
    }
  }, []);

  // Queries & Mutations
  const { data: remoteSettings, isLoading: isLoadingSettings } =
    useFetchChurchSettings();
  const updateSettingsMutation = useUpdateChurchSettings();
  const backupDataMutation = useBackupChurchData();

  const { data: adminsData, isLoading: isLoadingAdmins } =
    useFetchChurchAdmins(adminSearch);
  const updateAdminMutation = useUpdateChurchAdmin();
  const resetPasswordMutation = useResetChurchAdminPassword();
  const removeAdminMutation = useRemoveChurchAdmin();

  const { data: rolesData, isLoading: isLoadingRoles } = useFetchChurchRoles();
  const { data: permissionsData } = useFetchChurchPermissions();
  const createRoleMutation = useCreateChurchRole();
  const updateRoleMutation = useUpdateChurchRole();
  const deleteRoleMutation = useDeleteChurchRole();
  const assignRoleMutation = useAssignChurchRole();

  const { data: branchesData } = useFetchBranches(1, '');
  const { data: allMembersData } = useFetchUsers(1, '');

  const branches = useMemo(
    () =>
      (branchesData as any)?.branches || (branchesData as any)?.data || [],
    [branchesData]
  );
  const allMembers = useMemo(
    () =>
      (allMembersData as any)?.users ||
      (allMembersData as any)?.members ||
      [],
    [allMembersData]
  );

  const admins = adminsData?.admins || [];
  const roles = rolesData?.roles || [];
  const allPermissions = permissionsData?.permissions || [];

  // Local settings state synced from backend
  const [settings, setSettings] = useState({
    churchName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    dateFormat: 'DD/MM/YYYY',
    emailNotifications: true,
    smsNotifications: true,
    autoBackup: true,
    maintenanceMode: false,
    publicRegistration: true,
    requireApproval: true,
  });

  useEffect(() => {
    if (remoteSettings) {
      setSettings({
        churchName: remoteSettings.churchName || '',
        address: remoteSettings.address || '',
        phone: remoteSettings.phone || '',
        email: remoteSettings.email || '',
        website: remoteSettings.website || '',
        logo: remoteSettings.logo || '',
        timezone: remoteSettings.timezone || 'Africa/Nairobi',
        currency: remoteSettings.currency || 'KES',
        dateFormat: remoteSettings.dateFormat || 'DD/MM/YYYY',
        emailNotifications: remoteSettings.emailNotifications ?? true,
        smsNotifications: remoteSettings.smsNotifications ?? true,
        autoBackup: remoteSettings.autoBackup ?? true,
        maintenanceMode: remoteSettings.maintenanceMode ?? false,
        publicRegistration: remoteSettings.publicRegistration ?? true,
        requireApproval: remoteSettings.requireApproval ?? true,
      });
    }
  }, [remoteSettings]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    await updateSettingsMutation.mutateAsync(settings);
  };

  const handleBackupData = async () => {
    await backupDataMutation.mutateAsync();
  };

  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadFile(file, 'logo');
      const uploadedUrl = res.data?.secure_url || res.data?.url || '';
      if (uploadedUrl) {
        setSettings((prev) => ({ ...prev, logo: uploadedUrl }));
        await updateSettingsMutation.mutateAsync({
          ...settings,
          logo: uploadedUrl,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  // --- Admin Action Dialog States ---
  const [editingAdmin, setEditingAdmin] = useState<ChurchAdminUser | null>(
    null
  );
  const [editAdminForm, setEditAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'ADMIN',
    branchId: '',
    accessLevel: 'BRANCH',
    status: 'ACTIVE',
  });

  const openEditAdminDialog = (admin: ChurchAdminUser) => {
    setEditingAdmin(admin);
    setEditAdminForm({
      firstName: admin.firstName || admin.name.split(' ')[0] || '',
      lastName:
        admin.lastName || admin.name.split(' ').slice(1).join(' ') || '',
      email: admin.email || '',
      phoneNumber: admin.phoneNumber || '',
      role: admin.role || 'ADMIN',
      branchId: admin.branchId || '',
      accessLevel: admin.accessLevel || 'BRANCH',
      status: admin.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    });
  };

  const handleSaveEditAdmin = async () => {
    if (!editingAdmin) return;
    await updateAdminMutation.mutateAsync({
      memberId: editingAdmin.id,
      payload: editAdminForm,
    });
    setEditingAdmin(null);
  };

  // Reset Password Dialog State
  const [resetPasswordAdmin, setResetPasswordAdmin] =
    useState<ChurchAdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);

  const generateRandomPassword = () => {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setCopiedPassword(false);
  };

  const openResetPasswordDialog = (admin: ChurchAdminUser) => {
    setResetPasswordAdmin(admin);
    setNewPassword('User@123');
    setCopiedPassword(false);
  };

  const handleCopyPassword = async () => {
    if (!newPassword) return;
    await navigator.clipboard.writeText(newPassword);
    setCopiedPassword(true);
    toast.success('Password copied to clipboard');
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleConfirmResetPassword = async () => {
    if (!resetPasswordAdmin) return;
    await resetPasswordMutation.mutateAsync({
      memberId: resetPasswordAdmin.id,
      password: newPassword,
    });
    setResetPasswordAdmin(null);
  };

  // Delete / Demote Admin Dialog State
  const [deletingAdmin, setDeletingAdmin] = useState<ChurchAdminUser | null>(
    null
  );
  const [deleteMode, setDeleteMode] = useState<'demote' | 'remove'>('demote');

  const openDeleteAdminDialog = (admin: ChurchAdminUser) => {
    setDeletingAdmin(admin);
    setDeleteMode('demote');
  };

  const handleConfirmDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    await removeAdminMutation.mutateAsync({
      memberId: deletingAdmin.id,
      mode: deleteMode,
    });
    setDeletingAdmin(null);
  };

  // --- Role Action Dialog States ---
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ChurchRoleItem | null>(null);
  const [roleForm, setRoleForm] = useState<{
    name: string;
    description: string;
    permissionCodes: string[];
  }>({
    name: '',
    description: '',
    permissionCodes: [],
  });

  const openCreateRoleDialog = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      description: '',
      permissionCodes: ['member.read', 'branch.read'],
    });
    setIsRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: ChurchRoleItem) => {
    setEditingRole(role);
    setRoleForm({
      name: role.displayName || role.name,
      description: role.description || '',
      permissionCodes: role.isLocked
        ? allPermissions.map((p) => p.code)
        : [...(role.permissionCodes || [])],
    });
    setIsRoleDialogOpen(true);
  };

  const toggleRolePermission = (code: string) => {
    if (editingRole?.isLocked) return;
    setRoleForm((prev) => ({
      ...prev,
      permissionCodes: prev.permissionCodes.includes(code)
        ? prev.permissionCodes.filter((c) => c !== code)
        : [...prev.permissionCodes, code],
    }));
  };

  const handleSaveRole = async () => {
    if (!roleForm.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    if (editingRole) {
      await updateRoleMutation.mutateAsync({
        roleId: editingRole.id,
        payload: {
          name: roleForm.name,
          description: roleForm.description,
          permissionCodes: roleForm.permissionCodes,
        },
      });
    } else {
      await createRoleMutation.mutateAsync({
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissionCodes,
      });
    }
    setIsRoleDialogOpen(false);
  };

  const handleDeleteOrResetRole = async (role: ChurchRoleItem) => {
    await deleteRoleMutation.mutateAsync(role.id);
    setIsRoleDialogOpen(false);
  };

  // Assign Role Dialog State
  const [assigningRole, setAssigningRole] = useState<ChurchRoleItem | null>(
    null
  );
  const [selectedMemberIdsForRole, setSelectedMemberIdsForRole] = useState<
    string[]
  >([]);
  const [assignMemberSearch, setAssignMemberSearch] = useState('');

  const openAssignRoleDialog = (role: ChurchRoleItem) => {
    setAssigningRole(role);
    setSelectedMemberIdsForRole(
      (role.assignedMembers || []).map((m) => m.id)
    );
    setAssignMemberSearch('');
  };

  const toggleMemberForRole = (memberId: string) => {
    setSelectedMemberIdsForRole((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSaveRoleAssignments = async () => {
    if (!assigningRole) return;
    await assignRoleMutation.mutateAsync({
      roleId: assigningRole.id,
      memberIds: selectedMemberIdsForRole,
      mode: 'set',
    });
    setAssigningRole(null);
  };

  const permissionsByCategory = useMemo(() => {
    const grouped: Record<string, ChurchPermissionItem[]> = {};
    for (const p of allPermissions) {
      const cat = p.category || 'General';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    }
    return grouped;
  }, [allPermissions]);

  const filteredAssignableMembers = useMemo(() => {
    const q = assignMemberSearch.trim().toLowerCase();
    return allMembers.filter((m: any) => {
      const fullName =
        m.name ||
        `${m.firstName || ''} ${m.lastName || ''}`.trim() ||
        m.user?.name ||
        '';
      const email = m.email || m.user?.email || '';
      if (!q) return true;
      return (
        fullName.toLowerCase().includes(q) || email.toLowerCase().includes(q)
      );
    });
  }, [allMembers, assignMemberSearch]);

  const getRoleBadge = (role: string, label?: string) => {
    const upper = (role || '').toUpperCase();
    const colors: Record<string, string> = {
      OWNER: 'bg-red-100 text-red-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      PASTOR: 'bg-purple-100 text-purple-800',
      BISHOP: 'bg-indigo-100 text-indigo-800',
      TREASURER: 'bg-green-100 text-green-800',
      STAFF: 'bg-amber-100 text-amber-800',
    };
    return (
      <Badge className={colors[upper] || 'bg-muted text-foreground'}>
        {label || role}
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

  const churchInitials = useMemo(() => {
    if (!settings.churchName) return 'CH';
    return settings.churchName
      .split(' ')
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0]?.toUpperCase())
      .join('');
  }, [settings.churchName]);

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
          <Button
            disabled={backupDataMutation.isPending}
            onClick={handleBackupData}
            size="sm"
            variant="outline"
          >
            {backupDataMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Backup Data
          </Button>
          <Button
            disabled={updateSettingsMutation.isPending || isLoadingSettings}
            onClick={handleSaveSettings}
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
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

            {/* ==================== GENERAL TAB ==================== */}
            <TabsContent className="space-y-6 p-6" value="general">
              {isLoadingSettings ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
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
                            placeholder="Enter church name"
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
                            placeholder="Enter physical address"
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
                            placeholder="+254 700 000000"
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
                            placeholder="info@church.org"
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
                            placeholder="https://www.church.org"
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
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Africa/Nairobi">
                                East Africa Time (Africa/Nairobi)
                              </SelectItem>
                              <SelectItem value="Africa/Lagos">
                                West Africa Time (Africa/Lagos)
                              </SelectItem>
                              <SelectItem value="Africa/Johannesburg">
                                South Africa Time (Africa/Johannesburg)
                              </SelectItem>
                              <SelectItem value="Europe/London">
                                London (GMT/BST)
                              </SelectItem>
                              <SelectItem value="America/New_York">
                                Eastern Time (US & Canada)
                              </SelectItem>
                              <SelectItem value="America/Chicago">
                                Central Time (US & Canada)
                              </SelectItem>
                              <SelectItem value="America/Denver">
                                Mountain Time (US & Canada)
                              </SelectItem>
                              <SelectItem value="America/Los_Angeles">
                                Pacific Time (US & Canada)
                              </SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
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
                            <SelectTrigger id="currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KES">
                                Kenyan Shilling (KES)
                              </SelectItem>
                              <SelectItem value="USD">
                                US Dollar (USD)
                              </SelectItem>
                              <SelectItem value="UGX">
                                Ugandan Shilling (UGX)
                              </SelectItem>
                              <SelectItem value="TZS">
                                Tanzanian Shilling (TZS)
                              </SelectItem>
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
                            <SelectTrigger id="dateFormat">
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">
                                DD/MM/YYYY
                              </SelectItem>
                              <SelectItem value="MM/DD/YYYY">
                                MM/DD/YYYY
                              </SelectItem>
                              <SelectItem value="YYYY-MM-DD">
                                YYYY-MM-DD
                              </SelectItem>
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
                            alt={settings.churchName || 'Church Logo'}
                            src={settings.logo || undefined}
                          />
                          <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                            {churchInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            className="hidden"
                            onChange={handleLogoFileChange}
                            ref={logoInputRef}
                            type="file"
                          />
                          <Button
                            disabled={isUploadingLogo}
                            onClick={() => logoInputRef.current?.click()}
                            type="button"
                            variant="outline"
                          >
                            {isUploadingLogo ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            {isUploadingLogo
                              ? 'Uploading...'
                              : 'Upload New Logo'}
                          </Button>
                          <p className="mt-2 text-muted-foreground text-sm">
                            Recommended size: 200x200px, PNG, JPG, GIF or WEBP
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* ==================== ADMINS TAB ==================== */}
            <TabsContent className="p-6" value="admins">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-lg">Admin Management</h3>
                  <p className="text-muted-foreground">
                    Manage system admins and their access
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Search admins..."
                      value={adminSearch}
                    />
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
                        scope="church"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
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
                    {isLoadingAdmins ? (
                      <TableRow>
                        <TableCell className="py-10 text-center" colSpan={6}>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : admins.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="py-10 text-center text-muted-foreground"
                          colSpan={6}
                        >
                          No administrators found. Click &ldquo;Add Admin&rdquo;
                          to add one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      admins.map((user) => (
                        <TableRow className="hover:bg-accent" key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  alt={user.name}
                                  src={user.avatar || undefined}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {user.name
                                    .split(' ')
                                    .filter(Boolean)
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-foreground">
                                  {user.name}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {user.email || 'No email'}
                                  {user.branchName
                                    ? ` • ${user.branchName}`
                                    : ''}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(user.role, user.roleLabel)}
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <span className="text-muted-foreground text-sm">
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : 'Never'}
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
                                <Button
                                  className="h-8 w-8 p-0"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => openEditAdminDialog(user)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openResetPasswordDialog(user)}
                                >
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteAdminDialog(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ==================== ROLES TAB ==================== */}
            <TabsContent className="p-6" value="roles">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Role Management</h3>
                  <p className="text-muted-foreground">
                    Define roles and permissions for different user types
                  </p>
                </div>
                <Button onClick={openCreateRoleDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </div>

              {isLoadingRoles ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {roles.map((role) => (
                    <Card
                      className="transition-shadow hover:shadow-lg"
                      key={role.id}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {role.displayName || role.name}
                            </CardTitle>
                            {!role.isBuiltIn && (
                              <Badge variant="secondary">Custom</Badge>
                            )}
                            {role.isCustomized && (
                              <Badge variant="secondary">Customized</Badge>
                            )}
                          </div>
                          <Badge variant="outline">
                            {role.userCount}{' '}
                            {role.userCount === 1 ? 'user' : 'users'}
                          </Badge>
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
                            {role.permissions.length === 0 ? (
                              <Badge className="text-xs" variant="outline">
                                Basic Member Access
                              </Badge>
                            ) : (
                              role.permissions
                                .slice(0, 6)
                                .map((permission, index) => (
                                  <Badge
                                    className="text-xs"
                                    key={index}
                                    variant="secondary"
                                  >
                                    {permission}
                                  </Badge>
                                ))
                            )}
                            {role.permissions.length > 6 && (
                              <Badge className="text-xs" variant="secondary">
                                +{role.permissions.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            className="flex-1 bg-transparent"
                            onClick={() => openEditRoleDialog(role)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            className="flex-1 bg-transparent"
                            onClick={() => openAssignRoleDialog(role)}
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
              )}
            </TabsContent>

            {/* ==================== NOTIFICATIONS TAB ==================== */}
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

            {/* ==================== SYSTEM TAB ==================== */}
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
                    <Button
                      disabled={backupDataMutation.isPending}
                      onClick={handleBackupData}
                      variant="outline"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                    <Button
                      disabled={backupDataMutation.isPending}
                      onClick={handleBackupData}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    <p>
                      Last backup:{' '}
                      {remoteSettings?.lastBackupAt
                        ? new Date(remoteSettings.lastBackupAt).toLocaleString()
                        : 'No backup recorded yet'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ==================== EDIT ADMIN DIALOG ==================== */}
      <Dialog
        onOpenChange={(open) => !open && setEditingAdmin(null)}
        open={!!editingAdmin}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update administrator details, role, branch, and status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  onChange={(e) =>
                    setEditAdminForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  value={editAdminForm.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  onChange={(e) =>
                    setEditAdminForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  value={editAdminForm.lastName}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  onChange={(e) =>
                    setEditAdminForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  type="email"
                  value={editAdminForm.email}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  onChange={(e) =>
                    setEditAdminForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  value={editAdminForm.phoneNumber}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  onValueChange={(value) =>
                    setEditAdminForm((prev) => ({ ...prev, role: value }))
                  }
                  value={editAdminForm.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter(
                        (r) =>
                          !['MEMBER', 'VISITOR'].includes(r.name.toUpperCase())
                      )
                      .map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.displayName || r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select
                  onValueChange={(value) =>
                    setEditAdminForm((prev) => ({
                      ...prev,
                      accessLevel: value,
                    }))
                  }
                  value={editAdminForm.accessLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_ACCESS_LEVEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  onValueChange={(value) =>
                    setEditAdminForm((prev) => ({ ...prev, branchId: value }))
                  }
                  value={editAdminForm.branchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b: any) => (
                      <SelectItem key={b.id || b._id} value={b.id || b._id}>
                        {b.name || b.branchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(value) =>
                    setEditAdminForm((prev) => ({ ...prev, status: value }))
                  }
                  value={editAdminForm.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setEditingAdmin(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={updateAdminMutation.isPending}
              onClick={handleSaveEditAdmin}
              type="button"
            >
              {updateAdminMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== RESET PASSWORD DIALOG ==================== */}
      <Dialog
        onOpenChange={(open) => !open && setResetPasswordAdmin(null)}
        open={!!resetPasswordAdmin}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Administrator Password</DialogTitle>
            <DialogDescription>
              Set or auto-generate a new password for{' '}
              <span className="font-semibold text-foreground">
                {resetPasswordAdmin?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reset-password-input">New Password</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="reset-password-input"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  type="text"
                  value={newPassword}
                />
                <Button
                  onClick={generateRandomPassword}
                  size="icon"
                  title="Auto-generate password"
                  type="button"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCopyPassword}
                  size="icon"
                  title="Copy password"
                  type="button"
                  variant="outline"
                >
                  {copiedPassword ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Copy this password and share it securely with the user.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setResetPasswordAdmin(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={
                resetPasswordMutation.isPending || newPassword.trim().length < 6
              }
              onClick={handleConfirmResetPassword}
              type="button"
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE / DEMOTE ADMIN DIALOG ==================== */}
      <Dialog
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
        open={!!deletingAdmin}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Administrator Access</DialogTitle>
            <DialogDescription>
              Choose how you want to handle{' '}
              <span className="font-semibold text-foreground">
                {deletingAdmin?.name}
              </span>
              :
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div
              className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                deleteMode === 'demote'
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-accent'
              }`}
              onClick={() => setDeleteMode('demote')}
            >
              <div className="font-medium text-sm">
                Demote to Regular Member (Recommended)
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Revokes their administrative/leadership roles while keeping
                their church member profile and history intact.
              </p>
            </div>
            <div
              className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                deleteMode === 'remove'
                  ? 'border-red-600 bg-red-50/50'
                  : 'hover:bg-accent'
              }`}
              onClick={() => setDeleteMode('remove')}
            >
              <div className="font-medium text-red-600 text-sm">
                Remove from Church Entirely
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Removes their administrative roles and soft-deletes their member
                record from this church.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setDeletingAdmin(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={removeAdminMutation.isPending}
              onClick={handleConfirmDeleteAdmin}
              type="button"
              variant="destructive"
            >
              {removeAdminMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deleteMode === 'demote'
                ? 'Demote to Member'
                : 'Remove from Church'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== CREATE / EDIT ROLE DIALOG ==================== */}
      <Dialog onOpenChange={setIsRoleDialogOpen} open={isRoleDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole
                ? `Edit Role: ${editingRole.displayName || editingRole.name}`
                : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {editingRole?.isLocked
                ? 'Owner and Administrator roles retain full system permissions.'
                : 'Configure the role description and assign granular permissions for your church.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                disabled={!!editingRole?.isBuiltIn}
                id="role-name"
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Finance Manager, Media Lead"
                value={roleForm.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                onChange={(e) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what users with this role can do"
                rows={2}
                value={roleForm.description}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                {!editingRole?.isLocked && (
                  <div className="space-x-2">
                    <Button
                      onClick={() =>
                        setRoleForm((prev) => ({
                          ...prev,
                          permissionCodes: allPermissions.map((p) => p.code),
                        }))
                      }
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={() =>
                        setRoleForm((prev) => ({
                          ...prev,
                          permissionCodes: [],
                        }))
                      }
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
              <div className="max-h-72 space-y-4 overflow-y-auto rounded-md border p-4">
                {Object.entries(permissionsByCategory).map(
                  ([category, perms]) => (
                    <div className="space-y-2" key={category}>
                      <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {perms.map((perm) => {
                          const checked =
                            editingRole?.isLocked ||
                            roleForm.permissionCodes.includes(perm.code);
                          return (
                            <label
                              className="flex cursor-pointer items-start space-x-2 rounded p-1.5 hover:bg-accent"
                              key={perm.code}
                            >
                              <Checkbox
                                checked={checked}
                                disabled={!!editingRole?.isLocked}
                                onCheckedChange={() =>
                                  toggleRolePermission(perm.code)
                                }
                              />
                              <div className="text-sm leading-tight">
                                <div className="font-medium">{perm.label}</div>
                                <div className="text-muted-foreground text-xs">
                                  {perm.code}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <div>
              {editingRole &&
                (!editingRole.isBuiltIn || editingRole.isCustomized) && (
                  <Button
                    disabled={deleteRoleMutation.isPending}
                    onClick={() => handleDeleteOrResetRole(editingRole)}
                    type="button"
                    variant="destructive"
                  >
                    {deleteRoleMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingRole.isBuiltIn
                      ? 'Reset to Default'
                      : 'Delete Custom Role'}
                  </Button>
                )}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsRoleDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  createRoleMutation.isPending || updateRoleMutation.isPending
                }
                onClick={handleSaveRole}
                type="button"
              >
                {(createRoleMutation.isPending ||
                  updateRoleMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingRole ? 'Save Changes' : 'Create Role'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== ASSIGN ROLE DIALOG ==================== */}
      <Dialog
        onOpenChange={(open) => !open && setAssigningRole(null)}
        open={!!assigningRole}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assign Role: {assigningRole?.displayName || assigningRole?.name}
            </DialogTitle>
            <DialogDescription>
              Select the church members who should hold the{' '}
              <span className="font-semibold text-foreground">
                {assigningRole?.displayName || assigningRole?.name}
              </span>{' '}
              role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setAssignMemberSearch(e.target.value)}
                placeholder="Search church members by name or email..."
                value={assignMemberSearch}
              />
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>{selectedMemberIdsForRole.length} member(s) selected</span>
            </div>
            <div className="max-h-72 divide-y overflow-y-auto rounded-md border">
              {filteredAssignableMembers.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No matching members found.
                </div>
              ) : (
                filteredAssignableMembers.map((m: any) => {
                  const mid = m.id || m._id;
                  const fullName =
                    m.name ||
                    `${m.firstName || ''} ${m.lastName || ''}`.trim() ||
                    m.user?.name ||
                    'Unnamed Member';
                  const email = m.email || m.user?.email || '';
                  const isChecked = selectedMemberIdsForRole.includes(mid);
                  return (
                    <label
                      className="flex cursor-pointer items-center justify-between p-3 hover:bg-accent"
                      key={mid}
                    >
                      <div>
                        <div className="font-medium text-sm">{fullName}</div>
                        {email && (
                          <div className="text-muted-foreground text-xs">
                            {email}
                          </div>
                        )}
                      </div>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleMemberForRole(mid)}
                      />
                    </label>
                  );
                })
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setAssigningRole(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={assignRoleMutation.isPending}
              onClick={handleSaveRoleAssignments}
              type="button"
            >
              {assignRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
