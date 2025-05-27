import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BarChart3, Brain, Users } from 'lucide-react';

const QuickNavigate = ({ teamId }: { teamId: string }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Start an activity with your team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href={`/team/${teamId}/skills-matrix`} className="block">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
                <Brain className="w-6 h-6 text-sky-600" />
              </div>
              <CardTitle>Edit your skill matrix</CardTitle>
              <CardDescription>
                Check your team&apos;s skills and make development plans.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/team/${teamId}/health-check`} className="block">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-lime-600" />
              </div>
              <CardTitle>Start a health check</CardTitle>
              <CardDescription>
                Check how your team is really doing with anonymous surveys.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/team/${teamId}/retro`} className="block">
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle>Create a retro</CardTitle>
              <CardDescription>
                Facilitate the process of reflection and continuous improvement of your team.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default QuickNavigate;
