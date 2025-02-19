import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utilities/cn';

interface Props {
  className?: string;
  level?: number;
  onChange: (newLevel: number) => void;
  disabled?: boolean;
}

const getColorForSkillLevel = (level?: number) => {
  if (level === undefined) {
    return '';
  }

  const currentOption = skillLevelOptions.find((option) => option.value === level);
  return currentOption ? currentOption.color : '';
};

const skillLevelOptions = [
  {
    value: 1,
    label: 'Novice',
    color: 'bg-red-200 hover:bg-red-200',
  },
  {
    value: 2,
    label: 'Intermediate',
    color: 'bg-yellow-200 hover:bg-yellow-200',
  },
  {
    value: 3,
    label: 'Advanced',
    color: 'bg-green-200 hover:bg-green-200',
  },
  {
    value: 4,
    label: 'Expert',
    color: 'bg-green-400 hover:bg-green-400',
  },
];

const LevelSkillSelection: React.FC<Props> = ({ level, onChange, disabled }) => {
  const currentOption = skillLevelOptions.find((option) => option.value === level);
  return (
    <Select
      value={(currentOption ? String(currentOption.value) : null) as any}
      onValueChange={(newLevel) => onChange(Number(newLevel))}
      disabled={disabled}
    >
      <SelectTrigger className={cn('w-full', getColorForSkillLevel(level))}>
        <SelectValue placeholder="Select level" />
      </SelectTrigger>
      <SelectContent>
        {skillLevelOptions.map(({ value, label }) => (
          <SelectItem key={value} value={String(value)} className={getColorForSkillLevel(value)}>
            {value} - {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LevelSkillSelection;
