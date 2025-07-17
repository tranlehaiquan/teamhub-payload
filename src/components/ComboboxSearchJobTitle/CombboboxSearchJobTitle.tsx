'use client';
import * as React from 'react';
import { api } from '@/trpc/react';
import { ComboboxSearch } from '@/components/ComboboxSearch/ComboboxSearch';

// props
interface ComboboxSearchJobTitlesProps {
  className?: string;
  onSelect: (selected: { value: string; label: string }) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export function ComboboxSearchJobTitles({
  className,
  onSelect,
  placeholder = 'Select job title...',
  value,
  disabled = false,
}: ComboboxSearchJobTitlesProps) {
  const [searchResult] = api.global.getJobTitles.useSuspenseQuery();

  const items = searchResult.titles.map((job) => ({
    value: String(job.id),
    label: job.name,
  }));

  return (
    <ComboboxSearch
      className={className}
      onSelect={onSelect}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      items={items}
      shouldFilter
    />
  );
}
