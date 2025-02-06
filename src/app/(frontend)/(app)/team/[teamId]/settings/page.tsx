import React from 'react';
import TeamSettingGeneralForm from './TeamSettingGeneralForm';
import TeamMembers from './Members/TeamMembers';
import DangerSetting from './DangerSetting';
import SectionCard from '@/components/SectionCard/SectionCard';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const teamId = (await params).teamId;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <SectionCard title="General">
        <TeamSettingGeneralForm teamId={teamId} />
      </SectionCard>

      <SectionCard title="Members">
        <TeamMembers teamId={teamId} />
      </SectionCard>

      <DangerSetting teamId={teamId} />
    </div>
  );
};

export default Page;
