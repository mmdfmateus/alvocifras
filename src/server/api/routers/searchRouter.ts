import { z } from 'zod'

import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc'

export const searchRouter = createTRPCRouter({
  searchByName: publicProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        take: z.number().optional().default(3)
      })
    )
    .query(async ({ ctx, input }) => {
      const songs = await ctx.prisma.song.findMany({
        select: {
          id: true,
          name: true,
          artist:
          {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        take: input.take,
        where: {
          name: {
            contains: input.searchTerm
          }
        }
      })

      const artists = await ctx.prisma.artist.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true
        },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        take: input.take,
        where: {
          name: {
            contains: input.searchTerm
          }
        }
      })

      return { artists, songs }
    }),
})
