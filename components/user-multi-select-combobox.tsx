import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Check, ChevronDown, Loader2, Search, Users, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface UserMultiSelectProps {
  value?: UserResponse[] | string[] | null;
  onChange?: (members: UserResponse[]) => void;
  onValueChange?: (ids: string[]) => void; // For ID-based forms
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayProperty?: keyof UserResponse;
  maxDisplay?: number; // Maximum number of selected items to display
}

const UserMultiSelectComponent = React.forwardRef<
  HTMLButtonElement,
  UserMultiSelectProps
>(
  (
    {
      className,
      placeholder = 'Search members...',
      value = [],
      onChange,
      onValueChange,
      disabled,
      displayProperty = 'firstName',
      maxDisplay = 3,
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
    // Handle different value types (array of objects or array of string IDs)
    const selectedUsers = useMemo(() => {
      if (!(value && Array.isArray(value)) || value.length === 0) return [];
      if (typeof value[0] === 'string') {
        // If value is an array of string IDs, find the users in the members array
        const stringValues = value as string[];
        return members.filter((member) => stringValues.includes(member._id));
      }
      // If value is already an array of UserResponse objects
      return value as UserResponse[];
    }, [value, members]);
    const handleSelect = (member: UserResponse) => {
      const isSelected = selectedUsers.some(
        (selected) => selected._id === member._id
      );
      let newSelection: UserResponse[];
      if (isSelected) {
        // Remove from selection
        newSelection = selectedUsers.filter(
          (selected) => selected._id !== member._id
        );
      } else {
        // Add to selection
        newSelection = [...selectedUsers, member];
      }
      onChange?.(newSelection);
      onValueChange?.(newSelection.map((user) => user._id));
    };
    const handleRemove = (memberId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const newSelection = selectedUsers.filter(
        (selected) => selected._id !== memberId
      );
      onChange?.(newSelection);
      onValueChange?.(newSelection.map((user) => user._id));
    };
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.([]);
      onValueChange?.([]);
    };
    const getFullName = (member: UserResponse): string => {
      return `${capitalizeFirstLetter(member?.firstName || '')} ${capitalizeFirstLetter(member?.lastName || '')}`.trim();
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    const displayText = useMemo(() => {
      if (selectedUsers.length === 0) return placeholder;
      if (selectedUsers.length === 1) return getFullName(selectedUsers[0]);
      return `${selectedUsers.length} members selected`;
    }, [selectedUsers, placeholder]);
    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
          <Button
            aria-expanded={open}
            className={cn(
              'h-auto min-h-10 w-full justify-between text-left font-normal',
              selectedUsers.length === 0 && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
            ref={ref}
            role="combobox"
            variant="outline"
            {...props}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Users className="size-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {selectedUsers.length > 0 ? (
                  selectedUsers.length <= maxDisplay ? (
                    selectedUsers.map((user) => (
                      <Badge
                        className="px-2 py-1 text-xs"
                        key={user._id}
                        variant="secondary"
                      >
                        <Avatar className="mr-1 h-4 w-4">
                          <AvatarImage
                            alt={getFullName(user)}
                            src={user?.profilePictureUrl || ''}
                          />
                          <AvatarFallback className="text-xs">
                            {`${getFirstLetter(user?.firstName || '')}${getFirstLetter(user?.lastName || '')}`}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-24 truncate">
                          {getFullName(user)}
                        </span>
                        <Button
                          className="ml-1 h-auto w-auto p-0 hover:bg-destructive/20"
                          onClick={(e) => handleRemove(user._id, e)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="size-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">{displayText}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              {selectedUsers.length > 0 && (
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
                      {members.map((member) => {
                        const isSelected = selectedUsers.some(
                          (selected) => selected._id === member._id
                        );
                        return (
                          <CommandItem
                            className="flex items-center gap-2"
                            key={member._id}
                            onSelect={() => handleSelect(member)}
                            value={`${member.firstName} ${member.lastName} ${member.email}`}
                          >
                            <div className="flex h-4 w-4 items-center justify-center">
                              {isSelected && <Check className="h-4 w-4" />}
                            </div>
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
                                  <span className="truncate">
                                    {member.email}
                                  </span>
                                )}
                                {member.branchId && (
                                  <>
                                    {member.email && <span>•</span>}
                                    <span>{member?.branchId?.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        );
                      })}
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

UserMultiSelectComponent.displayName = 'UserMultiSelect';

export { UserMultiSelectComponent as UserMultiSelect };
