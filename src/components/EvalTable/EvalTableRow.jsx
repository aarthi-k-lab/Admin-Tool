import React from 'react';
import PropTypes from 'prop-types';
import EvalTableCell from './EvalTableCell';

const EvalTableRow = ({ row }) => {
  let cellData = null;
  switch (row.column.Header) {
    case 'ASSIGNEE':
      cellData = row.value
        ? (
          <EvalTableCell addLink={false} styleProps="blackText" value={row.value} />
        )
        : (
          <EvalTableCell addLink styleProps="redText" value="Unassigned" />
        );
      break;
    default:
      cellData = (
        row.original.assignee
          ? (
            <EvalTableCell addLink={false} styleProps="blackText" value={row.value} />
          )
          : (
            <EvalTableCell addLink styleProps="blackText" value={row.value} />
          )
      );
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
