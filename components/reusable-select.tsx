'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface ReusableSelectProps {
  /**
   * Array of options to display in the select
   */
  options: SelectOption[];
  /**
   * URL parameter name to sync with (e.g., 'status', 'category', 'type')
   */
  paramName: string;
  /**
   * Default value to use when no URL param is present
   * @default 'all'
   */
  defaultValue?: string;
  /**
   * Placeholder text for the select trigger
   */
  placeholder: string;
  /**
   * CSS classes for the select trigger
   * @default 'w-full sm:w-[180px]'
   */
  className?: string;
  /**
   * Whether to reset pagination when selection changes
   * @default true
   */
  resetPagination?: boolean;
  /**
   * Value that should remove the param from URL (typically 'all')
   * @default 'all'
   */
  clearValue?: string;
  /**
   * Optional callback when value changes
   */
  onValueChange?: (value: string) => void;
}

const ReusableSelect: React.FC<ReusableSelectProps> = ({
  options,
  paramName,
  defaultValue = 'all',
  placeholder,
  className = 'w-full sm:w-[180px]',
  resetPagination = true,
  clearValue = 'all',
  onValueChange,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // Get initial value from URL params, default to provided default
  const [selectedValue, setSelectedValue] = useState<string>(() => {
    return searchParams.get(paramName) || defaultValue;
  });
  // Handle value change and update URL
  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    // Reset to page 1 when filtering (if enabled)
    if (resetPagination) {
      params.set('page', '1');
    }
    // Remove param if it's the clear value, otherwise set it
    if (value === clearValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    setSelectedValue(value);
    router.push(`${pathname}?${params.toString()}`);
    // Call optional callback
    onValueChange?.(value);
  };
  // Sync component state with URL params when they change externally
  useEffect(() => {
    const valueFromUrl = searchParams.get(paramName) || defaultValue;
    setSelectedValue(valueFromUrl);
  }, [searchParams, paramName, defaultValue]);
  return (
    <Select onValueChange={handleValueChange} value={selectedValue}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReusableSelect;
