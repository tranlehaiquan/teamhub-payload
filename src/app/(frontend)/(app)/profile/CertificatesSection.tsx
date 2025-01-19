import { Card } from '@/components/ui/card';
import React from 'react';

interface Props {
  className?: string;
}

const CertificatesSection: React.FC<Props> = (props) => {
  return (
    <Card className="p-4">
      <p className="mb-2 text-lg">Certificates</p>

      <p>Certificates you have earned</p>
    </Card>
  );
};

export default CertificatesSection;
