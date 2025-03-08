'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Level } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LevelSkillSelectionGlobal from '../LevelSkillSelection/LevelSkillSelection';
import LevelSlot from '../LevelSlot';

interface Props {
  className?: string;
  levels: Level;
  current?: number | null;
  desired?: number | null;
  onSubmit: (current: number | null, desired: number | null) => void;
}

const zSchema = z
  .object({
    currentLevel: z.number().optional().nullable(),
    desiredLevel: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.currentLevel && data.desiredLevel && data.currentLevel > data.desiredLevel) {
        return false;
      }

      return true;
    },
    {
      path: ['desiredLevel'],
      message: 'Desired level should be greater than or equal current level',
    },
  );

const SkillProgressIndicator: React.FC<Props> = ({ levels, current, desired, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const currentLevel = levels.items.find((level) => level.level === current);
  const desiredLevel = levels.items.find((level) => level.level === desired);
  const form = useForm({
    defaultValues: {
      currentLevel: current,
      desiredLevel: desired,
    },
    resolver: zodResolver(zSchema),
  });

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleSubmit = form.handleSubmit((data) => {
    setOpen(false);

    onSubmit(data.currentLevel ?? null, data.desiredLevel ?? null);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer p-1 justify-center">
          <LevelSlot level={currentLevel} />
          {!!desired && (
            <>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <LevelSlot level={desiredLevel} />
            </>
          )}
          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Level</DialogTitle>
          <DialogDescription>Set current and desired skill</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid grid-cols-2 space-x-2" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Level</FormLabel>

                  <LevelSkillSelectionGlobal
                    level={field.value ? Number(field.value) : undefined}
                    onChange={(level) => {
                      field.onChange(level);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desiredLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Level</FormLabel>

                  <LevelSkillSelectionGlobal
                    level={field.value ? Number(field.value) : undefined}
                    onChange={(level) => {
                      field.onChange(level);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 col-span-2"
              disabled={form.formState.isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillProgressIndicator;
