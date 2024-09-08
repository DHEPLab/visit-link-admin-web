import React from "react";
import { Select, SelectProps } from "antd";

import * as Enums from "../constants/enums";

type EnumKeys = keyof typeof Enums;

type SelectEnumProps = {
  name: EnumKeys;
} & SelectProps;

const SelectEnum: React.FC<SelectEnumProps> = ({ name, ...rest }) => {
  return (
    <Select {...rest}>
      {Object.entries(Enums[name] || []).map(([key, value]) => (
        <Select.Option key={key} value={key}>
          {value}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectEnum;
