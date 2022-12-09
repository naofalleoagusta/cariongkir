import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const subdistrictRouter = router({
  getAll: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      const capitalQuery = `${input.query[0]?.toUpperCase()}${input.query.substring(
        1
      )}`;
      return ctx.prisma.subdistricts.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          city: {
            select: {
              id: true,
              name: true,
              province: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          OR: [
            {
              name: {
                contains: capitalQuery,
              },
            },
            {
              city: {
                name: {
                  contains: capitalQuery,
                },
              },
            },
            {
              city: {
                province: {
                  name: {
                    contains: capitalQuery,
                  },
                },
              },
            },
          ],
        },
      });
    }),
});
