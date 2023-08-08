import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, TableRow, TableHead,
  TableContainer, TableCell, TableBody, Table,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import './BorrowerIncomeExpense.css';

function BorrowerIncomeExpense(props) {
  const { data, borrName } = props;
  const incomeData = data.incomeData || [];

  const expenseData = data.expenseData || [];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Grid container direction="column">
        <Grid item xs={12}>
          <div styleName="borrExpandContainer">
            <div>
              {
                !isExpanded ? <span styleName="header">Borrower Income & Expense</span> : ''
              }

            </div>
            <div>
              { isExpanded
                ? <ExpandLess onClick={() => setIsExpanded(!isExpanded)} styleName="cursor" />
                : <ExpandMore onClick={() => setIsExpanded(!isExpanded)} styleName="cursor" />
             }
            </div>
          </div>
        </Grid>
        {
            isExpanded
              && (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={7}>
                    <Grid container direction="column">
                      <Grid item>
                        <div styleName="borrNameContainer">
                          <span styleName="header">Borrower Income</span>
                          <span>
                            Borrower name :
                            {' '}
                            {borrName}
                          </span>
                        </div>
                      </Grid>
                      <Grid item styleName="borrowerIncomeContainer">
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead styleName="borrTableHead">
                              <TableRow>
                                <TableCell align="left" styleName="tableCellHead">Fiancial Item</TableCell>
                                <TableCell align="left" styleName="tableCellHead">Gross Amount</TableCell>
                                <TableCell align="left" styleName="tableCellHead">Net Amount</TableCell>
                                <TableCell align="left" styleName="tableCellHead">Description</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody styleName="borrTableBody">
                              {incomeData && incomeData.map(row => (
                                <TableRow key={row.id}>
                                  <TableCell component="th" scope="row" styleName="tableCell">
                                    {row.title}
                                  </TableCell>
                                  <TableCell align="left" styleName="tableCell">
                                    {row.grossAmount}
                                  </TableCell>
                                  <TableCell align="left" styleName="tableCell">
                                    {row.netAmount}
                                  </TableCell>
                                  <TableCell align="left" styleName="tableCell">
                                    {row.description}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5}>
                    <Grid container direction="column">
                      <Grid item>
                        <div>
                          <span styleName="header">Borrower Expense</span>
                        </div>
                      </Grid>
                      <Grid item styleName="borrowerExpenseContainer">
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead styleName="borrTableHead">
                              <TableRow>
                                <TableCell align="left" styleName="tableCellHead">Fiancial Item</TableCell>
                                <TableCell align="left" styleName="tableCellHead">Gross Amount</TableCell>
                                <TableCell align="left" styleName="tableCellHead">Description</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody styleName="borrTableBody">
                              {expenseData && expenseData.map(row => (
                                <TableRow key={row.id}>
                                  <TableCell component="th" scope="row" styleName="tableCell">
                                    {row.title}
                                  </TableCell>
                                  <TableCell align="left" styleName="tableCell">
                                    {row.grossAmount}
                                  </TableCell>
                                  <TableCell align="left" styleName="tableCell">
                                    {row.description}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              )

        }
      </Grid>
    </div>
  );
}


BorrowerIncomeExpense.propTypes = {
  borrName: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired,
  expenseData: PropTypes.shape().isRequired,
  incomeData: PropTypes.shape().isRequired,
};

export default BorrowerIncomeExpense;
