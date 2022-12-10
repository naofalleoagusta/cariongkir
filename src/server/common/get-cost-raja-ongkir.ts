import fetch, { FormData } from "node-fetch";
import { z } from "zod";

import { type QueryResType, type StatusResType } from "@prisma/seed";
import { type CourierCode } from "@prisma/client";
import { env } from "@/env/server.mjs";

type CostResultsType = {
  code: CourierCode;
  name: string;
  costs: CostType[];
};

type CostType = {
  service: string;
  description: string;
  cost: Array<{ value: number; etd: string; note: "" }>;
};

export type GetCostRajaOngkirRes = {
  rajaongkir: {
    query: QueryResType;
    status: StatusResType;
    origin_details: {
      subdistrict_id: string;
      province_id: string;
      province: string;
      city_id: string;
      city: string;
      type: string;
      subdistrict_name: string;
    };
    destination_details: {
      subdistrict_id: string;
      province_id: string;
      province: string;
      city_id: string;
      city: string;
      type: string;
      subdistrict_name: string;
    };
    results: CostResultsType[];
  };
};

const paramSchema = z.object({
  origin: z.number(),
  destination: z.number(),
  weight: z.number(),
  courier: z.string(),
  w: z.number().nullish(),
  l: z.number().nullish(),
  h: z.number().nullish(),
});

export const getCostRajaOngkir = async (param: z.infer<typeof paramSchema>) => {
  const parsedParam = paramSchema.parse(param);
  const formData = new FormData();
  for (const key in parsedParam) {
    formData.append(key, `${parsedParam[key as keyof typeof parsedParam]}`);
  }
  formData.append("originType", "subdistrict");
  formData.append("destinationType", "subdistrict");
  const res = await fetch(`${env.RAJAONGKIR_API_URL}/cost`, {
    method: "POST",
    headers: {
      key: env.RAJAONGKIR_API_KEY,
    },
    body: formData,
  });
  const shippingCosts = (await res.json()) as GetCostRajaOngkirRes;
  return shippingCosts;
};
