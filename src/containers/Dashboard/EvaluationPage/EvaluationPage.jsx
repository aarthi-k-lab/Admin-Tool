import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import FrontEndDisposition from 'containers/Dashboard/FrontEndDisposition';
import { BackendDisposition } from 'containers/Dashboard/BackEndDisposition';
import DocProcessing from 'containers/Dashboard/DocProcessing';
import Tombstone from 'containers/Dashboard/Tombstone';
import TasksAndChecklist from 'containers/Dashboard/TasksAndChecklist';
import DashboardModel from 'models/Dashboard';
import { withRouter } from 'react-router-dom';
import './EvaluationPage.css';
// import Trail from 'containers/Trail';

class EvaluationPage extends React.PureComponent {
  renderDashboard() {
    const { group } = this.props;
    switch (group) {
      case DashboardModel.BEUW:
        return <BackendDisposition />;
      case DashboardModel.FEUW_TASKS_AND_CHECKLIST:
        return <TasksAndChecklist />;
      case DashboardModel.DP:
        return <DocProcessing />;
      default:
        return <FrontEndDisposition />;
    }
  }

  render() {
    const { location } = this.props;
    const el = DashboardModel.PAGE_LOOKUP.find(page => page.path === location.pathname);
    const title = el.task;
    return (
      <>
        <ContentHeader title={title}>
          <Controls
            showEndShift
            showGetNext
            showValidate
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          { this.renderDashboard() }
        </FullHeightColumn>
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
};

EvaluationPage.propTypes = {
  group: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const TestHooks = {
  EvaluationPage,
};

export default withRouter(EvaluationPage);

export { TestHooks };
