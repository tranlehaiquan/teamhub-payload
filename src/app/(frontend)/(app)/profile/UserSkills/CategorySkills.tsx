import React from 'react';
import { Category, Skill, UsersSkill } from '@/payload-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen, XIcon } from 'lucide-react';

interface CategorySkillsProps {
  categoryId: string;
  userSkills: UsersSkill[];
  skills: Skill[];
  categories: Category[];
  handleRemoveSkill: (skillId: number) => Promise<void>;
}

const CategorySkills: React.FC<CategorySkillsProps> = ({
  categoryId,
  userSkills,
  skills,
  categories,
  handleRemoveSkill,
}) => {
  const category = categories.find((s) => s.id === Number(categoryId));

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
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
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Pen />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
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
};

export default CategorySkills;
