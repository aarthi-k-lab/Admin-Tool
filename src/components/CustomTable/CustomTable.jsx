import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ReactTable from 'react-table';
import './CustomTable.css';

const CustomTable = (props) => {
  const { tableHeader, tableData, ...otherProps } = props;
  return (
    <Grid container direction="column">
      <div styleName="table-container">
        <div styleName="height-limiter">
          <ReactTable
            className="-striped -highlight"
            columns={tableHeader}
            data={tableData || []}
            {...otherProps}
            style={{
              height: '53rem',
            }}
          />
        </div>
      </div>
    </Grid>
  );
};

CustomTable.defaultProps = {
  tableHeader: [],
  tableData: [],
};

CustomTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({ data: PropTypes.String })),
  tableHeader: PropTypes.arrayOf(PropTypes.shape({ header: PropTypes.String })),
};

export default CustomTable;
