import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Grid } from '@material-ui/core';
import './LoanDocument.css';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onPageChange,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        aria-label="first page"
        disabled={page === 0}
        onClick={handleFirstPageButtonClick}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton aria-label="previous page" disabled={page === 0} onClick={handleBackButtonClick}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        aria-label="next page"
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={handleNextButtonClick}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        aria-label="last page"
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={handleLastPageButtonClick}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


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
