const dayOfMonth = 30;
const dayOfFirstMonthForStageEDC = 10;

function offset(stage) {
  if (stage !== 'EDC') return 0;
  return dayOfMonth - dayOfFirstMonthForStageEDC;
}

function filterLessons(lessons, stage, startMonth, endMonth) {
  if (!stage || startMonth == null || startMonth === '' || endMonth == null || endMonth === '')
    return [];
  return lessons.filter((lesson) => {
    return (
      lesson.stage === stage &&
      lesson.startOfApplicableDays > (startMonth - 1) * dayOfMonth - offset(stage) &&
      lesson.endOfApplicableDays <= endMonth * dayOfMonth - offset(stage)
    );
  });
}

function validateLessonNumber(lessons, { number, id }) {
  return !lessons.filter((item) => item.id !== id).find((item) => item.number === number);
}

function validateLessonDateRange(lessons, lesson) {
  return !lessons
    .filter((item) => item.id !== lesson.id && item.stage === lesson.stage)
    .find(
      (item) =>
        (item.startOfApplicableDays <= lesson.startOfApplicableDays &&
          item.endOfApplicableDays >= lesson.startOfApplicableDays) ||
        (item.startOfApplicableDays <= lesson.endOfApplicableDays &&
          item.endOfApplicableDays >= lesson.endOfApplicableDays) ||
        (lesson.startOfApplicableDays <= item.startOfApplicableDays &&
          lesson.endOfApplicableDays >= item.endOfApplicableDays)
    );
}

function cleanInvalidLessons(schedules, lessons) {
  return schedules.map((schedule) => ({
    ...schedule,
    lessons: schedule.lessons.filter((domain) =>
      filterLessons(
        lessons,
        schedule.stage,
        schedule.startOfApplicableMonths,
        schedule.endOfApplicableMonths
      ).find((lesson) => domain.label === lesson.number)
    ),
  }));
}

export default {
  filterLessons,
  validateLessonNumber,
  validateLessonDateRange,
  cleanInvalidLessons,
};
