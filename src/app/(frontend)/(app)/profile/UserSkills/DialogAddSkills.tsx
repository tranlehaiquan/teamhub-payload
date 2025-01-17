'use client';
import { getCategoriesQuery } from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
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

interface Props {
  className?: string;
}

const DialogAddSkills: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {
    data: { docs: categories },
  } = useSuspenseQuery(getCategoriesQuery);

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
                <CheckboxWithLabel key={skill.id} id={String(skill.id)} label={skill?.name} />
              ))}
            </div>
          </div>
        ))}

        <Button type="submit">Add Skill</Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSkills;
