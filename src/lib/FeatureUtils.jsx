const isFeatureEnabled = (featureName, featureSet) => {
  if (featureSet && featureSet[featureName] != null) {
    return featureSet[featureName];
  }
  return false;
};

export default isFeatureEnabled;
