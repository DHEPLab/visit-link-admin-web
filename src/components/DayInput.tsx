import styled from "@emotion/styled";
import { InputNumber as AntdInputNumber } from "antd";
import { InputNumberProps } from "antd/es/input-number";
import * as React from "react";
import { useTranslation } from "react-i18next";

type DayInputProps = React.PropsWithChildren<Omit<InputNumberProps, "suffix">> & React.RefAttributes<HTMLInputElement>;

const DayInput: React.FC<DayInputProps> = ({ value, ...rest }) => {
  const { t } = useTranslation("common");

  return <InputNumber suffix={t("unit.day", { count: value ? Number(value) : undefined })} value={value} {...rest} />;
};

const InputNumber = styled(AntdInputNumber)`
  // This is workaround for cursor display when input number set the suffix

  .ant-input-number-input {
    border-radius: 0;
  }
`;

export default DayInput;
