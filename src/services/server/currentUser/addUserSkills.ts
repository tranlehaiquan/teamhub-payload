'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

const addCurrentUserSkills = async (skills: number[]) => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  // TODO: consider insert with drizzle
  try {
    await Promise.all(
      skills.map(async (skill) =>
        payload.create({
          collection: 'users_skills',
          data: {
            user: userId,
            skill: skill,
          },
        }),
      ),
    );

    return {
      success: true,
      message: 'Skills added successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to add skills',
    };
  }
};

export { addCurrentUserSkills };
