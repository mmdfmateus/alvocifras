import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'

export const songsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          take: z.number().optional(),
          includeArtist: z.boolean().default(false).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.song.findMany({
        select: {
          id: true,
          name: true,
          artist: input?.includeArtist
            ? {
                select: {
                  imageUrl: true,
                  name: true,
                },
              }
            : true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        take: input?.take ?? 3,
      })

      return response
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

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        artistId: z.string().uuid(),
        chords: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.song.update({
        where: {
          id: input.id
        },
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
