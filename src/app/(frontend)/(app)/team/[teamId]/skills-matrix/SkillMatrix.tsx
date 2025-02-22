'use client';
import React, { useState } from 'react';
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
import { toast } from 'sonner';

interface Props {
  className?: string;
  teamId: number;
}

const SkillMatrix: React.FC<Props> = ({ teamId }) => {
  const [team] = api.team.getTeamById.useSuspenseQuery(teamId);
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);
  const userSkills = teamMembers.flatMap((teamMember) => teamMember.userSkills);
  const [userSkillsUpdate, setUserSkillsDataUpdate] = useState<
    { id: number | string; user: number; skill: number; currentLevel: string | null }[]
  >([]);
  const updateUserSkills = api.team.updateUserSkills.useMutation();
  const utils = api.useUtils();

  const categories = uniqBy(
    teamSkills.docs.map((teamSkill) => (teamSkill.skill as Skill).category as Category),
    'id',
  );
  const groupSkillsByCategory = groupBy(
    teamSkills.docs,
    (teamSkill) => ((teamSkill.skill as Skill)?.category as Category)?.id,
  );
  const users = teamMembers.map((teamMember) => teamMember.user as User);

  const handleOnUpdateUserSkillLevel = (input: {
    id: number | string;
    user: number;
    skill: number;
    currentLevel: string | null;
  }) => {
    const isNewUserSKill = !input.id;
    if (isNewUserSKill) {
      const newId = `new-${userSkillsUpdate.length}`;
      const newInput = { ...input, id: newId };
      const newUserSkillsUpdate = [...userSkillsUpdate, newInput];
      setUserSkillsDataUpdate(newUserSkillsUpdate);
      return;
    }

    const isInUpdateList = userSkillsUpdate.some(
      (userSkillUpdate) => userSkillUpdate.id === input.id,
    );

    if (!isInUpdateList) {
      setUserSkillsDataUpdate([...userSkillsUpdate, input]);
      return;
    }

    const newUserSkillsUpdate = userSkillsUpdate.map((userSkillUpdate) => {
      if (userSkillUpdate.id === input.id) {
        return input;
      }

      return userSkillUpdate;
    });

    setUserSkillsDataUpdate(newUserSkillsUpdate);
  };

  // merge userSkillsData with userSkills
  const mergedUserSkills = [...userSkills] as {
    id: number | string;
    user: number;
    skill: number;
    currentLevel: string | null;
  }[];

  userSkillsUpdate.forEach((userSkillUpdate) => {
    const userSkillIndex = mergedUserSkills.findIndex(
      (userSkill) =>
        userSkill.user === userSkillUpdate.user && userSkill.skill === userSkillUpdate.skill,
    );

    if (userSkillIndex === -1) {
      mergedUserSkills.push(userSkillUpdate);
      return;
    }

    mergedUserSkills[userSkillIndex] = userSkillUpdate;
  });

  const handleCancel = () => {
    setUserSkillsDataUpdate([]);
  };

  const handleSubmit = async () => {
    const data = userSkillsUpdate.map((item) => {
      if (typeof item.id === 'string') {
        return {
          id: undefined,
          user: item.user,
          skill: item.skill,
          currentLevel: Number(item.currentLevel),
        };
      }

      return {
        id: item.id,
        user: item.user,
        skill: item.skill,
        currentLevel: item.currentLevel ? Number(item.currentLevel) : null,
      };
    }) as {
      id: undefined | number;
      user: number;
      skill: number;
      currentLevel: number | null;
    }[];

    try {
      await updateUserSkills.mutateAsync(data);
      await utils.team.getTeamMembers.invalidate(teamId);
      setUserSkillsDataUpdate([]);

      toast.success('User skills updated');
    } catch {
      toast.error('Failed to update user skills');
    }
  };

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
                <TableHead></TableHead>
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
                  onUpdateUserSkillLevel={handleOnUpdateUserSkillLevel}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant={'outline'}
              disabled={!userSkillsUpdate.length || updateUserSkills.isPending}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!userSkillsUpdate.length || updateUserSkills.isPending}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SkillMatrix;
