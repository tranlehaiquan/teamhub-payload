import { z } from 'zod';
import { createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import type { Profile } from '@/payload-types';
import {
  categories,
  skills,
  teams,
  teams_users,
  users,
  users_skills,
  profiles,
  certificates,
  certificates_rels,
  trainings,
  trainings_rels,
} from '@/payload-generated-schema';
import { TrainingStatusValues } from '@/collections/Trainings/constants';
import { eq, inArray, or, and, desc } from '@payloadcms/db-postgres/drizzle';

const schemaChangePassword = z.object({
  currentPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
});

export const meRouter = createTRPCRouter({
  getMe: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;

    return me;
  }),

  getTeams: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;
    const userId = me.user.id;
    const drizzle = ctx.drizzle;

    // Optimized: Single query to get all teams where user is owner or member
    const teamsIsMemberOrOwner = await drizzle
      .select()
      .from(teams)
      .leftJoin(teams_users, eq(teams.id, teams_users.team))
      .where(or(eq(teams.owner, userId), eq(teams_users.user, userId)));

    // Remove duplicates (if any) due to join
    const uniqueTeams = new Map();
    for (const row of teamsIsMemberOrOwner) {
      // If using Drizzle's select with join, row will be { teams: ..., teams_users: ... }
      const team = row.teams || row;
      uniqueTeams.set(team.id, team);
    }

    return Array.from(uniqueTeams.values());
  }),

  userSkills: isAuthedProcedure.query(
    async ({
      ctx: {
        user: { user },
        drizzle,
      },
    }) => {
      const userId = user.id;

      // Single query with joins to get all data at once
      const userSkillsWithSkills = await drizzle
        .select({
          id: users_skills.id,
          currentLevel: users_skills.currentLevel,
          desiredLevel: users_skills.desiredLevel,
          skill: {
            id: skills.id,
            name: skills.name,
            category: categories.id,
          },
        })
        .from(users_skills)
        .leftJoin(skills, eq(users_skills.skill, skills.id))
        .leftJoin(categories, eq(skills.category, categories.id))
        .where(eq(users_skills.user, userId));

      return userSkillsWithSkills;
    },
  ),

  getCertificates: isAuthedProcedure.query(async ({ ctx }) => {
    const drizzle = ctx.drizzle;
    const me = ctx.user;
    const userId = me.user.id;

    // Get certificates with their user skills relationships in a single query using joins
    const certificatesWithRels = await drizzle
      .select({
        id: certificates.id,
        name: certificates.name,
        issuingOrganization: certificates.issuingOrganization,
        deliveryDate: certificates.deliveryDate,
        expiryDate: certificates.expiryDate,
        user: certificates.user,
        updatedAt: certificates.updatedAt,
        createdAt: certificates.createdAt,
        userSkillId: certificates_rels.users_skillsID,
      })
      .from(certificates)
      .leftJoin(
        certificates_rels,
        and(
          eq(certificates.id, certificates_rels.parent),
          eq(certificates_rels.path, 'userSkills'),
        ),
      )
      .where(eq(certificates.user, userId))
      .orderBy(desc(certificates.createdAt));

    if (certificatesWithRels.length === 0) {
      return { docs: [], totalDocs: 0, hasNextPage: false };
    }

    // Extract unique user skill IDs from the joined results
    const userSkillIds = certificatesWithRels
      .map((cert) => cert.userSkillId)
      .filter(Boolean) as number[];

    let userSkillsMap = new Map();
    if (userSkillIds.length > 0) {
      const userSkillsData = await drizzle
        .select({
          id: users_skills.id,
          user: users_skills.user,
          skill: users_skills.skill,
          currentLevel: users_skills.currentLevel,
          desiredLevel: users_skills.desiredLevel,
          skillName: skills.name,
        })
        .from(users_skills)
        .leftJoin(skills, eq(users_skills.skill, skills.id))
        .where(inArray(users_skills.id, userSkillIds));

      userSkillsMap = new Map(
        userSkillsData.map((skill) => [
          skill.id,
          {
            ...skill,
            skill: { id: skill.skill, name: skill.skillName },
          },
        ]),
      );
    }

    // Group certificates and their user skills from the joined results
    const certificatesMap = new Map();
    certificatesWithRels.forEach((row) => {
      const certId = row.id;
      if (!certificatesMap.has(certId)) {
        certificatesMap.set(certId, {
          id: row.id,
          name: row.name,
          issuingOrganization: row.issuingOrganization,
          deliveryDate: row.deliveryDate,
          expiryDate: row.expiryDate,
          user: row.user,
          updatedAt: row.updatedAt,
          createdAt: row.createdAt,
          userSkills: [],
        });
      }

      if (row.userSkillId && userSkillsMap.has(row.userSkillId)) {
        certificatesMap.get(certId).userSkills.push(userSkillsMap.get(row.userSkillId));
      }
    });

    const certificatesWithUserSkills = Array.from(certificatesMap.values());

    return {
      docs: certificatesWithUserSkills,
      totalDocs: certificatesWithUserSkills.length,
      hasNextPage: false,
    };
  }),

  updateProfile: isAuthedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user;
      const drizzle = ctx.drizzle;
      const profileId = (me.user.profile as Profile).id;

      const updatedProfile = await drizzle
        .update(profiles)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(profiles.id, profileId))
        .returning();

      return updatedProfile[0];
    }),

  addCertificate: isAuthedProcedure
    .input(
      z.object({
        name: z.string().nonempty({
          message: 'Name is required',
        }),
        issuingOrganization: z.string().min(1, {
          message: 'Issuing organization is required',
        }),
        deliveryDate: z.date().optional().nullable(),
        expiryDate: z.date().optional().nullable(),
        userSkills: z.array(
          z.number({
            message: 'Skill is required',
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const drizzle = ctx.drizzle;
      const { name, issuingOrganization, deliveryDate, expiryDate, userSkills } = input;

      // Insert certificate
      const newCertificate = await drizzle
        .insert(certificates)
        .values({
          name,
          issuingOrganization,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
          user: userId,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      const certificateId = newCertificate[0].id;

      // Insert user skills relationships
      if (userSkills.length > 0) {
        const relationshipData = userSkills.map((userSkillId, index) => ({
          parent: certificateId,
          path: 'userSkills',
          users_skillsID: userSkillId,
          order: index,
        }));

        await drizzle.insert(certificates_rels).values(relationshipData);
      }

      return newCertificate[0];
    }),

  updateCertificate: isAuthedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty({
          message: 'Name is required',
        }),
        issuingOrganization: z.string().min(1, {
          message: 'Issuing organization is required',
        }),
        deliveryDate: z.date().optional().nullable(),
        expiryDate: z.date().optional().nullable(),
        userSkills: z.array(
          z.number({
            message: 'Skill is required',
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const drizzle = ctx.drizzle;
      const { id, name, issuingOrganization, deliveryDate, expiryDate, userSkills } = input;

      // Update certificate
      const updatedCertificate = await drizzle
        .update(certificates)
        .set({
          name,
          issuingOrganization,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(certificates.id, id), eq(certificates.user, userId)))
        .returning();

      if (updatedCertificate.length === 0) {
        throw new Error('Certificate not found or access denied');
      }

      // Delete existing user skills relationships
      await drizzle
        .delete(certificates_rels)
        .where(and(eq(certificates_rels.parent, id), eq(certificates_rels.path, 'userSkills')));

      // Insert new user skills relationships
      if (userSkills.length > 0) {
        const relationshipData = userSkills.map((userSkillId, index) => ({
          parent: id,
          path: 'userSkills',
          users_skillsID: userSkillId,
          order: index,
        }));

        await drizzle.insert(certificates_rels).values(relationshipData);
      }

      return updatedCertificate[0];
    }),

  removeCertificate: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const drizzle = ctx.drizzle;
    const userId = ctx.user.user.id;
    const certificateId = input;

    try {
      // Delete relationships first (cascading should handle this, but being explicit)
      await drizzle.delete(certificates_rels).where(eq(certificates_rels.parent, certificateId));

      // Delete certificate
      const deletedCertificate = await drizzle
        .delete(certificates)
        .where(and(eq(certificates.id, certificateId), eq(certificates.user, userId)))
        .returning();

      if (deletedCertificate.length === 0) {
        throw new Error('Certificate not found or access denied');
      }

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
  }),

  updatePassword: isAuthedProcedure.input(schemaChangePassword).mutation(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const user = ctx.user.user;

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: input.newPassword,
      },
    });

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }),

  addUserSkill: isAuthedProcedure.input(z.array(z.number())).mutation(async ({ input, ctx }) => {
    const me = ctx.user.user;
    const userId = me.id;
    const drizzle = ctx.drizzle;
    const skills = input;

    try {
      const newUserSkills = skills.map((skill) => ({
        user: userId,
        skill: skill,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }));

      await drizzle.insert(users_skills).values(newUserSkills);

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
  }),

  removeUserSkill: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const me = ctx.user.user;
    const userId = me.id;
    const drizzle = ctx.drizzle;
    const skill = input;

    try {
      const deletedSkill = await drizzle
        .delete(users_skills)
        .where(and(eq(users_skills.user, userId), eq(users_skills.skill, skill)))
        .returning();

      if (deletedSkill.length === 0) {
        throw new Error('User skill not found');
      }

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
  }),

  updateUserSkill: isAuthedProcedure
    .input(
      z.object({
        id: z.number(),
        currentLevel: z.number().optional(),
        desiredLevel: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const drizzle = ctx.drizzle;
      const { id, currentLevel, desiredLevel } = input;

      try {
        const updatedUserSkill = await drizzle
          .update(users_skills)
          .set({
            currentLevel: currentLevel !== undefined ? String(currentLevel) : undefined,
            desiredLevel: desiredLevel !== undefined ? String(desiredLevel) : undefined,
            updatedAt: new Date().toISOString(),
          })
          .where(and(eq(users_skills.user, userId), eq(users_skills.id, id)))
          .returning();

        if (updatedUserSkill.length === 0) {
          throw new Error('User skill not found');
        }

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
    }),

  getTrainings: isAuthedProcedure
    .input(
      z
        .object({
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const me = ctx.user;
      const userId = me.user.id;
      const drizzle = ctx.drizzle;
      const { page = 1, limit = 10 } = input || {};

      const offset = (page - 1) * limit;

      // Get trainings for the user and total count in parallel
      const [userTrainings, totalCountResult] = await Promise.all([
        drizzle
          .select({
            id: trainings.id,
            name: trainings.name,
            link: trainings.link,
            description: trainings.description,
            user: trainings.user,
            status: trainings.status,
            startDate: trainings.startDate,
            endDate: trainings.endDate,
            certificate: trainings.certificate,
            updatedAt: trainings.updatedAt,
            createdAt: trainings.createdAt,
          })
          .from(trainings)
          .where(eq(trainings.user, userId))
          .orderBy(desc(trainings.createdAt))
          .limit(limit)
          .offset(offset),
        drizzle.select({ count: trainings.id }).from(trainings).where(eq(trainings.user, userId)),
      ]);

      const totalDocs = totalCountResult.length;
      const hasNextPage = offset + limit < totalDocs;

      // Get user skills relationships for trainings
      const trainingIds = userTrainings.map((training) => training.id);

      let trainingsWithUserSkills = userTrainings;

      if (trainingIds.length > 0) {
        const trainingUserSkills = await drizzle
          .select({
            trainingId: trainings_rels.parent,
            userSkillId: trainings_rels.users_skillsID,
          })
          .from(trainings_rels)
          .where(
            and(inArray(trainings_rels.parent, trainingIds), eq(trainings_rels.path, 'userSkills')),
          );

        // Get user skills with skill details
        const userSkillIds = trainingUserSkills
          .map((rel) => rel.userSkillId)
          .filter(Boolean) as number[];

        let userSkillsMap = new Map();
        if (userSkillIds.length > 0) {
          const userSkillsData = await drizzle
            .select({
              id: users_skills.id,
              user: users_skills.user,
              skill: users_skills.skill,
              currentLevel: users_skills.currentLevel,
              desiredLevel: users_skills.desiredLevel,
              skillName: skills.name,
            })
            .from(users_skills)
            .leftJoin(skills, eq(users_skills.skill, skills.id))
            .where(inArray(users_skills.id, userSkillIds));

          userSkillsMap = new Map(
            userSkillsData.map((skill) => [
              skill.id,
              {
                ...skill,
                skill: { id: skill.skill, name: skill.skillName },
              },
            ]),
          );
        }

        // Map trainings with their user skills
        trainingsWithUserSkills = userTrainings.map((training) => {
          const relatedUserSkills = trainingUserSkills
            .filter((rel) => rel.trainingId === training.id)
            .map((rel) => (rel.userSkillId ? userSkillsMap.get(rel.userSkillId) : null))
            .filter(Boolean);

          return {
            ...training,
            userSkills: relatedUserSkills,
          };
        });
      }

      return {
        docs: trainingsWithUserSkills,
        totalDocs,
        page,
        limit,
        totalPages: Math.ceil(totalDocs / limit),
        hasNextPage,
        hasPrevPage: page > 1,
      };
    }),

  addTraining: isAuthedProcedure
    .input(
      z.object({
        name: z.string(),
        link: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(TrainingStatusValues).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        userSkills: z.array(z.number()).default([]).nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const drizzle = ctx.drizzle;
      const { name, link, description, status, startDate, endDate, userSkills } = input;

      // Insert training
      const newTraining = await drizzle
        .insert(trainings)
        .values({
          name,
          link: link || null,
          description: description || null,
          status: status || 'not-started',
          user: userId,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      const trainingId = newTraining[0].id;

      // Insert user skills relationships
      if (userSkills && userSkills.length > 0) {
        const relationshipData = userSkills.map((userSkillId, index) => ({
          parent: trainingId,
          path: 'userSkills',
          users_skillsID: userSkillId,
          order: index,
        }));

        await drizzle.insert(trainings_rels).values(relationshipData);
      }

      return newTraining[0];
    }),

  updateTraining: isAuthedProcedure
    .input(
      z
        .object({
          id: z.number(),
          name: z.string().nonempty({
            message: 'Training name is required',
          }),
          link: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(TrainingStatusValues).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          userSkills: z.array(z.number()).nullable(),
        })
        .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
          message: 'End date must be after start date',
          path: ['endDate'],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const drizzle = ctx.drizzle;
      const { id, name, link, description, status, startDate, endDate, userSkills } = input;

      try {
        // Update training
        const updatedTraining = await drizzle
          .update(trainings)
          .set({
            name,
            link: link || null,
            description: description || null,
            status,
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null,
            updatedAt: new Date().toISOString(),
          })
          .where(and(eq(trainings.id, id), eq(trainings.user, userId)))
          .returning();

        if (updatedTraining.length === 0) {
          throw new Error('Training not found or access denied');
        }

        // Delete existing user skills relationships
        await drizzle
          .delete(trainings_rels)
          .where(and(eq(trainings_rels.parent, id), eq(trainings_rels.path, 'userSkills')));

        // Insert new user skills relationships
        if (userSkills && userSkills.length > 0) {
          const relationshipData = userSkills.map((userSkillId, index) => ({
            parent: id,
            path: 'userSkills',
            users_skillsID: userSkillId,
            order: index,
          }));

          await drizzle.insert(trainings_rels).values(relationshipData);
        }

        return {
          success: true,
          message: 'Training updated successfully',
        };
      } catch {
        return {
          success: false,
          message: 'Failed to update training',
        };
      }
    }),

  removeTraining: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const drizzle = ctx.drizzle;
    const userId = ctx.user.user.id;
    const trainingId = input;

    try {
      // Delete relationships first (cascading should handle this, but being explicit)
      await drizzle.delete(trainings_rels).where(eq(trainings_rels.parent, trainingId));

      // Delete training
      const deletedTraining = await drizzle
        .delete(trainings)
        .where(and(eq(trainings.id, trainingId), eq(trainings.user, userId)))
        .returning();

      if (deletedTraining.length === 0) {
        throw new Error('Training not found or access denied');
      }

      return {
        success: true,
        message: 'Training removed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to remove training',
      };
    }
  }),

  updateMe: isAuthedProcedure
    .input(
      z.object({
        reportTo: z.number().nullable(),
        jobTitle: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const drizzle = ctx.drizzle;
      const me = ctx.user.user;

      if (me.id === input.reportTo) {
        throw new Error('You cannot report to yourself');
      }

      await drizzle
        .update(users)
        .set({
          reportTo: input.reportTo,
          jobTitle: input.jobTitle,
        })
        .where(eq(users.id, me.id));

      return {
        success: true,
        message: 'User updated successfully',
      };
    }),
});
