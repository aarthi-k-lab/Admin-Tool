/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';

const renderProgress = classes => (
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

function TimeAgo({ lastUpdated, isLoading, classes }) {
  const [lastRefreshed, setDate] = React.useState(moment(new Date(lastUpdated)).fromNow());
  React.useEffect(() => {
    const timer = setInterval(() => {
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(moment(new Date(lastUpdated)).fromNow());
    }, 1000);
    return () => {
      setDate(null);
      clearInterval(timer);
    };
  }, [lastUpdated]);
  if (isLoading || !lastRefreshed) {
    return renderProgress(classes);
  } if (lastRefreshed) {
    return (<p>{lastRefreshed.toString()}</p>);
  }
}


TimeAgo.propTypes = {
  classes: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.string.isRequired,
};

export default TimeAgo;
