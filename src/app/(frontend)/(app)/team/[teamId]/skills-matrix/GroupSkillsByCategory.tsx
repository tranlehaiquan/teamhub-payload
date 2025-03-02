'use client';
import React from 'react';
import { Category, Skill, TeamSkill, UsersSkill } from '@/payload-types';
import { api } from '@/trpc/react';
import { TableCell, TableRow } from '@/components/ui/table';
import { groupBy, isUndefined } from 'lodash';
import SkillProgressIndicator from '@/components/SkillProgressIndicator/SkillProgressIndicator';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GroupHeader = ({ name }: { name: string }) => (
  <TableRow className="bg-gray-100 dark:bg-gray-700">
    <TableCell colSpan={15} className="font-bold py-2 px-4">
      {name}
    </TableCell>
  </TableRow>
);

export const GroupSkillsByCategory = ({
  teamSkills,
  category,
  teamId,
  userSkills,
}: {
  teamSkills: TeamSkill[];
  category: Category;
  teamId: number;
  userSkills: {
    id: number | string;
    user: number;
    skill: number;
    currentLevel: number | null;
    desiredLevel: number | null;
  }[];
}) => {
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const userSKillsByUserId = groupBy(userSkills, 'user');
  const [levels] = api.global.getLevels.useSuspenseQuery();
  const utils = api.useUtils();
  const updateUserSkills = api.team.updateUserSkills.useMutation();

  const getUserSkill = (userId: number, skillId: number) => {
    const userSkills = userSKillsByUserId[userId];
    const userSkill = userSkills?.find((userSkill) => userSkill.skill === skillId);

    if (isUndefined(userSkill)) {
      return undefined;
    }

    return {
      id: userSkill.id,
      skill: userSkill.skill,
      current: userSkill.currentLevel,
      desired: userSkill.desiredLevel,
    };
  };

  const handleUpdateTeamUserSkills = async ({
    id,
    current,
    desired,
    skill,
    user,
  }: {
    id: number | undefined;
    skill: number;
    user: number;
    current: number | null;
    desired: number | null;
  }) => {
    try {
      await updateUserSkills.mutateAsync([
        {
          id,
          skill,
          user,
          currentLevel: current,
          desiredLevel: desired,
        },
      ]);

      await utils.team.getTeamUserSkills.invalidate(teamId);
      toast.success('Skill updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      <GroupHeader name={category.title} />

      {teamSkills.map(({ skill }) => (
        <TableRow key={(skill as Skill).id} className="group">
          <TableCell>{(skill as Skill).name}</TableCell>
          {teamMembers.map((teamMember) => {
            const userId = teamMember.user.id as number;
            const userSkill = getUserSkill(userId, (skill as Skill).id);

            return (
              <TableCell key={teamMember.id} className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <SkillProgressIndicator
                          levels={levels}
                          {...getUserSkill(teamMember.user.id, (skill as Skill).id)}
                          onSubmit={async (current, desired) => {
                            await handleUpdateTeamUserSkills({
                              id: userSkill?.id as number | undefined,
                              skill: (skill as Skill).id,
                              user: userId,
                              current,
                              desired,
                            });
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-semibold">{(skill as Skill).name}</div>
                        <div>Current: {userSkill?.current || '-'}</div>
                        <div>Desired: {userSkill?.desired || '-'}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};
