import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React from 'react';
import './ResultStatus.css';

function ResultStatus({ cellProps }) {
  const { isValid } = cellProps.original;
  return (
    <span styleName="status">
      <FiberManualRecordIcon styleName={R.equals(isValid, true) ? 'passedTab' : 'failedTab'} text="Image" />
      <span>{R.equals(isValid, true) ? 'Passed' : 'Failed' }</span>
    </span>
  );
}

ResultStatus.defaultProps = {
  cellProps: {},
};

ResultStatus.propTypes = {
  cellProps: PropTypes.shape({
    original: PropTypes.shape({
      isValid: PropTypes.string,
    }),
  }),
};
export default ResultStatus;
