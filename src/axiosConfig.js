import Axios from "axios";
import i18n from "./i18n";

// Add a request interceptor
Axios.interceptors.request.use(
  (config) => {
    // Get the current language from i18next
    const currentLang = i18n.resolvedLanguage;

    // Add the lang parameter to all requests

    config.headers["Accept-Language"] = currentLang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default Axios;
