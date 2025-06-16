import type React from 'react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import type { User } from '@/payload-types';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utilities/cn';
import { useDebounce } from '@/utilities/useDebounce';

interface Props {
  className?: string;
}

const DialogTransferOwner: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const params = useParams();
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 500);

  const transferTeamOwnership = api.team.transferTeamOwnership.useMutation({
    onSuccess: () => {
      toast.success('Team ownership transferred successfully');
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to transfer team ownership');
    },
  });

  const { data: searchUsers, isLoading } = api.user.getUsers.useQuery(
    { email: debouncedQuery },
    { enabled: !!debouncedQuery },
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedUser(null);
  };

  const handleTransferOwnership = async () => {
    if (!selectedUser || !params.teamId) return;

    transferTeamOwnership.mutate({
      teamId: Number(params.teamId),
      newOwnerId: selectedUser.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={!!children}>
        {children || (
          <Button variant="outline" className="block mb-4">
            Transfer owner
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer owner</DialogTitle>
        </DialogHeader>

        <div className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Search user"
            className="w-full"
            value={query}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <div className="mt-2 text-muted-foreground">Loading...</div>}

        {searchUsers && searchUsers.docs.length > 0 && (
          <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
            {searchUsers.docs.map((user) => (
              <div
                key={user.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded cursor-pointer',
                  'hover:bg-muted transition-colors duration-200',
                  'dark:hover:bg-muted/70',
                  selectedUser?.id === user.id && 'bg-muted dark:bg-muted/70',
                )}
                onClick={() => setSelectedUser(user)}
              >
                <span className="text-foreground">{user.email}</span>
                {selectedUser?.id === user.id && (
                  <X
                    className="w-4 h-4 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(null);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          className="mt-4"
          disabled={!selectedUser || transferTeamOwnership.isPending}
          onClick={handleTransferOwnership}
        >
          {transferTeamOwnership.isPending ? 'Transferring...' : 'Transfer Ownership'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTransferOwner;
