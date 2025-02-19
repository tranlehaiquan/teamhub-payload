'use client';
import React, { useEffect } from 'react';
import { UsersSkill } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import LevelSkillSelection from '@/components/LevelSkillSelection/LevelSkillSelection';

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

const DialogUpdateUserSkill = ({
  userSkill,
  onClose,
}: {
  userSkill?: UsersSkill;
  onClose: () => void;
}) => {
  const updateCurrentUserSkillMutation = api.me.updateUserSkill.useMutation();
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

    const result = await updateCurrentUserSkillMutation.mutateAsync({
      id: userSkill.id,
      desiredLevel: values.desiredLevel ? Number(values.desiredLevel) : undefined,
      currentLevel: values.currentLevel ? Number(values.currentLevel) : undefined,
    });

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

                    <LevelSkillSelection
                      level={field.value ? Number(field.value) : undefined}
                      onChange={(level) => {
                        field.onChange(level);
                      }}
                    />
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

                    <LevelSkillSelection
                      level={field.value ? Number(field.value) : undefined}
                      onChange={(level) => {
                        field.onChange(level);
                      }}
                    />
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
