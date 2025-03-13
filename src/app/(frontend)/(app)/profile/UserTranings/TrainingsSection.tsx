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
import DialogTraining, { FormValues } from './DialogTraining';
import { Button } from '@/components/ui/button';
import { Pen, Plus, XIcon } from 'lucide-react';
import { toast } from 'sonner';

const TrainingsSection: React.FC = () => {
  const [data] = api.me.getTrainings.useSuspenseQuery();
  const trainings = data?.docs;
  const utils = api.useUtils();
  const createTrainingMutation = api.me.addTraining.useMutation({
    onSuccess: () => {
      utils.me.getTrainings.invalidate();
      toast.success('Training added successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateTrainingMutation = api.me.updateTraining.useMutation({
    onSuccess: () => {
      utils.me.getTrainings.invalidate();
      toast.success('Training updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const removeTrainingMutation = api.me.removeTraining.useMutation({
    onSuccess: () => {
      utils.me.getTrainings.invalidate();
      toast.success('Training removed successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnSubmit = async (data: FormValues) => {
    await createTrainingMutation.mutateAsync(data);
  };

  const handleRemove = async (id: number) => {
    await removeTrainingMutation.mutateAsync(id);
  };

  const handleUpdate = async (data: FormValues & { id: number }) => {
    await updateTrainingMutation.mutateAsync(data);
  };

  return (
    <SectionCard title="Trainings">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training) => (
            <TableRow key={training.id}>
              <TableCell>{training.name}</TableCell>
              <TableCell>{training.link}</TableCell>
              <TableCell>{training.description}</TableCell>
              <TableCell>{training.status}</TableCell>
              <TableCell className="text-right">
                <DialogTraining
                  defaultValues={{
                    startDate: training.startDate ? new Date(training.startDate) : undefined,
                    endDate: training.endDate ? new Date(training.endDate) : undefined,
                    link: training.link ?? '',
                    description: training.description ?? '',
                    status: training.status ?? undefined,
                    name: training.name ?? '',
                  }}
                  onSubmit={(data) =>
                    handleUpdate({
                      id: training.id,
                      ...data,
                    })
                  }
                >
                  <Button size={'icon'} variant={'ghost'} className="rounded-full">
                    <Pen />
                  </Button>
                </DialogTraining>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  className="rounded-full"
                  onClick={() => handleRemove(training.id)}
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogTraining onSubmit={handleOnSubmit}>
        <Button variant={'default'} className="mt-4">
          <Plus className="size-4" />
          Add Training
        </Button>
      </DialogTraining>
    </SectionCard>
  );
};

export default TrainingsSection;
