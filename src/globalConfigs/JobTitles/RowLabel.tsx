'use client';

import { useRowLabel } from '@payloadcms/ui';

export const RowLabel = () => {
  const { data } = useRowLabel<{ name?: string }>();
  const customLabel = `${data.name || 'Job title'}`;

  return <div>{customLabel}</div>;
};
