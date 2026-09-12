import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
}

// Generic interface that works with both strings and objects
interface MultiSelectProps<T = string> {
  options: MultiSelectOption[];
  selected: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
  className?: string;
  // Function to extract the value from the selected item (for objects)
  getValueFromItem?: (item: T) => string;
  // Function to create the item from a value (for objects)
  createItemFromValue?: (value: string) => T;
}

export function MultiSelect<T = string>({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  className,
  getValueFromItem,
  createItemFromValue,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  // Helper function to get the string value from an item
  const getItemValue = (item: T): string => {
    if (getValueFromItem) {
      return getValueFromItem(item);
    }
    // If T is string, just return it
    return item as string;
  };
  // Helper function to create an item from a string value
  const createItem = (value: string): T => {
    if (createItemFromValue) {
      return createItemFromValue(value);
    }
    // If T is string, just return the value
    return value as T;
  };
  const handleSelect = (value: string) => {
    const selectedValues = selected.map(getItemValue);
    if (selectedValues.includes(value)) {
      // Remove the item
      onChange(selected.filter((item) => getItemValue(item) !== value));
    } else {
      // Add the item
      onChange([...selected, createItem(value)]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => getItemValue(item) !== value));
  };

  const selectedLabels = selected.map((item) => {
    const value = getItemValue(item);
    return options.find((option) => option.value === value)?.label || value;
  });

  const selectedValues = selected.map(getItemValue);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
          variant="outline"
        >
          <div className="flex max-w-full flex-wrap gap-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selected.length <= 2 ? (
              selectedLabels.map((label, index) => (
                <Badge
                  className="text-xs"
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(getItemValue(selected[index]));
                  }}
                  variant="secondary"
                >
                  {label}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))
            ) : (
              <Badge className="text-xs" variant="secondary">
                {selected.length} items selected
              </Badge>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                className="cursor-pointer"
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selectedValues.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
