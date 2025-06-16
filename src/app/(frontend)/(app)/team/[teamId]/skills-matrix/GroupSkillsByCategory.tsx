'use client';
import React from 'react';
import { Skill } from '@/payload-types';
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
    <TableCell colSpan={15} className="font-bold py-2 relative px-0">
      <p className="px-4 sticky left-0 inline-block">{name}</p>
    </TableCell>
  </TableRow>
);

export const GroupSkillsByCategory = ({
  teamSkills,
  category,
  teamId,
  userSkills,
}: {
  teamSkills: {
    id: number;
    skill: {
      id: number;
      name: string;
    };
  }[];
  category: {
    id: number;
    title: string;
  };
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
    const teamRequirementsForSkill = teamRequirements.filter(
      (teamRequirement) => teamRequirement.skill === skillId,
    );

    return teamRequirementsForSkill.map((teamRequirement) => ({
      ...teamRequirement,
      desiredLevel: teamRequirement.desiredLevel ? Number(teamRequirement.desiredLevel) : null,
      desiredMembers: teamRequirement.desiredMembers
        ? Number(teamRequirement.desiredMembers)
        : null,
      numberOfUserSkillsWithSameSkillAndDesiredLevel:
        teamRequirement.numberOfUserSkillsWithSameSkillAndDesiredLevel,
    }));
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
      await utils.team.getUserSkills.invalidate(teamId);
      toast.success('Skill updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      <GroupHeader name={category.title} />
      {teamSkills.map(({ skill }) => (
        <TableRow key={skill.id} className="group">
          <TableCell className="sticky left-0 bg-white dark:bg-accent">{skill.name}</TableCell>
          <TableCell>
            <div className="flex items-center justify-center">
              <RequirementIndicator
                skill={skill}
                teamRequirements={
                  getTeamRequirementsBySkillId(skill.id)?.map((req) => ({
                    ...req,
                    skill: req.skill as number,
                    desiredLevel: req.desiredLevel || 0,
                    desiredMembers: req.desiredMembers || 0,
                  })) || []
                }
                teamId={teamId}
              />
            </div>
          </TableCell>

          {teamMembers.map((teamMember) => (
            <TeamMemberSkillCell
              key={teamMember.id}
              user={teamMember.user}
              skill={skill}
              userSkill={getUserSkill(teamMember.user.id, skill.id)}
              levels={levels}
              onUpdateSkill={handleUpdateTeamUserSkills}
            />
          ))}
        </TableRow>
      ))}
    </>
  );
};
