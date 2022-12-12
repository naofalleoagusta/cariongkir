import React, { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import ChevronUpDownIcon from "@heroicons/react/20/solid/ChevronUpDownIcon";

export type DataType = {
  id: number;
  value: string;
};

type ComboBoxFieldProps = {
  datas: DataType[];
  query: string;
  selected: DataType;
  onSelect: React.Dispatch<React.SetStateAction<DataType>>;
  onChangeQuery: (param: string) => void;
  loading?: boolean;
  placeholder?: string;
  name?: string;
  label?: string;
};

const ComboBoxField = ({
  datas,
  query,
  selected,
  onSelect,
  onChangeQuery,
  loading = false,
  placeholder,
  name,
  label,
}: ComboBoxFieldProps) => {
  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeQuery(event.target.value);
  };

  return (
    <>
      {label && (
        <label htmlFor={name} className="font-semibold">
          {label}
        </label>
      )}
      <Combobox value={selected} onChange={onSelect}>
        {({ open }) => (
          <div className="relative mt-1">
            <Combobox.Button
              as="div"
              className="h-[40px] w-full cursor-default overflow-hidden focus:outline-none sm:text-sm"
            >
              <Combobox.Input
                className="w-full rounded-lg border-2 border-black bg-white py-2 pl-3 pr-6 text-left text-sm leading-5 text-gray-900 transition-[border] duration-300 ease-in-out focus:border-purple-600 focus-visible:outline-none"
                displayValue={(data: DataType) => data?.value || ""}
                onChange={handleOnChangeInput}
                placeholder={placeholder}
                name={name}
              />
              <ChevronUpDownIcon
                className={`${
                  open ? "fill-purple-600" : ""
                } absolute top-1/2 right-1 flex w-5 -translate-y-1/2 items-center text-gray-400 transition-all duration-300`}
                aria-hidden="true"
              />
            </Combobox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              enter="transition ease-in duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <Combobox.Options
                className={`${
                  !datas.length && !query ? "hidden" : "block"
                } absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border-2 border-black bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
              >
                {loading && !!query ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Loading...
                  </div>
                ) : datas.length === 0 && !!query ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Tidak Ditemukan.
                  </div>
                ) : (
                  datas.map((data) => (
                    <Combobox.Option
                      key={data.id}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2 px-4 ${
                          active || selected
                            ? "bg-purple-600 text-white"
                            : "text-gray-900"
                        }`
                      }
                      value={data}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {data.value}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </>
  );
};

export default ComboBoxField;
