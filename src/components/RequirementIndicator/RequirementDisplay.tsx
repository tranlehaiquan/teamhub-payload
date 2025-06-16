import type { Level } from '@/payload-types';
import LevelSlot from '@/components/LevelSlot';

type Props = {
  requirements: {
    skill: number;
    desiredLevel: number;
    desiredMembers: number;
    numberOfUserSkillsWithSameSkillAndDesiredLevel: number;
  }[];
  levels: Level;
};

export const RequirementDisplay = ({ requirements, levels }: Props) => {
  const sortedRequirements = requirements.sort(
    (a, b) => (a.desiredLevel as number) - (b.desiredLevel as number),
  );

  return (
    <div className="flex gap-2">
      {sortedRequirements.map((requirement) => {
        const level = levels.items.find((l) => l.level === requirement.desiredLevel);

        return (
          <div key={requirement.desiredLevel} className="flex flex-col text-center gap-1">
            <LevelSlot level={level} />
            <div className="text-sm">
              <span className="font-medium">
                {requirement.numberOfUserSkillsWithSameSkillAndDesiredLevel}
              </span>
              /{requirement.desiredMembers}
            </div>
          </div>
        );
      })}
    </div>
  );
};
