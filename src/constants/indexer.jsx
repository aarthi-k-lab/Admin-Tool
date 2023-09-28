import * as moment from 'moment';

export const DISPOSITION_OPTIONS = [{ value: 'MRSD', disabled: false, label: 'Mod Related Supporting Docs Uploaded/Linked' },
  { value: 'DRIA', disabled: false, label: 'Mod Related Supporting Docs Received/Not Linked Due to Eval in Missing Docs Status for AQ - FHA 60+' },
];

export const SOI_OPTIONS = [{ value: 'PTTL', disabled: false, label: 'Received Complete' },
  { value: 'DILK', disabled: false, label: 'Received Incomplete' },
  { value: '2', disabled: false, label: 'No' }];

export const MMO_OPTIONS = [{ value: 'Yes', disabled: false, label: 'Yes' },
  { value: 'No', disabled: false, label: 'No' }];

export const MMO_SELECTIONS = [{ value: 'MAMR', disabled: false, label: 'MA Modification Requested' },
  { value: 'MAAF', disabled: false, label: 'MA Foreclosure Alternative Requested' },
  { value: 'MANR', disabled: false, label: 'MA No Modification Requested' },
  { value: 'MAWP', disabled: false, label: 'MA Waived Right to Cure, Proceed to Foreclosure' }];

export const INDEXER_TABLE_COLUMNS = [
  {
    name: 'loanId',
    label: 'Loan Number',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'evalId',
    label: 'Eval ID',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'createDate',
    label: 'Eval Created Date',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'subStatus',
    label: 'Sub-Status',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'assignedTo',
    label: 'Assigned To',
    align: 'left',
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
];
