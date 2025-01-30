'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import groupBy from 'lodash/groupBy';
import { Skill } from '@/payload-types';
import DialogAddSkills from './DialogAddSkills';
import CategorySkills from './CategorySkills';
import { api } from '@/trpc/react';

const UserSkills: React.FC = () => {
  const removeCurrentUserSkillMutation = api.me.removeUserSkill.useMutation();
  const [{ docs: categories }] = api.category.getCategories.useSuspenseQuery({});
  const [{ docs: skills }] = api.skill.getSkills.useSuspenseQuery({
    page: 1,
    limit: 100,
  });
  const [{ docs: userSkillsData }] = api.me.userSkill.useSuspenseQuery();
  const utils = api.useUtils();

  const skillsByCategory = groupBy(userSkillsData, (userSkill) => {
    return (userSkill.skill as Skill).category as number;
  });
  const categoriesByIdPair = Object.entries(skillsByCategory);
  const userSkillIds = userSkillsData?.map((userSkill) => (userSkill.skill as Skill).id) || [];

  const handleRemoveSkill = async (skillId: number) => {
    await removeCurrentUserSkillMutation.mutateAsync(skillId);
    toast.success('Skill removed successfully');
    utils.me.userSkill.invalidate();
    utils.me.getCertificates.invalidate();
  };

  return (
    <Card className="p-4">
      <p className="mb-2 text-lg">Skills</p>
      {categoriesByIdPair.map(([categoryId, userSkills]) => (
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
