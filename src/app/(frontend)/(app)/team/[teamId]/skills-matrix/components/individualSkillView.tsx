import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/payload-types';

type Props = {
  members: {
    id: number;
    email: string;
  }[];
  teamUserSkills: any[];
};

const IndividualSkillView = ({ members, teamUserSkills }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {members.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle>{member.email}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default IndividualSkillView;
