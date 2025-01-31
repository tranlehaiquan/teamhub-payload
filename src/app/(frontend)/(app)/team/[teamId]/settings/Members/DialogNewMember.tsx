import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { User } from '@/payload-types';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utilities/cn';

type DialogNewMemberProps = React.PropsWithChildren<{
  teamId: number;
  members?: number[];
}>;

const DialogNewMember: React.FC<DialogNewMemberProps> = ({ children, teamId, members }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User>();
  const addTeamMemberMutation = api.team.addTeamMember.useMutation();
  const utils = api.useUtils();
  const { data: searchUsers } = api.user.getUsers.useQuery(
    {
      email: search,
    },
    {
      enabled: !!search,
    },
  );

  const reset = () => {
    setOpen(false);
    setSearch('');
    setSelectedUsers(undefined);
  };

  const handleCancel = () => {
    reset();
  };

  const handleSubmit = async () => {
    if (!selectedUsers) {
      return;
    }

    try {
      await addTeamMemberMutation.mutateAsync({
        teamId,
        userId: selectedUsers.id,
      });

      reset();
      toast.success('User added to team');
      await utils.team.getTeamMembers.invalidate(teamId);
    } catch {
      toast.error('Failed to add user to team');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || 'Add Member'}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        {!selectedUsers && (
          <>
            <p>Search by email</p>

            <Input
              placeholder="Find people"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ul className="flex flex-col gap-2">
              {searchUsers?.docs.map((user) => (
                <li key={user.id} className="flex w-full">
                  <Button
                    className={cn(
                      'block w-full text-left',
                      members?.includes(user.id) && 'bg-gray-100 opacity-50',
                    )}
                    variant={'ghost'}
                    onClick={() => {
                      if (members?.includes(user.id)) return;
                      setSelectedUsers(user);
                    }}
                    disabled={members?.includes(user.id)}
                  >
                    <p>{user.email}</p>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}

        {selectedUsers && (
          <div className="flex gap-2 items-center">
            <p>{selectedUsers.email}</p>

            <Button
              variant={'ghost'}
              className="rounded-full"
              size={'icon'}
              onClick={() => setSelectedUsers(undefined)}
            >
              <X />
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant={'outline'} onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={!selectedUsers} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogNewMember;
