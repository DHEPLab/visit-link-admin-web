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
