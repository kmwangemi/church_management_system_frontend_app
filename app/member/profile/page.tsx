'use client';

import {
  Award,
  Calendar,
  Camera,
  Clock,
  Edit,
  Heart,
  Mail,
  MapPin,
  Phone,
  Save,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/use-auth';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function MemberProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Member',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '1985-06-15',
    maritalStatus: 'Married',
    occupation: '',
    emergencyContact: '',
    bio: 'Passionate about serving God and the community.',
    interests: ['Bible Study', 'Youth Ministry', 'Music', 'Community Service'],
    skills: ['Teaching', 'Music', 'Technology', 'Leadership'],
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || prev.firstName,
        lastName:
          user.lastName ||
          user.name?.split(' ').slice(1).join(' ') ||
          prev.lastName,
        email: user.email || prev.email,
        phone: (user as any).phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  const membershipInfo = {
    memberSince: '2020-03-15',
    membershipStatus: 'Active',
    baptismDate: '2020-06-15',
    smallGroups: ['Young Adults', 'Bible Study Group'],
    ministries: ['Youth Ministry', 'Music Team'],
    roles: ['Small Group Leader', 'Worship Team Member'],
  };

  const spiritualGrowth = {
    bibleReadingStreak: 45,
    prayerPartner: 'Sarah Johnson',
    currentStudy: 'Book of Romans',
    mentoring: ['Mike Wilson', 'Lisa Chen'],
    achievements: [
      { title: 'Bible Study Graduate', date: '2023-12-10' },
      { title: 'Leadership Training', date: '2023-08-15' },
      { title: 'Volunteer of the Month', date: '2023-05-01' },
    ],
  };

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-x-6 md:space-y-0">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  alt="Profile"
                  src="/placeholder.svg?height=96&width=96"
                />
                <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                className="-bottom-2 -right-2 absolute h-8 w-8 rounded-full bg-transparent p-0"
                size="sm"
                variant="outline"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h1 className="font-bold text-2xl">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  variant={isEditing ? 'default' : 'outline'}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <Badge
                  className="bg-green-100 text-green-800"
                  variant="secondary"
                >
                  {membershipInfo.membershipStatus}
                </Badge>
                {membershipInfo.roles.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 text-muted-foreground text-sm md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Member since{' '}
                    {new Date(membershipInfo.memberSince).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs className="space-y-6" defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="spiritual">Spiritual Growth</TabsTrigger>
          <TabsTrigger value="involvement">Church Involvement</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    disabled={!isEditing}
                    id="firstName"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    value={profileData.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    disabled={!isEditing}
                    id="lastName"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    value={profileData.lastName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled={!isEditing}
                    id="email"
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    type="email"
                    value={profileData.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    disabled={!isEditing}
                    id="phone"
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    value={profileData.phone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    disabled={!isEditing}
                    id="dateOfBirth"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    type="date"
                    value={profileData.dateOfBirth}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, maritalStatus: value })
                    }
                    value={profileData.maritalStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  disabled={!isEditing}
                  id="address"
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  value={profileData.address}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  disabled={!isEditing}
                  id="occupation"
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      occupation: e.target.value,
                    })
                  }
                  value={profileData.occupation}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  disabled={!isEditing}
                  id="emergencyContact"
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      emergencyContact: e.target.value,
                    })
                  }
                  value={profileData.emergencyContact}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  disabled={!isEditing}
                  id="bio"
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  rows={4}
                  value={profileData.bio}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership Information */}
        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
              <CardDescription>
                Your church membership details and history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium text-muted-foreground text-sm">
                      Member Since
                    </Label>
                    <p className="font-semibold text-lg">
                      {new Date(
                        membershipInfo.memberSince
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium text-muted-foreground text-sm">
                      Baptism Date
                    </Label>
                    <p className="font-semibold text-lg">
                      {new Date(
                        membershipInfo.baptismDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium text-muted-foreground text-sm">
                      Membership Status
                    </Label>
                    <Badge className="mt-1 bg-green-100 text-green-800">
                      {membershipInfo.membershipStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block font-medium text-muted-foreground text-sm">
                      Small Groups
                    </Label>
                    <div className="space-y-2">
                      {membershipInfo.smallGroups.map((group) => (
                        <Badge className="mr-2" key={group} variant="outline">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block font-medium text-muted-foreground text-sm">
                      Ministries
                    </Label>
                    <div className="space-y-2">
                      {membershipInfo.ministries.map((ministry) => (
                        <Badge
                          className="mr-2"
                          key={ministry}
                          variant="outline"
                        >
                          {ministry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block font-medium text-muted-foreground text-sm">
                      Current Roles
                    </Label>
                    <div className="space-y-2">
                      {membershipInfo.roles.map((role) => (
                        <Badge className="mr-2" key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spiritual Growth */}
        <TabsContent value="spiritual">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Spiritual Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <p className="font-medium">Bible Reading Streak</p>
                    <p className="text-muted-foreground text-sm">Consecutive days</p>
                  </div>
                  <div className="font-bold text-2xl text-blue-600">
                    {spiritualGrowth.bibleReadingStreak}
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-sm">
                    Prayer Partner
                  </Label>
                  <p className="font-medium">{spiritualGrowth.prayerPartner}</p>
                </div>

                <div>
                  <Label className="font-medium text-muted-foreground text-sm">
                    Current Study
                  </Label>
                  <p className="font-medium">{spiritualGrowth.currentStudy}</p>
                </div>

                <div>
                  <Label className="mb-2 block font-medium text-muted-foreground text-sm">
                    Mentoring
                  </Label>
                  {spiritualGrowth.mentoring.map((person) => (
                    <Badge className="mr-2 mb-1" key={person} variant="outline">
                      {person}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {spiritualGrowth.achievements.map((achievement, index) => (
                  <div
                    className="flex items-center space-x-3 rounded-lg border p-3"
                    key={index}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Church Involvement */}
        <TabsContent value="involvement">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Small Groups & Ministries</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Active Small Groups</h4>
                  {membershipInfo.smallGroups.map((group) => (
                    <div
                      className="mb-2 flex items-center justify-between rounded-lg border p-3"
                      key={group}
                    >
                      <span>{group}</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-medium">Ministry Involvement</h4>
                  {membershipInfo.ministries.map((ministry) => (
                    <div
                      className="mb-2 flex items-center justify-between rounded-lg border p-3"
                      key={ministry}
                    >
                      <span>{ministry}</span>
                      <Badge variant="outline">Member</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Service Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-green-50 p-6 text-center">
                  <div className="mb-2 font-bold text-3xl text-green-600">
                    124
                  </div>
                  <p className="text-green-700 text-sm">
                    Total volunteer hours this year
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Youth Ministry</span>
                    <span className="font-medium">45 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Music Team</span>
                    <span className="font-medium">32 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Community Outreach</span>
                    <span className="font-medium">28 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Small Group Leadership</span>
                    <span className="font-medium">19 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
