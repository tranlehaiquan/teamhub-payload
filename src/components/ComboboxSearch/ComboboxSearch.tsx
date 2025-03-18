'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utilities/cn';
import { useState } from 'react';

// props
interface ComboboxSearchProps {
  className?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  isLoading?: boolean;
  items?: { value: string; label: string }[];
  onSearch: (search: string) => void;
}

export function ComboboxSearch({
  className,
  onSelect,
  placeholder = 'Select item...',
  value,
  disabled = false,
  isLoading = false,
  items = [],
  onSearch,
}: ComboboxSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between w-full', className)}
          disabled={disabled}
        >
          {value ? items.find((user) => user.value === value)?.label : 'Select item...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            onValueChange={(value) => {
              onSearch(value);
            }}
          />
          <CommandList>
            {isLoading ? (
              <CommandLoading>Fetching...</CommandLoading>
            ) : (
              <>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={String(item.value)}
                      onSelect={(currentValue) => {
                        const newValue = currentValue === value ? '' : currentValue;
                        onSelect(newValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === String(item.value) ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
