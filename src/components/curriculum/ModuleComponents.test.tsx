import { render } from "@testing-library/react";
import { Formik } from "formik";

import CurriculumFactory from "./curriculumFactory";
import ModuleComponents from "./ModuleComponents";

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
});
