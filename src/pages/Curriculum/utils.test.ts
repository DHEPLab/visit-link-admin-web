import { filterLessons, validateLessonNumber, cleanInvalidLessons } from "./utils";
import { LessonFormValue } from "./schema/Lesson";
import { ScheduleFormValue } from "./schema/Schedule";

it("should filter lesson by stage, start months, end months", () => {
  const lessons = [
    {
      stage: "UNBORN",
      startOfApplicableDays: 1,
      endOfApplicableDays: 20,
    },
    {
      stage: "BORN",
      startOfApplicableDays: 1,
      endOfApplicableDays: 30,
    },
  ] as LessonFormValue[];
  expect(filterLessons(lessons, "UNBORN", 1, 10).length).toBe(0);
  expect(filterLessons(lessons, "UNBORN", 1, 40).length).toBe(1);
  expect(filterLessons(lessons, "BORN", 1, 30).length).toBe(1);
});

it("should validate lesson number to keep unique", () => {
  const lessons = [
    {
      id: 1,
      number: "L1",
    },
  ] as LessonFormValue[];
  expect(validateLessonNumber(lessons, "L1", null)).toBeFalsy();
  expect(validateLessonNumber(lessons, "L2", null)).toBeTruthy();
  expect(validateLessonNumber(lessons, "L1", "L1")).toBeTruthy();
});

it("should clean invalid lessons from schedule", () => {
  const schedules = [
    {
      stage: "UNBORN",
      startOfApplicableDays: 11,
      endOfApplicableDays: 90,
      lessons: [
        {
          label: "L1",
        },
      ],
    },
  ] as ScheduleFormValue[];
  const cleaned = [
    {
      stage: "UNBORN",
      startOfApplicableDays: 11,
      endOfApplicableDays: 90,
      lessons: [],
    },
  ];
  expect(
    cleanInvalidLessons(schedules, [
      {
        number: "L1",
        stage: "UNBORN",
        startOfApplicableDays: 9,
        endOfApplicableDays: 100,
      },
    ] as LessonFormValue[]),
  ).toStrictEqual(cleaned);
  expect(
    cleanInvalidLessons(schedules, [
      {
        number: "L1",
        stage: "UNBORN",
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ] as LessonFormValue[]),
  ).toStrictEqual(schedules);
  expect(
    cleanInvalidLessons(schedules, [
      {
        number: "L2",
        stage: "UNBORN",
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ] as LessonFormValue[]),
  ).toStrictEqual(cleaned);
  expect(
    cleanInvalidLessons(schedules, [
      {
        number: "L1",
        stage: "BORN",
        startOfApplicableDays: 21,
        endOfApplicableDays: 30,
      },
    ] as LessonFormValue[]),
  ).toStrictEqual(cleaned);
});
