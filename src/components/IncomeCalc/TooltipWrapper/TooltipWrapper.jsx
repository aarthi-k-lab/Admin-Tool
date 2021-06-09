import React from 'react';
import * as R from 'ramda';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  warningTooltip: {
    backgroundColor: '#ffa400',
  },
  warningArrow: {
    color: '#ffa400',
  },
  errorTooltip: {
    backgroundColor: 'rgb(231, 61, 91)',
  },
  errorArrow: {
    color: 'rgb(231, 61, 91)',
  },
}));

const TooltipWrapper = ({ element, failureReason }) => {
  const classes = useStyles();

  if (R.isNil(failureReason) || R.isEmpty(failureReason)) return element;
  const errorLevels = {
    1: 'errors',
    2: 'warnings',
  };
  const { errors, warnings } = R.groupBy(
    item => errorLevels[item.level], R.reject(R.isNil, failureReason),
  );
  const isErrors = !(R.isEmpty(errors) || R.isNil(errors));
  return (
    <>
      <Tooltip
        arrow
        classes={{
          tooltip: isErrors ? classes.errorTooltip : classes.warningTooltip,
          arrow: isErrors ? classes.errorArrow : classes.warningArrow,
        }}
        disableFocusListener
        disableTouchListener
        placement="right"
        title={(
          <>
            {errors && errors.map(error => <p style={{ fontSize: '1rem' }}>{error.message}</p>)}
            {warnings && warnings.map(warning => <p style={{ fontSize: '1rem' }}>{warning.message}</p>)}
          </>
          )}
      >
        <div style={{ width: 'fit-content' }}>
          {element}
        </div>
      </Tooltip>
    </>
  );
};

TooltipWrapper.defaultProps = {
  element: null,
  failureReason: null,
};


TooltipWrapper.propTypes = {
  element: PropTypes.node,
  failureReason: PropTypes.arrayOf(PropTypes.shape()),

};

export default TooltipWrapper;
