import * as moment from 'moment';

const PROPERTY_VALUATIONS_COLUMNS = [
  {
    name: 'valuationId',
    label: 'Valuation ID',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'propertyId',
    label: 'Pid',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'valuationDate',
    label: 'Date',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => moment(value).format('MM/DD/YYYY hh:mm a'),
  },
  {
    name: 'valuationType',
    label: 'Valuation Type',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'value',
    label: 'Value',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => `$${value}`,
  },
  {
    name: 'requestingGroup',
    label: 'Requesting Group',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'vendorName',
    label: 'Vendor Name',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'intOrExtFlag',
    label: 'Int or Ext Flag',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
];

const PROPERTY_PRIMARY_USE = 'CollateralPrimaryUse';
const COLLATERAL_DIALOG_MSG = 'Are you sure you want to discard the unsaved changes?';

export {
  PROPERTY_VALUATIONS_COLUMNS,
  PROPERTY_PRIMARY_USE,
  COLLATERAL_DIALOG_MSG,
};
