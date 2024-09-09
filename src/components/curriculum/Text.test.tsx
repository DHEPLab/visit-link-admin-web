import { vi } from "vitest";
import { render } from "@testing-library/react";

import Text from "./Text";

test("should render Text value", () => {
  const { getByText } = render(
    <Text name="component.0.value" value={{ html: "Hello World", type: "script" }} onChange={() => vi.fn()} />,
  );
  expect(getByText("Hello World")).toBeInTheDocument();
});

test("should render readonly Text", () => {
  const { queryByText } = render(
    <Text
      name="component.0.value"
      readonly
      value={{ html: "Hello World", type: "instruction" }}
      onChange={() => vi.fn()}
    />,
  );

  const qlContainer = queryByText("Hello World")?.closest("div.ql-container");

  expect(qlContainer).toHaveClass("ql-disabled");
  expect(queryByText("Instruction")).toBeInTheDocument();
  expect(queryByText("Script")).not.toBeInTheDocument();
});
