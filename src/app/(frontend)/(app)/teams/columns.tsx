import { ColumnDef } from '@tanstack/react-table';
import { User, Team } from '@/payload-types';

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
    header: 'Owner Name',
    accessorFn: (row) => (row.owner as User).email,
  },
  {
    accessorKey: 'members',
    header: 'Members',
    accessorFn: (row) => row.members?.docs?.length || 0,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    accessorFn: (row) => row.createdAt && new Date(row.createdAt).toString(),
  },
];
