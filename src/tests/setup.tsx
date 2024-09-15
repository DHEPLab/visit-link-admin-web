import i18n from "@/i18n";
import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

export default function testSetup(component: React.ReactNode, initialEntries = ["/"]) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    </I18nextProvider>,
  );
}
