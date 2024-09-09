import React from "react";
import StaticField from "@/components/StaticField";

type ReadonlyFormProps = {
  fields: { label: string; value: string }[];
  labelWidth?: number;
};

const ReadonlyForm: React.FC<ReadonlyFormProps> = ({ fields, labelWidth }) => {
  const labelStyle = labelWidth ? { width: labelWidth } : {};

  return (
    <div data-testid="readonly-form">
      {fields.map(({ label, value }) => (
        <StaticField key={label} label={label} labelStyle={labelStyle}>
          {value}
        </StaticField>
      ))}
    </div>
  );
};

export default ReadonlyForm;
