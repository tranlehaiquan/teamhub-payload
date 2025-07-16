import type React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserAvatarOnlyByUserId } from '@/components/UserProfile/UserAvatar';
import type { User } from '@/payload-types';
import { GroupSkillsByCategory } from './GroupSkillsByCategory';
import groupBy from 'lodash/groupBy';

// Match the UserSkill type from GroupSkillsByCategory
export type UserSkill = {
  id: number | string;
  user: number;
  skill: number;
  currentLevel: number | null;
  desiredLevel: number | null;
};

// TeamSkill type as used in GroupSkillsByCategory
export type TeamSkill = {
  id: number;
  team: number | null;
  skill: {
    id: number;
    name: string;
  };
  skillCategory: {
    id: number;
    title: string;
  };
};

interface Props {
  members: {
    id: number;
    email: string;
  }[];
  categories: { id: number; title: string }[];
  // groupSkillsByCategory: Record<string, TeamSkill[]>;
  teamSkills: TeamSkill[];
  teamId: number;
  teamUserSkills: UserSkill[];
}

const SkillMatrixTable: React.FC<Props> = ({
  members,
  categories,
  teamSkills,
  teamId,
  teamUserSkills,
}) => {
  const groupSkillsByCategory = groupBy(teamSkills, (teamSkill) => teamSkill.skillCategory?.id);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 z-10"></TableHead>
          <TableHead className="w-[250px] text-center">Requirements</TableHead>
          {members.map((user) => (
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
            category={category}
            teamSkills={groupSkillsByCategory[category?.id ?? '']}
            teamId={teamId}
            userSkills={teamUserSkills}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default SkillMatrixTable;
