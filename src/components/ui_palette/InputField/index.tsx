import React from "react";

type InputFieldProps = {
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  id?: string;
  label?: React.ReactNode;
  name?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: "text" | "number";
  placeholder?: string;
  ariaLabel?: string;
};

const InputField = ({
  value,
  onChange,
  onBlur,
  id,
  label,
  name,
  onKeyDown,
  type = "text",
  placeholder,
  ariaLabel,
}: InputFieldProps) => {
  const handleOnWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur();
  };
  return (
    <>
      {label && (
        <label htmlFor={name} className="font-semibold">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border-2 border-black bg-white py-2 pl-3 pr-10 text-left text-sm leading-5 text-gray-900 transition-[border] duration-300 ease-in-out focus:border-purple-600 focus-visible:outline-none"
        aria-label={ariaLabel}
        onWheel={handleOnWheel}
      />
    </>
  );
};

export default InputField;
