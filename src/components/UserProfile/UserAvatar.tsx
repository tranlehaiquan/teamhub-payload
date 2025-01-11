import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Media } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { Edit } from 'lucide-react';

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

export default UserAvatar;
