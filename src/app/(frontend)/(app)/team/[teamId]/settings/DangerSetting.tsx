'use client';
import React from 'react';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { User } from '@/payload-types';

type DangerSettingProps = {
  teamId: string;
};

const DangerSetting: React.FC<DangerSettingProps> = ({ teamId }) => {
  const deleteTeamMutation = api.team.deleteTeam.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  const [team] = api.team.getTeamById.useSuspenseQuery(Number(teamId));
  const [me] = api.me.getMe.useSuspenseQuery();
  const isOwner = (team?.owner as Number) === me.user?.id;

  const handleOnDelete = async () => {
    try {
      await deleteTeamMutation.mutateAsync(Number(teamId));

      toast.success('Team deleted successfully');

      await utils.me.getTeams.invalidate();
      router.push('/');
    } catch {
      toast.error('Failed to delete team');
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Card className="p-4">
      <h2 className="mb-2 text-lg">Danger zone</h2>

      <div>
        <Button variant="outline" className="block mb-4">
          Transfer owner
        </Button>

        <ConfirmDialog
          title="Delete team"
          description="Are you sure you want to delete this team? This action cannot be undone."
          onConfirm={handleOnDelete}
        >
          <Button variant="destructive" className="block">
            Delete team
          </Button>
        </ConfirmDialog>
      </div>
    </Card>
  );
};

export default DangerSetting;
