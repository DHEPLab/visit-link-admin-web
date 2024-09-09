import { render } from "@testing-library/react";

import PageFooter from "./PageFooter";

it("should render readonly PagerFooter", () => {
  const { queryByText, queryByTestId } = render(<PageFooter readonly />);
  expect(queryByText("Remove")).not.toBeInTheDocument();
  expect(queryByTestId("move")).not.toBeInTheDocument();
});
