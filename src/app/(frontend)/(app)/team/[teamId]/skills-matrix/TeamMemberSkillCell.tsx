import type { Level } from '@/payload-types';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SkillProgressIndicator from '@/components/SkillProgressIndicator/SkillProgressIndicator';

type TeamMemberSkillCellProps = {
  user: any;
  skill: {
    id: number;
    name: string;
  };
  userSkill?: {
    id: number | string;
    skill: number;
    current: number | null;
    desired: number | null;
  };
  levels: Level;
  onUpdateSkill: (params: {
    id?: number;
    skill: number;
    user: number;
    current: number | null;
    desired: number | null;
  }) => Promise<void>;
};

export const TeamMemberSkillCell = ({
  user,
  skill,
  userSkill,
  levels,
  onUpdateSkill,
}: TeamMemberSkillCellProps) => {
  return (
    <TableCell className="text-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <SkillProgressIndicator
                levels={levels}
                {...userSkill}
                onSubmit={async (current, desired) => {
                  await onUpdateSkill({
                    id: userSkill?.id as number | undefined,
                    skill: skill.id,
                    user: user.id,
                    current,
                    desired,
                  });
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-semibold">{skill.name}</div>
              <div>Current: {userSkill?.current || '-'}</div>
              <div>Desired: {userSkill?.desired || '-'}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
