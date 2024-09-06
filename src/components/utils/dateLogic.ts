import dayjs from "dayjs";

export const disabledDateForEDC = (date: dayjs.Dayjs, baseline: dayjs.Dayjs) => {
  if (!date) return false;
  const start = dayjs(baseline).format("YYYY-MM-DD");
  // days of edc is 280
  const end = dayjs(baseline).add(280, "day").format("YYYY-MM-DD");
  return !dayjs(dayjs(date).format("YYYY-MM-DD")).isBetween(start, end, undefined, "(]");
};
