'use client';
import type React from 'react';
import SectionCard from '@/components/SectionCard/SectionCard';
import { type User } from '@/payload-types';
import { api } from '@/trpc/react';
import uniqBy from 'lodash/uniqBy';
import { Button } from '@/components/ui/button';
import SkillLevelLegend from '@/components/SkillLevelLegend/SkillLevelLegend';
import DialogTeamSkills from './DialogTeamSkills';
import SkillMatrixTable, { type TeamSkill } from './SkillMatrixTable';

interface Props {
  className?: string;
  teamId: number;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(teamId);
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const [teamUserSkills] = api.team.getUserSkills.useSuspenseQuery(teamId);
  const [levels] = api.global.getLevels.useSuspenseQuery();

  const categories = uniqBy(teamSkills, (teamSkill) => teamSkill.skillCategory?.id).map(
    (i) => i.skillCategory,
  ) as {
    id: number;
    title: string;
  }[];

  // Fix teamUserSkills to remove null users
  const filteredTeamUserSkills = teamUserSkills
    .filter((us) => us.user !== null)
    .map((us) => ({
      ...us,
      user: us.user as number,
    }));

  const members = teamMembers.map((teamMember) => teamMember.user as User);

  return (
    <div className="p-4">
      <div className="grid gap-4">
        <SectionCard className="overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-medium">Skill matrix {team.name}</h1>
              <p className="text-sm text-gray-500">
                Team skill requirements vs current capabilities
              </p>
            </div>

            <DialogTeamSkills teamId={teamId}>
              <Button className="btn">Update team skills</Button>
            </DialogTeamSkills>
          </div>
          <SkillLevelLegend levels={levels} className="my-4" />

          <SkillMatrixTable
            members={members}
            categories={categories}
            teamSkills={teamSkills as TeamSkill[]}
            teamId={teamId}
            teamUserSkills={filteredTeamUserSkills}
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default SkillMatrix;
