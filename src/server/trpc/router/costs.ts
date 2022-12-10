import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { type GetCostRajaOngkirRes } from "@/server/common/get-cost-raja-ongkir";
import { type CourierCode, type CourierCosts } from "@prisma/client";

const ONE_DAY = 86400000; // in millisecond

const paramSchema = z.object({
  origin: z.number(),
  destination: z.number(),
  weight: z.number(),
  w: z.number().nullish(),
  l: z.number().nullish(),
  h: z.number().nullish(),
});

const courierCodes: CourierCode[] = [
  "anteraja",
  "indah",
  "jne",
  "jnt",
  "pos",
  "rpx",
  "sap",
  "sicepat",
  "star",
  "tiki",
];

export const costsRouter = router({
  getCosts: publicProcedure.input(paramSchema).query(({ ctx, input }) => {
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
          { destinationtId: input.destination },
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
        Date.now() - new Date(res?.[0]?.updatedAt || "").getTime() < ONE_DAY
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
                minWeight:
                  shippingService.description.toLowerCase().includes("cargo") ||
                  shippingService.description.toLowerCase().includes("kargo")
                    ? 10000
                    : 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
                originId: input.origin,
                destinationtId: input.destination,
                estimatedDuration: shippingService.cost[0]?.etd || "",
              };
              tempCosts.push(tempCost);
            }
          }
        }

        return ctx.prisma.courierCosts
          .createMany({
            data: tempCosts,
          })
          .then(() => {
            return tempCosts.reduce(
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
          });
      });
    });
  }),
});
