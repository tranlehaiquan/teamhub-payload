'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/trpc/react';

function CircularProgress({ value }: { value: number }) {
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#eee"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#F97316"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fontWeight="bold"
        fill="#222"
      >
        {progress}
      </text>
    </svg>
  );
}

export default function SkillsToBeDevelop({ teamId }: { teamId: number }) {
  const [requirements] = api.team.getTeamRequirements.useSuspenseQuery(teamId);
  const [showAll, setShowAll] = React.useState(false);

  // Flatten and calculate progress
  const skills = requirements.map((skill: any) => {
    // Find the requirement with the highest desiredMembers for this skill
    const topReq = skill.requirements.reduce(
      (max: any, req: any) => (req.desiredMembers > (max?.desiredMembers ?? 0) ? req : max),
      null,
    );
    const progress =
      topReq && topReq.desiredMembers
        ? Math.round(
            ((topReq.numberOfUserSkillsWithSameSkillAndDesiredLevel || 0) / topReq.desiredMembers) *
              100,
          )
        : 0;
    return {
      skillName: skill.skillName,
      progress,
    };
  });

  // Sort by lowest progress (top skills to be developed)
  const sortedSkills = skills.sort((a, b) => a.progress - b.progress);
  const hasMore = sortedSkills.length > 5;
  const displayedSkills = showAll ? sortedSkills : sortedSkills.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Skills to be developped</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 font-semibold text-muted-foreground mb-2">
          <span>SKILLS</span>
          <span className="justify-self-end">PROGRESS IN %</span>
        </div>
        <ul>
          {displayedSkills.map((skill) => (
            <li
              key={skill.skillName}
              className="flex items-center justify-between border-b last:border-b-0 py-4"
            >
              <span className="underline">{skill.skillName}</span>
              <CircularProgress value={skill.progress} />
            </li>
          ))}
        </ul>
        {hasMore && (
          <button
            className="mt-4 block mx-auto px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Show less' : 'Show more'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
