function getOr(key, obj, fallbackValue) {
  const value = obj[key];
  return value || value === 0 ? value : fallbackValue;
}

const Validators = {
  getOr,
};

export default Validators;
