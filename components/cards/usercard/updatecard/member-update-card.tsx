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
import type { MemberUpdateCardProps } from '@/lib/types/index';
import { getRelativeYear, MEMBERSHIP_STATUS_OPTIONS } from '@/lib/utils';

export const MemberUpdateCard: React.FC<MemberUpdateCardProps> = ({
  form,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Details</CardTitle>
        <CardDescription>Member-specific information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="memberUpdate.memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="memberUpdate.membershipDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Date</FormLabel>
              <FormControl>
                <DatePicker
                  format="long"
                  maxDate={getRelativeYear(1)}
                  minDate={getRelativeYear(-50)}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                  placeholder="Membership date"
                  value={field.value ? new Date(field.value) : undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="memberUpdate.membershipStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select membership status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {MEMBERSHIP_STATUS_OPTIONS.map((option) => (
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
          name="memberUpdate.baptismDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baptism Date</FormLabel>
              <FormControl>
                <DatePicker
                  format="long"
                  maxDate={getRelativeYear(1)}
                  minDate={getRelativeYear(-20)}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                  placeholder="Baptism date"
                  value={field.value ? new Date(field.value) : undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="memberUpdate.joinedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joined Date</FormLabel>
              <FormControl>
                <DatePicker
                  format="long"
                  maxDate={getRelativeYear(1)}
                  minDate={getRelativeYear(-50)}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                  placeholder="Joined date"
                  value={field.value ? new Date(field.value) : undefined}
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
