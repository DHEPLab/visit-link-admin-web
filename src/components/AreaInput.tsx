import styled from "@emotion/styled";
import { Select as AntdSelect, SelectProps } from "antd";
import { debounce } from "radash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type AreaInputProps<ValueType = string[]> = {
  enablePlaceSearch?: boolean;
} & SelectProps<ValueType>;

const AreaInput = <ValueType extends string[]>({ enablePlaceSearch = false, ...props }: AreaInputProps<ValueType>) => {
  const { t } = useTranslation("form");
  const [options, setOptions] = useState<SelectProps["options"]>([]);

  const handleSearch = debounce({ delay: 1000 }, (value: string) => {
    console.log("type to search value:", value);
    // TODO: integrate with map API
    setOptions([{ value: value, label: value }]);
  });

  return (
    <Select
      mode="tags"
      options={options}
      onSearch={handleSearch}
      dropdownStyle={enablePlaceSearch ? {} : { display: "none" }}
      showSearch={enablePlaceSearch}
      suffixIcon={null}
      allowClear
      placeholder={t("areaPlaceholder")}
      {...props}
    />
  );
};

const Select = styled(AntdSelect)<SelectProps>`
  .ant-select-selection-placeholder {
    inset-inline-start: 24px;
  }
` as <ValueType>(props: SelectProps<ValueType>) => JSX.Element;

export default AreaInput;
