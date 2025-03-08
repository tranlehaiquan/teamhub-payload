import { TeamRequirement, Level, UsersSkill, Skill } from '@/payload-types';
import LevelSlot from '@/components/LevelSlot';

type Props = {
  requirements: TeamRequirement[];
  levels: Level;
  userSkills: Omit<UsersSkill, 'createdAt' | 'updatedAt'>[];
};

export const RequirementDisplay = ({ requirements, levels, userSkills }: Props) => {
  const sortedRequirements = requirements.sort(
    (a, b) => (a.desiredLevel as number) - (b.desiredLevel as number),
  );

  return (
    <div className="flex gap-2">
      {sortedRequirements.map((requirement) => {
        const skillId = (requirement.skill as Skill).id;
        const level = levels.items.find((l) => l.level === requirement.desiredLevel);
        const userSkillsMatch = userSkills.filter(
          (i) => i.skill === skillId && i.currentLevel === requirement.desiredLevel,
        );

        return (
          <div key={requirement.desiredLevel} className="flex flex-col text-center gap-1">
            <LevelSlot level={level} />
            <div className="text-sm">
              <span className="font-medium">{userSkillsMatch.length}</span>/
              {requirement.desiredMembers}
            </div>
          </div>
        );
      })}
    </div>
  );
};
