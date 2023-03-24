/* eslint-disable linebreak-style */
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

export {
  getDate,
  getMonth,
  getYear,
  isToday,
};
