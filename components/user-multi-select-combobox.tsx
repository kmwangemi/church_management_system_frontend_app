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
import { useActiveOrganization } from '@/hooks/use-active-organization';
import { useFetchUsers } from '@/lib/hooks/church/user/use-user-queries';
import type { UserResponse } from '@/lib/types/user';
import { cn, getFirstLetter } from '@/lib/utils';
import { Check, ChevronDown, Loader2, Users, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { type ComboboxMemberItem, normalizeMember } from './user-combobox';

interface UserMultiSelectComboboxProps {
  value?: (UserResponse | ComboboxMemberItem | string)[];
  onChange?: (members: (UserResponse | ComboboxMemberItem)[]) => void;
  onValueChange?: (ids: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
  organizationId?: string;
}

const UserMultiSelectComboboxComponent = React.forwardRef<
  HTMLButtonElement,
  UserMultiSelectComboboxProps
>(
  (
    {
      className,
      placeholder = 'Select members...',
      value = [],
      onChange,
      onValueChange,
      disabled,
      maxDisplay = 3,
      organizationId: propOrgId,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const { organizationId: activeOrgId } = useActiveOrganization();
    const effectiveOrgId = propOrgId || activeOrgId;

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, error } = useFetchUsers(
      1,
      debouncedSearchTerm,
      50,
      effectiveOrgId
    );

    const members: ComboboxMemberItem[] = useMemo(() => {
      const rawList: any[] = data?.users || (data as any)?.members || [];
      return rawList
        .map(normalizeMember)
        .filter((item) => item.id && item.fullName);
    }, [data]);

    const selectedMembers: ComboboxMemberItem[] = useMemo(() => {
      if (!Array.isArray(value) || value.length === 0) return [];
      return value
        .map((item) => {
          if (typeof item === 'string') {
            const found = members.find(
              (m) =>
                m.id === item ||
                m.memberId === item ||
                m.raw?._id === item ||
                m.raw?.id === item ||
                m.raw?.user?.id === item
            );
            return found || { id: item, fullName: 'Selected Member', raw: { id: item } };
          }
          return normalizeMember(item);
        })
        .filter(Boolean);
    }, [value, members]);

    const handleSelect = (member: ComboboxMemberItem) => {
      const isSelected = selectedMembers.some((s) => s.id === member.id);
      let newSelection: ComboboxMemberItem[];
      if (isSelected) {
        newSelection = selectedMembers.filter((s) => s.id !== member.id);
      } else {
        newSelection = [...selectedMembers, member];
      }
      onChange?.(newSelection.map((s) => s.raw));
      onValueChange?.(newSelection.map((s) => s.id));
    };

    const handleRemove = (memberId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const newSelection = selectedMembers.filter((s) => s.id !== memberId);
      onChange?.(newSelection.map((s) => s.raw));
      onValueChange?.(newSelection.map((s) => s.id));
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.([]);
      onValueChange?.([]);
    };

    return (
      <Popover modal={true} onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
          <Button
            aria-expanded={open}
            className={cn(
              'h-auto min-h-10 w-full justify-between text-left font-normal',
              selectedMembers.length === 0 && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
            ref={ref}
            role="combobox"
            type="button"
            variant="outline"
            {...props}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Users className="size-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {selectedMembers.length > 0 ? (
                  selectedMembers.length <= maxDisplay ? (
                    selectedMembers.map((member) => (
                      <Badge
                        className="px-2 py-0.5 text-xs flex items-center gap-1"
                        key={member.id}
                        variant="secondary"
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarImage
                            alt={member.fullName}
                            src={member.avatarUrl || ''}
                          />
                          <AvatarFallback className="text-[8px]">
                            {getFirstLetter(member.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[120px]">
                          {member.fullName}
                        </span>
                        <X
                          className="size-3 cursor-pointer hover:text-destructive"
                          onClick={(e) => handleRemove(member.id, e)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <Badge className="px-2 py-0.5 text-xs" variant="secondary">
                      {selectedMembers.length} members selected
                    </Badge>
                  )
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              {selectedMembers.length > 0 && (
                <Button
                  className="h-auto p-1 hover:bg-destructive/10"
                  onClick={handleClear}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-3 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] min-w-[320px] max-w-[480px] p-0 z-[100] shadow-xl border bg-popover text-popover-foreground"
          sideOffset={4}
        >
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setSearchTerm}
              placeholder="Search members by name, email, or ID..."
              value={searchTerm}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 className="size-4 animate-spin text-primary" />
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
                      : 'No members found in this church.'}
                  </CommandEmpty>
                  {members.length > 0 && (
                    <CommandGroup
                      heading={
                        searchTerm
                          ? `Results for "${searchTerm}"`
                          : 'Church Members & Leaders'
                      }
                    >
                      {members.map((member) => {
                        const isSelected = selectedMembers.some(
                          (selected) => selected.id === member.id
                        );
                        return (
                          <CommandItem
                            className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer"
                            key={member.id}
                            onSelect={() => handleSelect(member)}
                            value={`${member.fullName} ${member.memberId || ''} ${member.email || ''}`}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage
                                  alt={member.fullName}
                                  src={member.avatarUrl || ''}
                                />
                                <AvatarFallback>
                                  {getFirstLetter(member.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate font-medium text-sm">
                                    {member.fullName}
                                  </span>
                                  {member.memberId && (
                                    <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-primary">
                                      {member.memberId}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs truncate">
                                  {member.email && (
                                    <span className="truncate">{member.email}</span>
                                  )}
                                  {member.position && (
                                    <>
                                      {member.email && <span>•</span>}
                                      <span className="truncate text-muted-foreground/80">
                                        {member.position}
                                      </span>
                                    </>
                                  )}
                                  {member.branchName && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate">
                                        {member.branchName}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-primary" />
                            )}
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

UserMultiSelectComboboxComponent.displayName = 'UserMultiSelectCombobox';

export {
  UserMultiSelectComboboxComponent as UserMultiSelect,
  UserMultiSelectComboboxComponent as UserMultiSelectCombobox,
};
export default UserMultiSelectComboboxComponent;
