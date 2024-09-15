import { STAGE_TYPE } from "./schema/common";
import { LessonFormValue } from "./schema/Lesson";
import { ScheduleFormValue } from "./schema/Schedule";

export function filterLessons(lessons: LessonFormValue[], stage: STAGE_TYPE, startDays?: number, endDays?: number) {
  if (!stage || !startDays || !endDays) return [];
  return lessons.filter((lesson) => {
    return lesson.stage === stage && lesson.startOfApplicableDays >= startDays && lesson.endOfApplicableDays <= endDays;
  });
}

export function validateLessonNumber(lessons: LessonFormValue[], number: string, exclude: string | null) {
  return !lessons.filter((item) => item.number !== exclude).find((item) => item.number === number);
}

type DaysFormValues = {
  id?: number;
  stage: STAGE_TYPE;
  startOfApplicableDays: number | null;
  endOfApplicableDays: number | null;
};

export function validateDateRange<T extends LessonFormValue | ScheduleFormValue>(
  items: T[],
  currentItem: DaysFormValues,
) {
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

export function cleanInvalidLessons(schedules: ScheduleFormValue[], lessons: LessonFormValue[]) {
  return schedules.map((schedule) => ({
    ...schedule,
    lessons: schedule.lessons.filter((domain) =>
      filterLessons(lessons, schedule.stage, schedule.startOfApplicableDays, schedule.endOfApplicableDays).find(
        (lesson) => domain.label === lesson.number,
      ),
    ),
  }));
}
