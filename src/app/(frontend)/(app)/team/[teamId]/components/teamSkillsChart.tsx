'use client';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { api } from '@/trpc/react';
import type { Skill } from '@/payload-types';

const generateColor = (index: number, total: number) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function TeamSkillsChart({ teamId }: { teamId: number }) {
  const [teamUserSkills] = api.team.getUserSkills.useSuspenseQuery(teamId);
  const [teamSkills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [teamMembers] = api.team.getTeamMembers.useSuspenseQuery(teamId);

  // Generate dynamic chart config based on team members
  const chartConfig = Object.fromEntries(
    teamMembers.map((member, index) => [
      member.user.id.toString(),
      {
        label: member.user.name || `${member.user.email}`,
        color: generateColor(index, teamMembers.length),
      },
    ]),
  ) satisfies ChartConfig;

  const data = teamSkills.docs.map((teamSkill) => {
    const teamMemberSkills = teamUserSkills.filter(
      (i) => i.skill === (teamSkill.skill as Skill).id,
    );
    const skillsEntries = Object.fromEntries(teamMemberSkills.map((i) => [i.user, i.currentLevel]));

    return {
      skill: (teamSkill.skill as Skill).name,
      ...skillsEntries,
    };
  });

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Team Skills</CardTitle>
        <CardDescription>Showing team skills</CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            {teamMembers.map((member) => (
              <Radar
                key={member.id}
                dataKey={member.user.id.toString()}
                fill={chartConfig[member.user.id.toString()].color}
                fillOpacity={0.6}
                stroke={chartConfig[member.user.id.toString()].color}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
