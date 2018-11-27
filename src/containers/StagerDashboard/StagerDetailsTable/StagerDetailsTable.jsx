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
import Skeleton from 'react-loading-skeleton';

class StagerDetailsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.renderDataTable = this.renderDataTable.bind(this);
  }

  renderDataTable(data) {
    const { onCheckBoxClick, selectedData } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Table styleName="main-table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" styleName="table-cell-right-border" />
                {Object.keys(data.tableData[0]).map(key => (<TableCell styleName="table-cell-right-border">{key}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.tableData.map((row) => {
                const isSelected = selectedData.find(o => o.TKIID === row.TKIID) || false;
                return (
                  <TableRow key={row.evalId} role="checkbox">
                    <TableCell padding="checkbox" styleName="table-cell-right-border">
                      <Checkbox
                        checked={isSelected}
                        onChange={e => onCheckBoxClick(e.target.checked, row)}
                      />
                    </TableCell>
                    {Object.keys(row).map(key => (
                      <TableCell component="th" scope="row" styleName="table-cell-right-border">
                        {row[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  static renderUnselectedMessage() {
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
          <ListIcon styleName="no-preview-icon" />
          <br />
          <span styleName="no-preview-message">No list selected to preview</span>
        </Grid>
      </Grid>
    );
  }

  static renderSkeletonLoader() {
    return (
      <>
        <Grid
          alignItems="flex-end"
          container
          justify="space-between"
          styleName="stager-details-table-top-div"
        >
          <Grid item xs={4}>
            <span styleName="details-table-document-type"><Skeleton /></span>
            <br />
            <span styleName="details-table-document-status"><Skeleton /></span>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Skeleton />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Table styleName="main-table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" styleName="table-cell-right-border"><Skeleton /></TableCell>
                  <TableCell styleName="table-cell-right-border"><Skeleton /></TableCell>
                  <TableCell styleName="table-cell-right-border"><Skeleton /></TableCell>
                  <TableCell styleName="table-cell-right-border"><Skeleton /></TableCell>
                  <TableCell styleName="table-cell-right-border"><Skeleton /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow role="checkbox">
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                </TableRow>
                <TableRow role="checkbox">
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                  <TableCell component="th" scope="row" styleName="table-cell-right-border">
                    <Skeleton />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid></>
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
          R.isEmpty(data) && !loading ? this.constructor.renderUnselectedMessage() : null
        }
        {
          loading ? this.constructor.renderSkeletonLoader() : null
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
