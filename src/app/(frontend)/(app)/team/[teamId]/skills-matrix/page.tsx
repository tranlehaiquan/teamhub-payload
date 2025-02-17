import React from 'react';
import SkillMatrix from './SkillMatrix';
import TeamSkillsMatrix from '@/components/team-skills-matrix';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const { teamId } = await params;

  return (
    <>
      <SkillMatrix teamId={teamId} />
      <TeamSkillsMatrix />
    </>
  );
};

export default Page;
