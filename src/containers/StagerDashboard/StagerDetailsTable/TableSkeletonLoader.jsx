import React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from 'react-loading-skeleton';
import './StagerDetailsTable.css';

const renderSkeletonLoader = () => (
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
    </Grid>
  </>
);

export default renderSkeletonLoader;
