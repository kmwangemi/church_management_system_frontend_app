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
          name="adminDetails.adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin ID</FormLabel>
              <FormControl>
                <Input placeholder="Auto-generated Admin ID" {...field} value={field.value || ''} className="font-mono bg-muted/40 font-semibold" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminDetails.accessLevel"
          render={({ field }) => {
            const currentVal = field.value ? String(field.value).toUpperCase() : 'NATIONAL';
            return (
              <FormItem>
                <FormLabel>Access Level</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    if (form.setValue) {
                      form.setValue('adminUpdate.accessLevel', val);
                    }
                  }}
                  value={currentVal}
                >
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
            );
          }}
        />
      </CardContent>
    </Card>
  );
};
