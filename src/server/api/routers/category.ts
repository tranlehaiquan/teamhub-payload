import { z } from 'zod';
import { categories } from '@/payload-generated-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { asc, inArray } from '@payloadcms/db-postgres/drizzle';
import { skills } from '@/payload-generated-schema';

export const categoryRouter = createTRPCRouter({
  getCategories: publicProcedure
    .input(
      z
        .object({
          page: z.number().optional().default(1),
          limit: z.number().optional().default(10),
        })
        .optional(),
    )
    .query(async ({ input: { page, limit } = { page: 1, limit: 10 }, ctx }) => {
      const { drizzle } = ctx;

      // First, get the categories with pagination
      const categoriesRecords = await drizzle
        .select({
          id: categories.id,
          title: categories.title,
          parent: categories.parent,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        })
        .from(categories)
        .orderBy(asc(categories.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);

      // Get the total count for pagination
      const totalCountResult = await drizzle.select({ count: categories.id }).from(categories);
      const totalDocs = totalCountResult.length;

      // If no categories, return early
      if (categoriesRecords.length === 0) {
        return {
          docs: [],
          totalDocs,
          limit,
          totalPages: Math.ceil(totalDocs / limit),
          page,
        };
      }

      // Get all skills for the fetched categories
      const categoryIds = categoriesRecords.map((cat) => cat.id);
      const skillsRecords = await drizzle
        .select({
          id: skills.id,
          name: skills.name,
          category: skills.category,
        })
        .from(skills)
        .where(inArray(skills.category, categoryIds));

      // Group skills by category using Map to avoid type issues
      const skillsByCategory = new Map<number, Array<{ id: number; name: string }>>();

      skillsRecords.forEach((skill) => {
        const categoryId = skill.category;
        if (categoryId !== null) {
          if (!skillsByCategory.has(categoryId)) {
            skillsByCategory.set(categoryId, []);
          }
          skillsByCategory.get(categoryId)!.push({
            id: skill.id,
            name: skill.name,
          });
        }
      });

      // Combine categories with their skills
      const docs = categoriesRecords.map((category) => ({
        ...category,
        skills: skillsByCategory.get(category.id) || [],
      }));

      return {
        docs,
        totalDocs,
        limit,
        totalPages: Math.ceil(totalDocs / limit),
        page,
      };
    }),
});
