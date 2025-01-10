import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Media } from '@/payload-types';
import { cn } from '@/utilities/cn';

interface Props {
  className?: string;
  avatar: Media;
  onChange?: () => void;
}

const UserAvatar: React.FC<Props> = ({ className, avatar, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleOnClick = () => {
    if (!onChange) return;

    ref.current?.click();
  };

  return (
    <>
      <Avatar
        className={cn('h-24 w-24 rounded-full', onChange && 'cursor-pointer', className)}
        onClick={handleOnClick}
      >
        <AvatarImage src={avatar.thumbnailURL || undefined} />
        <AvatarFallback className="rounded-lg">QA</AvatarFallback>
      </Avatar>

      <input type="file" accept="image/*" className="hidden" ref={ref} />
    </>
  );
};

export default UserAvatar;
