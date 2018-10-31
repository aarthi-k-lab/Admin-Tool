const arrayToString = arr => arr.map((m) => {
  if (m && m.length > 0) {
    return `'${m[0].toUpperCase()}${m.substr(1)}'`;
  }
  return `'${m}'`;
}).join(' or ');

export {
  // eslint-disable-next-line
  arrayToString,
};
