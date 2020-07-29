import Curriculum from './curriculum';

test('should filter lesson by stage, startMonths, endMonths', () => {
  const lessons = [
    {
      stage: 'EDC',
      startOfApplicableDays: 1,
      endOfApplicableDays: 20,
    },
    {
      stage: 'BIRTH',
      startOfApplicableDays: 1,
      endOfApplicableDays: 30,
    },
  ];
  expect(Curriculum.filterLessons(lessons, 'EDC', 1, 1).length).toBe(0);
  expect(Curriculum.filterLessons(lessons, 'EDC', 1, 2).length).toBe(1);
  expect(Curriculum.filterLessons(lessons, 'BIRTH', 1, 1).length).toBe(1);
});

test('should keep lesson number unique', () => {
  const lessons = [
    {
      id: 1,
      number: 'L1',
    },
  ];
  expect(Curriculum.validateLessonNumberUnique(lessons, 'L1')).toBeFalsy();
  expect(Curriculum.validateLessonNumberUnique(lessons, 'L2')).toBeTruthy();
});

test('should pass validation when editing lesson', () => {
  const lessons = [
    {
      id: 1,
      number: 'L1',
    },
  ];
  expect(Curriculum.validateLessonNumberUnique(lessons, 'L1', 1)).toBeTruthy();
});
