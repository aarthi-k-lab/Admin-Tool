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
import { selectors as widgetsSelectors } from 'ducks/widgets';
import UserNotification from 'components/UserNotification/UserNotification';
import { selectors, operations } from '../../../state/ducks/dashboard';
import './EvaluationPage.css';
import { HISTORY } from '../../../constants/widgets';

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
  constructor(props) {
    super(props);
    const { onCleanResult } = props;
    onCleanResult();
  }

  haveGroupTrial() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return R.indexOf('trial', groups) !== -1 || R.indexOf('trial-mgr', groups) !== -1;
  }

  canShowSendToDocsIn() {
    const {
      group, user, isAssigned, processName, taskStatus,
    } = this.props;
    const groups = user && user.groupList;
    const isPendingloan = R.equals(taskStatus, 'Active')
    && (R.equals(processName, 'Pending Buyout') || R.equals(processName, DashboardModel.PENDING_BOOKING));
    return isPendingloan && group === DashboardModel.BOOKING && groups.includes('docsin-mgr') && !R.isNil(isAssigned) && !isAssigned;
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
      userNotification, isAutoDisposition, openWidgetList,
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
            showUpdateRemedy={isAutoDisposition}
            showValidate={canShowValidate(group) && !isAutoDisposition}
          />
        </ContentHeader>
        <Tombstone />
        <div style={{ paddingTop: '0.1rem', paddingBottom: '0' }} styleName="title-row">
          {(userNotification && userNotification.status)
            ? <UserNotification level={userNotification.level} message={userNotification.status} type="alert-box" />
            : ''
          }
        </div>
        {(R.contains(HISTORY, openWidgetList)
        && group !== DashboardModel.LOAN_ACTIVITY) ? this.renderDashboard() : (
          <FullHeightColumn styleName={R.contains(HISTORY, openWidgetList) ? '' : 'columns-container'}>
            {this.renderDashboard()}
          </FullHeightColumn>
          )}
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
  checklisttTemplateName: null,
  taskName: '',
  stagerTaskName: '',
  userNotification: { level: '', status: '' },
  onCleanResult: () => {},
  openWidgetList: [],
};

EvaluationPage.propTypes = {
  checklisttTemplateName: PropTypes.string,
  group: PropTypes.string,
  isAssigned: PropTypes.bool.isRequired,
  isAutoDisposition: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onCleanResult: PropTypes.func,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  processName: PropTypes.string.isRequired,
  stagerTaskName: PropTypes.string,
  taskName: PropTypes.string,
  taskStatus: PropTypes.string.isRequired,
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
  userNotification: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};
const mapStateToProps = state => ({
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  taskName: selectors.processName(state),
  isAssigned: selectors.showAssign(state),
  stagerTaskName: selectors.stagerTaskName(state),
  user: loginSelectors.getUser(state),
  checklisttTemplateName: checklistSelectors.getChecklistTemplate(state),
  isAutoDisposition: checklistSelectors.getDispositionType(state),
  userNotification: selectors.userNotification(state),
  processName: selectors.processName(state),
  taskStatus: selectors.taskStatus(state),
});

const mapDispatchToProps = dispatch => ({
  onCleanResult: operations.onCleanResult(dispatch),
});

const container = connect(mapStateToProps, mapDispatchToProps)(EvaluationPage);
const TestHooks = {
  EvaluationPage,
};
export default withRouter(container);

export { TestHooks };
