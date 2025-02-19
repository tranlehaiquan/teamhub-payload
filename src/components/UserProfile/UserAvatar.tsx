import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utilities/cn';
import { Edit } from 'lucide-react';
import { api } from '@/trpc/react';
import { Profile, Media, User } from '@/payload-types';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  className?: string;
  avatar?: Media;
  onChange?: (file: File) => void;
  fallback?: string;
}

const UserAvatar: React.FC<Props> = ({ className, avatar, onChange, fallback }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleOnClick = () => {
    if (!onChange) return;

    ref.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const file = e.target.files?.[0];

    if (file) {
      await onChange(file);
    }
  };

  return (
    <div className={cn('h-8 w-8 rounded-full bg-red relative', className)}>
      <Avatar className={cn('h-full w-full rounded-full')}>
        <AvatarImage src={avatar?.thumbnailURL || undefined} />
        <AvatarFallback className="rounded-lg">{fallback || 'QA'}</AvatarFallback>
      </Avatar>

      {/* a layer */}
      {onChange && (
        <div
          className="absolute inset-0 hover:bg-black opacity-0 hover:opacity-30 rounded-full flex items-center justify-center cursor-pointer"
          onClick={handleOnClick}
        >
          <div className="text-white">
            <Edit size={20} />
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        ref={ref}
        onChange={onFileChange}
      />
    </div>
  );
};

export const UserAvatarOnlyByUserId: React.FC<{ userId: number }> = ({ userId }) => {
  const { data, isFetched } = api.user.findUserById.useQuery({
    id: userId,
  });

  if (!isFetched) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const user = data as User;
  const avatar = (user.profile as Profile)?.avatar as Media;

  return <UserAvatar avatar={avatar} />;
};

export const UserAvatarByUserId: React.FC<{ userId: number }> = ({ userId }) => {
  const { data, isFetched } = api.user.findUserById.useQuery({
    id: userId,
  });

  if (!isFetched) {
    return (
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="grid flex-1 text-left text-sm leading-tight gap-2">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-32 h-3" />
        </div>
      </div>
    );
  }

  const user = data as User;
  const avatar = (user.profile as Profile)?.avatar as Media;

  return (
    <div className="flex gap-2">
      <UserAvatar avatar={avatar} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user!.name}</span>
        <span className="truncate text-xs">{user!.email}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
