import { useTranslation } from "react-i18next";
import StaticField from "@/components/StaticField";
import React from "react";
import { ModuleTopic } from "@/constants/enums";
import { ModuleResponse } from "@/models/res/Moduel";

const ReadonlyForm: React.FC<{ value: ModuleResponse }> = ({ value }) => {
  const { t } = useTranslation("module");

  return (
    <div data-testid="readonly-form">
      <StaticField label={t("moduleName")} labelStyle={{ width: 150 }}>
        {value.name}
      </StaticField>
      <StaticField label={t("moduleNumber")} labelStyle={{ width: 150 }}>
        {value.number}
      </StaticField>
      <StaticField label={t("moduleDescription")} labelStyle={{ width: 150 }}>
        {value.description}
      </StaticField>
      <StaticField label={t("moduleTheme")} labelStyle={{ width: 150 }}>
        {t(ModuleTopic[value.topic as keyof typeof ModuleTopic])}
      </StaticField>
    </div>
  );
};

export default ReadonlyForm;
