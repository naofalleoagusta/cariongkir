import { type CourierCode } from "@prisma/client";
import { z } from "zod";

export const courierCodes: CourierCode[] = [
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

export const courierNames: string[] = [
  "SiCepat",
  "J&T",
  "JNE",
  "Tiki",
  "AnterAja",
  "POS",
  "SAP Express",
  "Star Cargo",
  "Indah Cargo",
  "RPX Holding",
  "SiCepat",
];

export const getCostParamSchema = z.object({
  origin: z.number(),
  destination: z.number(),
  weight: z.number(),
  w: z.number().nullish(),
  l: z.number().nullish(),
  h: z.number().nullish(),
});

export type GetCostParamType = z.infer<typeof getCostParamSchema>;
