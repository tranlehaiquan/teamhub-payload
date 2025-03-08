import { TeamRequirement, Level } from '@/payload-types';
import { cn } from '@/utilities/cn';

type Props = {
  requirements: TeamRequirement[];
  levels: Level;
};

export const RequirementDisplay = ({ requirements, levels }: Props) => {
  const sortedRequirements = requirements.sort(
    (a, b) => (a.desiredLevel as number) - (b.desiredLevel as number),
  );

  return (
    <div className="grid gap-2">
      {sortedRequirements.map((requirement) => {
        const level = levels.items.find((l) => l.level === requirement.desiredLevel);
        return (
          <div key={requirement.desiredLevel} className="flex items-center space-x-2">
            <div
              className={cn(
                `w-6 h-6 rounded-full flex items-center justify-center dark:text-black`,
                level?.levelColor ?? 'bg-gray-200',
              )}
              style={{ backgroundColor: level?.levelColor }}
            >
              {level?.level}
            </div>
            <div className="text-sm">
              <span className="font-medium">0</span>/{requirement.desiredMembers}
            </div>
          </div>
        );
      })}
    </div>
  );
};
