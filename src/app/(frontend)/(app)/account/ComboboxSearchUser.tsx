'use client';
import * as React from 'react';
import { api } from '@/trpc/react';
import { ComboboxSearch } from '@/components/ComboboxSearch/ComboboxSearch';
import { useDebounce } from '@/utilities/useDebounce';

// props
interface ComboboxSearchUserProps {
  className?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export function ComboboxSearchUser({
  className,
  onSelect,
  placeholder = 'Select user...',
  value,
  disabled = false,
}: ComboboxSearchUserProps) {
  const [search, setSearch] = React.useState('');
  const searchDebounced = useDebounce(search, 500);
  const searchResult = api.user.getUsers.useQuery({
    email: searchDebounced,
  });

  const users =
    searchResult.data?.docs.map((user) => ({
      value: String(user.id),
      label: user.email,
    })) || [];

  return (
    <ComboboxSearch
      className={className}
      onSelect={onSelect}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      items={users}
      isLoading={searchResult.isLoading}
      onSearch={setSearch}
    />
  );
}
