import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { countries } from 'countries-list';
import { ChevronDown, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CountrySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CountrySelectComponent = React.forwardRef<
  HTMLDivElement,
  CountrySelectProps
>(
  (
    {
      className,
      placeholder = 'Select country',
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Convert countries object to array and sort alphabetically
    const countryOptions = useMemo(() => {
      return Object.entries(countries)
        .map(([_code, country]) => ({
          name: country.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, []);
    // Filter countries based on search term (only by name now)
    const filteredCountries = useMemo(() => {
      if (!searchTerm) return countryOptions;
      return countryOptions.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [countryOptions, searchTerm]);
    const selectedCountry = countryOptions.find(
      (country) => country.name === value
    );
    const handleSelect = (countryName: string) => {
      onChange?.(countryName);
      setIsOpen(false);
      setSearchTerm('');
    };
    return (
      <div className={cn('relative', className)} ref={ref} {...props}>
        <button
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          type="button"
        >
          <span className="flex items-center gap-2">
            {selectedCountry ? (
              <span>{selectedCountry.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'size-4 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-2 size-4 transform text-muted-foreground" />
                <Input
                  className="pl-8"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search countries..."
                  type="text"
                  value={searchTerm}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent',
                      value === country.name && 'bg-accent'
                    )}
                    key={country.name}
                    onClick={() => handleSelect(country.name)}
                    type="button"
                  >
                    <span>{country.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-muted-foreground text-sm">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CountrySelectComponent.displayName = 'CountrySelect';

export { CountrySelectComponent as CountrySelect };
