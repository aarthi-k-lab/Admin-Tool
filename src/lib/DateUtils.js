/* eslint-disable linebreak-style */
import * as R from 'ramda';

const getDate = (d) => {
  if (d) {
    const inputDate = new Date(d);
    return inputDate.getDate();
  }
  return null;
};

const getMonth = (d) => {
  if (d) {
    const inputDate = new Date(d);
    return inputDate.getMonth() + 1;
  }
  return null;
};

const getYear = (d) => {
  if (d) {
    const inputDate = new Date(d);
    return inputDate.getFullYear();
  }
  return null;
};

const isToday = (d) => {
  if (d) {
    const inputDate = `${getDate(d)}/${getMonth(d)}/${getYear(d)}`;
    const today = new Date();
    const tdate = today.getDate();
    const tmonth = today.getMonth() + 1;
    const tyear = today.getFullYear();
    const todayDate = `${tdate}/${tmonth}/${tyear}`;
    return inputDate === todayDate;
  }
  return null;
};

const DateFormatter = (date) => {
  if (R.isNil(date)) { return ''; }
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  return (`${month}/${day}/${year}`);
};

export {
  getDate,
  getMonth,
  getYear,
  isToday,
  DateFormatter,
};
