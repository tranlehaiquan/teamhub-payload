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
import { Edit } from 'lucide-react';

const RequirementIndicator = ({ skill }) => {
  const requirement = {
    level: '2',
    required: 2,
  };
  const level = {
    value: '2',
    label: 'Beginner',
    color: 'bg-blue-100 text-blue-600',
  };
  const currentCount = 0;
  const missing = Math.max(0, requirement.required - currentCount);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${level.color}`}>
            {level.value}
          </div>
          <div className="text-sm">
            <span className="font-medium">{currentCount}</span>/{requirement.required}
          </div>
          {missing > 0 && <div className="text-xs text-red-500">(-{missing})</div>}
          <Edit className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Skill Requirement</DialogTitle>
          <DialogDescription>
            Set required level and number of team members for {skill}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Required Level</label>
              <Select
                value={requirement.level}
                // onValueChange={(value) =>
                //   setRequirements((prev) => ({
                //     ...prev,
                //     [skill]: { ...prev[skill], level: value },
                //   }))
                // }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {/* {skillLevels.slice(1).map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Required Team Members</label>
              <Select
                value={requirement.required.toString()}
                // onValueChange={(value) =>
                //   setRequirements((prev) => ({
                //     ...prev,
                //     [skill]: { ...prev[skill], required: Number.parseInt(value) },
                //   }))
                // }
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
