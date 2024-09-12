import { ModuleComponentType } from "@/models/res/Moduel";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import CurriculumFactory from "./curriculumFactory";
import ModuleComponents from "./ModuleComponents";

const user = userEvent.setup();

describe("<ModuleComponents />", () => {
  it("should render", () => {
    const components = [CurriculumFactory.createText()];
    const { queryByTestId } = render(
      <Formik initialValues={{ components }} onSubmit={vi.fn()}>
        {({ values }) => <ModuleComponents value={values.components} readonly={true} />}
      </Formik>,
    );

    expect(queryByTestId("components.0.value_text_component")).toBeInTheDocument();
    expect(queryByTestId("module-components-toolbar")).not.toBeInTheDocument();
  });

  it("should submit the correct value when user switch the component order", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const components: ModuleComponentType[] = [CurriculumFactory.createText()];
    vi.advanceTimersByTime(10);
    components.push(CurriculumFactory.createSwitch());
    vi.advanceTimersByTime(10);
    components.push(CurriculumFactory.createPageFooter());
    const onSubmitFn = vi.fn();

    const { container, findAllByTestId, findByTestId } = render(
      <Formik initialValues={{ components }} onSubmit={onSubmitFn}>
        {({ values, handleSubmit }) => {
          return (
            <>
              <ModuleComponents value={values.components} readonly={false} />
              <button data-testid="submit-button" type="submit" onClick={() => handleSubmit()}>
                Submit
              </button>
            </>
          );
        }}
      </Formik>,
    );
    const moveUpButtons = await findAllByTestId("component-move-up");
    await user.click(moveUpButtons[moveUpButtons.length - 1]);

    const quills = container.querySelectorAll(".ql-editor");
    await user.type(quills[quills.length - 1], "Hello, World!");
    await act(() => vi.advanceTimersByTime(1001)); // Text onChange debounce 1s
    await user.click(await findByTestId("submit-button"));

    const fnCall = onSubmitFn.mock.calls[0];
    const lastSwitchOptionText = fnCall[0].components[2].value.cases[0].components[0].value.html;
    expect(lastSwitchOptionText).toEqual("<p><br></p><p>Hello, World!</p>");
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
});
