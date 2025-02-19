'use client';
import React from 'react';
import SectionCard from '@/components/SectionCard/SectionCard';
import { UserAvatarOnlyByUserId } from '@/components/UserProfile/UserAvatar';
import { Category, Skill, TeamSkill, User } from '@/payload-types';
import { api } from '@/trpc/react';
import uniqBy from 'lodash/uniqBy';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { groupBy } from 'lodash';
import TeamSkillsMatrix from '@/components/team-skills-matrix';
import DialogTeamSkills from './DialogTeamSkills';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
  teamId: string;
}

const GroupHeader = ({ name }: { name: string }) => (
  <TableRow className="bg-gray-100 dark:bg-gray-700">
    <TableCell colSpan={15} className="font-bold py-2 px-4">
      {name}
    </TableCell>
  </TableRow>
);

const GroupSkillsByCategory = ({
  teamSkills,
  category,
}: {
  teamSkills: TeamSkill[];
  category: Category;
}) => {
  return (
    <>
      <GroupHeader name={category.title} />

      {teamSkills.map(({ skill }) => (
        <TableRow key={(skill as Skill).id}>
          <TableCell>{(skill as Skill).name}</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-center">0%</TableCell>
          <TableCell className="text-center">0</TableCell>
          <TableCell className="text-center">0</TableCell>
        </TableRow>
      ))}
    </>
  );
};

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(Number(teamId));
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(Number(teamId));
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(Number(teamId));
  // const [teamRequirements] = api.team.getTeamRequirement.useSuspenseQuery(Number(teamId));

  const categories = uniqBy(
    teamSkills.docs.map((teamSkill) => (teamSkill.skill as Skill).category as Category),
    'id',
  );
  const groupSkillsByCategory = groupBy(
    teamSkills.docs,
    (teamSkill) => ((teamSkill.skill as Skill)?.category as Category)?.id,
  );

  const users = teamMembers.map((teamMember) => teamMember.user as User);

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
          <DialogTeamSkills teamId={teamId}>
            <Button className="btn">Update team skills</Button>
          </DialogTeamSkills>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>❤️</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                {users.map((user) => (
                  <TableHead key={user.id} title={user.email}>
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
                />
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <TeamSkillsMatrix teamId={teamId} className="mt-4" />
    </div>
  );
};

export default SkillMatrix;
