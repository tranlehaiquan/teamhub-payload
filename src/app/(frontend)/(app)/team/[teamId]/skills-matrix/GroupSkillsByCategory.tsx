'use client';
import React from 'react';
import { Category, Skill, TeamSkill } from '@/payload-types';
import { api } from '@/trpc/react';
import { TableCell, TableRow } from '@/components/ui/table';
import { groupBy } from 'lodash';
import { toast } from 'sonner';
import RequirementIndicator from '@/components/RequirementIndicator/RequirementIndicator';
import { TeamMemberSkillCell } from './TeamMemberSkillCell';

type UserSkill = {
  id: number | string;
  user: number;
  skill: number;
  currentLevel: number | null;
  desiredLevel: number | null;
};

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
  userSkills: UserSkill[];
}) => {
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const userSkillsByUserId = groupBy(userSkills, 'user');
  const [levels] = api.global.getLevels.useSuspenseQuery();
  const utils = api.useUtils();
  const updateUserSkills = api.team.updateUserSkills.useMutation();
  const [teamRequirements] = api.team.getTeamRequirements.useSuspenseQuery(teamId);

  const getUserSkill = (userId: number, skillId: number) => {
    const skills = userSkillsByUserId[userId];
    const skill = skills?.find((s) => s.skill === skillId);

    if (!skill) return undefined;

    return {
      id: skill.id,
      skill: skill.skill,
      current: skill.currentLevel,
      desired: skill.desiredLevel,
    };
  };

  const getTeamRequirementsBySkillId = (skillId: number) => {
    const teamRequirementsForSkill = teamRequirements.docs.find(
      (teamRequirement) => (teamRequirement.skill as Skill).id === skillId,
    );

    return teamRequirementsForSkill;
  };

  const handleUpdateTeamUserSkills = async ({
    id,
    current,
    desired,
    skill,
    user,
  }: {
    id?: number;
    skill: number;
    user: number;
    current: number | null;
    desired: number | null;
  }) => {
    try {
      await updateUserSkills.mutateAsync([
        { id, skill, user, currentLevel: current, desiredLevel: desired },
      ]);
      await utils.team.getTeamUserSkills.invalidate(teamId);
      toast.success('Skill updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      <GroupHeader name={category.title} />
      {teamSkills.map(({ skill }) => (
        <TableRow key={(skill as Skill).id} className="group">
          <TableCell>{(skill as Skill).name}</TableCell>
          <TableCell>
            <div className="flex items-center justify-center">
              <RequirementIndicator skill={skill as Skill} />
              {JSON.stringify(getTeamRequirementsBySkillId((skill as Skill).id))}
            </div>
          </TableCell>

          {teamMembers.map((teamMember) => (
            <TeamMemberSkillCell
              key={teamMember.id}
              teamMember={teamMember}
              skill={skill as Skill}
              userSkill={getUserSkill(teamMember.user.id, (skill as Skill).id)}
              levels={levels}
              onUpdateSkill={handleUpdateTeamUserSkills}
            />
          ))}
        </TableRow>
      ))}
    </>
  );
};
