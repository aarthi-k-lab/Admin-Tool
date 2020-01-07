import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import Tombstone from 'containers/Dashboard/Tombstone';
import TasksAndChecklist from 'containers/Dashboard/TasksAndChecklist';
import LoanActivity from 'containers/LoanActivity';
import DashboardModel from 'models/Dashboard';
import * as R from 'ramda';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist';
import { selectors } from '../../../state/ducks/dashboard';
import './EvaluationPage.css';

function isNotLoanActivity(group) {
  return group !== DashboardModel.LOAN_ACTIVITY;
}

function canShowValidate(group) {
  return group !== DashboardModel.LOAN_ACTIVITY
    && group !== DashboardModel.POSTMODSTAGER && group !== DashboardModel.ALLSTAGER;
}

function isTrialOrForbearance(taskName) {
  return taskName && taskName.includes('Trial') ? 'Trial ' : 'Forbearance ';
}
class EvaluationPage extends React.PureComponent {
  haveGroupTrial() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return R.indexOf('trial', groups) !== -1 || R.indexOf('trial-mgr', groups) !== -1;
  }

  canShowSendToDocsIn() {
    const { group, user, isAssigned } = this.props;
    const groups = user && user.groupList;
    return group === DashboardModel.BOOKING && groups.includes('docsin-mgr') && !isAssigned;
  }

  renderDashboard() {
    const { group } = this.props;
    switch (group) {
      case DashboardModel.LOAN_ACTIVITY:
        return <LoanActivity />;
      default:
        return <TasksAndChecklist />;
    }
  }

  render() {
    const {
      location, group, taskName, checklisttTemplateName, stagerTaskName,
    } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    let title = el.task === 'Loan Activity' ? isTrialOrForbearance(taskName) : el.task;
    title = (stagerTaskName && stagerTaskName.activeTile) || title;
    return (
      <>
        <ContentHeader checklistTemplateName={checklisttTemplateName} group={group} title={title}>
          <Controls
            showEndShift={isNotLoanActivity(group)}
            showGetNext={isNotLoanActivity(group)}
            showSendToDocsIn={this.canShowSendToDocsIn()}
            showSendToUnderWritingIcon={(!isNotLoanActivity(group) && this.haveGroupTrial())}
            showValidate={canShowValidate(group)}
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          {this.renderDashboard()}
        </FullHeightColumn>
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
  checklisttTemplateName: null,
  taskName: '',
  stagerTaskName: '',
};

EvaluationPage.propTypes = {
  checklisttTemplateName: PropTypes.string,
  group: PropTypes.string,
  isAssigned: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  stagerTaskName: PropTypes.string,
  taskName: PropTypes.string,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    skills: PropTypes.objectOf(PropTypes.array).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};
const mapStateToProps = state => ({
  taskName: selectors.processName(state),
  isAssigned: selectors.isAssigned(state),
  stagerTaskName: selectors.stagerTaskName(state),
  user: loginSelectors.getUser(state),
  checklisttTemplateName: checklistSelectors.getChecklistTemplate(state),
});

const container = connect(mapStateToProps, null)(EvaluationPage);
const TestHooks = {
  EvaluationPage,
};
export default withRouter(container);

export { TestHooks };
