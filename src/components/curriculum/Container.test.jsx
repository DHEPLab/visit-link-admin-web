import React from "react";
import { render } from "@testing-library/react";

import Container from "./Container";

test("should render readonly Container", () => {
  const { queryByText, queryByTestId } = render(<Container icon="icontext" readonly />);
  expect(queryByText(/移除/)).not.toBeInTheDocument();
  expect(queryByTestId("move")).not.toBeInTheDocument();
});
