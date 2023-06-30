import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'

export const artistsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ take: z.number().optional() }).optional())
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          imageUrl: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.artist.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        take: input?.take ?? 100,
      })

      return response
    }),

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.artist.findFirst({
        where: {
          id: input,
        },
        include: {
          songs: {},
        },
      })

      if (!response) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Artista não encontrada',
        })
      }

      return response
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(4).max(50),
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.artist.create({
        data: {
          name: input.name,
          imageUrl: input.imageUrl,
        },
      })

      return result.id
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(4).max(50),
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.artist.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          imageUrl: input.imageUrl,
        },
      })

      return result.id
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.artist.delete({
        where: {
          id: input,
        },
      })
    }),
})
