import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export default function testSetup(component) {
  return {
    ...render(<MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>),
    history,
  };
}
