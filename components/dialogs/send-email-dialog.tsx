'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { UserResponse } from '@/lib/types/user';
import { capitalizeFirstLetter, getFirstLetter } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const emailSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.string().min(1, 'Priority is required'),
  template: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  user,
}: SendEmailDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: '',
      message: '',
      priority: 'normal',
      template: '',
    },
  });
  if (!user) return null;
  const onSubmit = async (data: EmailFormData) => {
    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Email sent:', { ...data, recipient: user.email });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const emailTemplates = [
    {
      value: 'welcome',
      label: 'Welcome Message',
      subject: 'Welcome to our Church Family!',
    },
    {
      value: 'event-invite',
      label: 'Event Invitation',
      subject: "You're Invited to Our Upcoming Event",
    },
    {
      value: 'follow-up',
      label: 'Follow-up Message',
      subject: 'Following Up on Your Visit',
    },
    { value: 'birthday', label: 'Birthday Wishes', subject: 'Happy Birthday!' },
    {
      value: 'prayer',
      label: 'Prayer Request Follow-up',
      subject: 'Praying for You',
    },
  ];

  const handleTemplateSelect = (templateValue: string) => {
    const template = emailTemplates.find((t) => t.value === templateValue);
    if (template) {
      form.setValue('subject', template.subject);
      form.setValue('template', templateValue);
      // Set template content based on selection
      let templateContent = '';
      switch (templateValue) {
        case 'welcome':
          templateContent = `Dear ${capitalizeFirstLetter(
            user?.firstName || 'N/A'
          )} ${capitalizeFirstLetter(user?.lastName || 'N/A')},\n\nWelcome to our church family! We're so glad you've joined us and look forward to getting to know you better.\n\nBlessings,\nChurch Administration`;
          break;
        case 'event-invite':
          templateContent = `Dear ${capitalizeFirstLetter(
            user?.firstName || 'N/A'
          )} ${capitalizeFirstLetter(user?.lastName || 'N/A')},\n\nWe would love to invite you to our upcoming event. Your presence would mean a lot to us.\n\nBlessings,\nChurch Administration`;
          break;
        case 'follow-up':
          templateContent = `Dear ${capitalizeFirstLetter(
            user?.firstName || 'N/A'
          )} ${capitalizeFirstLetter(user?.lastName || 'N/A')},\n\nThank you for visiting us recently. We hope you felt welcomed and would love to see you again soon.\n\nBlessings,\nChurch Administration`;
          break;
        case 'birthday':
          templateContent = `Dear ${capitalizeFirstLetter(
            user?.firstName || 'N/A'
          )} ${capitalizeFirstLetter(user?.lastName || 'N/A')},\n\nWishing you a very happy birthday! May God bless you abundantly in the year ahead.\n\nBlessings,\nChurch Administration`;
          break;
        case 'prayer':
          templateContent = `Dear ${capitalizeFirstLetter(
            user?.firstName || 'N/A'
          )} ${capitalizeFirstLetter(user?.lastName || 'N/A')},\n\nWe want you to know that we are continuing to pray for you and your prayer request.\n\nBlessings,\nChurch Administration`;
          break;
        default:
          templateContent;
      }
      form.setValue('message', templateContent);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Email</span>
          </DialogTitle>
          <DialogDescription>
            Compose and send an email to the selected member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Recipient Info */}
          <div className="flex items-center space-x-4 rounded-lg bg-accent p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                alt={user?.firstName || 'User'}
                src={user?.profilePictureUrl ?? ''}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {`${getFirstLetter(
                  user?.firstName || ''
                )}${getFirstLetter(user?.lastName || '')}`}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{`${capitalizeFirstLetter(
                user?.firstName || 'N/A'
              )} ${capitalizeFirstLetter(user?.lastName || 'N/A')}`}</h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="mt-1 flex items-center space-x-2">
                <Badge className="text-xs" variant="secondary">
                  {capitalizeFirstLetter(user?.role)}
                </Badge>
                {/* <Badge className="text-xs" variant="outline">
                  {user?.department}
                </Badge> */}
              </div>
            </div>
          </div>
          <Separator />
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Template Selection */}
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Template (Optional)</FormLabel>
                    <Select
                      onValueChange={handleTemplateSelect}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template or write custom message" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem
                            key={template.value}
                            value={template.value}
                          >
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Attachment Option */}
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Paperclip className="h-4 w-4" />
                <Button
                  className="h-auto p-0 text-blue-600"
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Attach files
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={isSending}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            disabled={isSending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
