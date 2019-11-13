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

const checklistGroupNames = [
  DOC_PROCESSOR,
  FEUW,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  POSTMOD,
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
];


module.exports = {
  BEUW,
  DOC_GEN,
  DOCS_IN,
  userGroupList,
  BETA,
  checklistGroupNames,
};
