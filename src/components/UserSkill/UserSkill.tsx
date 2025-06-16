import type { Skill } from '@/payload-types';
import { cn } from '@/utilities/cn';
import type React from 'react';
import { Button } from '../ui/button';
import { XIcon, Pen } from 'lucide-react';

interface Props {
  className?: string;
  skill: Skill;
  currentLevel?: number | null;
  desiredLevel?: number | null;
}

const UserSkill: React.FC<Props> = ({ className, skill, currentLevel, desiredLevel }) => {
  return (
    <div className={cn(className, 'grid grid-cols-4 gap-2 items-center')}>
      <p>{skill.name}</p>

      <p>{currentLevel}</p>

      <p>{desiredLevel}</p>

      <div className="ml-auto flex gap-2">
        <Button size="icon" variant={'ghost'} className="rounded-full">
          <Pen size={16} />
        </Button>

        <Button size="icon" variant={'ghost'} className="rounded-full">
          <XIcon />
        </Button>
      </div>
    </div>
  );
};

export default UserSkill;
