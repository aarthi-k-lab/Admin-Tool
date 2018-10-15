const isFeatureEnabled = (featureName, featureSet) => {
  if (featureSet && featureSet[featureName] != null) {
    return featureSet[featureName];
  }
  return false;
};

const TASK_PANE = 'taskPane';

const features = {
  TASK_PANE,
};

export default isFeatureEnabled;
export { features };
