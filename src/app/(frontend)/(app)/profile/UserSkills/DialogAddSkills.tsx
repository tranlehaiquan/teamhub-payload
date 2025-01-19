'use client';
import { getCategoriesQuery, getCurrentUserSkillsQuery } from '@/tanQueries';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skill } from '@/payload-types';
import { CheckboxWithLabel } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { addCurrentUserSkills } from '@/services/server/currentUser/userSkills';

interface Props {
  className?: string;
  checkedSkillIds?: number[];
  disabledSkillIds?: number[];
}

const DialogAddSkills: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  disabledSkillIds = [],
  checkedSkillIds = [],
}) => {
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const {
    data: { docs: categories },
  } = useSuspenseQuery(getCategoriesQuery);

  const handleOnCheck = (id: number) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter((skillId) => skillId !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleSubmit = async () => {
    console.log('Selected Skills:', selectedSkills);
    await addCurrentUserSkills(selectedSkills);
    queryClient.invalidateQueries(getCurrentUserSkillsQuery);
    setSelectedSkills([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={!!children}>{children || 'Add Skill'}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skills</DialogTitle>
        </DialogHeader>

        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="text-lg">{category.title}</h3>

            <div className="flex gap-2">
              {(category.skills?.docs as Skill[]).map((skill) => (
                <CheckboxWithLabel
                  key={skill.id}
                  id={String(skill.id)}
                  label={skill?.name}
                  disabled={disabledSkillIds.includes(skill.id)}
                  checked={checkedSkillIds.includes(skill.id) || selectedSkills.includes(skill.id)}
                  onCheckedChange={() => handleOnCheck(skill.id)}
                />
              ))}
            </div>
          </div>
        ))}

        <Button onClick={handleSubmit} disabled={!selectedSkills.length}>
          <Plus />
          Add Skill
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSkills;
