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
import { api } from '@/trpc/react';
import { Edit } from 'lucide-react';
import LevelSkillSelection from '../LevelSkillSelection/LevelSkillSelection';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRequirementForm } from './useRequirementForm';
import { RequirementDisplay } from './RequirementDisplay';

type Props = {
  skill: {
    id: number;
    name: string;
  };
  teamRequirements?: {
    desiredLevel: number;
    desiredMembers: number;
    numberOfUserSkillsWithSameSkillAndDesiredLevel: number;
  }[];
  teamId: number;
};

const DialogRequirementIndicator: React.FC<Props> = ({ skill, teamRequirements, teamId }) => {
  const [open, setOpen] = useState(false);
  const [levels] = api.global.getLevels.useSuspenseQuery();
  const utils = api.useUtils();
  const { formMethods, fields } = useRequirementForm(levels, teamRequirements || []);

  const updateRequirements = api.team.updateTeamRequirements.useMutation({
    onSuccess: () => {
      utils.team.getTeamRequirements.invalidate();
      toast.success('Skill requirement updated');
      setOpen(false);
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
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} aria-label="Update skill requirement">
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer p-1 rounded">
          {teamRequirements && (
            <RequirementDisplay requirements={teamRequirements} levels={levels} />
          )}
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

        <Button
          onClick={handleOnSubmit}
          disabled={updateRequirements.isPending || formMethods.formState.isSubmitting}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRequirementIndicator;
