'use client';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { Plus } from 'lucide-react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DialogNewMember from './DialogNewMember';
import { toast } from 'sonner';

interface Props {
  className?: string;
  teamId: string;
}

const TeamMembers: React.FC<Props> = ({ teamId }) => {
  const [members] = api.team.getTeamMembers.useSuspenseQuery(Number(teamId));
  const removeUserMutation = api.team.removeTeamMember.useMutation();
  const utils = api.useUtils();

  const handleRemove = async (teams_usersId: number) => {
    try {
      await removeUserMutation.mutateAsync({
        teams_usersId,
      });

      await utils.team.getTeamMembers.invalidate(Number(teamId));
      toast.success('User removed from team');
    } catch {
      toast.error('Failed to remove user from team');
    }
  };

  return (
    <div>
      <DialogNewMember teamId={Number(teamId)}>
        <Button className="mb-4">
          <Plus /> Add member
        </Button>
      </DialogNewMember>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.user?.email}</TableCell>
              <TableCell>
                <Button
                  variant={'destructive'}
                  onClick={() => handleRemove(member.id)}
                  disabled={removeUserMutation.isPending}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembers;
