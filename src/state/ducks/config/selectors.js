import * as R from 'ramda';
import isFeatureEnabled, { features } from 'lib/FeatureUtils';

const getPowerBIConstants = R.propOr([], 'powerBIConstants');
const getFeaturesKey = R.propOr([], 'features');
const getPdfUrl = R.propOr('', 'pdfGeneratorUrl');
const getTaskAuditRuleMapping = R.propOr({}, 'taskAuditRuleMapping');

const appConfig = state => state.appConfig;
const powerBIConstants = state => getPowerBIConstants(state.appConfig);
const getFeatures = state => getFeaturesKey(state.appConfig);
const pdfUrlConstants = state => getPdfUrl(state.appConfig);
const taskAuditRuleMapping = state => getTaskAuditRuleMapping(state.appConfig);

const isTaskPaneAccessible = state => isFeatureEnabled(features.TASK_PANE, getFeatures(state));

const selectors = {
  appConfig,
  isTaskPaneAccessible,
  powerBIConstants,
  getFeatures,
  getPdfUrl,
  pdfUrlConstants,
  taskAuditRuleMapping,
};

export default selectors;
