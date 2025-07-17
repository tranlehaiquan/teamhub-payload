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

// Utility functions
const generateColor = (index: number, total: number) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 50%)`;
};

const createChartConfig = (members: any[]) => {
  return Object.fromEntries(
    members.map((member, index) => [
      member.user.id.toString(),
      {
        label: member.user.email,
        color: generateColor(index, members.length),
      },
    ]),
  ) satisfies ChartConfig;
};

const processChartData = (skills: any[], teamUserSkills: any[], members: any[]) => {
  const teamUserSkillsBySkillId = Object.groupBy(teamUserSkills, (i) => i.skill);
  const memberIds = members.map((i) => i.user.id);

  return skills.map((teamSkill) => {
    const teamMemberSkills = teamUserSkillsBySkillId[teamSkill.skill?.id as number] || [];
    const skillsEntries = Object.fromEntries(teamMemberSkills.map((i) => [i.user, i.currentLevel]));

    // Fill missing member skills with 0
    memberIds.forEach((memberId) => {
      if (!skillsEntries[memberId]) {
        skillsEntries[memberId] = 0;
      }
    });

    return {
      skill: teamSkill.skill?.name,
      ...skillsEntries,
    };
  });
};

export default function TeamSkillsChart({ teamId }: { teamId: number }) {
  const [teamUserSkills] = api.team.getUserSkills.useSuspenseQuery(teamId);
  const [skills] = api.team.getTeamSkills.useSuspenseQuery(teamId);
  const [members] = api.team.getTeamMembers.useSuspenseQuery(teamId);

  const chartConfig = createChartConfig(members);
  const chartData = processChartData(skills, teamUserSkills, members);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Team Skills</CardTitle>
        <CardDescription>Showing team skills</CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            {members.map((member) => (
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
