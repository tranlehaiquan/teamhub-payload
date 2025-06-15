import { ColumnDef } from '@tanstack/react-table';
import { type RouterOutputs } from '@/trpc/react';

type Team = RouterOutputs['team']['getTeams']['docs'][0];

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Team Name',
  },
  {
    accessorKey: 'owner',
    header: 'Owner Email',
    accessorFn: (row) => row.owner?.email,
  },
  {
    accessorKey: 'members',
    header: 'Members',
    accessorFn: (row) => row.members,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    accessorFn: (row) => row.createdAt && new Date(row.createdAt).toString(),
  },
];
