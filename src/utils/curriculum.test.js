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
  expect(Curriculum.validateLessonNumber(lessons, 'L1')).toBeFalsy();
  expect(Curriculum.validateLessonNumber(lessons, 'L2')).toBeTruthy();
  expect(Curriculum.validateLessonNumber(lessons, 'L1', 'L1')).toBeTruthy();
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
      stage: 'EDC',
      startOfApplicableDays: 1,
      endOfApplicableDays: 30,
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

it('should clean invalid lessons from schedule', () => {
  const schedules = [
    {
      stage: 'EDC',
      startOfApplicableMonths: 2,
      endOfApplicableMonths: 3,
      lessons: [
        {
          label: 'L1',
        },
      ],
    },
  ];
  const cleaned = [
    {
      stage: 'EDC',
      startOfApplicableMonths: 2,
      endOfApplicableMonths: 3,
      lessons: [],
    },
  ];
  expect(
    Curriculum.cleanInvalidLessons(schedules, [
      {
        number: 'L1',
        stage: 'EDC',
        startOfApplicableDays: 9,
        endOfApplicableDays: 100,
      },
    ])
  ).toStrictEqual(cleaned);
  expect(
    Curriculum.cleanInvalidLessons(schedules, [
      {
        number: 'L1',
        stage: 'EDC',
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ])
  ).toStrictEqual(schedules);
  expect(
    Curriculum.cleanInvalidLessons(schedules, [
      {
        number: 'L2',
        stage: 'EDC',
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ])
  ).toStrictEqual(cleaned);
  expect(
    Curriculum.cleanInvalidLessons(schedules, [
      {
        number: 'L1',
        stage: 'BIRTH',
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ])
  ).toStrictEqual(cleaned);
});
