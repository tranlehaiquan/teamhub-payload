import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Level, TeamRequirement } from '@/payload-types';

const requirementSchema = z.object({
  desiredLevel: z.number().min(1).nullable(),
  desiredMembers: z.number().min(0).nullable(),
});

export const requirementsListSchema = z.object({
  requirements: z.array(requirementSchema),
});

export type RequirementFormData = z.infer<typeof requirementsListSchema>;

export const useRequirementForm = (levels: Level, teamRequirements: TeamRequirement[]) => {
  const requirementPlaceholder = levels.items.map((level) => {
    const teamRequirement = teamRequirements.find((req) => req.desiredLevel === level.level);

    return {
      desiredLevel: level.level,
      desiredMembers: teamRequirement?.desiredMembers ?? 0,
    };
  });

  const formMethods = useForm<RequirementFormData>({
    resolver: zodResolver(requirementsListSchema),
    defaultValues: {
      requirements: requirementPlaceholder,
    },
  });

  const { fields } = useFieldArray({
    name: 'requirements',
    control: formMethods.control,
  });

  return { formMethods, fields };
};
