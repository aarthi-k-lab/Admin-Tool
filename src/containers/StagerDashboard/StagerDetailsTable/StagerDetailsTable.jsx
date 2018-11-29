/* eslint-disable no-dupe-keys */
import React from 'react';
import './StagerDetailsTable.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import * as R from 'ramda';
import ListIcon from '@material-ui/icons/List';
// import Loader from 'components/Loader/Loader';
import renderSkeletonLoader from './TableSkeletonLoader';

class StagerDetailsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.renderDataTable = this.renderDataTable.bind(this);
  }

  static renderRow(rowKey, rowValue) {
    switch (rowKey) {
      case 'Days Until SLA':
        return (
          <span styleName={rowValue < 0 ? 'days-until-sla-red' : ''}>
            {`${rowValue} ${rowValue > 1 ? 'DAYS' : 'DAY'}`}
          </span>
        );
      default:
        return rowValue;
    }
  }

  renderDataTable(data) {
    const { onCheckBoxClick, selectedData } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table styleName="main-table">
            <TableHead>
              <TableRow>
                {data.isManualOrder ? (<TableCell padding="checkbox" styleName="table-cell-right-border" />) : null}
                {Object.keys(data.tableData[0]).map(key => (!['TKIID'].includes(key) ? (<TableCell styleName="table-cell-right-border table-header-cell">{key}</TableCell>) : null))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.tableData.map((row) => {
                const isSelected = selectedData.find(o => o.TKIID === row.TKIID) || false;
                return (
                  <TableRow key={row.evalId} role="checkbox">
                    {data.isManualOrder ? (
                      <TableCell padding="checkbox" styleName="table-cell-right-border">
                        <Checkbox
                          checked={isSelected}
                          onChange={e => onCheckBoxClick(e.target.checked, row)}
                        />
                      </TableCell>
                    ) : null}
                    {Object.keys(row).map(key => (!['TKIID'].includes(key) ? (
                      <TableCell component="th" scope="row" styleName="table-cell-right-border table-row-cell">
                        {this.constructor.renderRow(key, row[key])}
                      </TableCell>
                    ) : null))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  static renderUnselectedMessage(noTableData = false) {
    return (
      <Grid
        alignItems="center"
        container
        direction="column"
        justify="center"
        spacing={0}
        styleName="center-grid"
      >
        <Grid item xs={3}>
          {noTableData ? null : (<><ListIcon styleName="no-preview-icon" />
            <br /></>)}
          <span styleName="no-preview-message">{ noTableData ? 'No Loans Present' : 'No list selected to preview' }</span>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { data, loading } = this.props;
    return (
      <>
        {
          !R.isEmpty(data) && !loading
            ? (
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                styleName="stager-details-table-top-div"
              >
                <Grid item xs={4}>
                  <span styleName="details-table-document-type">{data.stagerTaskType && data.stagerTaskType.toUpperCase()}</span>
                  <br />
                  <span styleName="details-table-document-status">{data.stagerTaskStatus && data.stagerTaskStatus.toUpperCase()}</span>
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
                    <DownloadIcon styleName="details-table-download-icon" />
                    { ' DOWNLOAD' }
                  </Button>
                </Grid>
              </Grid>
            ) : null
        }
        {
          (R.isEmpty(data) || R.isEmpty(data.tableData)) && !loading
            ? this.constructor.renderUnselectedMessage(R.isEmpty(data.tableData)) : null
        }
        {
          loading ? renderSkeletonLoader() : null
        }
        {
          data.tableData && data.tableData.length && !loading ? (
            this.renderDataTable(data)
          ) : null
        }
        </>
    );
  }
}

StagerDetailsTable.propTypes = {
  data: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
};

export default StagerDetailsTable;
