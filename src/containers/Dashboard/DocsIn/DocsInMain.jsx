import React from 'react';
// import LandingPage from './LandingPage';
import UserReport from '../UserReport/UserReport';


function DocsInMain(group) {
  return <UserReport group={group} />;
}

const TestExports = {
  DocsInMain,
};

export default DocsInMain;
export { TestExports };
