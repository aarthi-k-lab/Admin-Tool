import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { selectors } from 'ducks/tombstone';
import './CFPBTableContent.css';
import MUITable from '../../../MUITable/MUITable';
import PopupContainer from '../../../PopupContainer';
import Loader from '../../../Loader';

const CFPB_TABLE_COLUMNS = [
  {
    name: 'delinquencyStartDate',
    label: 'Delinquency Start date',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'cfpbEffortMetDate',
    label: 'CFPB Effort Met Date',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
  {
    name: 'evaluationID',
    label: 'Evalution ID',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: (value) => {
      if (value === 'C') return 'Completed';
      if (value === 'I') return 'In Progress';
      return value;
    },
  },
  {
    name: 'statusDate',
    label: 'Status Date',
    align: 'left',
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => (value ? moment(value).format('MM/DD/YYYY') : '-'),
  },
];


const CFPBTableContent = ({
  cfpbTableData, loading, show, handleClose,
}) => (
  <PopupContainer handleClose={handleClose} show={show} title="CFPB Delinquency tracking">
    <div styleName="table-container">
      {loading ? <Loader message="Please Wait" />
        : (
          <MUITable columns={CFPB_TABLE_COLUMNS} data={cfpbTableData || []} size="small" />
        )}
    </div>
  </PopupContainer>
);

CFPBTableContent.defaultProps = {
  cfpbTableData: {},
  loading: false,
  show: false,
};

CFPBTableContent.propTypes = {
  cfpbTableData: PropTypes.arrayOf(PropTypes.shape),
  handleClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  cfpbTableData: selectors.getCFPBTableData(state),
  loading: selectors.getLoader(state),
});

export default connect(mapStateToProps)(CFPBTableContent);
