'use client';
import React, { useState } from 'react';
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
import { api } from '@/trpc/react';
import DialogUpdateUserSkill from './DialogUpdateUserSkill';

interface CategorySkillsProps {
  categoryId: string;
  userSkills: {
    id: number;
    skill: {
      id: number;
      name: string;
      category: number;
    };
    currentLevel: number;
    desiredLevel: number;
  }[];
  skills: Skill[];
  categories: Category[];
  handleRemoveSkill: (skillId: number) => Promise<void>;
}

const CategorySkills: React.FC<CategorySkillsProps> = ({
  categoryId,
  userSkills,
  categories,
  handleRemoveSkill,
}) => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState<number | undefined>();
  const category = categories.find((s) => s.id === Number(categoryId));
  const selectedUserSkill = userSkills.find((s) => s.id === openUpdateDialog);
  const [{ docs: certificates }] = api.me.getCertificates.useSuspenseQuery();
  const [globalLevels] = api.global.getLevels.useSuspenseQuery();
  const [{ docs: trainings }] = api.me.getTrainings.useSuspenseQuery();

  const getLevelOption = (level?: number | null) => {
    return globalLevels.items.find((i) => i.level === level);
  };

  const getTrainingsByUserSkillId = (userSkillId: number) => {
    return trainings.filter((training) => {
      return (
        training.userSkills &&
        (training.userSkills as UsersSkill[]).some((userSkill) => userSkill.id === userSkillId)
      );
    });
  };

  const certificatesByUserSkillId = certificates.reduce((acc, certificate) => {
    const userSkills = certificate.userSkills as UsersSkill[];

    userSkills.forEach((userSkill) => {
      const userSkillId = userSkill.id;

      if (acc[userSkillId]) {
        acc[userSkillId] += 1;
      } else {
        acc[userSkillId] = 1;
      }
    });

    return acc;
  }, {});

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
            <TableHead className="text-center">Trainings</TableHead>
            <TableHead className="text-center">Certificates</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userSkills.map((userSkill) => (
            <TableRow key={userSkill.id}>
              <TableCell className="font-medium">
                <p>{(userSkill.skill as Skill).name}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{getLevelOption(userSkill?.currentLevel)?.name || '---'}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{getLevelOption(userSkill?.desiredLevel)?.name || '---'}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{getTrainingsByUserSkillId(userSkill.id).length}</p>
              </TableCell>
              <TableCell className="text-center">
                <p>{certificatesByUserSkillId[userSkill.id]}</p>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setOpenUpdateDialog(userSkill.id)}
                >
                  <Pen size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => handleRemoveSkill((userSkill.skill as Skill).id)}
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Update UserSkill */}
      <DialogUpdateUserSkill
        userSkill={selectedUserSkill}
        onClose={() => setOpenUpdateDialog(undefined)}
      />
    </div>
  );
};

export default CategorySkills;
