'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Category, Skill } from '@/payload-types';
import { getCategoriesQuery, getCurrentUserSkillsQuery, getSkillsQuery } from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
import groupBy from 'lodash/groupBy';
import DialogAddSkills from './DialogAddSkills';
import { Plus } from 'lucide-react';

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
            <div>
              {userSkills.map((userSkill) => {
                const skill = skills.find((s) => s.id === userSkill.skill) as Skill;
                return (
                  <div key={userSkill.id}>
                    {skill.name} {userSkill.currentLevel} {userSkill.desiredLevel}
                  </div>
                );
              })}
            </div>
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
