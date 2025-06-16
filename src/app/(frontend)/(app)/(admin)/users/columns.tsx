'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Profile, User } from '@/payload-types';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableGlobalFilter: false, // exclude from global search
  },
  {
    accessorKey: 'firstName',
    accessorFn: (row) => (row.profile as Profile)?.firstName,
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    accessorFn: (row) => (row.profile as Profile)?.lastName,
    header: 'Last Name',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => row.original.roles?.join(', '),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: '_verified',
    header: 'Verify email',
    cell: ({ row }) => (row.original._verified ? 'Yes' : 'No'),
    enableGlobalFilter: false, // exclude from global search
  },
];
