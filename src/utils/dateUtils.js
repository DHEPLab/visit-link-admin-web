import dayjs from "dayjs";

function meridiem(momentInstance) {
  let hour = momentInstance.hour();
  const minute = momentInstance.minute();
  hour += minute / 60;
  if (hour <= 9) {
    return "早上";
  } else if (hour <= 11.5) {
    return "上午";
  } else if (hour <= 13.5) {
    return "中午";
  } else if (hour <= 18) {
    return "下午";
  } else {
    return "晚上";
  }
}

function formatTimeCN(time) {
  return meridiem(dayjs(time)) + dayjs(time).format("h:mm");
}

function formatDateTimeCN(datetime) {
  return dayjs(datetime).format("YYYY年MM月DD日/") + formatTimeCN(datetime);
}

export default {
  formatDateTimeCN,
};
