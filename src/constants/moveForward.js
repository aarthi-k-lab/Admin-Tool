const MOVE_FORWARD = 'MOVE FORWARD';
const PROCESSING = 'Processing';
const FRONTEND_REVIEW = 'FrontEnd Review';
const UNDERWRITING = 'Underwriting';
const DOCUMENT_GENERATION = 'Document Generation';
const DOCS_SENT = 'Docs Sent';
const DOCS_IN = 'Docs In';

const TASK_NAMES = [
  PROCESSING, FRONTEND_REVIEW, UNDERWRITING, DOCUMENT_GENERATION, DOCS_IN, DOCS_SENT];

const TABLE_COLUMN = [
  {
    Header: 'EVAL ID', accessor: 'evalId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
  },
  {
    Header: 'STATUS', accessor: 'status', minWidth: 700, maxWidth: 1000, style: { width: '54%' }, headerStyle: { textAlign: 'left' },
  },
];

module.exports = {
  MOVE_FORWARD,
  TASK_NAMES,
  TABLE_COLUMN,
};
