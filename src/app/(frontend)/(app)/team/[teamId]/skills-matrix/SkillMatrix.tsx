'use client';
import type React from 'react';
import SectionCard from '@/components/SectionCard/SectionCard';
import { UserAvatarOnlyByUserId } from '@/components/UserProfile/UserAvatar';
import { Category, Skill, type User } from '@/payload-types';
import { api } from '@/trpc/react';
import uniqBy from 'lodash/uniqBy';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import groupBy from 'lodash/groupBy';
import { Button } from '@/components/ui/button';
import SkillLevelLegend from '@/components/SkillLevelLegend/SkillLevelLegend';
import DialogTeamSkills from './DialogTeamSkills';
import { GroupSkillsByCategory } from './GroupSkillsByCategory';

interface Props {
  className?: string;
  teamId: number;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(teamId);
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const [teamUserSkills] = api.team.getUserSkills.useSuspenseQuery(teamId);
  const [levels] = api.global.getLevels.useSuspenseQuery();

  const categories = uniqBy(teamSkills.docs, (teamSkill) => teamSkill.skillCategory?.id).map(
    (i) => i.skillCategory,
  );
  const groupSkillsByCategory = groupBy(
    teamSkills.docs,
    (teamSkill) => teamSkill.skillCategory?.id,
  );
  const users = teamMembers.map((teamMember) => teamMember.user as User);

  return (
    <div className="p-4">
      <h1 className="text-lg mb-4">Skill matrix {team.name}</h1>

      <div className="grid gap-4">
        <SectionCard title="Skills" className="overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <SkillLevelLegend levels={levels} />
            <DialogTeamSkills teamId={teamId}>
              <Button className="btn">Update team skills</Button>
            </DialogTeamSkills>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10"></TableHead>
                <TableHead className="w-[250px] text-center">Requirements</TableHead>
                {users.map((user) => (
                  <TableHead key={user.id} title={user.email} className="py-2">
                    <div className="flex items-center flex-col gap-1">
                      <UserAvatarOnlyByUserId userId={user.id} />
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category) => (
                <GroupSkillsByCategory
                  key={category?.id}
                  category={category as any}
                  teamSkills={groupSkillsByCategory[category?.id ?? ''] as any}
                  teamId={teamId}
                  userSkills={teamUserSkills as any}
                />
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
};

export default SkillMatrix;
