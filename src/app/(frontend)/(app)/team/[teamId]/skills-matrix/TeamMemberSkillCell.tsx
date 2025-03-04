import { Level, Skill } from '@/payload-types';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SkillProgressIndicator from '@/components/SkillProgressIndicator/SkillProgressIndicator';

type TeamMemberSkillCellProps = {
  teamMember: any; // Type this properly based on your team member type
  skill: Skill;
  userSkill:
    | {
        id: number | string;
        skill: number;
        current: number | null;
        desired: number | null;
      }
    | undefined;
  levels: Level; // Type this properly based on your levels type
  onUpdateSkill: (params: {
    id?: number;
    skill: number;
    user: number;
    current: number | null;
    desired: number | null;
  }) => Promise<void>;
};

export const TeamMemberSkillCell = ({
  teamMember,
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
                    user: teamMember.user.id,
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
