module.exports = {
  'whole-number': {
    expression: '[^0-9]',
    replaceWith: '',
    flag: 'g',
  },
  'decimal-number': {
    expression: '[^0-9.]',
    replaceWith: '',
    flag: 'g',
  },
  alphanumeric: {
    expression: '[^a-zA-Z0-9]',
    replaceWith: '',
    flag: 'g',
  },
};
