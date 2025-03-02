import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Level, Skill, UsersSkill } from '@/payload-types';

interface Props {
  className?: string;
  levels: Level;
  userSkill?: UsersSkill;
}

const SkillProgressIndicator: React.FC<Props> = ({ userSkill, levels, className }) => {
  const current = userSkill?.currentLevel;
  const desired = userSkill?.desiredLevel;
  const currentLevel = levels.items.find((level) => level.level === current);
  const desiredLevel = levels.items.find((level) => level.level === desired);
  const showProgress =
    current?.toString() !== '0' &&
    desired?.toString() !== '0' &&
    current?.toString() !== desired?.toString();
  const skill = (userSkill?.skill as Skill)?.name;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center`}
            style={{ backgroundColor: currentLevel?.levelColor }}
          >
            {current ? current : '-'}
          </div>

          {showProgress && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: desiredLevel?.levelColor }}
              >
                {desired}
              </div>
            </>
          )}

          {!showProgress && desired && current && (
            <>
              <div className="text-xs text-gray-500">Target:</div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center`}
                style={{ backgroundColor: desiredLevel?.levelColor }}
              >
                {desired}
              </div>
            </>
          )}

          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Level</DialogTitle>
          <DialogDescription>Set current and desired skill levels for {skill}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Level</label>
              {/* <Select
                value={skills[email][skill].current}
                onValueChange={(value) => handleSkillChange(email, skill, 'current', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Desired Level</label>
              {/* <Select
                value={skills[email][skill].desired}
                onValueChange={(value) => handleSkillChange(email, skill, 'desired', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Target level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillProgressIndicator;
