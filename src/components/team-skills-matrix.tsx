'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const skillLevels = ['Novice', 'Intermediate', 'Advanced', 'Expert'];

const initialSkillsData = [
  { category: 'Front End', name: 'React', levels: [1, 2, 3, 0] },
  { category: 'Front End', name: 'TypeScript', levels: [2, 3, 1, 3] },
  { category: 'Front End', name: 'Node.js', levels: [3, 1, 2, 2] },
  { category: 'Front End', name: 'GraphQL', levels: [0, 2, 3, 1] },
  { category: 'Back End', name: 'AWS', levels: [3, 0, 2, 2] },
  { category: 'Back End', name: 'Docker', levels: [2, 1, 0, 3] },
];

const teamMembers = ['Alice', 'Bob', 'Charlie', 'Diana'];

const teamRequirements = [
  { skill: 'React', level: 'Expert', category: 'Front End' },
  { skill: 'AWS', level: 'Advanced', category: 'Back End' },
  { skill: 'Docker', level: 'Intermediate', category: 'Back End' },
];

const getColorForSkillLevel = (level: number) => {
  const colors = ['bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-green-400'];
  return colors[level];
};

export default function TeamSkillsMatrix() {
  const [skillsData, setSkillsData] = useState(initialSkillsData);

  const handleSkillChange = (skillIndex: number, memberIndex: number, newLevel: string) => {
    const newSkillsData = [...skillsData];
    newSkillsData[skillIndex].levels[memberIndex] = skillLevels.indexOf(newLevel);
    setSkillsData(newSkillsData);
  };

  return (
    <div className="p-4">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Team Skills Matrix</CardTitle>
          <CardDescription>Select the skill level for each team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">Skill Category</th>
                  <th className="p-2 border">Skill</th>
                  {teamMembers.map((member) => (
                    <th key={member} className="p-2 border">
                      {member}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skillsData.map((skill, skillIndex) => (
                  <tr key={skill.name}>
                    {skillIndex === 0 || skillsData[skillIndex - 1].category !== skill.category ? (
                      <td
                        rowSpan={skillsData.filter((s) => s.category === skill.category).length}
                        className="p-2 border font-medium"
                      >
                        {skill.category}
                      </td>
                    ) : null}
                    <td className="p-2 border font-medium">{skill.name}</td>
                    {skill.levels.map((level, memberIndex) => (
                      <td key={memberIndex} className="p-2 border text-center">
                        <Select
                          value={skillLevels[level]}
                          onValueChange={(newLevel) =>
                            handleSkillChange(skillIndex, memberIndex, newLevel)
                          }
                        >
                          <SelectTrigger className={`w-full ${getColorForSkillLevel(level)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevels.map((skillLevel, index) => (
                              <SelectItem
                                key={skillLevel}
                                value={skillLevel}
                                className={getColorForSkillLevel(index)}
                              >
                                {skillLevel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Team Requirements for Upskilling</h3>
            <ul className="space-y-2">
              {teamRequirements.map((req, index) => (
                <li key={index} className="flex items-center">
                  <Badge variant="secondary" className="mr-2">
                    {req.category}
                  </Badge>
                  <span>
                    <strong>{req.skill}</strong>: Required level - <strong>{req.level}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
