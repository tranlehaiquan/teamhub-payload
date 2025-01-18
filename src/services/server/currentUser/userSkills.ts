'use server';
import { UsersSkill } from '@/payload-types';
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

const removeCurrentUserSkill = async (skill: number) => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  try {
    await payload.delete({
      collection: 'users_skills',
      where: {
        user: {
          equals: userId,
        },
        skill: {
          equals: skill,
        },
      },
    });

    return {
      success: true,
      message: 'Skill removed successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to remove skill',
    };
  }
};

const updateCurrentUserSkill = async (
  skill: number,
  data: {
    currentLevel?: number;
    desiredLevel?: number;
  },
) => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  try {
    await payload.update({
      collection: 'users_skills',
      data,
      where: {
        user: {
          equals: userId,
        },
        skill: {
          equals: skill,
        },
      },
    });

    return {
      success: true,
      message: 'Skill updated successfully',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to update skill',
    };
  }
};

export { addCurrentUserSkills, removeCurrentUserSkill, updateCurrentUserSkill };
