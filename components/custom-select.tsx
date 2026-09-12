// Custom Select search Component Implementation

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
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select item...',
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const handleSelect = (value: string) => {
    onChange(value === selected ? '' : value);
    setOpen(false);
  };
  const selectedOption = options.find((option) => option.value === selected);
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
        <Button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={
            selectedOption ? `Selected: ${selectedOption.label}` : placeholder
          }
          className={`w-full justify-between ${className}`}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span className={selectedOption ? '' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
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
                    selected === option.value ? 'opacity-100' : 'opacity-0'
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
