import type { Level } from '@/payload-types';
import { cn } from '@/utilities/cn';
import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const levelVariants = cva('rounded-full flex items-center justify-center text-black bg-gray-200', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

interface Props extends VariantProps<typeof levelVariants> {
  className?: string;
  level?: Level['items'][number];
}

const LevelSlot: React.FC<Props> = ({ level, className, size }) => {
  return (
    <p
      className={cn(
        levelVariants({ size, className }),
        'rounded-full flex items-center justify-center text-black bg-gray-200',
      )}
      style={{ backgroundColor: level?.levelColor }}
    >
      {level?.level || '-'}
    </p>
  );
};

export default LevelSlot;
