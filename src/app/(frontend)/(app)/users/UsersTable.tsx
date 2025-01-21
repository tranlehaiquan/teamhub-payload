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
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUsersQuery } from '@/tanQueries';
import { Profile } from '@/payload-types';

const UsersTable: React.FC = () => {
  const { data: userDocs } = useSuspenseQuery(getUsersQuery);
  const users = userDocs.docs;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verify email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{(user.profile as Profile).firstName}</TableCell>
            <TableCell>{(user.profile as Profile).lastName}</TableCell>
            <TableCell>{user.roles?.join(', ')}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user._verified && 'Yes'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
