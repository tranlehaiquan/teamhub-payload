'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const removeUserCertificate = async (certificateId: number) => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  try {
    await payload.delete({
      collection: 'certificates',
      where: {
        id: {
          equals: certificateId,
        },
        user: {
          equals: userId,
        },
      },
    });

    return {
      success: true,
      message: 'Certificate removed successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to remove certificate',
    };
  }
};
