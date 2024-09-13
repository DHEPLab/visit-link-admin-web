import { vi } from "vitest";
import { render } from "@testing-library/react";

import Media from "./Media";

it("should render readonly Media", () => {
  const { queryByText, queryByTestId } = render(
    <Media
      name="component.0.value"
      value={{ type: "IMAGE", file: "/api/filename.jpg", text: "" }}
      onChange={() => vi.fn()}
      onBlur={() => vi.fn()}
      readonly
    />,
  );

  expect(queryByText("Remove")).not.toBeInTheDocument();
  expect(queryByText("Click to Upload Picture")).not.toBeInTheDocument();
  expect(queryByTestId("move")).not.toBeInTheDocument();
});

it("should render Media with exist file", () => {
  const { queryByText } = render(
    <Media
      name="component.0.value"
      value={{ type: "IMAGE", file: "/api/filename.jpg", text: "" }}
      onChange={() => vi.fn()}
      onBlur={() => vi.fn()}
    />,
  );

  expect(queryByText("Remove")).toBeInTheDocument();
  expect(queryByText("Click to Upload Picture")).not.toBeInTheDocument();
});

it("should render Media without file", () => {
  const { queryByText } = render(
    <Media
      name="component.0.value"
      value={{ type: "IMAGE", file: "", text: "" }}
      onChange={() => vi.fn()}
      onBlur={() => vi.fn()}
    />,
  );

  expect(queryByText("Click to Upload Picture")).toBeInTheDocument();
});
