'use client';
import React, { useState } from 'react';
import { api } from '@/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Select from 'react-select';
import { Skill } from '@/payload-types';
import { useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  teamId: number;
}

const schema = zod.object({
  skills: zod.array(
    zod.object({
      value: zod.number(),
      label: zod.string(),
    }),
  ),
});

const DialogTeamSkills: React.FC<React.PropsWithChildren<Props>> = ({ teamId, children }) => {
  const [skills] = api.skill.getSkills.useSuspenseQuery({
    page: 1,
    limit: 50,
  });
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(Number(teamId));
  const [open, setOpen] = useState(false);
  const updateTeamSkillsMutation = api.team.updateTeamSkills.useMutation();
  const utils = api.useUtils();

  const selectedOptions = teamSkills.docs.map((skill) => ({
    label: (skill.skill as Skill).name,
    value: (skill.skill as Skill).id,
  }));

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: selectedOptions,
    },
  });

  const skillOptions = skills.docs.map((skill) => ({
    label: skill.name,
    value: skill.id,
  }));

  const handleSubmit = formMethods.handleSubmit(async (data) => {
    const skills = data.skills.map((skill) => skill.value);

    try {
      await updateTeamSkillsMutation.mutateAsync({
        teamId: Number(teamId),
        skills,
      });

      await utils.team.getTeamSkills.invalidate(Number(teamId));

      toast.success('Team skills updated');
    } catch {
      toast.error('Failed to update team skills');
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Skills</DialogTitle>
        </DialogHeader>

        <Select
          isMulti
          options={skillOptions}
          defaultValue={selectedOptions}
          onChange={(value) => {
            formMethods.setValue('skills', [...value]);
          }}
        />

        <Button
          onClick={handleSubmit}
          disabled={formMethods.formState.isSubmitting || formMethods.formState.isDirty}
          type="submit"
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTeamSkills;
