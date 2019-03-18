import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import FrontEndDisposition from 'containers/Dashboard/FrontEndDisposition';
import { BackendDisposition } from 'containers/Dashboard/BackEndDisposition';
import Tombstone from 'containers/Dashboard/Tombstone';
import TasksAndChecklist from 'containers/Dashboard/TasksAndChecklist';
import DashboardModel from 'models/Dashboard';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectors } from 'ducks/dashboard';
import DispositionModel from 'models/Disposition';
import UserNotification from 'components/UserNotification/UserNotification';
import Center from 'components/Center';
import './EvaluationPage.css';
import Trail from 'containers/Trail';

class EvaluationPage extends React.PureComponent {
  renderDashboard() {
    const { group } = this.props;
    switch (group) {
      case DashboardModel.BEUW:
        return <BackendDisposition />;
      case DashboardModel.FEUW_TASKS_AND_CHECKLIST:
        return <TasksAndChecklist />;
      default:
        return <FrontEndDisposition />;
    }
  }

  render() {
    const { location, message } = this.props;
    const title = location.pathname === '/backend-evaluation' ? 'UNDERWRITING' : 'Income Calculation';
    return (
      <>
        <ContentHeader title={title}>
          {message && message.length ? (
            <Center>
              <span styleName="notif">
                <UserNotification
                  level="error"
                  message={message}
                  type="alert-box"
                />
              </span>
            </Center>
          ) : null}
          <Controls
            showEndShift
            showGetNext
            showValidate
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          {/* { this.renderDashboard() } */}
          <Trail />
        </FullHeightColumn>
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
  message: null,
};

EvaluationPage.propTypes = {
  group: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string,
};

const mapStateToProps = state => ({
  message: DispositionModel.getErrorMessages(
    selectors.getChecklistDiscrepancies(state),
  ),
});

const TestHooks = {
  EvaluationPage,
};

export default connect(mapStateToProps, null)(withRouter(EvaluationPage));

export { TestHooks };
