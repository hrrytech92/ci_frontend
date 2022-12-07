import moment from 'moment';
import 'moment-timezone';

export const formatDateTime = dateTime => {
  if (!dateTime) {
    return '';
  }

  return moment(dateTime)
    .tz('America/New_York')
    .format('MM-DD-YYYY hh:mm a z');
};

export const formatDate = date => {
  return moment(date)
    .tz('America/New_York')
    .format('MM-DD-YYYY');
};

export const formatCells = (key, value) => {
  const dates: any = ['subscribe_date', 'double_opt'];
  const dateTimes: any = ['updated_on', 'created_on', 'scheduled_on', 'sent_on', 'timestamp'];
  if (dates.includes(key) && value) {
    return formatDate(value);
  } else if (dateTimes.includes(key) && value) {
    return formatDateTime(value);
  } else {
    return value;
  }
};
