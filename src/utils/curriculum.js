function filterLessons(lessons, stage, startDays, endDays) {
  if (!stage || startDays == null || startDays === "" || endDays == null || endDays === "") return [];
  return lessons.filter((lesson) => {
    return lesson.stage === stage && lesson.startOfApplicableDays >= startDays && lesson.endOfApplicableDays <= endDays;
  });
}

function validateLessonNumber(lessons, number, exclude) {
  return !lessons.filter((item) => item.number !== exclude).find((item) => item.number === number);
}

function validateLessonDateRange(lessons, lesson) {
  return !lessons
    .filter((item) => {
      const isAdd = (item.id === undefined && lesson.id === undefined)
      return (item.id !== lesson.id || isAdd) && item.stage === lesson.stage;
    })
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
      filterLessons(lessons, schedule.stage, schedule.startOfApplicableDays, schedule.endOfApplicableDays).find(
        (lesson) => domain.label === lesson.number
      )
    ),
  }));
}

export default {
  filterLessons,
  validateLessonNumber,
  validateLessonDateRange,
  cleanInvalidLessons,
};
