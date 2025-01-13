import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';

interface Props {
  className?: string;
}

const UserSkills: React.FC<Props> = (props) => {
  return (
    <Card className="p-4">
      <p className="mb-2">Skills</p>
      <Button>Add Skill</Button>
    </Card>
  );
};

export default UserSkills;
