import React from 'react';
import './StagerDetailsTable.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

class StagerDetailsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.renderDataTable = this.renderDataTable.bind(this);
  }

  /* eslint-disable class-methods-use-this */
  renderDataTable(data) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" styleName="table-cell-right-border">
                  <Checkbox checked={false} />
                </TableCell>
                {Object.keys(data.tableData[0]).map(key => (<TableCell styleName="table-cell-right-border">{key}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.tableData.map(row => (
                <TableRow key={row.evalId} role="checkbox">
                  <TableCell padding="checkbox" styleName="table-cell-right-border">
                    <Checkbox checked={false} />
                  </TableCell>
                  {Object.keys(row).map(key => (
                    <TableCell component="th" scope="row" styleName="table-cell-right-border">
                      {row[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  render() {
    const data = {
      documentType: 'Attorney Fees',
      documentStatus: 'To Order',
      isManualOrder: true,
      tableData: [
        {
          'Loan#': '1323234',
          'Borrower Name': 'Aditya',
          Investor: 'ABS',
          'Days until SLA': -2,
        },
        {
          'Loan#': '1323234',
          'Borrower Name': 'Aditya',
          Investor: 'ABS',
          'Days until SLA': -2,
        },
        {
          'Loan#': '1323234',
          'Borrower Name': 'Aditya',
          Investor: 'ABS',
          'Days until SLA': -2,
        },
        {
          'Loan#': '1323234',
          'Borrower Name': 'Aditya',
          Investor: 'ABS',
          'Days until SLA': -2,
        },
      ],
    };
    return (
    <>
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        styleName="stager-details-table-top-div"
      >
        <Grid item xs={4}>
          <span styleName="details-table-document-type">{data.documentType && data.documentType.toUpperCase()}</span>
          <br />
          <span styleName="details-table-document-status">{data.documentStatus && data.documentStatus.toUpperCase()}</span>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          {
              data.isManualOrder
                ? (
                  <Button styleName="details-table-order-btn" variant="contained">
                    { 'ORDER' }
                  </Button>
                ) : null
            }
          <Button styleName="details-table-download-btn">
            <DownloadIcon />
            { ' DOWNLOAD' }
          </Button>
        </Grid>
      </Grid>
      {
        data.tableData && data.tableData.length ? (
          this.renderDataTable(data)
        ) : null
      }
      </>
    );
  }
}

export default StagerDetailsTable;
