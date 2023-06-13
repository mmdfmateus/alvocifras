import { type Artist } from '@prisma/client'
import { TRPCError } from '@trpc/server'
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
        orderBy: [
          {
            name: 'asc',
          },
        ],
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

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.song.findFirst({
        where: {
          id: input,
        },
        include: {
          artist: {},
        },
      })

      if (!response) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Música não encontrada',
        })
      }

      return response
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

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.song.delete({
        where: {
          id: input,
        },
      })
    }),
})
