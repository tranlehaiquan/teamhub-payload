import { Card } from '@/components/ui/card';
import { cn } from '@/utilities/cn';

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className, ...props }) => {
  return (
    <Card className={cn('p-4', className)} {...props} aria-roledescription="section">
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      {children}
    </Card>
  );
};

export default SectionCard;
