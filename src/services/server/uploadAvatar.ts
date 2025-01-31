'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { Media, Profile, User } from '@/payload-types';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
const getAvatarFileName = (user: User) => {
  return `${user.id}-avatar.jpg`;
};

export const uploadAvatar = async (formData: FormData) => {
  const me = await getMeUser();
  const user = me.user;
  const fileName = getAvatarFileName(user);
  const file = formData.get('file') as File;
  const payload = await getPayloadFromConfig();
  const avatar = (user.profile as Profile).avatar;
  try {
    if (avatar) {
      await payload.update({
        collection: 'media',
        id: (avatar as Media).id,
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: fileName,
          size: file.size,
        },
        data: {},
      });
    } else {
      const newAvatar = await payload.create({
        collection: 'media',
        data: {
          filename: fileName,
        },
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: fileName,
          size: file.size,
        },
      });
      await payload.update({
        collection: 'profiles',
        id: (user.profile as Profile).id,
        data: {
          avatar: newAvatar.id,
        },
      });
    }
    return {
      success: true,
      message: 'Avatar uploaded successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to upload avatar',
    };
  }
};
