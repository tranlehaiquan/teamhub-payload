import type { Level } from '@/payload-types';
import type React from 'react';

interface Props {
  className?: string;
  levels: Level;
}

const SkillLevelLegend: React.FC<Props> = ({ levels, className }) => {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        {levels.items.map((level) => (
          <div key={level.id} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center dark:text-black`}
              style={{ backgroundColor: level.levelColor }}
            >
              {level.level}
            </div>
            <span className="text-sm">{level.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillLevelLegend;
