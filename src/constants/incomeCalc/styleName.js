const R = require('ramda');

const textFields = {
  'inc-text': {
    value: 'weekly-text',
  },
  'ri-total-text': {
    title: 'ri-total-text',
    value: '',
  },
  'se-total-text': {
    value: 'se-total-value',
    title: 'se-total',
  },
  'pitia-amt': {
    title: 'pitia-amt-title',
    div: 'display-in-row',
    inputProps: { style: { width: '17rem' } },
  },
  'fico-scr': {
    title: 'fico-scr-title',
    div: 'display-in-row',
    inputProps: { style: { width: '17rem' } },
  },
  'pay-periods-text': {
    div: 'pay-periods-text',
    title: 'pay-periods-title',
    textField: 'pay-period-textField',
    inputProps: { style: { paddingTop: '8px', paddingBottom: '8px' } },
  },
  'mrla-text': {
    textField: 'ri-div-label',
    title: 'mrla-title',
    div: 'display-in-row',
  },
  'ri-label': {
    div: 'ri-div-label',
    title: 'ri-title',
    value: 'ri-label',
  },
  'weekly-amt': {
    div: 'weekly-amt',
    textField: 'weekly-text',
  },
  savings: {
    div: 'savings',
    textField: 'weekly-text',
  },
  'monthly-inc': {
    div: 'monthly-inc',
  },
  'se-nom': {
    div: 'se-nom-div',
    title: 'se-nom-title',
  },
  'se-pao': {
    div: 'se-nom-div',
    title: 'se-nom-title',
  },
  'se-amount': {
    div: 'se-amount-div',
    title: 'se-amount-title',
  },
  'cnsdt-net': {
    div: 'cnsdt-net',
    title: 'cnsdt-net-title',
    value: 'cnsdt-net-value',
  },
  'reason-for': {
    div: 'reason-for',
    value: 'reason-for-value',
    textField: 'reason-for-textbox',
  },
  commentBox: {
    div: 'commentBox',
    textField: 'reason-for-textbox',
  },
  'cnsdt-income-title': {
    div: 'cnsdt-income-div',
  },
  'pp-text': {
    value: 'pp-value',
  },
  'cnsdt-exp-sec-amt': {
    div: 'cnsdt-exp-amt-text',
    value: 'cnsdt-exp-amt-text',
    textField: 'cnsdt-exp-amt-text',
    inputProps: 'cnsdt-exp-amt-text',
  },
  'cnsdt-net-dti': {
    div: 'cnsdt-net-dti',
    title: 'cnsdt-net-dti-title',
    value: 'cnsdt-net-dti-value',
  },
  'cnsdt-net-exp': {
    div: 'cnsdt-net-exp',
    title: 'cnsdt-net-exp-title',
    value: 'cnsdt-net-exp-value',
  },
  'cnsdt-inc-count-indc': {
    div: 'cnsdt-inc-count-indc-div',
  },
  'contrib-text': {
    title: 'doc-add-contrib-title',
    div: 'display-in-row',
    textField: 'doc-text',
    inputProps: { style: { width: '30rem !important' } },
  },
  addr: {
    inputProps: { autoComplete: 'new-password' },
  },
  default: {

  },
};

