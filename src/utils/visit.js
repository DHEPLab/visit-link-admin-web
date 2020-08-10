import moment from 'moment';

function defaultDatetime(range, visitTime) {
  if (!visitTime) visitTime = moment();

  if (
    // unlimit range
    !range ||
    !range[0] ||
    // unlimit range end
    (!range[1] && moment(range[0]).isBefore(formatDate(visitTime))) ||
    // limit range
    (moment(range[0]).isBefore(formatDate(visitTime)) &&
      moment(range[1]).isAfter(formatDate(visitTime)))
  ) {
    return visitTime;
  }

  // return range start with default time 10:00 AM
  return range[0] + 'T10:00';
}

function meridiem(momentInstance) {
  const hour = momentInstance.hour();
  const minute = momentInstance.minute();
  if (hour < 9) {
    return '早上';
  } else if (hour < 11 && minute < 30) {
    return '上午';
  } else if (hour < 13 && minute < 30) {
    return '中午';
  } else if (hour < 18) {
    return '下午';
  } else {
    return '晚上';
  }
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function formatDateCN(date) {
  return moment(date).format('YYYY年MM月DD日');
}

function formatTimeCN(time) {
  return meridiem(moment(time)) + moment(time).format('h:mm');
}

function formatDateTime(datetime) {
  return moment(datetime).format('YYYY-MM-DDTHH:mm');
}

function formatDateTimeCN(datetime) {
  return moment(datetime).format('YYYY年MM月DD日/') + formatTimeCN(datetime);
}

function mergeDateAndTime(date, time) {
  return `${formatDate(date)}T${moment(time).format('HH:mm')}`;
}

export default {
  canBegin(status, visitTime) {
    if (status !== 'NOT_STARTED') return false;
    return moment(formatDate(moment())).isSame(formatDate(moment(visitTime)));
  },
  formatDate,
  formatDateTime,
  formatTimeCN,
  formatDateTimeCN,
  formatDateCN,
  mergeDateAndTime,
  defaultDatetime,
};
