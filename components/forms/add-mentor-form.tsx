'use client';

import RenderApiError from '@/components/api-error';
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
import { Textarea } from '@/components/ui/textarea';
import { UserCombobox, normalizeMember } from '@/components/user-combobox';
import { useCreateMentor } from '@/lib/hooks/church/disciple/use-disciple-queries';
import { Award, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AddMentorFormProps {
  onCloseDialog: () => void;
}

const SPECIALIZATION_OPTIONS = [
  'New Converts',
  'Youth Ministry',
  "Women's Ministry",
  "Men's Ministry",
  'Leadership Development',
  'Marriage & Family',
  'Bible Study & Foundations',
];

export function AddMentorForm({ onCloseDialog }: AddMentorFormProps) {
  const {
    mutateAsync: createMentorMutation,
    isPending,
    isError,
    error,
  } = useCreateMentor();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('3 years');
  const [specialization, setSpecialization] = useState('New Converts');
  const [maxCapacity, setMaxCapacity] = useState('5');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !selectedMemberId) return;

    await createMentorMutation({
      memberId: selectedMemberId || undefined,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      experience: experience.trim() || '3 years',
      specialization,
      maxCapacity: parseInt(maxCapacity, 10) || 5,
      notes: notes.trim() || undefined,
    });
    onCloseDialog();
  };

  return (
    <>
      {isError && <RenderApiError error={error} />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Mentor Information</span>
            </CardTitle>
            <CardDescription>
              Select an existing church member or enter mentor details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Church Member (Optional)</Label>
              <UserCombobox
                onChange={(memberRaw) => {
                  if (memberRaw) {
                    const norm = normalizeMember(memberRaw);
                    setSelectedMemberId(norm.id);
                    setName(norm.fullName || '');
                    setEmail(norm.email || '');
                    setPhone(
                      (memberRaw as any)?.phoneNumber ||
                        (memberRaw as any)?.phone ||
                        ''
                    );
                  } else {
                    setSelectedMemberId(null);
                  }
                }}
                placeholder="Search and select a member to be a mentor..."
                value={selectedMemberId}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mentorName">
                  Mentor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mentorName"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentorEmail">Email</Label>
                <Input
                  id="mentorEmail"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor@church.org"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="mentorPhone">Phone</Label>
                <Input
                  id="mentorPhone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254..."
                  value={phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentorExperience">Experience</Label>
                <Input
                  id="mentorExperience"
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 5 years"
                  value={experience}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentorCapacity">Max Mentees</Label>
                <Input
                  id="mentorCapacity"
                  min="1"
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  type="number"
                  value={maxCapacity}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select onValueChange={setSpecialization} value={specialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorNotes">Notes / Bio (Optional)</Label>
              <Textarea
                id="mentorNotes"
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Background in discipleship and mentoring..."
                rows={3}
                value={notes}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button onClick={onCloseDialog} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isPending || (!name.trim() && !selectedMemberId)}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Mentor...
              </>
            ) : (
              'Add Mentor'
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
