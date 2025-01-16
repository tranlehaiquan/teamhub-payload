'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Category, Skill } from '@/payload-types';
import { getCategoriesQuery, getCurrentUserSkillsQuery, getSkillsQuery } from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
import groupBy from 'lodash/groupBy';

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

  return (
    <Card className="p-4">
      <p className="mb-2">Skills</p>

      {categoriesById.map(([categoryId, userSkills]) => {
        const category = categories.find((s) => s.id === Number(categoryId));
        return (
          <div key={categoryId} className="mb-6 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              {category?.title || 'Another'}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {userSkills.map((userSkill) => {
                const skill = skills.find((s) => s.id === userSkill.skill) as Skill;
                return (
                  <li
                    key={userSkill.id}
                    className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    {skill.name}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <Button>Add Skill</Button>
    </Card>
  );
};

export default UserSkills;
