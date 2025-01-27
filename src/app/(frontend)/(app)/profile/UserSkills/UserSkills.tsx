'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import groupBy from 'lodash/groupBy';
import { Category, Skill } from '@/payload-types';
import { removeCurrentUserSkill } from '@/services/server/currentUser';
import DialogAddSkills from './DialogAddSkills';
import CategorySkills from './CategorySkills';
import { api } from '@/trpc/react';

const UserSkills: React.FC = () => {
  const [{ docs: categories }] = api.category.getCategories.useSuspenseQuery({});
  const [{ docs: skills }] = api.skill.getSkills.useSuspenseQuery({});
  const [{ docs: userSkillsData }] = api.me.userSkill.useSuspenseQuery();
  const utils = api.useUtils();

  const skillsByCategory = groupBy(userSkillsData, (userSkill) => {
    const skill = skills.find((s) => s.id === userSkill.skill);
    const categoryId = (skill?.category as Category)?.id || 'none';
    return categoryId;
  });

  const categoriesById = Object.entries(skillsByCategory);
  const userSkillIds = userSkillsData?.map((userSkill) => (userSkill.skill as Skill).id) || [];

  const handleRemoveSkill = async (skillId: number) => {
    await removeCurrentUserSkill(skillId);
    toast.success('Skill removed successfully');
    utils.me.userSkill.invalidate();
    utils.me.getCertificates.invalidate();
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
