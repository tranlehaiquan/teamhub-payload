'use client';
import SectionCard from '@/components/SectionCard/SectionCard';
import { Skill } from '@/payload-types';
import { api } from '@/trpc/react';
import { uniqBy } from 'lodash';
import React from 'react';

interface Props {
  className?: string;
  teamId: string;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(Number(teamId));
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(Number(teamId));
  const [teamRequirements] = api.team.getTeamRequirement.useSuspenseQuery(Number(teamId));

  const categories = uniqBy(
    teamSkills.docs.map((teamSkill) => (teamSkill.skill as Skill).category),
    'id',
  );

  return (
    <div className="p-4">
      <h1 className="text-lg mb-4">Skill matrix {team.name}</h1>

      <div className="grid gap-4">
        <SectionCard title="Skills">Hello</SectionCard>
      </div>
    </div>
  );
};

export default SkillMatrix;
