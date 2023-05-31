import { type Artist } from '@prisma/client'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'

export const songsRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(
      z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          artist: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
      )
    )
    .query(async ({ ctx }) => {
      const response = await ctx.prisma.song.findMany({
        select: {
          id: true,
          name: true,
          artist: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return response.map(
        ({
          artist,
          ...song
        }: { artist: Artist } & {
          id: string
          name: string
          createdAt: Date
          updatedAt: Date
        }) => ({
          artist: artist.name,
          ...song,
        })
      )
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        artistId: z.string().uuid(),
        chords: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.song.create({
        data: {
          name: input.name,
          artistId: input.artistId,
          chords: input.chords,
          lyrics: input.chords,
        },
      })

      return result.id
    }),
})
