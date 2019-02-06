import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import EvalTableCell from './EvalTableCell';

const getDate = (value) => {
  const date = moment(value);
  return date.isValid() ? date.format('MM/DD/YYYY') : '';
};

const EvalTableRow = ({ row }) => {
  let cellData = null;
  switch (row.column.Header) {
    case 'ASSIGNEE':
      cellData = <EvalTableCell addLink={!row.value} styleProps={row.value ? 'blackText' : 'redText'} value={row.value ? row.value : 'Unassigned'} />;
      break;
    case 'STATUS DATE':
      cellData = <EvalTableCell addLink={!row.original.assignee} styleProps="blackText" value={getDate(row.value)} />;
      break;
    default:
      cellData = <EvalTableCell addLink={!row.original.assignee} styleProps="blackText" value={row.value} />;
  }
  return (
    <div>
      {cellData}
    </div>
  );
};
EvalTableRow.propTypes = {
  row: PropTypes.arrayOf(PropTypes.shape({
    evalId: PropTypes.string.isRequired,
  })).isRequired,
};
export default EvalTableRow;
