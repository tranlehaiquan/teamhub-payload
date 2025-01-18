'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Category, Skill } from '@/payload-types';
import { getCategoriesQuery, getCurrentUserSkillsQuery, getSkillsQuery } from '@/tanQueries';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import groupBy from 'lodash/groupBy';
import DialogAddSkills from './DialogAddSkills';
import { Pen, Plus, XIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { removeCurrentUserSkill } from '@/services/server/currentUser/userSkills';
import { toast } from 'sonner';

const UserSkills: React.FC = () => {
  const {
    data: { docs: categories },
  } = useSuspenseQuery(getCategoriesQuery);
  const { data: skillDocs } = useSuspenseQuery(getSkillsQuery);
  const { data: userSkills } = useSuspenseQuery(getCurrentUserSkillsQuery);
  const skills = skillDocs?.docs;
  const userSkillsData = userSkills?.docs;
  const skillsByCategory = groupBy(userSkillsData, (userSkill) => {
    const skill = skills.find((s) => s.id === userSkill.skill);
    const categoryId = (skill?.category as Category)?.id || 'none';
    return categoryId;
  });
  const categoriesById = Object.entries(skillsByCategory);
  const userSkillIds = userSkillsData?.map((userSkill) => Number(userSkill.skill)) || [];
  const queryClient = useQueryClient();

  const handleRemoveSkill = async (skillId: number) => {
    await removeCurrentUserSkill(skillId);
    toast.success('Skill removed successfully');
    queryClient.invalidateQueries(getCurrentUserSkillsQuery);
  };

  return (
    <Card className="p-4">
      <p className="mb-2 text-lg">Skills</p>

      {categoriesById.map(([categoryId, userSkills]) => {
        const category = categories.find((s) => s.id === Number(categoryId));
        return (
          <div key={categoryId} className="mb-6 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              {category?.title || 'Another'}
            </h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Skill</TableHead>
                  <TableHead className="text-center">Current Level</TableHead>
                  <TableHead className="text-center">Desired Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSkills.map((userSkill) => {
                  const skill = skills.find((s) => s.id === userSkill.skill) as Skill;
                  return (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">
                        <p>{skill.name}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p>{userSkill.currentLevel || '---'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p>{userSkill.desiredLevel || '---'}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant={'ghost'} className="rounded-full">
                          <Pen />
                        </Button>
                        <Button
                          size="icon"
                          variant={'ghost'}
                          className="rounded-full"
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <XIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}

      <DialogAddSkills disabledSkillIds={userSkillIds} checkedSkillIds={userSkillIds}>
        <Button>
          <Plus />
          Add Skill
        </Button>
      </DialogAddSkills>
    </Card>
  );
};

export default UserSkills;
