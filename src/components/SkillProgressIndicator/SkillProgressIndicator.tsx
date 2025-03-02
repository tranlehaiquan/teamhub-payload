import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Level } from '@/payload-types';
import LevelSkillSelectionGlobal from '../LevelSkillSelection/LevelSkillSelection';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
  levels: Level;
  current?: number | null;
  desired?: number | null;
  onSubmit: (current: number | null, desired: number | null) => void;
}

const SkillProgressIndicator: React.FC<Props> = ({ levels, current, desired, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const currentLevel = levels.items.find((level) => level.level === current);
  const desiredLevel = levels.items.find((level) => level.level === desired);

  const [levelUpdate, setLevelUpdate] = useState({
    current,
    desired,
  });

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleSave = () => {
    setOpen(false);

    onSubmit(levelUpdate.current ?? null, levelUpdate.desired ?? null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer p-1 justify-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center`}
            style={{ backgroundColor: currentLevel?.levelColor }}
          >
            {current ? current : '-'}
          </div>

          {!!desired && (
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

          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Level</DialogTitle>
          <DialogDescription>Set current and desired skill</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Level</label>
              <LevelSkillSelectionGlobal
                level={levelUpdate.current}
                onChange={(level) => setLevelUpdate((prev) => ({ ...prev, current: level }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Desired Level</label>
              <LevelSkillSelectionGlobal
                level={levelUpdate.desired}
                onChange={(level) => setLevelUpdate((prev) => ({ ...prev, desired: level }))}
              />
            </div>
          </div>
        </div>

        <Button type="submit" onClick={handleSave}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SkillProgressIndicator;
