import React, { Component } from 'react';
import Report from 'powerbi-report-component';
import Auth from 'lib/Auth';
import ContentHeader from 'components/ContentHeader';
import App from 'components/App';
import AppCenterDisplay from 'components/AppCenterDisplay';
import './ManagerDashboard.css';

class ManagerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.reportStyle = { width: '100%', height: '100%' };
    this.accessToken = Auth.fetchCookie(Auth.AD_TOKEN_COOKIE_NAME);
    this.renderReport = this.renderReport.bind(this);
  }

  renderReport() {
    return this.accessToken
      ? (
        <Report
          accessToken={this.accessToken}
          embedId="8abb8a35-dbbd-4ca5-ab18-1fcd866af863"
          embedType="report"
          embedUrl="https://app.powerbi.com/reportEmbed?reportId=8abb8a35-dbbd-4ca5-ab18-1fcd866af863&groupId=fba9bb0f-22b1-42c8-b361-df6d18f2fbf5"
          permissions="All"
          style={this.reportStyle}
          tokenType="Aad"
        />
      )
      : (
        <AppCenterDisplay>
          <span styleName="message">
            {'PowerBI Report could not be loaded due to system error. Please refresh the page and try again!'}
          </span>
        </AppCenterDisplay>
      );
  }

  render() {
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
