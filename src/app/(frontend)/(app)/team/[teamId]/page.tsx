import SectionCard from '@/components/SectionCard/SectionCard';
import SkillsToBeDevelop from './components/skillsToBeDevelop';
import TeamSkillsChart from './components/teamSkillsChart';
import QuickNavigate from './components/quickNavigate';

const GeneralPage = async ({ params }: { params: Promise<{ teamId: string }> }) => {
  const teamId = (await params).teamId;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <QuickNavigate teamId={teamId} />

      <SectionCard title={`Metrics`}>
        <div className="grid grid-cols-2 gap-4">
          <TeamSkillsChart teamId={Number(teamId)} />
          <SkillsToBeDevelop teamId={Number(teamId)} />
        </div>
      </SectionCard>
    </div>
  );
};

export default GeneralPage;
