import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { connect } from 'react-redux';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import FrontEndDisposition from 'containers/Dashboard/FrontEndDisposition';
import { BackendDisposition } from 'containers/Dashboard/BackEndDisposition';
import Tombstone from 'containers/Dashboard/Tombstone';
import TasksAndChecklist from 'containers/Dashboard/TasksAndChecklist';
import LoanActivity from 'containers/LoanActivity';
import DashboardModel from 'models/Dashboard';
import { withRouter } from 'react-router-dom';
import CustomSnackBar from 'components/CustomSnackBar';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import './EvaluationPage.css';

function isNotLoanActivity(group) {
  return group !== DashboardModel.LOAN_ACTIVITY;
}
class EvaluationPage extends React.PureComponent {
  renderDashboard() {
    const { group } = this.props;
    switch (group) {
      case DashboardModel.BEUW:
        return <BackendDisposition />;
      case DashboardModel.FEUW_TASKS_AND_CHECKLIST:
        return <TasksAndChecklist />;
      case DashboardModel.PROC:
        return <TasksAndChecklist />;
      case DashboardModel.LOAN_ACTIVITY:
        return <LoanActivity />;
      default:
        return <FrontEndDisposition />;
    }
  }

  renderSnackBar() {
    const { group, snackBarData, closeSnackBar } = this.props;
    const page = DashboardModel.PAGE_LOOKUP.find(pageInstance => pageInstance.group === group);
    const hasCommentsWidget = !R.isNil(page) ? page.hasCommentsWidget : false;
    if (hasCommentsWidget) {
      return (
        <CustomSnackBar
          message={snackBarData && snackBarData.message}
          onClose={closeSnackBar}
          open={snackBarData && snackBarData.open}
          type={snackBarData && snackBarData.type}
        />
      );
    }

    return null;
  }

  render() {
    const { location, group } = this.props;
    const el = DashboardModel.PAGE_LOOKUP.find(page => page.path === location.pathname);
    const title = el.task;
    return (
      <>
        <ContentHeader title={title}>
          <Controls
            showEndShift={isNotLoanActivity(group)}
            showGetNext={isNotLoanActivity(group)}
            showSendToUnderWritingIcon={!isNotLoanActivity(group)}
            showValidate={isNotLoanActivity(group)}
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          {this.renderSnackBar()}
          {this.renderDashboard()}
        </FullHeightColumn>
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
};

EvaluationPage.propTypes = {
  closeSnackBar: PropTypes.func.isRequired,
  group: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  snackBarData: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  snackBarData: notificationSelectors.getSnackBarState(state),
});

const mapDispatchToProps = dispatch => ({
  closeSnackBar: notificationOperations.closeSnackBar(dispatch),
});

const EvaluationPageContainer = connect(mapStateToProps, mapDispatchToProps)(EvaluationPage);

const TestHooks = {
  EvaluationPage,
};

export default withRouter(EvaluationPageContainer);

export { TestHooks };
