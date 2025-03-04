'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Skill } from '@/payload-types';
import { api } from '@/trpc/react';
import { Edit } from 'lucide-react';
import LevelSkillSelection from '../LevelSkillSelection/LevelSkillSelection';

type Props = {
  skill: Skill;
};

const RequirementIndicator: React.FC<Props> = ({ skill }) => {
  const [levels] = api.global.getLevels.useSuspenseQuery();
  const requirement = {
    level: 2,
    required: 2,
  };
  const level = levels.items.find((level) => level.level === requirement.level);
  const currentCount = 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center`}
            style={{ backgroundColor: level?.levelColor }}
          >
            {level?.level}
          </div>
          <div className="text-sm">
            <span className="font-medium">{currentCount}</span>/{requirement.required}
          </div>
          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Requirement</DialogTitle>
          <DialogDescription>
            Set required level and number of team members for {skill.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Required Level</label>
              <LevelSkillSelection
                level={levels.items.find((level) => level.level === requirement.level)?.level}
                onChange={(level) => {
                  console.log(level);
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Required Team Members</label>
              <Select
                value={requirement.required.toString()}
                onValueChange={(value) => {
                  console.log(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementIndicator;
