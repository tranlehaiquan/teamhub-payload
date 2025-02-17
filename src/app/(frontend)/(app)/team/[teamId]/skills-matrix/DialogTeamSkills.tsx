'use client';
import React from 'react';
import { api } from '@/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  teamId: string;
}

const DialogTeamSkills: React.FC<React.PropsWithChildren<Props>> = ({ teamId }) => {
  const [teamRequirements] = api.team.getTeamRequirement.useSuspenseQuery(Number(teamId));
  return <div>{JSON.stringify(teamRequirements)}</div>;
};

export default DialogTeamSkills;
