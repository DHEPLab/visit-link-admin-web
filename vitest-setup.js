import "@testing-library/jest-dom/vitest";
import i18n from "./src/i18n";
import "./src/dayjsInit";

global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

global.i18n = i18n;
i18n.changeLanguage("en");

vi.mock("zustand");
