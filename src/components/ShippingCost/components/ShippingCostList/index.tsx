import { forwardRef, useImperativeHandle, useState } from "react";

import { type GetCostParamType } from "@/constants";
import { trpc } from "@/utils/trpc";

type QueryType = {
  origin?: number;
  destination?: number;
  weight?: number;
  w?: number;
  h?: number;
  l?: number;
};

const ShippingCostList = forwardRef(function ShippingCostList(_, ref) {
  const [query, setQuery] = useState<QueryType>();
  const { data } = trpc.queries.costs.getCosts.useQuery(
    {
      destination: query?.destination || 0,
      origin: query?.origin || 0,
      weight: query?.weight || 0,
    },
    {
      enabled: !!query?.origin && !!query.destination && !!query.weight,
    }
  );
  useImperativeHandle(
    ref,
    () => ({
      setShippingCostQuery: (data: GetCostParamType) => {
        console.log(data);
        setQuery({
          destination: data.destination,
          weight: data.weight,
          origin: data.origin,
        });
      },
    }),
    []
  );
  console.log(data);
  return <></>;
});

export default ShippingCostList;
