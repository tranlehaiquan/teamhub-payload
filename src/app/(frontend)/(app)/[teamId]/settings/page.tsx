import { api, HydrateClient } from '@/trpc/server';
import React from 'react';
import { Card } from '@/components/ui/card';
import TeamSettingGeneralForm from './TeamSettingGeneralForm';
import TeamMembers from './TeamMembers';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const teamId = (await params).teamId;
  await api.team.getTeamById.prefetch(Number(teamId));
  await api.team.getTeamMembers.prefetch(Number(teamId));

  return (
    <HydrateClient>
      <div className="p-4">
        <Card className="p-4 mb-4">
          <h2 className="mb-2 text-lg">General</h2>

          <TeamSettingGeneralForm teamId={teamId} />
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-lg">Members</h2>

          <TeamMembers teamId={teamId} />
        </Card>
      </div>
    </HydrateClient>
  );
};

export default Page;
