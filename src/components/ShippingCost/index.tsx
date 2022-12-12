import { useRef } from "react";
import Button from "../ui_palette/Button";

import AreaComboBox from "./components/AreaComboBox";
import WeightField from "./components/WeightField";
import ShippingCostList from "./components/ShippingCostList";

import { getCostParamSchema } from "@/constants";
import {
  type ShippingCostListRefType,
  type ShippingCostInputRefType,
} from "./types";
import { z } from "zod";

const ShippingCost = () => {
  const originRef = useRef<ShippingCostInputRefType>();
  const destinationRef = useRef<ShippingCostInputRefType>();
  const weightRef = useRef<ShippingCostInputRefType>();
  const shippingCostListRef = useRef<ShippingCostListRefType>();

  const handleOnClick = () => {
    const originId = originRef.current?.getValue();
    const destinationId = destinationRef.current?.getValue();
    const weight = weightRef.current?.getValue();
    try {
      getCostParamSchema.parse({
        origin: originId,
        destination: destinationId,
        weight: weight,
      });
      shippingCostListRef.current?.setShippingCostQuery({
        destination: destinationId || 0,
        origin: originId || 0,
        weight: weight || 0,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.issues);
      }
    }
    console.log(originId, destinationId, weight);
  };
  return (
    <>
      <div className="flex w-full flex-col flex-wrap items-end gap-2  rounded-xl border-2 border-black bg-white p-4 md:flex-row md:flex-nowrap">
        <div className="flex w-full flex-grow flex-col flex-wrap gap-2 md:flex-row md:flex-nowrap">
          <div className="md:basis-[30%]">
            <AreaComboBox
              placeholder="Asal Daerah"
              name="origin-combobox"
              label="Dari"
              ref={originRef}
            />
          </div>
          <div className="md:basis-[30%]">
            <AreaComboBox
              placeholder="Tujuan Daerah"
              name="destination-combobox"
              label="Ke"
              ref={destinationRef}
            />
          </div>
          <div className="basis-[40%]">
            <WeightField ref={weightRef} />
          </div>
        </div>
        <div className="w-full basis-[17.5%]">
          <Button
            className="h-[40px] w-full"
            id="check-cost-btn"
            ariaLabel="Button Cek Tarif"
            onClick={handleOnClick}
          >
            Cek Tarif
          </Button>
        </div>
      </div>
      <ShippingCostList ref={shippingCostListRef} />
    </>
  );
};

export default ShippingCost;
