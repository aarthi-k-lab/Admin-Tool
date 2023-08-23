import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import './LoanDocument.css';
import TablePaginationActions from './TablePaginationActions';


const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function LoanDocument(props) {
  const { rows } = props;
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container>
      <span styleName="header">Documents</span>
      <TableContainer component={Paper} styleName="loanDocumentTableContainer">
        <Table className={classes.table}>
          <TableHead styleName="loanDocTableHead">
            <TableRow>
              <TableCell align="left" styleName="tableCellHead">Document Name</TableCell>
              <TableCell align="left" styleName="tableCellHead">Eval Id</TableCell>
              <TableCell align="left" styleName="tableCellHead">Document Type</TableCell>
              <TableCell align="left" styleName="tableCellHead">Borrower Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody styleName="loanDocTableBody">
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map(row => (
              <TableRow key={row.documentId}>
                <TableCell component="th" scope="row" styleName="tableCell">
                  {row.documentName}
                </TableCell>
                <TableCell align="left" style={{ width: 160 }} styleName="tableCell">
                  {row.evalId}
                </TableCell>
                <TableCell align="left" style={{ width: 160 }} styleName="tableCell">
                  {row.loanDocSubTypeDescription}
                </TableCell>
                <TableCell component="th" scope="row">
                  {'-'}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter styleName="loanDocTableFooter">
            <TablePagination
              ActionsComponent={TablePaginationActions}
              colSpan={4}
              count={rows.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          </TableFooter>
        </Table>
      </TableContainer>
    </Grid>

  );
}

LoanDocument.propTypes = {
  rows: PropTypes.shape().isRequired,
};


export default LoanDocument;
