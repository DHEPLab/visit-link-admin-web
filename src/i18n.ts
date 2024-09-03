import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation";
import zhTranslation from "./locales/zh/translation";
import LngDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: enTranslation,
  zh: zhTranslation,
};

await i18n
  .use(initReactI18next)
  .use(LngDetector)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: "en",
    detection: {
      order: ["navigator", "htmlTag"],
    },
  });

export default i18n;
