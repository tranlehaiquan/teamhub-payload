import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { skillRouter } from './routers/skill';
import { meRouter } from './routers/me';
import { categoryRouter } from './routers/category';
import { teamRouter } from './routers/team';
import { userRouter } from './routers/user';
import { authRouter } from './routers/auth';
import { globalConfigsRouter } from './routers/globals';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  skill: skillRouter,
  me: meRouter,
  category: categoryRouter,
  team: teamRouter,
  user: userRouter,
  auth: authRouter,
  global: globalConfigsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
