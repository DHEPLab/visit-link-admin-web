const dayOfMonth = 30;
export function filterLessons(lessons, stage, startMonth, endMonth) {
  if (!stage || startMonth == null || startMonth === '' || endMonth == null || endMonth === '')
    return [];
  if (!lessons || lessons.length === 0) return [];
  return lessons.filter((lesson) => {
    return (
      lesson.stage === stage &&
      lesson.startOfApplicableDays >= startMonth * dayOfMonth &&
      lesson.endOfApplicableDays <= endMonth * dayOfMonth
    );
  });
}
export function validateLessonNumberUnique(lessons, number, id) {
  if (!lessons || lessons.length === 0) return true;
  return !lessons.find((lesson) => lesson.number === number && lesson.id !== id);
}
