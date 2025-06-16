'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import groupBy from 'lodash/groupBy';
import DialogAddSkills from './DialogAddSkills';
import CategorySkills from './CategorySkills';
import { api } from '@/trpc/react';
import SectionCard from '@/components/SectionCard/SectionCard';

const UserSkills: React.FC = () => {
  const removeCurrentUserSkillMutation = api.me.removeUserSkill.useMutation();
  const [{ docs: categories }] = api.category.getCategories.useSuspenseQuery();
  const [{ docs: skills }] = api.skill.getSkills.useSuspenseQuery({
    page: 1,
    limit: 50,
  });
  const [userSkills] = api.me.userSkills.useSuspenseQuery();
  const utils = api.useUtils();

  const skillsByCategory = groupBy(
    userSkills.filter(
      (userSkill) => userSkill.skill && userSkill.currentLevel && userSkill.desiredLevel,
    ),
    (userSkill) => userSkill.skill?.category ?? null,
  );
  const categoriesByIdPair = Object.entries(skillsByCategory).filter(
    ([_, userSkills]) => userSkills.length > 0,
  );
  const userSkillIds = userSkills.map((userSkill) => userSkill.id) || [];

  const handleRemoveSkill = async (skillId: number) => {
    await removeCurrentUserSkillMutation.mutateAsync(skillId);
    toast.success('Skill removed successfully');

    utils.me.userSkills.invalidate();
    utils.me.getCertificates.invalidate();
    utils.team.getTeamMembers.reset();
  };

  return (
    <SectionCard title="Skills">
      {categoriesByIdPair.map(([categoryId, userSkills]) => (
        <CategorySkills
          key={categoryId}
          categoryId={categoryId}
          userSkills={userSkills as any}
          skills={skills}
          categories={categories as any}
          handleRemoveSkill={handleRemoveSkill}
        />
      ))}

      <DialogAddSkills disabledSkillIds={userSkillIds} checkedSkillIds={userSkillIds}>
        <Button>
          <Plus />
          Add Skill
        </Button>
      </DialogAddSkills>
    </SectionCard>
  );
};

export default UserSkills;
