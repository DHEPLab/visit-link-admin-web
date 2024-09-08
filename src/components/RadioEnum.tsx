import React from "react";
import { Radio, RadioGroupProps } from "antd";

import * as Enums from "@/constants/enums";

type EnumKeys = keyof typeof Enums;

type RadioEnumProps = {
  name: EnumKeys;
} & RadioGroupProps;

const RadioEnum: React.FC<RadioEnumProps> = ({ name, ...rest }) => {
  return (
    <Radio.Group {...rest}>
      {Object.entries(Enums[name] || []).map(([key, value]) => (
        <Radio key={key} value={key}>
          {value}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default RadioEnum;
