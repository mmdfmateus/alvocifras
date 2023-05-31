import { createTRPCRouter } from '~/server/api/trpc'
import { artistsRouter } from './routers/artistsRouter'
import { songsRouter } from './routers/songsRouter'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  artists: artistsRouter,
  songs: songsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
