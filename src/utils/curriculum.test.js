import Curriculum from './curriculum';

it('should filter lesson by stage, start months, end months', () => {
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

it('should validate lesson number to keep unique', () => {
  const lessons = [
    {
      id: 1,
      number: 'L1',
    },
  ];
  expect(Curriculum.validateLessonNumber(lessons, { number: 'L1' })).toBeFalsy();
  expect(Curriculum.validateLessonNumber(lessons, { number: 'L2' })).toBeTruthy();
  expect(Curriculum.validateLessonNumber(lessons, { number: 'L1', id: 1 })).toBeTruthy();
});

it('should validate lesson date range cannot overlap', () => {
  const lessons = [
    {
      id: 1,
      startOfApplicableDays: 10,
      endOfApplicableDays: 20,
      stage: 'EDC',
    },
  ];
  expect(
    Curriculum.validateLessonDateRange(lessons, {
      stage: 'EDC',
      startOfApplicableDays: 20,
      endOfApplicableDays: 30,
    })
  ).toBeFalsy();
  expect(
    Curriculum.validateLessonDateRange(lessons, {
      stage: 'EDC',
      startOfApplicableDays: 1,
      endOfApplicableDays: 10,
    })
  ).toBeFalsy();
  expect(
    Curriculum.validateLessonDateRange(lessons, {
      stage: 'BIRTH',
      startOfApplicableDays: 1,
      endOfApplicableDays: 10,
    })
  ).toBeTruthy();
  expect(
    Curriculum.validateLessonDateRange(lessons, {
      id: 1,
      stage: 'EDC',
      startOfApplicableDays: 1,
      endOfApplicableDays: 10,
    })
  ).toBeTruthy();
  expect(
    Curriculum.validateLessonDateRange(lessons, {
      stage: 'EDC',
      startOfApplicableDays: 21,
      endOfApplicableDays: 30,
    })
  ).toBeTruthy();
});
