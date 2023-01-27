function getOr(key, obj, fallbackValue) {
  if (obj === null) return fallbackValue;
  const value = obj[key];
  return value || value === 0 ? value : fallbackValue;
}

const Validators = {
  getOr,
};

export default Validators;
