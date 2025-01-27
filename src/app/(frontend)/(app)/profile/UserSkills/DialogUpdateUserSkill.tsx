'use client';
import React, { useEffect } from 'react';
import { UsersSkill } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateCurrentUserSkill } from '@/services/server/currentUser';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

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

const LEVELS = [
  {
    value: 1,
    label: 'Fundamental',
  },
  {
    value: 2,
    label: 'Novice',
  },
  {
    value: 3,
    label: 'Intermediate',
  },
  {
    value: 4,
    label: 'Advanced',
  },
  {
    value: 5,
    label: 'Expert',
  },
];

const DialogUpdateUserSkill = ({
  userSkill,
  onClose,
}: {
  userSkill?: UsersSkill;
  onClose: () => void;
}) => {
  const utils = api.useUtils();
  const form = useForm({
    defaultValues: {
      currentLevel: userSkill?.currentLevel,
      desiredLevel: userSkill?.desiredLevel,
    },
    resolver: zodResolver(zSchema),
  });

  useEffect(() => {
    form.reset({
      currentLevel: userSkill?.currentLevel,
      desiredLevel: userSkill?.desiredLevel,
    });
  }, [userSkill]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!userSkill) return;

    const result = await updateCurrentUserSkill(
      userSkill.id,
      values as {
        currentLevel?: number;
        desiredLevel?: number;
      },
    );

    if (result.success) {
      utils.me.userSkill.invalidate();
      toast.success(`Skill updated successfully`);
      form.reset();
      onClose();
    }
  });

  return (
    <Dialog open={Boolean(userSkill)} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Skill</DialogTitle>
          <Form {...form}>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your current level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level.value} value={String(level.value)}>
                            {level.value} - {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* desired level */}
              <FormField
                control={form.control}
                name="desiredLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your desired level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level.value} value={String(level.value)}>
                            {level.value} - {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                Update
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateUserSkill;
