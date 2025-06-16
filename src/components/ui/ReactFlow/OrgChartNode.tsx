import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Media, Profile, User } from '@/payload-types';
import { UserAvatar } from '@/components/UserProfile';

function OrgChartNode({ data }: { data: User }) {
  const profile = data.profile as Profile | undefined;
  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : data.email;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <UserAvatar avatar={profile?.avatar as Media} className="w-12 h-12" />

        <div className="ml-2">
          <div className="text-lg font-bold">{displayName}</div>
          <div className="text-gray-500">CEO</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}

export default memo(OrgChartNode);
