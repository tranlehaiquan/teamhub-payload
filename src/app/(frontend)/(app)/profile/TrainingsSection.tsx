import { Card } from '@/components/ui/card';
import React from 'react';

const TrainingsSection: React.FC = () => {
  return (
    <Card className="p-4">
      <p className="mb-2 text-lg">Trainings</p>

      <p>Trainings you have earned</p>
    </Card>
  );
};

export default TrainingsSection;
