import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import './TabView.css';
import TabPanel from './TabPanel';


const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleTabSelection = (event, newValue) => {
    this.setState({ value: newValue });
  }

  render() {
    const { value } = this.state;

    return (
      <>
        <Paper color="default" position="static" style={{ height: '4rem' }}>
          <Tabs
            indicatorColor="primary"
            onChange={(tab, newValue) => this.handleTabSelection(tab, newValue)}
            textColor="primary"
            value={value}
          >
            <Tab
              icon={<FiberManualRecordIcon styleName="failedTab" />}
              label="Failed"
              styleName="tabStyle"
              {...a11yProps(0)}
            />
            <Tab
              icon={<FiberManualRecordIcon styleName="passedTab" />}
              label="Passed"
              styleName="tabStyle"
              {...a11yProps(1)}
            />
            <Tab
              icon={<PublishIcon styleName="uploadTab" />}
              label="Upload"
              styleName="tabStyle"
              {...a11yProps(3)}
            />
          </Tabs>
        </Paper>
        <TabPanel index={0} value={value}>
          <h1>Failed</h1>
        </TabPanel>
        <TabPanel index={1} value={value}>
          <h1>Passed</h1>
        </TabPanel>
        <TabPanel index={2} value={value}>
          <h1>Upload</h1>
        </TabPanel>
      </>
    );
  }
}

TabView.defaultProps = {
  children: null,
};

export default TabView;
