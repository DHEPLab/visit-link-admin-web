import React from "react";
import { vi } from "vitest";
import { render } from "@testing-library/react";

import Media from "./Media";

it("should render readonly Media", () => {
  const { queryByText, queryByTestId } = render(
    <Media name="component.0.value" value={{ file: "Hello World" }} onChange={() => vi.fn()} readonly />,
  );
  expect(queryByText(/移除/)).not.toBeInTheDocument();
  expect(queryByText(/点击上传图片/)).not.toBeInTheDocument();
  expect(queryByTestId("move")).not.toBeInTheDocument();
});
