'use client';
import * as React from 'react';
import { api } from '@/trpc/react';
import { ComboboxSearch } from '@/components/ComboboxSearch/ComboboxSearch';
import { useDebounce } from '@/utilities/useDebounce';

// props
interface ComboboxSearchUserProps {
  className?: string;
  onSelect: (value: { value: string; label: string }) => void;
  placeholder?: string;
  selected?: {
    value: string;
    label: string;
  } | null;
  disabled?: boolean;
}

export function ComboboxSearchUser({
  className,
  onSelect,
  placeholder = 'Select user...',
  selected,
  disabled = false,
}: ComboboxSearchUserProps) {
  const [me] = api.me.getMe.useSuspenseQuery();
  const [search, setSearch] = React.useState('');
  const searchDebounced = useDebounce(search, 500);
  const searchResult = api.user.getUsers.useQuery({
    email: searchDebounced,
  });
  const meId = me.user.id;

  const users =
    searchResult.data?.docs
      .map((user) => ({
        value: String(user.id),
        label: user.email,
      }))
      .filter((user) => user.value !== String(meId)) || [];

  // make sure users have selected value
  if (selected) {
    const usersHaveSelectedValue = users.some((user) => user.value === selected.value);
    if (!usersHaveSelectedValue) {
      users.push(selected);
    }
  }

  return (
    <ComboboxSearch
      className={className}
      onSelect={onSelect}
      placeholder={placeholder}
      value={selected?.value}
      disabled={disabled}
      items={users}
      isLoading={searchResult.isLoading}
      onSearch={setSearch}
    />
  );
}
