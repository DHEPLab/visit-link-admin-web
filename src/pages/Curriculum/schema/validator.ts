import i18n from "@/i18n";
import { STAGE_TYPE } from "@/pages/Curriculum/schema/common";
import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import { ScheduleFormValue } from "@/pages/Curriculum/schema/Schedule";
import { FormInstance, RuleRender, ValidatorRule } from "rc-field-form/es/interface";

type DaysFormValues = {
  id?: number;
  stage: STAGE_TYPE;
  startOfApplicableDays: number | null;
  endOfApplicableDays: number | null;
};

function validateDateRange<T extends LessonFormValue | ScheduleFormValue>(items: T[], currentItem: DaysFormValues) {
  const { startOfApplicableDays, endOfApplicableDays, stage, id } = currentItem;

  if (startOfApplicableDays === null || endOfApplicableDays === null) {
    return true;
  }

  const isOverlap = (item: T) => {
    return (
      Math.max(item.startOfApplicableDays, startOfApplicableDays) <=
      Math.min(item.endOfApplicableDays, endOfApplicableDays)
    );
  };

  const isSameItem = (item: T) => {
    const bothHaveNoId = id === undefined && item.id === undefined;
    return item.id === id && !bothHaveNoId;
  };

  return items.filter((item) => !isSameItem(item) && item.stage === stage).every((item) => !isOverlap(item));
}

const t = i18n.getFixedT(null, "curriculum");

export function validateStartDateRange<T extends LessonFormValue | ScheduleFormValue>(
  items: T[],
  currentId?: number,
): RuleRender {
  return (form: FormInstance): ValidatorRule => ({
    validator(_rule, startOfApplicableDays: number | null) {
      const { stage, endOfApplicableDays } = form.getFieldsValue(["stage", "endOfApplicableDays"]);
      if (startOfApplicableDays === null || endOfApplicableDays === null) {
        return Promise.resolve();
      }
      return validateDateRange(items, {
        id: currentId,
        stage,
        startOfApplicableDays,
        endOfApplicableDays,
      })
        ? Promise.resolve()
        : Promise.reject(t("applicableDaysOverlap"));
    },
  });
}

export function validateEndDate(form: FormInstance): ValidatorRule {
  return {
    validator(_rule, endOfApplicableDays: number | null) {
      const startOfApplicableDays = form.getFieldValue("startOfApplicableDays");
      if (startOfApplicableDays === null || endOfApplicableDays === null) {
        return Promise.resolve();
      }
      return endOfApplicableDays > startOfApplicableDays
        ? Promise.resolve()
        : Promise.reject(t("endDayGreaterThanStart"));
    },
  };
}

export function validateEndDateRange<T extends LessonFormValue | ScheduleFormValue>(
  items: T[],
  currentId?: number,
): RuleRender {
  return (form: FormInstance): ValidatorRule => ({
    validator(_rule, endOfApplicableDays: number | null) {
      const { stage, startOfApplicableDays } = form.getFieldsValue(["stage", "startOfApplicableDays"]);
      if (startOfApplicableDays === null || endOfApplicableDays === null) {
        return Promise.resolve();
      }
      return validateDateRange(items, {
        id: currentId,
        stage,
        startOfApplicableDays,
        endOfApplicableDays,
      })
        ? Promise.resolve()
        : Promise.reject(t("applicableDaysOverlap"));
    },
  });
}
