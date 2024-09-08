import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export default function testSetup(component: React.ReactNode, initialEntries = ["/"]) {
  return {
    ...render(<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>),
    history,
  };
}
