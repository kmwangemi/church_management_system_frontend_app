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
import { useAdminTeams } from '@/lib/hooks/admin/use-organization-team-mutation';
import type { Branch } from '@/lib/types/branch';
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { useState } from 'react';

interface BranchComboboxProps {
  value?: string | null; // branch ID
  onChange?: (branchId: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BranchCombobox({
  value,
  onChange,
  placeholder = 'Select branch...',
  className,
  disabled = false,
}: BranchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { organizationId } = useActiveOrganization();
  // Fetch branches with search term
  const { data, isLoading } = useAdminTeams({
    organizationId,
    page: 1,
    pageSize: 50,
    search: searchTerm,
  });
  // console.log('Branches:', JSON.stringify(data));
  const branches = data?.teams || [];
  // Find selected branch
  const selectedBranch = branches.find((branch: Branch) => branch.id === value);
  const handleSelect = (branchId: string) => {
    const newValue = branchId === value ? null : branchId;
    onChange?.(newValue);
    setOpen(false);
  };
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        {/** biome-ignore lint/a11y/useSemanticElements: ignore */}
        <Button
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            {selectedBranch ? (
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="truncate">
                  {capitalizeFirstLetter(selectedBranch.name || '')}
                </span>
                {selectedBranch.address?.[0]?.street && (
                  <span className="truncate text-muted-foreground text-xs">
                    {capitalizeFirstLetter(selectedBranch.address[0].street)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearchTerm}
            placeholder="Search branches..."
            value={searchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading branches...' : 'No branches found.'}
            </CommandEmpty>
            <CommandGroup>
              {branches.map((branch: Branch) => (
                <CommandItem
                  className="flex items-center gap-2"
                  key={branch.id}
                  onSelect={handleSelect}
                  value={branch.id}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === branch.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">
                      {capitalizeFirstLetter(branch.name || '')}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      {branch.address?.[0]?.street && (
                        <span className="truncate">
                          {capitalizeFirstLetter(branch.address[0].street)}
                        </span>
                      )}
                      {branch.address?.[0]?.country && (
                        <>
                          {branch.address?.[0]?.street && <span>•</span>}
                          <span>
                            {capitalizeFirstLetter(branch.address[0].country)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
