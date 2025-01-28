'use client';
import { api } from '@/trpc/react';
import React from 'react';

interface Props {
  className?: string;
  teamId: string;
}

const TeamMembers: React.FC<Props> = ({ teamId }) => {
  const [members] = api.team.getTeamMembers.useSuspenseQuery(Number(teamId));

  return (
    <div>
      {members.map((member) => (
        <div key={member.id}>{member.user?.email}</div>
      ))}
    </div>
  );
};

export default TeamMembers;
