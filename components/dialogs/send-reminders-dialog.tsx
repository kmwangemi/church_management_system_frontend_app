'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Mail, Send, Smartphone, Users } from 'lucide-react';
import { useState } from 'react';

interface SendRemindersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
}

export function SendRemindersDialog({
  open,
  onOpenChange,
  event,
}: SendRemindersDialogProps) {
  const [formData, setFormData] = useState({
    reminderType: 'both',
    timing: '1day',
    customMessage: '',
    includeEventDetails: true,
    sendToRegistered: true,
    sendToMembers: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending reminders:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Send Event Reminders
          </DialogTitle>
          <DialogDescription>
            Send reminders for {event?.title}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reminder Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reminderType">Reminder Method</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, reminderType: value })
                  }
                  value={formData.reminderType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="sms">SMS Only</SelectItem>
                    <SelectItem value="both">Email & SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing">Send Timing</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, timing: value })
                  }
                  value={formData.timing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="1hour">1 Hour Before</SelectItem>
                    <SelectItem value="1day">1 Day Before</SelectItem>
                    <SelectItem value="3days">3 Days Before</SelectItem>
                    <SelectItem value="1week">1 Week Before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.sendToRegistered}
                  id="sendToRegistered"
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      sendToRegistered: checked as boolean,
                    })
                  }
                />
                <Label
                  className="flex items-center gap-2"
                  htmlFor="sendToRegistered"
                >
                  <Users className="h-4 w-4" />
                  Registered attendees (23 people)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.sendToMembers}
                  id="sendToMembers"
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      sendToMembers: checked as boolean,
                    })
                  }
                />
                <Label
                  className="flex items-center gap-2"
                  htmlFor="sendToMembers"
                >
                  <Users className="h-4 w-4" />
                  All church members (456 people)
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Message Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.includeEventDetails}
                  id="includeEventDetails"
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      includeEventDetails: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="includeEventDetails">
                  Include event details (date, time, location)
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  onChange={(e) =>
                    setFormData({ ...formData, customMessage: e.target.value })
                  }
                  placeholder="Add a personal message to the reminder..."
                  rows={4}
                  value={formData.customMessage}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-accent p-4">
                <div className="mb-2 flex items-center gap-2">
                  {formData.reminderType === 'email' ||
                  formData.reminderType === 'both' ? (
                    <Mail className="h-4 w-4 text-blue-600" />
                  ) : null}
                  {formData.reminderType === 'sms' ||
                  formData.reminderType === 'both' ? (
                    <Smartphone className="h-4 w-4 text-green-600" />
                  ) : null}
                  <span className="font-medium">Reminder Preview</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Subject:</strong> Reminder: {event?.title}
                  </p>
                  <p>
                    <strong>Message:</strong>
                  </p>
                  <div className="rounded border bg-background p-3">
                    <p>Don't forget about {event?.title}!</p>
                    {formData.includeEventDetails && (
                      <div className="mt-2 text-muted-foreground">
                        <p>📅 Date: {event?.date}</p>
                        <p>🕐 Time: {event?.time}</p>
                        <p>📍 Location: {event?.location}</p>
                      </div>
                    )}
                    {formData.customMessage && (
                      <div className="mt-2">
                        <p>{formData.customMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Send Reminders
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
