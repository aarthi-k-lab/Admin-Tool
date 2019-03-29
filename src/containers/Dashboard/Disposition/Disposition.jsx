import React, { Component } from 'react';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import { selectors as loginSelectors } from 'ducks/login';
import { arrayToString } from 'lib/ArrayUtils';
import RouteAccess from 'lib/RouteAccess';
import { selectors, operations } from 'ducks/dashboard';
import { operations as commentoperations } from 'ducks/comments';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import CardCreator from './CardCreator';
import './Disposition.css';
import CommentBox from '../../../components/CommentBox/CommentBox';

const shouldExpand = (isExpanded, item, id) => {
  if (isExpanded) return item.id === id;
  return (item.id === id ? false : item.expanded);
};
const getContextTaskName = (groupName) => {
  let taskName = '';
  switch (groupName) {
    case 'FEUW':
      taskName = 'Income Calculation Review';
      break;
    case 'BEUW':
      taskName = 'Underwriting Review';
      break;
    default:
      taskName = groupName;
      break;
  }
  return taskName;
};
class Disposition extends Component {
  constructor(props) {
    super(props);
    const { status } = this.props;
    this.handleSave = this.handleSave.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.renderErrorNotification = this.renderErrorNotification.bind(this);
    this.getErrorMessages = this.getErrorMessages.bind(this);
    this.state = {
      status,
      operate: 'ExpandAll',
      refreshHook: false,
      selectedStatus: {
        Name: '',
        isExpanded: false,
      },
      selectedActivity: '',
      content: '',
      canSubmit: true,
    };
  }

  componentDidUpdate() {
    const {
      enableGetNext, selectedDisposition, onPostComment, AppName, LoanNumber, EvalId,
      EventName, groupName, user, ProcIdType, TaskId,
    } = this.props;
    const { activityName } = selectedDisposition;
    const taskName = getContextTaskName(groupName);
    if (enableGetNext && this.savedComments) {
      const commentsPayload = {
        applicationName: AppName,
        loanNumber: LoanNumber,
        processIdType: ProcIdType,
        processId: EvalId,
        eventName: EventName,
        comment: this.savedComments,
        userName: user.userDetails.name,
        createdDate: new Date().toJSON(),
        commentContext: JSON.stringify({
          TASK: taskName,
          TASK_ID: TaskId,
          TASK_ACTN: activityName,
          DSPN_IND: 1,
        }),
      };
      onPostComment(commentsPayload);
      this.savedComments = '';
    }
  }

  onCommentChange(event) {
    if (event.target.value !== '') this.setState({ canSubmit: true });
    this.setState({ content: event.target.value });
  }

  static getDerivedStateFromProps(props, prevState) {
    const { enableGetNext, selectedDisposition } = props;
    const { onClearBE } = props;
    if (!selectedDisposition || (enableGetNext && selectedDisposition.isActivitySelected)) {
      const { status } = prevState;
      const changedStatus = status.map(item => ({
        ...item,
        labelDisplay: 'none',
        expanded: false,
        selectedStatus: {},
      }));
      onClearBE();
      return ({ operate: 'CollapseAll', status: changedStatus });
    }
    if (enableGetNext) return ({ content: '', refreshHook: false });
    return prevState;
  }

