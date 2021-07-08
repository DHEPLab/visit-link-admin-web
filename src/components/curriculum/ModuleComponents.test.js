import React from "react";
import { render } from "@testing-library/react";
import { Formik } from "formik";

import factory from "./factory";
import ModuleComponents, { handleMoveUp, handleMoveDown, handleRemove } from "./ModuleComponents";

describe("<ModuleComponents />", () => {
  it("should render", () => {
    const components = [factory.createText()];
    render(
      <Formik initialValues={{ components }}>{({ values }) => <ModuleComponents value={values.components} readonly={true} />}</Formik>
    );
  });
});

describe("Component Helpers", () => {
  let helpers, setFocus;
  beforeEach(() => {
    helpers = { move: jest.fn(), remove: jest.fn() };
    setFocus = jest.fn();
  });

  it("should component move up", () => {
    handleMoveUp(helpers, 1, -1, setFocus);
    expect(helpers.move).toBeCalledWith(1, 0);
    handleMoveUp(helpers, 1, 1, setFocus);
    expect(helpers.move).toBeCalledWith(1, 0);
    expect(setFocus).toBeCalledWith(0);
  });

  it("should component move down", () => {
    handleMoveDown(helpers, 1, -1, setFocus, 3);
    expect(helpers.move).toBeCalledWith(1, 2);
    handleMoveDown(helpers, 1, 1, setFocus, 3);
    expect(helpers.move).toBeCalledWith(1, 2);
    expect(setFocus).toBeCalledWith(2);
  });

  it("should do nothing", () => {
    handleMoveUp(helpers, 0);
    handleMoveDown(helpers, 0, null, null, 1);
    expect(helpers.move).toBeCalledTimes(0);
  });

  it("should remove component", () => {
    handleRemove(helpers, 1, 1, setFocus);
    expect(helpers.remove).toBeCalledWith(1);
    expect(setFocus).toBeCalledWith(-1);

    handleRemove(helpers, 2, 4, setFocus);
    expect(setFocus).toBeCalledWith(3);
  });
});
