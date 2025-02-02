'use client';
import { Card } from '@/components/ui/card';
import { Skill } from '@/payload-types';
import { api } from '@/trpc/react';
import React from 'react';

interface Props {
  className?: string;
  teamId: string;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(Number(teamId));
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(Number(teamId));
  const [teamRequirements] = api.team.getTeamRequirement.useSuspenseQuery(Number(teamId));

  return (
    <div className="p-4">
      <h1 className="text-lg mb-4">Skill matrix {team.name}</h1>

      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="text-lg mb-2">Skills</h2>
          {teamSkills.docs.map((teamSkill) => (
            <div key={teamSkill.id}>{JSON.stringify((teamSkill.skill as Skill).name)}</div>
          ))}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg mb-2">Requirements</h2>
          {teamRequirements.docs.map((requirement) => (
            <div key={requirement.id}>
              <p>Skill: {(requirement.skill as Skill).name}</p>
              <p>Desired Level {requirement.desiredLevel}</p>
              <p>Desired Member Count {requirement.desiredMembers}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default SkillMatrix;
