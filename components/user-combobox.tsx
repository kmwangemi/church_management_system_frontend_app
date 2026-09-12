import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFetchUsers } from '@/lib/hooks/church/user/use-user-queries';
import type { UserResponse } from '@/lib/types/user';
import { capitalizeFirstLetter, cn, getFirstLetter } from '@/lib/utils';
import { ChevronDown, Loader2, Search, User, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface UserComboboxProps {
  value?: UserResponse | string | null;
  onChange?: (member: UserResponse | null) => void;
  onValueChange?: (id: string | null) => void; // For ID-based forms
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayProperty?: keyof UserResponse;
}

const UserComboboxComponent = React.forwardRef<
  HTMLButtonElement,
  UserComboboxProps
>(
  (
    {
      className,
      placeholder = 'Search members...',
      value,
      onChange,
      onValueChange,
      disabled,
      displayProperty = 'firstName',
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    // Debounce search term
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }, [searchTerm]);
    // Fetch members using the provided hook
    const { data, isLoading, error } = useFetchUsers(1, debouncedSearchTerm);
    // Extract members array from the API response
    const members: UserResponse[] = useMemo(() => {
      if (!data?.users) return [];
      return data.users;
    }, [data]);
    // Handle different value types (object or string ID)
    const selectedUser = useMemo(() => {
      if (!value) return null;
      if (typeof value === 'string') {
        // If value is a string ID, find the user in the members array
        return members.find((member) => member._id === value) || null;
      }
      // If value is already a UserResponse object
      return value;
    }, [value, members]);
    const handleSelect = (member: UserResponse) => {
      onChange?.(member);
      onValueChange?.(member._id);
      setOpen(false);
    };
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(null);
      onValueChange?.(null);
    };
    const getFullName = (member: UserResponse): string => {
      return `${capitalizeFirstLetter(member?.firstName || '')} ${capitalizeFirstLetter(member?.lastName || '')}`.trim();
    };
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
          <Button
            aria-expanded={open}
            className={cn(
              'w-full justify-between text-left font-normal',
              !value && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
            ref={ref}
            role="combobox"
            variant="outline"
            {...props}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <User className="size-4 flex-shrink-0 text-muted-foreground" />
              {selectedUser ? (
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{getFullName(selectedUser)}</span>
                  {selectedUser.email && (
                    <span className="truncate text-muted-foreground text-xs">
                      {selectedUser.email}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              {selectedUser && (
                <Button
                  className="h-auto p-1 hover:bg-destructive/10"
                  onClick={handleClear}
                  size="sm"
                  variant="ghost"
                >
                  <X className="size-3" />
                </Button>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                className="flex-1"
                onValueChange={setSearchTerm}
                placeholder="Search members..."
                value={searchTerm}
              />
            </div>
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    Searching members...
                  </span>
                </div>
              ) : error ? (
                <div className="py-6 text-center text-destructive text-sm">
                  Error loading members. Please try again.
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {searchTerm
                      ? `No members found for "${searchTerm}"`
                      : 'Start typing to search members'}
                  </CommandEmpty>
                  {members.length > 0 && (
                    <CommandGroup
                      heading={
                        searchTerm ? `Results for "${searchTerm}"` : 'Members'
                      }
                    >
                      {members.map((member) => (
                        <CommandItem
                          className="flex items-center gap-2"
                          key={member._id}
                          onSelect={() => handleSelect(member)}
                          value={`${member.firstName} ${member.lastName} ${member.email}`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              alt={getFullName(member)}
                              src={member?.profilePictureUrl || ''}
                            />
                            <AvatarFallback>
                              {`${getFirstLetter(member?.firstName || '')}${getFirstLetter(member?.lastName || '')}`}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">
                              {getFullName(member)}
                            </span>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              {member.email && (
                                <span className="truncate">{member.email}</span>
                              )}
                              {member.branchId && (
                                <>
                                  {member.email && <span>•</span>}
                                  <span>{member?.branchId?.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {selectedUser?._id === member._id && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

UserComboboxComponent.displayName = 'UserCombobox';

export { UserComboboxComponent as UserCombobox };
