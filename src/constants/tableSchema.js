const moment = require('moment');

const FICO_HISTORY_COLUMNS = [
  {
    name: 'fico',
    label: 'FICO Score',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Fico Score',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'lockedDate',
    label: 'Date Locked',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Date Locked',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => moment(value).format('MM/DD/YYYY'),
  },
];
export const TABLE_SCHEMA = { FICO: FICO_HISTORY_COLUMNS };

export const FICO_TASK_BLUEPRINT_CODE = 'FICO_BORR_LIST';
export const FICO_SCORE = 'FICO_SCORE';
