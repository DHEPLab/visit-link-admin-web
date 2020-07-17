import { filterLessons } from './index';

test('should filter lesson by stage, startMonths, endMonths', () => {
  const lessons = [
    {
      stage: 'EDC',
      startOfApplicableDays: 1,
      endOfApplicableDays: 10,
    },
  ];
  expect(filterLessons(lessons, 'EDC', 0, 1).length).toBe(1);
  expect(filterLessons(lessons, 'BIRTH', 0, 1).length).toBe(0);
  expect(filterLessons(lessons, 'EDC', 1, 1).length).toBe(0);
});
