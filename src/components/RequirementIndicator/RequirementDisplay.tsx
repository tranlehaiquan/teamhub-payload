import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle, Target } from 'lucide-react';

type RequirementDisplayProps = {
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

export const RequirementDisplay: React.FC<RequirementDisplayProps> = ({ requirements, levels }) => {
  const getStatusIcon = (current: number, required: number) => {
    if (current >= required) return <CheckCircle className="w-3 h-3 text-green-600" />;
    if (current > 0) return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
    return <XCircle className="w-3 h-3 text-red-600" />;
  };

  const getStatusColor = (current: number, required: number) => {
    if (current >= required) return 'bg-green-100 text-green-800 border-green-200';
    if (current > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (!requirements.length) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-1">
        {requirements.map((req, index) => {
          const level = levels.items.find((l) => l.level === req.desiredLevel);
          const isComplete =
            req.numberOfUserSkillsWithSameSkillAndDesiredLevel >= req.desiredMembers;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(
                    req.numberOfUserSkillsWithSameSkillAndDesiredLevel,
                    req.desiredMembers,
                  )}`}
                >
                  {getStatusIcon(
                    req.numberOfUserSkillsWithSameSkillAndDesiredLevel,
                    req.desiredMembers,
                  )}
                  <Target className="w-3 h-3" />
                  {req.desiredMembers} {level?.name || `Level ${req.desiredLevel}`}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-semibold">
                    Requirement: {level?.name || `Level ${req.desiredLevel}`}
                  </div>
                  <div className="text-sm">
                    <div>Required: {req.desiredMembers} members</div>
                    <div>Current: {req.numberOfUserSkillsWithSameSkillAndDesiredLevel} members</div>
                    <div
                      className={`font-medium ${isComplete ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {isComplete
                        ? '✅ Requirement met'
                        : `❌ Need ${req.desiredMembers - req.numberOfUserSkillsWithSameSkillAndDesiredLevel} more`}
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
