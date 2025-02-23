'use client';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utilities/cn';
import { Level } from '@/payload-types';
import { api } from '@/trpc/react';

interface Props {
  className?: string;
  level?: number;
  onChange: (newLevel: number) => void;
  disabled?: boolean;
  options: Level['items'];
}

const LevelSkillSelection: React.FC<Props> = ({ level, onChange, disabled, options }) => {
  const currentOption = options.find((option) => option.level === level);

  return (
    <Select
      value={(currentOption ? String(currentOption.level) : null) as any}
      onValueChange={(newLevel) => onChange(Number(newLevel))}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn('w-full dark:text-black')}
        style={{ backgroundColor: currentOption?.levelColor }}
      >
        <SelectValue placeholder="Select level" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ id, level, name, levelColor }) => (
          <SelectItem
            key={id}
            value={String(level)}
            className={cn('dark:text-black')}
            style={{ backgroundColor: levelColor }}
          >
            {level} - {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const LevelSkillSelectionGlobal: React.FC<Omit<Props, 'options'>> = ({
  level,
  onChange,
  disabled,
}) => {
  const [data] = api.global.getLevels.useSuspenseQuery();

  return (
    <LevelSkillSelection
      level={level}
      onChange={onChange}
      disabled={disabled}
      options={data.items}
    />
  );
};

export default LevelSkillSelectionGlobal;
