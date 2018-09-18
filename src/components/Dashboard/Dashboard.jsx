import React from 'react';
import FullHeightColumn from 'components/FullHeightColumn';
import App from 'components/App';
import Tasks from 'components/Tasks';

const Dashboard = () => (
  <App>
    <FullHeightColumn>
      <Tasks />
    </FullHeightColumn>
  </App>
);

export default Dashboard;
