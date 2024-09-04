import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import StaticField from "@/components/StaticField";
import React from "react";

export default function ReadonlyForm({ value: { name, description } }) {
  const { t } = useTranslation("curriculum");
  const labelWidth = i18n.resolvedLanguage === "zh" ? 80 : 180;

  return (
    <div data-testid="readonly-form">
      <StaticField label={t("curriculumName")} labelStyle={{ width: labelWidth }}>
        {name}
      </StaticField>
      <StaticField label={t("curriculumDescription")} labelStyle={{ width: labelWidth }}>
        {description}
      </StaticField>
    </div>
  );
}
