import { Skill } from '@/payload-types';
import { api } from '@/trpc/server';
import { Card } from '@/components/ui/card';
import React from 'react';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const { teamId } = await params;
  const team = await api.team.getTeamById(Number(teamId));
  const teamSkills = await api.team.getTeamSkills(Number(teamId));
  const teamRequirements = await api.team.getTeamRequirement(Number(teamId));

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

export default Page;
