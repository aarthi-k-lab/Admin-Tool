const FORMAT = {
  ssn: value => value
    .replace(/[^0-9]/g, '')
    .replace(/^(.{9})(.*)$/, '$1')
    .replace(/(\d{3})(\d{1,})/, '$1-$2')
    .replace(/(\d{3}-\d{2})(\d{1,})/, '$1-$2'),

  phone: value => value
    .replace(/[^0-9]/g, '')
    .replace(/^(.{9})(.*)$/, '$1')
    .replace(/(\d{3})(\d{1,})/, '($1) $2')
    .replace(/(\(\d{3}\)\s\d{3})(\d{1,})/, '$1 $2'),

  currency: value => value
    .replace(/[^0-9.]/g, '')
    .replace(/\d(?=(?:\d{3})+$)/g, '$&,'),
};

const UNFORMAT = {
  ssn: value => value.replace(/[^0-9]/g, ''),
  phone: value => value.replace(/[^0-9]/g, ''),
  currency: value => value.replace(/[^0-9.]/g, ''),
};

module.exports = {
  FORMAT,
  UNFORMAT,
};
