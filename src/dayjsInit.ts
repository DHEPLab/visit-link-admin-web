import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import i18n from "./i18n";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale(i18n.language);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
