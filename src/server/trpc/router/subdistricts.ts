import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const subdistrictRouter = router({
  getAll: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      const capitalQuery = `${input.query[0]?.toUpperCase()}${input.query.substring(
        1
      )}`;
      return ctx.prisma.subdistricts
        .findMany({
          select: {
            id: true,
            name: true,
            cityName: true,
            provinceName: true,
            type: true,
          },
          where: {
            OR: [
              {
                name: {
                  contains: capitalQuery,
                },
              },
              {
                cityName: {
                  contains: capitalQuery,
                },
              },
              {
                provinceName: {
                  contains: capitalQuery,
                },
              },
            ],
          },
          take: 10,
        })
        .then((subdistricts) => {
          return subdistricts.map((subdistrict) => ({
            id: subdistrict.id,
            value: `Kec. ${subdistrict.name}, ${
              subdistrict.type === "Kota" ? "Kota" : "Kab."
            } ${subdistrict.cityName}, ${subdistrict.provinceName}`,
          }));
        });
    }),
});
