import { LessonFormValue } from "./schema/Lesson";
import { ScheduleFormValue } from "./schema/Schedule";
import { STAGE_TYPE } from "./schema/common";

export function filterLessons(lessons: LessonFormValue[], stage: STAGE_TYPE, startDays?: number, endDays?: number) {
  if (!stage || !startDays || !endDays) return [];
  return lessons.filter((lesson) => {
    return lesson.stage === stage && lesson.startOfApplicableDays >= startDays && lesson.endOfApplicableDays <= endDays;
  });
}

export function validateLessonNumber(lessons: LessonFormValue[], number: string, exclude: string | null) {
  return !lessons.filter((item) => item.number !== exclude).find((item) => item.number === number);
}

type ValidateLessonDateRangeLesson = {
  id?: number;
  stage: STAGE_TYPE;
  startOfApplicableDays: number;
  endOfApplicableDays: number;
};

export function validateLessonDateRange<T extends LessonFormValue | ScheduleFormValue>(
  lessons: T[],
  lesson: ValidateLessonDateRangeLesson,
) {
  return !lessons
    .filter((item) => {
      const isAdd = item.id === undefined && lesson.id === undefined;
      return (item.id !== lesson.id || isAdd) && item.stage === lesson.stage;
    })
    .find(
      (item) =>
        (item.startOfApplicableDays <= lesson.startOfApplicableDays &&
          item.endOfApplicableDays >= lesson.startOfApplicableDays) ||
        (item.startOfApplicableDays <= lesson.endOfApplicableDays &&
          item.endOfApplicableDays >= lesson.endOfApplicableDays) ||
        (lesson.startOfApplicableDays <= item.startOfApplicableDays &&
          lesson.endOfApplicableDays >= item.endOfApplicableDays),
    );
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
