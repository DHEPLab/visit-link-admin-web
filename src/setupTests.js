// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import i18n from './i18n'

/**
 * fix: `matchMedia` not present, legacy browsers require a polyfill
 */
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { },
    };
  };

global.i18n = i18n
i18n.changeLanguage("zh")
