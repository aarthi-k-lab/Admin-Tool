import isFeatureEnabled from './FeatureUtils';


describe('should return appropriate feature from featureSet or false', () => {
  it('should return enabled or disabled', () => {
    const featureSet = {
      taskPane: true,
    };
    const result = isFeatureEnabled('taskPane', featureSet);
    expect(result).toEqual(true);
    const errorResult = isFeatureEnabled('task', featureSet);
    expect(errorResult).toEqual(false);
  });
});
