import React from 'react';
// import PropTypes from 'prop-types';
import './docWidget.css';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
// import ReactTable from 'react-table';
// import { EvalTableRow } from '../../Dashboard/EvalTable';

// const columnData = [{
//   Header: 'Case Id',
//   accessor: 'evalId',
//   maxWidth: 65,
//   minWidth: 65,
//   Cell: row => <EvalTableRow row={row} />,
// }, {
//   Header: 'Case Type',
//   accessor: 'piid',
//   maxWidth: 70,
//   minWidth: 70,
//   Cell: row => <EvalTableRow row={row} />,
// }, {
//   Header: 'Case Status',
//   accessor: 'pstatus',
//   maxWidth: 70,
//   minWidth: 70,
//   Cell: row => <EvalTableRow row={row} />,
// }, {
//   Header: 'Trial Letter Sent On',
//   accessor: 'pstatus',
//   maxWidth: 70,
//   minWidth: 70,
//   Cell: row => <EvalTableRow row={row} />,
// }];

class DocWidget extends React.Component {
  render() {
    return (
      <>
        <div styleName="title-style">
          Custom Communication Letter
        </div>
        <TextField
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.handleSearchLoanClick}>
                  <img alt="search" src="/static/img/search.png" styleName="searchIcon" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={this.onSearchTextChange}
          onKeyPress={this.handleSearchLoan}
          placeholder="      Search"
          styleName="searchStyle"
          varirant="filled"
        />
        <Grid container style={{ borderBottom: '1px solid rgb(181, 184, 189)', padding: '10px' }}>
          <Grid xs={2}>
            <span styleName="header-style">Case Id</span>
          </Grid>
          <Grid xs={3}>
            <span styleName="header-style">Case Type</span>
          </Grid>
          <Grid xs={3}>
            <span styleName="header-style">Case Status</span>
          </Grid>
          <Grid xs={4}>
            <span styleName="header-style">Trial Letter Sent On</span>
          </Grid>
        </Grid>
        <Grid container style={{ borderBottom: '1px solid rgb(181, 184, 189)', padding: '10px' }}>
          <Grid xs={2}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">CASEA</span>
          </Grid>
          <Grid xs={3}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">CASETYPEB</span>
          </Grid>
          <Grid xs={3}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">Active</span>
          </Grid>
          <Grid xs={4}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">04/11/2018</span>
          </Grid>
        </Grid>
        <Grid container style={{ borderBottom: '1px solid rgb(181, 184, 189)', padding: '10px' }}>
          <Grid xs={2}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">CASEA</span>
          </Grid>
          <Grid xs={3}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">CASETYPEB</span>
          </Grid>
          <Grid xs={3}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">Active</span>
          </Grid>
          <Grid xs={4}>
            <span style={{ paddingLeft: '12px' }} styleName="tableData-style">04/11/2018</span>
          </Grid>
        </Grid>
      </>
    );
  }
}

DocWidget.propTypes = {
  // classes: PropTypes.shape.isRequired,
};

export default DocWidget;
