import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale('zh-cn');
dayjs.extend(isBetween);

