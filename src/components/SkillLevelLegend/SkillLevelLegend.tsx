import type { Level } from '@/payload-types';
import type React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/utilities/cn';
import { getContrastColor } from '@/utilities/getContrastColor';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  className?: string;
  levels: Level;
}

const SkillLevelLegend: React.FC<Props> = ({ levels, className }) => {
  return (
    <Card className={cn(className)}>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          {levels.items.map((level) => (
            <Badge
              key={level.id}
              className="flex items-center gap-2"
              style={{
                backgroundColor: level.levelColor,
                color: getContrastColor(level.levelColor || ''),
              }}
            >
              {level.level} - {level.name}
            </Badge>
          ))}
          <div className="border-l pl-6 ml-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Met</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Shortage</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Not met</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillLevelLegend;
