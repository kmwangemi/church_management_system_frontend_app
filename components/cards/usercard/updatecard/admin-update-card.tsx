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
import type { AdminUpdateCardProps } from '@/lib/types/index';
import { ADMIN_ACCESS_LEVEL_OPTIONS } from '@/lib/utils';

export const AdminUpdateCard: React.FC<AdminUpdateCardProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Details</CardTitle>
        <CardDescription>Admin-specific information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="adminUpdate.adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminUpdate.accessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {ADMIN_ACCESS_LEVEL_OPTIONS.map((option) => (
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
      </CardContent>
    </Card>
  );
};
