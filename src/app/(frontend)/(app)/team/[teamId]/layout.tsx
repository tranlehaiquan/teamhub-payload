import { api, HydrateClient } from '@/trpc/server';

const Layout = async ({
  params,
  children,
}: {
  params: Promise<{ teamId: string }>;
  children: any;
}) => {
  const { teamId } = await params;
  void api.team.getTeamById.prefetch(Number(teamId));
  void api.team.getTeamSkills.prefetch(Number(teamId));
  void api.team.getTeamRequirements.prefetch(Number(teamId));
  void api.team.getTeamMembers.prefetch(Number(teamId));

  return <HydrateClient>{children}</HydrateClient>;
};

export default Layout;
