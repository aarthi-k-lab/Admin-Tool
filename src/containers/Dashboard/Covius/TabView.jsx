import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import './TabView.css';

class TabView extends React.Component {
  render() {
    const component = (
      <>
        <Paper>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<FiberManualRecordIcon styleName="failedTab" />} label="Failed" />
            <Tab icon={<FiberManualRecordIcon styleName="passedTab" />} label="Passed" />
            <Tab icon={<PublishIcon styleName="uploadTab" />} label="Upload" />
          </Tabs>
        </Paper>
      </>

    );

    return component;
  }
}

export default TabView;
