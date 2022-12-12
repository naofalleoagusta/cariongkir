import { forwardRef, useImperativeHandle, useState } from "react";

import ComboBoxField, {
  type DataType,
} from "@/components/ui_palette/ComboBoxField";

import { trpc } from "@/utils/trpc";
import useDebounce from "@/hooks/useDebounce";

type AreaComboBoxProps = {
  placeholder?: string;
  name?: string;
  label?: string;
};

const AreaComboBox = forwardRef(function AreaComboBox(
  { placeholder, name, label }: AreaComboBoxProps,
  ref
) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const { data, isLoading } = trpc.queries.subdistricts.getAll.useQuery(
    {
      query: debouncedQuery,
    },
    {
      enabled: !!debouncedQuery,
      cacheTime: 3600,
    }
  );
  const [selected, setSelected] = useState<DataType>({
    id: 0,
    value: "",
  });

  const handleOnChangeQuery = (param: string) => {
    setQuery(param);
  };

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => {
        return selected?.id;
      },
    }),
    [selected]
  );

  return (
    <div>
      <ComboBoxField
        datas={data || []}
        onChangeQuery={handleOnChangeQuery}
        onSelect={setSelected}
        selected={selected}
        query={debouncedQuery}
        loading={isLoading}
        placeholder={placeholder}
        name={name}
        label={label}
      />
    </div>
  );
});

export default AreaComboBox;
