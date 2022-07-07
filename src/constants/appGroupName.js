// AD GROUPS DEFINED BELOW ARE CASE SENSITIVE
const FEUW = 'FEUW';
const BEUW = 'BEUW';
const DOC_PROCESSOR = 'PROC';
const DOC_GEN = 'DOCGEN';
const DOCS_IN = 'DOCSIN';
const BETA = 'BETA';
const STAGER = 'STAGER';
const TRIAL = 'TRIAL';
const UTIL = 'UTIL';
const POSTMODSTAGER = 'POSTMODSTAGER';
const POSTMOD = 'POSTMOD';
const BOOKING = 'BOOKING';
const DOCGENVENDOR = 'DOCGENVENDOR';
const FHLMCRESOLVE = 'FHLMCRESOLVE';
const UWSTAGER = 'UWSTAGER';
const RPS_STAGER = 'RPSstager';
const INVSET = 'INVSET';
const SECLOOK = 'SECLOOK';

const checklistGroupNames = [
  DOC_PROCESSOR,
  FEUW,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  POSTMOD,
  BOOKING,
  UWSTAGER,
  INVSET,
  SECLOOK,
];

const userGroupList = [
  DOC_PROCESSOR,
  FEUW,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  BETA,
  STAGER,
  TRIAL,
  UTIL,
  POSTMODSTAGER,
  BOOKING,
  DOCGENVENDOR,
  FHLMCRESOLVE,
  RPS_STAGER,
  INVSET,
  SECLOOK,
];


module.exports = {
  BEUW,
  DOC_GEN,
  DOCS_IN,
  userGroupList,
  BETA,
  checklistGroupNames,
};
