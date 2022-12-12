import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { courierCodes } from "@/constants";

import { type GetCostRajaOngkirRes } from "@/server/common/get-cost-raja-ongkir";
import { type CourierCosts } from "@prisma/client";

const SEVEN_DAY = 604800000; // in millisecond

const getCostParamSchema = z.object({
  origin: z.number(),
  destination: z.number(),
  weight: z.number(),
  w: z.number().nullish(),
  l: z.number().nullish(),
  h: z.number().nullish(),
});

export const costsRouter = router({
  getCosts: publicProcedure
    .input(getCostParamSchema)
    .query(({ ctx, input }) => {
      let weight: number = input.weight;
      if (input.w && input.h && input.l) {
        const volume = (input.w * input.h * input.l) / 6;
        if (volume > weight) {
          weight = volume;
        }
      }
      let roundedWeight = weight / 1000;
      const baseWeight = Math.floor(weight / 1000);
      const floorBaseWeight = baseWeight === 0 ? 0 : baseWeight + 0.31;
      const upperBaseWeight = floorBaseWeight + 1;
      if (!baseWeight) {
        roundedWeight = 1;
      }
      if (roundedWeight < floorBaseWeight) {
        roundedWeight = Math.floor(floorBaseWeight);
      } else {
        roundedWeight = Math.floor(upperBaseWeight);
      }
      roundedWeight *= 1000;
      const courierCosts = ctx.prisma.courierCosts.findMany({
        where: {
          AND: [
            { destinationId: input.destination },
            {
              originId: input.origin,
            },
          ],
        },
        orderBy: {
          cost: "asc",
        },
      });
      return courierCosts.then((res) => {
        if (
          !!res.length &&
          Date.now() - new Date(res?.[0]?.updatedAt || "").getTime() < SEVEN_DAY
        ) {
          return res.reduce(
            (courierCostsRes: CourierCosts[], dtCost: CourierCosts) => {
              if (
                dtCost.minWeight === 1000 ||
                (dtCost.minWeight > 1000 && dtCost.minWeight <= roundedWeight)
              ) {
                courierCostsRes.push({
                  ...dtCost,
                  cost: (roundedWeight / dtCost.minWeight) * dtCost.cost,
                });
              }
              return courierCostsRes;
            },
            []
          );
        }
        const promises: Promise<GetCostRajaOngkirRes>[] = courierCodes.map(
          (code) => {
            return ctx.getCourierCost({
              courier: code,
              destination: input.destination,
              origin: input.origin,
              weight: 1000,
            });
          }
        );

        return Promise.all(promises).then((dtCosts) => {
          const tempCosts: CourierCosts[] = [];
          const prismaPromises = [];
          for (const dtCost of dtCosts) {
            for (const resCost of dtCost.rajaongkir.results) {
              for (const shippingService of resCost.costs) {
                if ((resCost.code as string) === "J&T") {
                  resCost.code = "jnt";
                }
                const tempCost: CourierCosts = {
                  cost: shippingService.cost[0]?.value || 0,
                  courierCode: resCost.code,
                  courierName: resCost.name,
                  serviceName: shippingService.service,
                  serviceDescription: shippingService.description,
                  id: undefined as any,
                  minWeight: getMinWeight(
                    shippingService.description,
                    resCost.code
                  ),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  originId: input.origin,
                  destinationId: input.destination,
                  estimatedDuration: shippingService.cost[0]?.etd || "",
                };
                if (!!res.length) {
                  prismaPromises.push(
                    ctx.prisma.courierCosts.updateMany({
                      where: {
                        AND: [
                          { courierCode: tempCost.courierCode },
                          {
                            destinationId: tempCost.destinationId,
                          },
                          { originId: tempCost.originId },
                          { serviceName: tempCost.serviceName },
                        ],
                      },
                      data: {
                        cost: tempCost.cost,
                      },
                    })
                  );
                } else {
                  prismaPromises.push(
                    ctx.prisma.courierCosts.create({ data: tempCost })
                  );
                }

                if (
                  tempCost.minWeight === 1000 ||
                  (tempCost.minWeight > 1000 &&
                    tempCost.minWeight <= roundedWeight)
                ) {
                  tempCosts.push({
                    ...tempCost,
                    cost: (roundedWeight / tempCost.minWeight) * tempCost.cost,
                  });
                }
              }
            }
          }
          return Promise.all(prismaPromises).then(() => {
            return tempCosts;
          });
        });
      });
    }),
});

const getMinWeight = (desc: string, courierCode: string) => {
  const matchNumber = desc.match(/\d+/g);
  if (matchNumber) {
    return parseInt(matchNumber[0]) * 1000;
  }
  if (
    desc.toLowerCase().includes("cargo") ||
    desc.toLowerCase().includes("kargo")
  ) {
    return 10000;
  }
  if (courierCode === "star") {
    return 50000;
  }
  return 1000;
};
