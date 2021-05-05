import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './Navigation.css';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function Progress({ status, lastUpdated }) {
  // const [lastUpdated, ] = useState
  if (status === 'loading') {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <CircularProgress
          className={classes.bottom}
          size={22}
          thickness={5}
          value={100}
          variant="determinate"
        />
        <CircularProgress
          classes={{
            circle: classes.circle,
          }}
          className={classes.top}
          disableShrink
          size={22}
          thickness={5}
          variant="indeterminate"
        />
      </div>
    );
  } if (lastUpdated === 'Never') {
    return <p>Never</p>;
  }
  return <p>{moment(new Date(lastUpdated)).fromNow()}</p>;
}
function Navigation({
  disableNext,
  disablePrev,
  onNext,
  onPrev,
  lastUpdated,
  status,
}) {
  return (
    <div styleName="navigation">
      <div />
      <div>
        <Button
          color="primary"
          disabled={disablePrev}
          onClick={onPrev}
          styleName="nav-button"
        >
        Prev
        </Button>
        <Button
          color="primary"
          disabled={disableNext}
          onClick={onNext}
          styleName="nav-button"
        >
        Next
        </Button>
      </div>
      <div styleName="lastUpdated">
        { status && (
        <>
          <p styleName="status">Last Updated: </p>
          <Progress lastUpdated={lastUpdated} status={status} styleName="spinner" />
        </>
        )}
      </div>
    </div>
  );
}

Navigation.defaultProps = {
  disableNext: false,
  disablePrev: false,
  status: null,
  lastUpdated: 'Never',
};

Navigation.propTypes = {
  disableNext: PropTypes.bool,
  disablePrev: PropTypes.bool,
  lastUpdated: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  status: PropTypes.string,
};
Progress.propTypes = {
  lastUpdated: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
export default Navigation;
