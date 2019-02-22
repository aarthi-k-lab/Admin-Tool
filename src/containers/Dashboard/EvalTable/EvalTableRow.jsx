import React from 'react';
import PropTypes from 'prop-types';
import EvalTableCell from './EvalTableCell';


class EvalTableRow extends React.PureComponent {
  render() {
    const getStyles = (row) => {
      let styles = '';
      if (!row.original.assignee && row.column.Header === 'ASSIGNED TO') {
        styles = 'redText pointer';
      } else if (row.original.assignee && (row.original.assignee === 'In Queue' || row.original.assignee === 'N/A')) {
        styles = 'blackText';
      } else {
        styles = 'blackText pointer';
      }
      return styles;
    };
    const { row } = this.props;
    let cellData = null;
    switch (row.column.Header) {
      case 'ASSIGNED TO':
        cellData = <EvalTableCell styleProps={getStyles(row)} value={row.value ? row.value : 'Unassigned'} />;
        break;
      default:
        cellData = <EvalTableCell styleProps={getStyles(row)} value={row.value} />;
    }
    return (
      <div>
        {cellData}
      </div>
    );
  }
}

EvalTableRow.propTypes = {
  row: PropTypes.arrayOf(PropTypes.shape({
    evalId: PropTypes.string.isRequired,
  })).isRequired,
};

export default EvalTableRow;
