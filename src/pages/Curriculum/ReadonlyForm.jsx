import { useTranslation } from "react-i18next";
import StaticField from "@/components/StaticField";
import React from "react";

export default function ReadonlyForm({ value: { name, description } }) {
  const { t } = useTranslation("curriculum");

  return (
    <div data-testid="readonly-form">
      <StaticField label={t("curriculumName")} labelStyle={{ width: 180 }}>
        {name}
      </StaticField>
      <StaticField label={t("curriculumDescription")} labelStyle={{ width: 180 }}>
        {description}
      </StaticField>
    </div>
  );
}
