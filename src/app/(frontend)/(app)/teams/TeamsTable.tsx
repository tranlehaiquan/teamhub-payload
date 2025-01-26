'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/payload-types';
import { api } from '@/trpc/react';

const TeamsTable: React.FC = () => {
  const [{ docs: teams = [] }] = api.team.getTeams.useSuspenseQuery({});

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Team Name</TableHead>
          <TableHead>Owner Name</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Created at</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.id}</TableCell>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell className="font-medium">{(team.owner as User).email}</TableCell>
            <TableCell>{team.members?.docs?.length}</TableCell>
            <TableCell className="font-medium">
              {team.createdAt && new Date(team.createdAt).toString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamsTable;
