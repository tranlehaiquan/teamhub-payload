import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Target } from 'lucide-react';

type RequirementProgressDisplayProps = {
  requirements: {
    desiredLevel: number;
    desiredMembers: number;
    numberOfUserSkillsWithSameSkillAndDesiredLevel: number;
  }[];
  levels: {
    items: {
      name: string;
      description: string;
      level: number;
      levelColor: string;
      id?: string | null;
    }[];
  };
};

export const RequirementProgressDisplay: React.FC<RequirementProgressDisplayProps> = ({
  requirements,
  levels,
}) => {
  if (!requirements.length) return null;

  return (
    <TooltipProvider>
      <div className="space-y-2 min-w-[120px]">
        {requirements.map((req, index) => {
          const level = levels.items.find((l) => l.level === req.desiredLevel);
          const progress =
            req.desiredMembers > 0
              ? (req.numberOfUserSkillsWithSameSkillAndDesiredLevel / req.desiredMembers) * 100
              : 0;
          const isComplete =
            req.numberOfUserSkillsWithSameSkillAndDesiredLevel >= req.desiredMembers;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <Badge
                      variant="secondary"
                      className="text-xs px-1 py-0"
                      style={{ backgroundColor: level?.levelColor || '#64748b' }}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {level?.name || `L${req.desiredLevel}`}
                    </Badge>
                    <span
                      className={`font-medium ${isComplete ? 'text-green-600' : 'text-gray-600'}`}
                    >
                      {req.numberOfUserSkillsWithSameSkillAndDesiredLevel}/{req.desiredMembers}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className="h-2"
                    style={
                      {
                        '--progress-background': isComplete
                          ? '#10b981'
                          : progress > 0
                            ? '#f59e0b'
                            : '#ef4444',
                      } as React.CSSProperties
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {level?.name || `Level ${req.desiredLevel}`} Requirement
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Target: {req.desiredMembers} team members</div>
                    <div>
                      Current: {req.numberOfUserSkillsWithSameSkillAndDesiredLevel} team members
                    </div>
                    <div className="border-t pt-1">
                      {isComplete ? (
                        <span className="text-green-600 font-medium">✅ Goal achieved!</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          📈 Need{' '}
                          {req.desiredMembers - req.numberOfUserSkillsWithSameSkillAndDesiredLevel}{' '}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
