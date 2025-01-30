import React from 'react';

const Page = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const { teamId } = await params;

  return <div className="p-4">Skill matrix {teamId}</div>;
};

export default Page;
