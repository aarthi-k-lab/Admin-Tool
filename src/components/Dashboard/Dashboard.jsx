import React from 'react';
import FullHeightColumn from '../FullHeightColumn';
import App from '../App';
import Tasks from '../Tasks';

const Dashboard = () => (
  <App>
    <FullHeightColumn>
      <Tasks />
    </FullHeightColumn>
  </App>
);

export default Dashboard;
