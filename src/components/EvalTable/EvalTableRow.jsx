import React from 'react';
import PropTypes from 'prop-types';
import EvalTableCell from './EvalTableCell';


const EvalTableRow = ({ row }) => {
  let cellData = null;
  switch (row.column.Header) {
    case 'ASSIGNED TO':
      cellData = <EvalTableCell addLink={!row.value} styleProps={row.value ? 'blackText' : 'redText'} value={row.value ? row.value : 'Unassigned'} />;
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
