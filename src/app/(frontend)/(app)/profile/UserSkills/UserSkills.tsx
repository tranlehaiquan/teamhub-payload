'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import groupBy from 'lodash/groupBy';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Category } from '@/payload-types';
import { getCategoriesQuery, getSkillsQuery, getCurrentUserSkillsQuery } from '@/tanQueries';
import { removeCurrentUserSkill } from '@/services/server/currentUser/userSkills';
import DialogAddSkills from './DialogAddSkills';
import CategorySkills from './CategorySkills';

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
      {categoriesById.map(([categoryId, userSkills]) => (
        <CategorySkills
          key={categoryId}
          categoryId={categoryId}
          userSkills={userSkills}
          skills={skills}
          categories={categories}
          handleRemoveSkill={handleRemoveSkill}
        />
      ))}
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
