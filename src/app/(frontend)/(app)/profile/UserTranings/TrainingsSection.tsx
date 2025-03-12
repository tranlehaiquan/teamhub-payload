'use client';
import React from 'react';
import SectionCard from '@/components/SectionCard/SectionCard';
import { api } from '@/trpc/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TrainingsSection: React.FC = () => {
  const [data] = api.me.getTrainings.useSuspenseQuery();
  const trainings = data?.docs;

  return (
    <SectionCard title="Trainings">
      {trainings.map((training) => (
        <Table key={training.id}>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{training.name}</TableCell>
              <TableCell>{training.link}</TableCell>
              <TableCell>{training.description}</TableCell>
              <TableCell>{training.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </SectionCard>
  );
};

export default TrainingsSection;
