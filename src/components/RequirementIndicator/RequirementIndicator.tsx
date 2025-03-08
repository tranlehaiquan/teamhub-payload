'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skill, TeamRequirement } from '@/payload-types';
import { api } from '@/trpc/react';
import { Edit } from 'lucide-react';
import LevelSkillSelection from '../LevelSkillSelection/LevelSkillSelection';
import { cn } from '@/utilities/cn';
import z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  skill: Skill;
  teamRequirements?: TeamRequirement[];
  teamId: number;
};

// Schema list of requirement, each item have desiredLevel, desiredMembers
const requirementSchema = z.object({
  desiredLevel: z.number().min(1).nullable(),
  desiredMembers: z.number().min(0).nullable(),
});

const requirementsListSchema = z.object({
  requirements: z.array(requirementSchema),
});

const RequirementIndicator: React.FC<Props> = ({ skill, teamRequirements, teamId }) => {
  const [open, setOpen] = useState(false);
  const [levels] = api.global.getLevels.useSuspenseQuery();
  // sort teamRequirements by desiredLevel
  const teamRequirementsSorted = teamRequirements?.sort(
    (a, b) => (a.desiredLevel as number) - (b.desiredLevel as number),
  );
  const requirementPlaceholder = levels.items.map((level) => {
    const teamRequirementsItem = teamRequirementsSorted?.find(
      (requirement) => requirement.desiredLevel === level.level,
    );

    return {
      desiredLevel: level.level,
      desiredMembers: teamRequirementsItem?.desiredMembers || 0,
    };
  });

  const formMethods = useForm({
    resolver: zodResolver(requirementsListSchema),
    defaultValues: {
      requirements: requirementPlaceholder,
    },
  });

  const { fields } = useFieldArray({
    name: 'requirements',
    control: formMethods.control,
  });

  const utils = api.useUtils();
  const updateRequirements = api.team.updateTeamRequirements.useMutation({
    onSuccess: () => {
      utils.team.getTeamRequirements.invalidate();
      toast.success('Skill requirement updated');
    },
    onError: () => {
      toast.error('Failed to update skill requirement');
    },
  });

  const handleOnSubmit = formMethods.handleSubmit((data) => {
    updateRequirements.mutate({
      teamId,
      skillId: skill.id,
      requirements: data.requirements,
    });

    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} aria-label="Update skill requirement">
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer p-1 rounded">
          <div className="grid gap-2">
            {teamRequirementsSorted?.map((requirement) => {
              const level = levels.items.find((level) => level.level === requirement.desiredLevel);

              return (
                <div key={requirement.desiredLevel} className="flex items-center space-x-2">
                  <div
                    className={cn(
                      `w-6 h-6 rounded-full flex items-center justify-center dark:text-black`,
                      level?.levelColor ?? 'bg-gray-200',
                    )}
                    style={{ backgroundColor: level?.levelColor }}
                  >
                    {level?.level}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">0</span>/{requirement.desiredMembers}
                  </div>
                </div>
              );
            })}
          </div>
          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Requirement</DialogTitle>
          <DialogDescription>
            Set required level and number of team members for {skill.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr] gap-4 items-end">
              <div>
                <LevelSkillSelection
                  level={formMethods.watch(`requirements.${index}.desiredLevel`)}
                  onChange={(level) => {
                    formMethods.setValue(`requirements.${index}.desiredLevel`, level);
                  }}
                  disabled
                />
              </div>

              <div>
                <Select
                  value={formMethods.watch(`requirements.${index}.desiredMembers`)?.toString()}
                  onValueChange={(value) => {
                    formMethods.setValue(`requirements.${index}.desiredMembers`, Number(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleOnSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementIndicator;
