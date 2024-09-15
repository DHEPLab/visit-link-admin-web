import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import testSetup from "@/tests/setup";
import userEvent from "@testing-library/user-event";
import { Button, Form } from "antd";
import ApplicableDays from "./ApplicableDays";

const lessons = [
  {
    id: 1,
    stage: "EDC",
    startOfApplicableDays: 10,
    endOfApplicableDays: 20,
  },
  {
    id: 2,
    stage: "EDC",
    startOfApplicableDays: 21,
    endOfApplicableDays: 40,
  },
] as LessonFormValue[];

const user = userEvent.setup();

const setup = () => {
  return testSetup(
    <Form initialValues={{ stage: "EDC" }}>
      <ApplicableDays value={lessons} currentEditValue={{} as LessonFormValue} />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>,
  );
};

describe("ApplicableDays component", () => {
  it("should display required error message when field value is empty", async () => {
    const { getByRole, getByText } = setup();
    await user.click(getByRole("button", { name: "Submit" }));

    expect(getByText("Start Date is required!")).toBeInTheDocument();
    expect(getByText("End Date is required!")).toBeInTheDocument();
  });

  it.each([
    ["15", "35"],
    ["10", "15"],
    ["21", "30"],
    ["40", "50"],
  ])("should display error message when start %s days and end %s days", async (start, end) => {
    const { getByRole, getAllByText } = setup();

    await user.type(getByRole("spinbutton", { name: "Start Applicable Days" }), start);
    await user.type(getByRole("spinbutton", { name: "End Applicable Days" }), end);

    await user.click(getByRole("button", { name: "Submit" }));

    const [errorElement] = getAllByText("Applicable days cannot overlap");
    expect(errorElement).toBeInTheDocument();
  });

  it.each([
    ["1", "9"],
    ["41", "50"],
  ])("should not display error message when start %s days and end %s days", async (start, end) => {
    const { getByRole, queryByText } = setup();

    await user.type(getByRole("spinbutton", { name: "Start Applicable Days" }), start);
    await user.type(getByRole("spinbutton", { name: "End Applicable Days" }), end);

    await user.click(getByRole("button", { name: "Submit" }));

    expect(queryByText("Applicable days cannot overlap")).not.toBeInTheDocument();
  });

  it.each([
    ["10", "10"],
    ["10", "9"],
  ])(
    "should display end day greater then start day error message when use input start: %s, end: %s",
    async (start, end) => {
      const { getByRole, queryByText } = setup();

      await user.type(getByRole("spinbutton", { name: "Start Applicable Days" }), start);
      await user.type(getByRole("spinbutton", { name: "End Applicable Days" }), end);

      await user.click(getByRole("button", { name: "Submit" }));

      expect(queryByText("The end day must be greater than the start day.")).toBeInTheDocument();
    },
  );
});
