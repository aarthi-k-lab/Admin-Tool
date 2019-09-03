import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import FrontEndDisposition from 'containers/Dashboard/FrontEndDisposition';
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
function isTrialOrForbearance(taskName) {
  return taskName && taskName.includes('Trial') ? 'Trial ' : 'Forbearance ';
}
class EvaluationPage extends React.PureComponent {
  haveGroupTrial() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return R.indexOf('trial', groups) !== -1 || R.indexOf('trial-mgr', groups) !== -1;
  }

  renderDashboard() {
    const { group } = this.props;
    switch (group) {
      case DashboardModel.BEUW:
        return <TasksAndChecklist />;
      case DashboardModel.FEUW_TASKS_AND_CHECKLIST:
      case DashboardModel.FEUW:
        return <TasksAndChecklist />;
      case DashboardModel.BEUW_TASKS_AND_CHECKLIST:
        return <TasksAndChecklist />;
      case DashboardModel.PROC:
        return <TasksAndChecklist />;
      case DashboardModel.LOAN_ACTIVITY:
        return <LoanActivity />;
      case DashboardModel.DOC_GEN:
        return <TasksAndChecklist />;
      default:
        return <FrontEndDisposition />;
    }
  }

  render() {
    const {
      location, group, taskName, checklisttTemplateName,
    } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    const title = el.task === 'Loan Activity' ? isTrialOrForbearance(taskName) : el.task;
    return (
      <>
        <ContentHeader checklistTemplateName={checklisttTemplateName} title={title}>
          <Controls
            showEndShift={isNotLoanActivity(group)}
            showGetNext={isNotLoanActivity(group)}
            showSendToUnderWritingIcon={(!isNotLoanActivity(group) && this.haveGroupTrial())}
            showValidate={isNotLoanActivity(group)}
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
};

EvaluationPage.propTypes = {
  checklisttTemplateName: PropTypes.string,
  group: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  taskName: PropTypes.string.isRequired,
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
  user: loginSelectors.getUser(state),
  checklisttTemplateName: checklistSelectors.getChecklistTemplate(state),
});

const container = connect(mapStateToProps, null)(EvaluationPage);
const TestHooks = {
  EvaluationPage,
};
export default withRouter(container);

export { TestHooks };
