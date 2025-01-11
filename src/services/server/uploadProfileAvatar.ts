'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { Profile, User } from '@/payload-types';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

const getAvatarFileName = (user: User) => {
  return `${user.id}-avatar.png`;
};

export const uploadAvatar = async (formData: FormData) => {
  const me = await getMeUser();
  const user = me.user;
  const fileName = getAvatarFileName(user);
  const file = formData.get('file') as File;

  const payload = await getPayloadFromConfig();

  const avatars = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: fileName,
      },
    },
  });

  const avatar = avatars.docs[0];

  try {
    if (!avatar) {
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
    } else {
      await payload.update({
        collection: 'media',
        id: avatar.id,
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: fileName,
          size: file.size,
        },
        data: {},
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
