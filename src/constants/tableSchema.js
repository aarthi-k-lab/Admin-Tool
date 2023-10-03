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
  {
    name: 'createdBy',
    label: 'Completed By',
    align: 'left',
    options: {
      filter: false,
      sort: false,
    },
    toolTip: {
      title: 'Completed By',
      size: 'small',
      color: 'action',
    },
  },
];

const DELAY_CHKLST_HISTORY_COLUMNS = [
  {
    name: 'completedDate',
    label: 'Completion Date',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Completion Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'completedByUserName',
    label: 'Completed By',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Completed By',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'letterSentDate',
    label: 'Letter Sent',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Letter Sent',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'letterExpiryDate',
    label: 'Letter Excluded',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Letter Excluded',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'delayCheckListReason',
    label: 'Delay Reason',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Delay Reason',
        size: 'small',
        color: 'action',
      },
    },
  },
];
export const TABLE_SCHEMA = {
  FICO: FICO_HISTORY_COLUMNS,
  DLY_CHK_LIST: DELAY_CHKLST_HISTORY_COLUMNS,
};

export const TABLE_DATA = {
  DLY_CHK_LIST: 'delayChecklistHistory',
};

export const FICO_TASK_BLUEPRINT_CODE = 'FICO_BORR_LIST';
export const FICO_SCORE = 'FICO_SCORE';