const taskSection = {
  'fixed-income-net-value': {
    'grid-label': 'fixed-income-net-value',
  },
  'inc-calc-borr': {
    item: 'inc-calc-borr-item',
    header: 'radio-control-label',
  },
  'we-title': {
    item: 'we-title-delete',
    header: 'we-heading',
  },
  'ri-title': {
    item: 'ri-title-item',
  },
  'ri-title-heading': {
    item: 'ri-title-item',
    header: 'we-heading',
  },
  'se-title': {
    item: 'ri-title-item',
    header: 'we-heading',
  },
  'inc-calc-placeholder': {
    header: 'header-placeholder',
  },
  wageEarnings: {
    item: 'inc-calc-borr-item',
  },
  grossYtd: {
    item: 'sect-title-delete',
  },
  grossBase: {
    item: 'sect-title-delete',
  },
  'add-contrib': {
    grid: 'add-contrib-grid',
  },
  'av-sect': {
    grid: 'av-sect-grid',
  },
  'rental-address-wrapper': {
    grid: 'rental-address-wrapper',
    icon: 'rental-address-icon',
  },
  'self-address-wrapper': {
    grid: 'rental-address-wrapper',
    icon: 'rental-address-icon',
  },
  'add-contrib-sect': {
    header: 'add-contrib-header',
    item: 'add-contrib-item',
    icon: 'chevron-left',
  },
  'rental-income-sect': {
    icon: 'rental-income-sect-icon',
  },
  'self-income-sect': {
    icon: 'rental-income-sect-icon',
  },
  'rental-share': {
    grid: 'rental-share-grid',
    gridItem: 'rental-share-grid-item',
  },
  'self-share': {
    grid: 'rental-share-grid',
    gridItem: 'rental-share-grid-item',
  },
  'ri-share-sect-title': {
    header: 'ri-share-sect-header',
  },
  'se-share-sect-title': {
    header: 'ri-share-sect-header',
  },
  'cnsdt-accordian': {
    summary: 'cnsdt-accordian-summary',
    label: 'cnsdt-accordian-label',
    labelValue: 'cnsdt-accordian-labelValue',
    details: 'cnsdt-accordian-details',
  },
  'cnsdt-income-data-headers': {
    header: 'cnsdt-inc-data-header-div',
    space: 'cnsdt-inc-data-header-space',
  },
  'cnsdt-income-data-row': {
    inctype: 'cnsdt-income-data-row-inctype',
    amount: 'cnsdt-income-data-row-amount',
  },
  'fico-score': {
    item: 'fico-score',
  },
  'fico-sect': {
    grid: 'fico-sect',
  },
  'doc-add-contrib': {
    grid: 'doc-add-contrib-grid',
  },
  'doc-chk-add-contrib-sect': {
    header: 'add-contrib-header',
    item: 'doc-add-contrib-item',
    icon: 'chevron-left',
  },
  'doc-chk-borr': {
    item: 'inc-calc-borr-item',
    header: 'radio-control-label',
  },
  'doc-add-action': {
    item: 'doc-add-action',
  },
  default: {
    title: 'text-label',
    header: 'radio-control-label',
    icon: '',
    grid: 'default-grid',
    gridItem: '',
    label: '',
    labelValue: '',
    summary: '',
    details: '',
    'grid-label': 'default-grid-label-spacing',
  },
};

const datePicker = {
  'se-pl-date': {
    div: 'date-flex-div',
    title: 'date-flex-title',
    picker: 'date-flex-picker',
  },
  'fico-scr': {
    title: 'fico-scr-title',
    inputProps: { style: { width: '17rem', margin: '1rem 1rem 1rem 0rem !important' } },
    div: 'fico-date-row',
  },
  'datepicker-we': {
    title: 'text-label',
    picker: 'datepicker-we',
  },
  'doc-chk-date': {
    div: 'doc-date-flex-div',
    title: 'doc-date-flex-title',
    picker: 'doc-date-flex-picker',
  },
  default: {
    title: 'text-label',
    picker: 'datepicker',
  },
};

const dropDown = {
  payFreq: {
    dropdown: 'payFreq',
    'dropdown-sect': 'displayInRow',
    title: 'pay-freq-title',
  },
  smallDropDown: {
    'dropdown-sect': 'selectType',
    select: 'small',
  },
  'we-bs-pay': {
    'dropdown-sect': 'inline',
    dropdown: 'inline-dropdown',
  },
  contributorType: {
    'dropdown-sect': '',
    dropdown: '',
    select: 'contrib',
    title: '',
  },
  'contrib-drop-down': {
    'dropdown-sect': 'displayInRow',
    dropDown: '',
    select: 'doc-contrib-select',
    title: 'title',
  },
  default: {
    'dropdown-sect': 'displayInRow',
    title: 'title',
    select: 'select',
  },
};

const radioButtons = {
  'sicm-options': {
    paddingRight: '3rem',
  },
  default: {

  },
};

const createSelect = {
  default: {
    button: 'cname-button',
    buttonIcon: 'cname-icon',
    createSelectWrapper: 'cname-create',
    createSelect: 'cname-button',
    dropDown: 'cname-dropdown',
  },
};

const direction = {
  top: { display: 'flex', flexDirection: 'column' },
  left: { display: 'flex', flexDirection: 'row' },
  right: { display: 'flex', flexDirection: 'row-reverse' },
  bottom: { display: 'flex', flexDirection: 'column-reverse' },
};

const tabStyle = {
  docBorrowerTab: {
    tabs: 'doc-tab-view',
  },
  default: {
    tabs: 'tabview',
  },
};

const styleData = {
  datePicker,
  textFields,
  taskSection,
  dropDown,
  radioButtons,
  createSelect,
  tabStyle,
};

const getStyleObj = component => R.prop(null, component, styleData);

const getStyleName = (component, styleName, element) => R.pathOr(R.pathOr('', [component, 'default', element], styleData), [component, styleName, element], styleData);

module.exports = {
  getStyleName,
  getStyleObj,
  direction,
};
