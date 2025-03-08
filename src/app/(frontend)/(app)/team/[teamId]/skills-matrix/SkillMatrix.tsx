'use client';
import React from 'react';
import SectionCard from '@/components/SectionCard/SectionCard';
import { UserAvatarOnlyByUserId } from '@/components/UserProfile/UserAvatar';
import { Category, Skill, User } from '@/payload-types';
import { api } from '@/trpc/react';
import uniqBy from 'lodash/uniqBy';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import groupBy from 'lodash/groupBy';
import DialogTeamSkills from './DialogTeamSkills';
import { Button } from '@/components/ui/button';
import { GroupSkillsByCategory } from './GroupSkillsByCategory';
import SkillLevelLegend from '@/components/SkillLevelLegend/SkillLevelLegend';

interface Props {
  className?: string;
  teamId: number;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(teamId);
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const [teamUserSkills] = api.team.getTeamUserSkills.useSuspenseQuery(teamId);
  const [levels] = api.global.getLevels.useSuspenseQuery();
  const userSkills = teamUserSkills.flatMap((teamMember) => teamMember.userSkills);

  const categories = uniqBy(
    teamSkills.docs.map((teamSkill) => (teamSkill.skill as Skill).category as Category),
    'id',
  );
  const groupSkillsByCategory = groupBy(
    teamSkills.docs,
    (teamSkill) => ((teamSkill.skill as Skill)?.category as Category)?.id,
  );
  const users = teamMembers.map((teamMember) => teamMember.user as User);

  const mergedUserSkills = userSkills as {
    id: number | string;
    user: number;
    skill: number;
    currentLevel: number | null;
    desiredLevel: number | null;
  }[];

  return (
    <div className="p-4">
      <h1 className="text-lg mb-4">Skill matrix {team.name}</h1>

      <SectionCard title="todo" className="mb-4">
        <ul>
          <li>Find way to show team requirements</li>
        </ul>
      </SectionCard>

      <div className="grid gap-4">
        <SectionCard title="Skills">
          <div className="flex justify-between items-center mb-2">
            <SkillLevelLegend levels={levels} />
            <DialogTeamSkills teamId={teamId}>
              <Button className="btn">Update team skills</Button>
            </DialogTeamSkills>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="w-[250px] text-center">Requirements</TableHead>
                {users.map((user) => (
                  <TableHead key={user.id} title={user.email} className="w-[250px] py-2">
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
                  key={category.id}
                  category={category}
                  teamSkills={groupSkillsByCategory[category.id]}
                  teamId={teamId}
                  userSkills={mergedUserSkills}
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
