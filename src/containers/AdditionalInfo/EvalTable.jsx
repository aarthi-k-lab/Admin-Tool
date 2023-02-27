import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as R from 'ramda';
import Row from './Row';
import './EvalTable.css';

const headers = [
  {
    colSpan: 1,
    name: 'EVAL ID',
  },
  {
    colSpan: 1,
    name: 'RESOLUTION ID',
  },
  {
    colSpan: 1,
    name: 'STATUS',
  },
  {
    colSpan: 2,
    name: 'STATUS DATE',
  },
  {
    colSpan: 1,
    name: 'SUBSTATUS',
  },
  {
    colSpan: 2,
    name: 'SUBSTATUS DATE',
  },
  {
    colSpan: 1,
    name: 'HISTORY',
  },
];

const EvalTable = ({ rows, selectRow, selectedIndex }) => {
  const rowsPerPage = 15;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length);
  if (!R.isEmpty(rows)) {
    return (
      <TableContainer component={Paper} styleName="container">
        <Table aria-label="collapsible table" fixedHeader={false} size="small" styleName="tableStyle">
          <TableHead styleName="head">
            <TableRow>
              {headers.map(header => (<TableCell key={header.name} align="center" colSpan={header.colSpan} styleName="headStyle">{header.name}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <Row
                key={`${row.resolutionId}-${row.statusDate}`}
                changeColor={selectedIndex === idx}
                data={row}
                onClick={() => selectRow(idx, row.evalId)}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} styleName="headStyle" />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return null;
};

EvalTable.defaultProps = {
  rows: [],
};

EvalTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    evalId: PropTypes.string,
    loanNumber: PropTypes.string.isRequired,
  })),
  selectedIndex: PropTypes.number.isRequired,
  selectRow: PropTypes.func.isRequired,
};


export default EvalTable;
