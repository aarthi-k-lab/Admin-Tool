/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as milestoneSelector, operations as milestoneOperations } from 'ducks/milestone-activity';
import { selectors as dashSelectors } from 'ducks/dashboard';
import { withRouter } from 'react-router-dom';
import MilestonePage from './MilestonePage';

class MilestoneActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
    };
    this.onStagerTaskClick = this.onStagerTaskClick.bind(this);
    this.onClickMilestone = this.onClickMilestone.bind(this);
    this.renderBpm = this.renderBpm.bind(this);
  }

  componentDidMount() {
    const { loadMlstn, processId } = this.props;
    if (processId) {
      loadMlstn(processId);
    } else {
      this.setState(
        { isRedirect: true },
      );
    }
  }

  componentWillUnmount() {
    const { clearData } = this.props;
    clearData();
  }

  onStagerTaskClick(processId, taskCategory, creDttm1, creDttm2) {
    const { getTasksByTaskCategory } = this.props;
    const taskCategoryTmp = taskCategory.replace(' ', '');
    const payload = `{"prcsId": "${processId}", "taskCategory": "${taskCategoryTmp}", "creDttmMin": "${creDttm1}", "creDttmMax": "${creDttm2}"}`;
    getTasksByTaskCategory(JSON.parse(payload));
  }

  onClickMilestone() {
    const { clearTasks } = this.props;
    clearTasks();
  }

  renderBpm() {
    const { isRedirect } = this.state;
    const { history } = this.props;
    if (isRedirect) {
      const location = { pathname: '/' };
      history.push(location);
    }
  }

  render() {
    const {
      inProgress,
      inProgressTask,
      groupTask,
      tasks,
      processId,
      inSearchPage,
    } = this.props;
    return (
      <>
        { this.renderBpm() }
        <MilestonePage
          groupTask={groupTask}
          inProgress={inProgress}
          inProgressTask={inProgressTask}
          inSearchPage={inSearchPage}
          onClickMilestone={() => this.onClickMilestone()}
          onStagerTaskClick={
            (taskCategory, creDttm1, creDttm2) => this.onStagerTaskClick(
              processId, taskCategory, creDttm1, creDttm2,
            )
          }
          prcsId={processId}
          tasks={tasks}
        />
      </>
    );
  }
}

const TestHooks = {
  MilestoneActivity,
};

MilestoneActivity.propTypes = {
  clearData: PropTypes.func.isRequired,
  getTasksByTaskCategory: PropTypes.func.isRequired,
  groupTask: PropTypes.arrayOf(
    PropTypes.shape({
      asgnDttm: PropTypes.string,
      asgnUsrNm: PropTypes.string,
      creDttm: PropTypes.string,
      currSts: PropTypes.string,
      currStsDttm: PropTypes.string,
      dueDttm: PropTypes.string,
      mlstnNm: PropTypes.string,
      taskId: PropTypes.string,
      taskName: PropTypes.string,
    }),
  ).isRequired,
  inProgress: PropTypes.bool,
  inSearchPage: PropTypes.bool,
  loadMlstn: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      creDttm: PropTypes.string,
      currSts: PropTypes.string,
      currStsDttm: PropTypes.string,
      dueDt: PropTypes.string,
      id: PropTypes.string,
      taskNm: PropTypes.string,
    }),
  ).isRequired,
};

MilestoneActivity.defaultProps = {
  inProgress: false,
  inSearchPage: false,
};

const mapStateToProps = state => ({
  inProgress: milestoneSelector.inProgress(state),
  inProgressTask: milestoneSelector.inProgressTask(state),
  groupTask: milestoneSelector.getMlstnData(state),
  tasks: milestoneSelector.getTasksData(state),
  processId: dashSelectors.processId(state),
  evalId: dashSelectors.evalId(state),
  processStatus: dashSelectors.processStatus(state),
});

const mapDispatchToProps = dispatch => ({
  loadMlstn: milestoneOperations.loadMlstn(dispatch),
  getTasksByTaskCategory: milestoneOperations.getTasksByTaskCategory(dispatch),
  clearTasks: milestoneOperations.clearTasks(dispatch),
  clearData: milestoneOperations.clearMlstnDatas(dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MilestoneActivity));
export { TestHooks };
