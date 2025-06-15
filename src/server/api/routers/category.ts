import { z } from 'zod';
import { categories } from '@/payload-generated-schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { asc } from '@payloadcms/db-postgres/drizzle';

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

      const categoriesRecords = await drizzle
        .select()
        .from(categories)
        .orderBy(asc(categories.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        docs: categoriesRecords,
        totalDocs: categoriesRecords.length,
        limit,
        totalPages: Math.ceil(categoriesRecords.length / limit),
        page,
      };
    }),
});
