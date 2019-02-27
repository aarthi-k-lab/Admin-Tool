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
import './EvaluationPage.css';

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
    return (
      <>
        <ContentHeader title="Income Calculation">
          <Controls
            showEndShift
            showGetNext
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
};

export default EvaluationPage;
