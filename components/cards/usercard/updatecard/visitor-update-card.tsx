import { DatePicker } from '@/components/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
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
import { Switch } from '@/components/ui/switch';
import { UserCombobox } from '@/components/user-combobox';
import type { VisitorUpdateCardProps } from '@/lib/types/index';
import {
  FOLLOW_UP_STATUS_OPTIONS,
  getRelativeYear,
  REFERRAL_SOURCE_OPTIONS,
} from '@/lib/utils';

export const VisitorUpdateCard: React.FC<VisitorUpdateCardProps> = ({
  form,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Details</CardTitle>
        <CardDescription>Visitor-specific information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="visitorUpdate.visitorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visitor ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitorUpdate.visitDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit Date</FormLabel>
              <FormControl>
                <DatePicker
                  format="long"
                  maxDate={getRelativeYear(1)}
                  minDate={getRelativeYear(-50)}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                  placeholder="Visit date"
                  value={field.value ? new Date(field.value) : undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitorUpdate.howDidYouHear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How Did You Hear About Us?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select how you heard about us" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {REFERRAL_SOURCE_OPTIONS.map((option) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitorUpdate.followUpStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow Up Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select follow up status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {FOLLOW_UP_STATUS_OPTIONS.map((option) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitorUpdate.interestedInMembership"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Interested in Membership
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitorUpdate.invitedBy" // Form field stores just the user ID string
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invited By</FormLabel>
              <FormControl>
                <UserCombobox
                  className="w-full"
                  onValueChange={field.onChange} // Use onValueChange for ID
                  placeholder="Search and select a member"
                  value={field.value} // Pass the ID directly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
