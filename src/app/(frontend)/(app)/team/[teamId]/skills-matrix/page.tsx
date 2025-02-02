import React from 'react';
import SkillMatrix from './SkillMatrix';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const { teamId } = await params;

  return <SkillMatrix teamId={teamId} />;
};

export default Page;