  setSelectionLabel(id, cardStatus, activityName) {
    const { status } = this.state;
    this.setState({
      selectedStatus: cardStatus,
      selectedActivity: activityName,
    });
    const changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        labelDisplay: (item.id !== id) ? 'none' : 'block',
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus, canSubmit: true });
  }

  getErrorMessages() {
    const {
      beDispositionErrorMessages: errorMessages,
      enableGetNext,
      showAssign,
      user,
      isAssigned,
      selectedDisposition,
    } = this.props;
    const { activityName } = selectedDisposition;
    const groups = user && user.groupList;
    let level = 'error';
    let message = null;

    if (errorMessages.length > 0) {
      message = errorMessages.reduce(
        (acc, msg) => {
          acc.push(msg);
          acc.push(<br key={msg} />);
          return acc;
        },
        [],
      );
    } else if (RouteAccess.hasManagerDashboardAccess(groups) && showAssign) {
      message = 'Please click Unassign to unassign the task from the user.';
    } else if (showAssign) {
      message = 'Please note only Manager can unassign the task.';
    } else if (!isAssigned) {
      message = 'WARNING – You are not assigned to this task. Please select “Assign to Me” to begin working.';
    } else if (enableGetNext) {
      message = `The task has been dispositioned successfully with disposition ${arrayToString([activityName])}`;
      level = 'success';
    }

    return { level, message };
  }

  handleSave() {
    const { content } = this.state;
    const {
      onDispositionSaveTrigger, selectedDisposition, groupName, saveValidation,
    } = this.props;
    this.savedComments = content;
    this.setState({ refreshHook: true });
    const checkSubmit = saveValidation(content);
    if (checkSubmit) {
      const payload = { dispositionReason: selectedDisposition.activityName, group: groupName };
      onDispositionSaveTrigger(payload);
      this.setState({ refreshHook: true });
    }
    this.setState({ canSubmit: checkSubmit });
  }

  collapseOthers(id, cardStatus, activityName) {
    const { status } = this.state;
    this.setState({ selectedStatus: cardStatus, selectedActivity: activityName });
    let changedStatus = null;
    changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        expanded: shouldExpand(cardStatus.isExpanded, item, id),
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus, operate: 'ExpandAll' });
  }


  handleExpandAll() {
    const { operate, status } = this.state;
    const { selectedDisposition } = this.props;
    if (selectedDisposition) {
      const { cardStatus } = selectedDisposition;
      this.setState({ selectedStatus: cardStatus });
    }
    const statuses = status.map(m => ({
      ...m,
      expanded: operate === 'ExpandAll',
    }));
    const changeOperate = operate === 'ExpandAll' ? 'CollapseAll' : 'ExpandAll';
    this.setState({ status: statuses, operate: changeOperate });
  }

  renderSave(isAssigned) {
    const {
      beDispositionErrorMessages,
      selectedDisposition,
      saveInProgress,
      enableGetNext,
    } = this.props;
    const { activityName } = selectedDisposition;
    if (saveInProgress) {
      return (
        <Loader />
      );
    }
    return (
      <Button
        className="material-ui-button"
        color="primary"
        disabled={!activityName || enableGetNext || !isAssigned}
        onClick={this.handleSave}
        styleName="save-button"
        variant="contained"
      >
        {beDispositionErrorMessages.length ? 'Retry' : 'Save'}
      </Button>
    );
  }

  renderTaskErrorMessage() {
    const { noTasksFound, taskFetchError } = this.props;
    const warningMessage = 'No tasks assigned.Please contact your manager';
    if (taskFetchError) {
      const errorMessage = 'Task Fetch Failed.Please try again Later';
      return (
        <UserNotification level="error" message={errorMessage} type="alert-box" />
      );
    }
    if (noTasksFound) {
      return (
        <UserNotification level="error" message={warningMessage} type="alert-box" />
      );
    }
    return null;
  }

  renderErrorNotification() {
    const { level, message } = this.getErrorMessages();
    if (!R.isNil(message)) {
      return (
        <UserNotification level={level} message={message} type="alert-box" />
      );
    }
    return null;
  }

  render() {
    const {
      status, operate, selectedStatus, selectedActivity, content, refreshHook, canSubmit,
    } = this.state;
    const {
      selectedDisposition,
      inProgress,
      enableGetNext, isAssigned, noTasksFound, taskFetchError,
    } = this.props;
    const { activityName } = selectedDisposition;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    const sameDispositionNotSelected = selectedDisposition
    && (selectedDisposition.cardStatus !== selectedStatus
    || selectedDisposition.activityName !== selectedActivity);
    if (sameDispositionNotSelected) {
      const {
        id,
        cardStatus,
        isActivitySelected,
      } = selectedDisposition;
      if (isActivitySelected) {
        this.setSelectionLabel(id, cardStatus, activityName);
      } else {
        this.collapseOthers(id, cardStatus, activityName);
      }
    }
    return (
      <>
        <div styleName="scrollable-block">
          <section styleName="disposition-section">
            {
        (noTasksFound || taskFetchError) ? this.renderTaskErrorMessage() : (
          <>
            <header styleName="para-title">
          Select the outcome of your review
            </header>
            {this.renderErrorNotification(isAssigned, activityName)}
            <button
              disabled={enableGetNext || !isAssigned}
              onClick={() => this.handleExpandAll()}
              styleName="OperateButton"
              type="submit"
            >
              {operate}
            </button>
            { status.map(m => (
              <CardCreator
                disabled={enableGetNext || !isAssigned}
                selectedActivity={selectedActivity}
                status={m}
              />
            ))}
            <CommentBox
              content={content}
              onCheck={canSubmit}
              onCommentChange={this.onCommentChange}
              onRefresh={refreshHook}
            />
            {this.renderSave(isAssigned)}
          </>
        )
          }
          </section>
        </div>
        <WidgetBuilder />
      </>
    );
  }
}
Disposition.defaultProps = {
  enableGetNext: false,
  inProgress: false,
  selectedDisposition: {
    cardStatus: {
      Name: '',
      isExpanded: false,
    },
  },
  saveInProgress: false,
  beDispositionErrorMessages: [],
  noTasksFound: false,
  taskFetchError: false,
  AppName: 'CMOD',
  EventName: 'UW',
  ProcIdType: 'EvalID',
  groupName: '',
};
Disposition.propTypes = {
  AppName: PropTypes.string,
  beDispositionErrorMessages: PropTypes.arrayOf(PropTypes.string),
  enableGetNext: PropTypes.bool,
  EvalId: PropTypes.number.isRequired,
  EventName: PropTypes.string,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  LoanNumber: PropTypes.number.isRequired,
  noTasksFound: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  onClearBE: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onPostComment: PropTypes.func.isRequired,
  ProcIdType: PropTypes.string,
  saveInProgress: PropTypes.bool,
  saveValidation: PropTypes.func.isRequired,
  selectedDisposition: PropTypes.shape({
    activityName: PropTypes.string,
    cardStatus: PropTypes.shape({
      isExpanded: PropTypes.bool,
      Name: PropTypes.string,
    }),
    id: PropTypes.string,
    isActivitySelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
  }),
  showAssign: PropTypes.bool.isRequired,
  status: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  taskFetchError: PropTypes.bool,
  TaskId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};
const mapStateToProps = state => ({
  selectedDisposition: selectors.getDisposition(state),
  beDispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  enableGetNext: selectors.enableGetNext(state),
  isAssigned: selectors.isAssigned(state),
  EvalId: selectors.evalId(state),
  TaskId: selectors.taskId(state),
  groupName: selectors.groupName(state),
  LoanNumber: selectors.loanNumber(state),
  saveInProgress: selectors.saveInProgress(state),
  showAssign: selectors.showAssign(state),
  noTasksFound: selectors.noTasksFound(state),
  taskFetchError: selectors.taskFetchError(state),
  user: loginSelectors.getUser(state),
});
const mapDispatchToProps = dispatch => ({
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
  onPostComment: commentoperations.postComment(dispatch),
  onClearBE: operations.onClearBEDisposition(dispatch),
});
const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);
const TestHooks = {
  Disposition,
};
export default DispositionContainer;
export {
  TestHooks,
};
