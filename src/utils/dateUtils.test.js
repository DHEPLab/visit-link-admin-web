import dateUtils from "./dateUtils";
import { mockDate, unmockDate } from "proxy-date";

describe("Date Utils", () => {
  beforeAll(() => {
    mockDate("2020-07-07");
  });

  afterAll(() => {
    unmockDate();
  });

  it("should format visit time cn", () => {
    expect(dateUtils.formatDateTimeCN("2020-07-12T11:11:00")).toBe("2020年07月12日/上午11:11");
  });
});
