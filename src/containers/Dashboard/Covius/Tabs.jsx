import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import { PropTypes } from 'prop-types';
import './TabView.css';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 'auto',
    padding: 0,
  },
  fullHeight: {
    ...theme.mixins.toolbar,
    height: '50px',
  },
  labelIcon: {
    minHeight: '60px',
  },
}));

export default function SimpleTabs({
  handleTabSelection, renderCountLabel, getCount, coviusTabIndex,
}) {
  const classes = useStyles();
  return (
    <Box borderBottom={1} borderTop={1} style={{ color: '#eaeaea' }}>
      <Tabs
        className={classes.fullHeight}
        id="Tabs"
        indicatorColor="primary"
        onChange={(tab, newValue) => handleTabSelection(tab, newValue)}
        textColor="primary"
        value={coviusTabIndex}
      >
        <Tab
          className={classes.fullHeight}
          icon={<FiberManualRecordIcon styleName="failedTab" />}
          label={renderCountLabel('Failed')}
          styleName="tabStyle"

        />
        <Tab
          className={classes.fullHeight}
          icon={<FiberManualRecordIcon styleName="passedTab" />}
          label={renderCountLabel('Passed')}
          styleName="tabStyle"
        />
        <Tab
          className={classes.fullHeight}
          icon={<PublishIcon styleName="uploadTab" />}
          label="Upload"
          styleName="tabStyle"
        />
        { getCount('Upload Failed') && (
        <Tab
          icon={<FiberManualRecordIcon styleName="uploadfailedTab" />}
          label={renderCountLabel('Upload Failed')}
          styleName="tabStyle"
        />
        )}
      </Tabs>
    </Box>
  );
}

SimpleTabs.defaultProps = {
  coviusTabIndex: 0,
};

SimpleTabs.propTypes = {
  coviusTabIndex: PropTypes.number,
  getCount: PropTypes.func.isRequired,
  handleTabSelection: PropTypes.func.isRequired,
  renderCountLabel: PropTypes.func.isRequired,
};
