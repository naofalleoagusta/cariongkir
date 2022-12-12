import InputField from "@/components/ui_palette/InputField";
import React, { forwardRef, useImperativeHandle, useState } from "react";

const blacklistedKey = ["-", ",", "+", "="];

const WeightField = forwardRef(function WeightField(_, ref) {
  const [value, setValue] = useState<number | undefined>(1);
  const handleOnChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value);
    const newValue = !!parsedValue
      ? parsedValue
      : parsedValue === 0
      ? 0
      : undefined;
    setValue(newValue);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (blacklistedKey.includes(event.key)) {
      event.preventDefault();
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => {
        return value;
      },
    }),
    [value]
  );

  return (
    <InputField
      value={value}
      onChange={handleOnChage}
      type="number"
      onKeyDown={handleOnKeyDown}
      id="weight-input"
      placeholder="1.00"
      label={
        <>
          Berat <span className="font-black">(Kg)</span>
        </>
      }
      ariaLabel="Input Field Berat"
    />
  );
});

export default WeightField;
