import { filterLessons, validateLessonNumberUnique } from './curriculum';

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
  expect(filterLessons(lessons, 'EDC', 1, 1).length).toBe(0);
  expect(filterLessons(lessons, 'EDC', 1, 2).length).toBe(1);
  expect(filterLessons(lessons, 'BIRTH', 1, 1).length).toBe(1);
});

test('should keep lesson number unique', () => {
  const lessons = [
    {
      id: 1,
      number: 'L1',
    },
  ];
  expect(validateLessonNumberUnique(lessons, 'L1')).toBeFalsy();
  expect(validateLessonNumberUnique(lessons, 'L2')).toBeTruthy();
});

test('should pass validation when editing lesson', () => {
  const lessons = [
    {
      id: 1,
      number: 'L1',
    },
  ];
  expect(validateLessonNumberUnique(lessons, 'L1', 1)).toBeTruthy();
});
