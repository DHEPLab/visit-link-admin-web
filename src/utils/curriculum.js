const dayOfMonth = 30;
const dayOfFirstMonthForStageEDC = 10;

function offset(stage) {
  if (stage !== 'EDC') return 0;
  return dayOfMonth - dayOfFirstMonthForStageEDC;
}

function filterLessons(lessons, stage, startMonth, endMonth) {
  if (!stage || startMonth == null || startMonth === '' || endMonth == null || endMonth === '')
    return [];
  if (!lessons || lessons.length === 0) return [];
  return lessons.filter((lesson) => {
    return (
      lesson.stage === stage &&
      lesson.startOfApplicableDays > (startMonth - 1) * dayOfMonth - offset(stage) &&
      lesson.endOfApplicableDays <= endMonth * dayOfMonth - offset(stage)
    );
  });
}

function validateLessonNumberUnique(lessons, number, id) {
  if (!lessons || lessons.length === 0) return true;
  return !lessons.find((lesson) => lesson.number === number && lesson.id !== id);
}

export default {
  filterLessons,
  validateLessonNumberUnique,
};
