import { type GetCostParamType } from "@/server/trpc/router/costs";

export type ShippingCostInputRefType = {
  getValue: () => number | undefined;
};

export type ShippingCostListRefType = {
  setShippingCostQuery: (param: GetCostParamType) => void;
};
