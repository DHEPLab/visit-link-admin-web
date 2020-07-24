const dayOfMonth = 30;
const dayOfFirstMonth = 10;
const offset = dayOfMonth - dayOfFirstMonth;

export function filterLessons(lessons, stage, startMonth, endMonth) {
  if (!stage || startMonth == null || startMonth === '' || endMonth == null || endMonth === '')
    return [];
  if (!lessons || lessons.length === 0) return [];
  return lessons.filter((lesson) => {
    return (
      lesson.stage === stage &&
      lesson.startOfApplicableDays > (startMonth - 1) * dayOfMonth - offset &&
      lesson.endOfApplicableDays <= endMonth * dayOfMonth - offset
    );
  });
}

export function validateLessonNumberUnique(lessons, number, id) {
  if (!lessons || lessons.length === 0) return true;
  return !lessons.find((lesson) => lesson.number === number && lesson.id !== id);
}
