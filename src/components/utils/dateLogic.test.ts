import { disabledDateForEDC } from "./dateLogic";
import dayjs from "dayjs";

it("should disable invalid edc date", () => {
  const baseline = new Date(2020, 1, 4);
  expect(disabledDateForEDC(dayjs(new Date(2020, 1, 5)), dayjs(baseline))).toBeFalsy();
  expect(disabledDateForEDC(dayjs(new Date(2020, 1, 3)), dayjs(baseline))).toBeTruthy();
  expect(disabledDateForEDC(dayjs(new Date(2020, 10, 10)), dayjs(baseline))).toBeFalsy();
  expect(disabledDateForEDC(dayjs(new Date(2020, 10, 11)), dayjs(baseline))).toBeTruthy();
});
