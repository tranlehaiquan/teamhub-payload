'use client';
import type React from 'react';
import { useState } from 'react';
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
import { api } from '@/trpc/react';

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
  const addCurrentUserSkillsMutation = api.me.addUserSkill.useMutation();
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [{ docs: categories }] = api.category.getCategories.useSuspenseQuery();
  const utils = api.useUtils();
  const handleOnCheck = (id: number) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter((skillId) => skillId !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleSubmit = async () => {
    await addCurrentUserSkillsMutation.mutateAsync(selectedSkills);
    utils.me.userSkills.invalidate();
    utils.me.getCertificates.invalidate();
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

            <div className="flex gap-2 flex-wrap">
              {category.skills.map((skill) => (
                <CheckboxWithLabel
                  key={skill.id}
                  id={String(skill.id)}
                  label={skill?.name}
                  disabled={
                    disabledSkillIds.includes(skill.id) || addCurrentUserSkillsMutation.isPending
                  }
                  checked={checkedSkillIds.includes(skill.id) || selectedSkills.includes(skill.id)}
                  onCheckedChange={() => handleOnCheck(skill.id)}
                />
              ))}
            </div>
          </div>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={!selectedSkills.length || addCurrentUserSkillsMutation.isPending}
        >
          <Plus />
          Add Skill
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSkills;
