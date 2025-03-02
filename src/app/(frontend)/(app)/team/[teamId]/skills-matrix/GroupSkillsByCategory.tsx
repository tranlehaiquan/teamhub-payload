'use client';
import React from 'react';
import { Category, Skill, TeamSkill, UsersSkill } from '@/payload-types';
import { api } from '@/trpc/react';
import { TableCell, TableRow } from '@/components/ui/table';
import { groupBy, isUndefined } from 'lodash';
import LevelSkillSelection from '@/components/LevelSkillSelection/LevelSkillSelection';
import SkillProgressIndicator from '@/components/SkillProgressIndicator/SkillProgressIndicator';

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
  onUpdateUserSkillLevel,
}: {
  teamSkills: TeamSkill[];
  category: Category;
  teamId: number;
  onUpdateUserSkillLevel: (input: {
    id: number | string | undefined;
    user: number;
    skill: number;
    currentLevel: number | null;
  }) => void;
  userSkills: {
    id: number | string;
    user: number;
    skill: number;
    currentLevel: number | null;
  }[];
}) => {
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const userSKillsByUserId = groupBy(userSkills, 'user');
  const [levels] = api.global.getLevels.useSuspenseQuery();

  const getUserSkillLevel = (userId: number, skillId: number) => {
    const userSkills = userSKillsByUserId[userId];
    const currentLevel = userSkills?.find((userSkill) => userSkill.skill === skillId)?.currentLevel;

    if (isUndefined(currentLevel)) {
      return undefined;
    }

    return currentLevel ? Number(currentLevel) : undefined;
  };

  const getUserSkill = (userId: number, skillId: number) => {
    const userSkills = userSKillsByUserId[userId];
    const userSkill = userSkills?.find((userSkill) => userSkill.skill === skillId);

    if (isUndefined(userSkill)) {
      return undefined;
    }

    return userSkill as UsersSkill;
  };

  const handleUpdateSkillLevel = async (user: number, skill: number, currentLevel: number) => {
    const userSkillsId = userSkills.find((userSkill) => {
      return userSkill.user === user && userSkill.skill === skill;
    })?.id;

    onUpdateUserSkillLevel({
      id: userSkillsId,
      user,
      skill,
      currentLevel: currentLevel,
    });
  };

  return (
    <>
      <GroupHeader name={category.title} />

      {teamSkills.map(({ skill }) => (
        <TableRow key={(skill as Skill).id}>
          <TableCell>{(skill as Skill).name}</TableCell>
          {teamMembers.map((teamMember) => (
            <TableCell key={teamMember.id} className="text-center">
              <SkillProgressIndicator
                levels={levels}
                userSkill={getUserSkill(
                  teamMember.user?.id as number,
                  (skill as Skill).id as number,
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
