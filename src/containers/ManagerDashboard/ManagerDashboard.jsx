import React, { Component } from 'react';
import Report from 'powerbi-report-component';
import Auth from 'lib/Auth';
import ContentHeader from 'components/ContentHeader';
import App from 'components/App';
import AppCenterDisplay from 'components/AppCenterDisplay';
import './ManagerDashboard.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

class ManagerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.accessToken = Auth.getPowerBIAccessToken();
    const auth = Auth.getInstance();
    this.groups = auth.getGroups();
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
  }

  renderReport() {
    return this.accessToken
      ? (
        <Report
          accessToken={this.accessToken}
          embedId="b167ee03-5641-42dc-9fa7-873382b46ec0"
          embedType="report"
          embedUrl="https://app.powerbi.com/reportEmbed?reportId=b167ee03-5641-42dc-9fa7-873382b46ec0&groupId=4aa8e155-b2fa-4034-9c19-261c4d80da5b"
          permissions="All"
          style={this.reportStyle}
          tokenType="Aad"
        />
      )
      : (
        <AppCenterDisplay>
          <span styleName="message">
            <CircularProgress size={30} />
            Authenticating with PowerBI...
          </span>
        </AppCenterDisplay>
      );
  }

  render() {
    if (!this.groups.includes('feuw-mgr')) {
      return <Redirect to="/unauthorized?error=MANAGER_ACCESS_NEEDED" />;
    }
    return (
      <App>
        <ContentHeader
          onGetNext={this.handleGetNext}
          showGetNext={false}
          title="Manager Dashboard"
        />
        <div styleName="reportsDiv">
          { this.renderReport() }
        </div>
      </App>
    );
  }
}

export default ManagerDashboard;
