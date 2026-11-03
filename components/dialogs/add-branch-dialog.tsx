'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useCreateSuperAdminBranch } from '@/hooks/api/use-superadmin';
import { useAllChurches } from '@/lib/hooks/superadmin/use-church-management-mutation';
import { Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBranchDialog({ open, onOpenChange }: AddBranchDialogProps) {
  const { data: churchesData } = useAllChurches();
  const churches = churchesData?.churches || [];

  const [name, setName] = useState('');
  const [churchId, setChurchId] = useState('');
  const [pastor, setPastor] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('500');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { mutateAsync: createBranch, isPending } = useCreateSuperAdminBranch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Branch name is required');
      return;
    }
    if (!churchId) {
      toast.error('Please select a parent church');
      return;
    }

    try {
      await createBranch({
        name: name.trim(),
        churchId,
        pastor: pastor.trim() || undefined,
        address: address.trim() || undefined,
        capacity: Number.parseInt(capacity, 10) || 500,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });
      // Reset form
      setName('');
      setChurchId('');
      setPastor('');
      setAddress('');
      setCapacity('500');
      setPhone('');
      setEmail('');
      onOpenChange(false);
    } catch (err: any) {
      // Handled in mutation onError
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Add New Branch</span>
          </DialogTitle>
          <DialogDescription>
            Register a new church branch campus in the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="branch-church">Parent Church *</Label>
            <Select value={churchId} onValueChange={setChurchId}>
              <SelectTrigger id="branch-church">
                <SelectValue placeholder="Select church" />
              </SelectTrigger>
              <SelectContent>
                {churches.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch Name *</Label>
            <Input
              id="branch-name"
              placeholder="e.g. Westlands Campus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch-pastor">Resident Pastor</Label>
              <Input
                id="branch-pastor"
                placeholder="Rev. John Doe"
                value={pastor}
                onChange={(e) => setPastor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-capacity">Capacity</Label>
              <Input
                id="branch-capacity"
                type="number"
                placeholder="500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-address">Location / Address</Label>
            <Input
              id="branch-address"
              placeholder="e.g. Waiyaki Way, Westlands, Nairobi"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch-phone">Phone Number</Label>
              <Input
                id="branch-phone"
                placeholder="+254 700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-email">Branch Email</Label>
              <Input
                id="branch-email"
                type="email"
                placeholder="branch@church.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Branch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

