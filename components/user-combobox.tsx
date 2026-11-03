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
import { useActiveOrganization } from '@/hooks/use-active-organization';
import {
  useFetchUserById,
  useFetchUsers,
} from '@/lib/hooks/church/user/use-user-queries';
import type { UserResponse } from '@/lib/types/user';
import { capitalizeFirstLetter, cn, getFirstLetter } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2, User, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

export interface ComboboxMemberItem {
  id: string;
  memberId?: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  position?: string;
  branchName?: string;
  raw: any;
}

export function normalizeMember(item: any): ComboboxMemberItem {
  if (!item) return { id: '', fullName: '', raw: item };

  // Case 1: Backend member object with nested user
  if (item.user && typeof item.user === 'object') {
    const u = item.user;
    const fullName =
      u.name ||
      `${capitalizeFirstLetter(u.firstName || '')} ${capitalizeFirstLetter(u.lastName || '')}`.trim() ||
      item.name ||
      `${capitalizeFirstLetter(item.firstName || '')} ${capitalizeFirstLetter(item.lastName || '')}`.trim() ||
      'Member';
    const id = u.id || u._id || item.id || item._id;
    const memberId =
      u.membershipNumber ||
      u.memberId ||
      item.membershipNumber ||
      item.memberId;
    const branchName =
      u.teammembers?.[0]?.team?.name ||
      item.branchId?.name ||
      item.branch?.name ||
      item.team?.name;
    const avatarUrl = u.image || u.profilePictureUrl || item.profilePictureUrl;
    const email = u.email || item.email;
    const position = item.position || u.position || 'Member';

    return {
      id: String(id),
      memberId: memberId ? String(memberId) : undefined,
      fullName,
      email: email || undefined,
      avatarUrl: avatarUrl || undefined,
      position,
      branchName,
      raw: item,
    };
  }

  // Case 2: Standard UserResponse flat object
  const fullName =
    `${capitalizeFirstLetter(item.firstName || '')} ${capitalizeFirstLetter(item.lastName || '')}`.trim() ||
    item.name ||
    'Member';
  const id = item.id || item._id;
  const memberId =
    item.membershipNumber ||
    item.memberId ||
    item.memberDetails?.memberId;
  const branchName = item.branchId?.name || item.branch?.name;
  const avatarUrl = item.profilePictureUrl || item.image;
  const email = item.email;
  const position = item.position || item.role;

  return {
    id: String(id),
    memberId: memberId ? String(memberId) : undefined,
    fullName,
    email: email || undefined,
    avatarUrl: avatarUrl || undefined,
    position,
    branchName,
    raw: item,
  };
}

export interface UserComboboxProps {
  value?: UserResponse | string | null;
  onChange?: (member: UserResponse | null) => void;
  onValueChange?: (id: string | null) => void; // For ID-based forms
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayProperty?: keyof UserResponse;
  organizationId?: string;
}

const UserComboboxComponent = React.forwardRef<
  HTMLButtonElement,
  UserComboboxProps
>(
  (
    {
      className,
      placeholder = 'Search and select a member...',
      value,
      onChange,
      onValueChange,
      disabled,
      displayProperty,
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

    // Debounce search term
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch members using the provided hook
    const { data, isLoading, error } = useFetchUsers(
      1,
      debouncedSearchTerm,
      50,
      effectiveOrgId
    );

    // Extract & normalize members array from the API response
    const members: ComboboxMemberItem[] = useMemo(() => {
      const rawList: any[] = data?.users || (data as any)?.members || [];
      return rawList
        .map(normalizeMember)
        .filter((item) => item.id && item.fullName);
    }, [data]);

    // Handle string ID vs object value
    const selectedMember = useMemo(() => {
      if (!value) return null;
      if (typeof value === 'string') {
        return (
          members.find(
            (m) =>
              m.id === value ||
              m.memberId === value ||
              m.raw?._id === value ||
              m.raw?.id === value ||
              m.raw?.user?.id === value ||
              m.raw?.user?._id === value
          ) || null
        );
      }
      return normalizeMember(value);
    }, [value, members]);

    // Fallback single-user fetch if value is a string ID not yet loaded in list
    const isStringId = typeof value === 'string' && !!value;
    const { data: fetchedUserData } = useFetchUserById(
      isStringId && !selectedMember ? (value as string) : ''
    );

    const displayMember = useMemo(() => {
      if (selectedMember) return selectedMember;
      if (fetchedUserData) {
        return normalizeMember(fetchedUserData);
      }
      return null;
    }, [selectedMember, fetchedUserData]);

    const handleSelect = (member: ComboboxMemberItem) => {
      onChange?.(member.raw);
      onValueChange?.(member.id);
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(null);
      onValueChange?.(null);
    };

    return (
      <Popover modal={true} onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
          <Button
            aria-expanded={open}
            className={cn(
              'w-full justify-between text-left font-normal h-10',
              !displayMember && 'text-muted-foreground',
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
              {displayMember ? (
                <>
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage
                      alt={displayMember.fullName}
                      src={displayMember.avatarUrl || ''}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getFirstLetter(displayMember.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                    <span className="truncate font-medium text-foreground text-sm">
                      {displayMember.fullName}
                    </span>
                    {displayMember.memberId && (
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {displayMember.memberId}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <User className="size-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              {displayMember && (
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
              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
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
                    Loading members...
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
                      {members.map((member) => (
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
                          {displayMember?.id === member.id && (
                            <Check className="h-4 w-4 shrink-0 text-primary" />
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
export default UserComboboxComponent;
