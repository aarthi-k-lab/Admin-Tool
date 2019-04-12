import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';
import RadioButtonGroup from 'components/RadioButtonGroup';
import Loader from 'components/Loader/Loader';
import dispositionOptions from 'constants/dispositionOptions';
import DispositionModel from 'models/Disposition';
import DashboardErrors from 'models/DashboardErrors';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import { operations as commentoperations } from '../../../state/ducks/comments';
import CommentBox from '../../../components/CommentBox/CommentBox';
import './FrontEndDisposition.css';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';

const getContextTaskName = (groupName) => {
  let taskName = '';
  switch (groupName) {
    case 'FEUW':
      taskName = 'Income Calculation Review';
      break;
    case 'BEUW':
      taskName = 'Underwriting Review';
      break;
    case 'PROC':
      taskName = 'Processing Review';
      break;
    default:
      taskName = groupName;
      break;
  }
  return taskName;
};

class Disposition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      refreshHook: false,
      canSubmit: true,
    };
    this.onCommentChange = this.onCommentChange.bind(this);
    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidUpdate() {
    const {
      enableGetNext, onPostComment, LoanNumber, ProcIdType, EvalId,
      user, groupName, dispositionReason, AppName, EventName, TaskId,
    } = this.props;
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
          TASK_ACTN: dispositionReason,
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
    const { enableGetNext } = props;
    const { content } = prevState;
    if (enableGetNext) {
      return ({ content: '', refreshHook: false });
    }
    return ({ content });
  }

  handleDispositionSelection(option) {
    const { dispositionReason, onDispositionSelect } = this.props;
    const { onClear } = this.props;
    this.setState({ refreshHook: false });
    this.setState({ canSubmit: true });
    if (dispositionReason && option !== dispositionReason) {
      onClear();
    }
    onDispositionSelect(option);
  }

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason, groupName } = this.props;
    const { content } = this.state;
    const checkDisposition = (dispositionReason !== 'allTasksCompleted' && content !== '');
    const checkApproval = dispositionReason === 'allTasksCompleted';
    this.savedComments = content;
    this.setState({ refreshHook: true });
    const checkSubmit = dispositionReason && (checkDisposition || checkApproval);
    if (checkSubmit) {
      const payload = { dispositionReason, group: groupName };
      onDispositionSaveTrigger(payload);
      this.setState({ refreshHook: false });
    }
    this.setState({ canSubmit: checkSubmit });
  }

  renderSave(isAssigned) {
    const {
      dispositionErrorMessages,
      dispositionReason,
      saveInProgress,
      enableGetNext,
    } = this.props;
    if (saveInProgress) {
      return (
        <Loader />
      );
    }
    return (
      <Button
        className="material-ui-button"
        color="primary"
        disabled={!dispositionReason || enableGetNext || !isAssigned}
        onClick={this.handleSave}
        styleName="save-button"
        variant="contained"
      >
        {dispositionErrorMessages.length ? 'Retry' : 'Save'}
      </Button>
    );
  }

  render() {
    const {
      noTasksFound, dispositionReason, inProgress, enableGetNext,
      taskFetchError, isAssigned,
      dispositionErrorMessages,
      user,
      showAssign,
    } = this.props;
    const { content, canSubmit, refreshHook } = this.state;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <div styleName="scrollable-block">
          <section styleName="disposition-section">
            {
              (noTasksFound || taskFetchError) ? DashboardErrors.renderErrorNotification(
                dispositionReason,
                enableGetNext, isAssigned, noTasksFound, taskFetchError,
                dispositionErrorMessages,
                user,
                showAssign,
              ) : (
                <>
                  <header styleName="title">Please select the outcome of your review</header>
                  {DashboardErrors.renderErrorNotification(
                    dispositionReason,
                    enableGetNext, isAssigned, noTasksFound, taskFetchError,
                    dispositionErrorMessages,
                    user,
                    showAssign,
                  )}
                  <RadioButtonGroup
                    clearSelectedDisposition={R.isEmpty(dispositionReason)}
                    disableDisposition={enableGetNext || !isAssigned}
                    items={dispositionOptions}
                    name="disposition-options"
                    onChange={this.handleDispositionSelection}
                  />
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
  noTasksFound: false,
  taskFetchError: false,
  inProgress: false,
  saveInProgress: false,
  AppName: 'CMOD',
  EventName: 'UW',
  ProcIdType: 'EvalID',
  groupName: '',
};

Disposition.propTypes = {
  AppName: PropTypes.string,
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispositionReason: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  EvalId: PropTypes.number.isRequired,
  EventName: PropTypes.string,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  LoanNumber: PropTypes.number.isRequired,
  noTasksFound: PropTypes.bool,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
  onPostComment: PropTypes.func.isRequired,
  ProcIdType: PropTypes.string,
  saveInProgress: PropTypes.bool,
  showAssign: PropTypes.bool.isRequired,
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
  dispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  dispositionReason: selectors.getDisposition(state),
  enableGetNext: selectors.enableGetNext(state),
  inProgress: selectors.inProgress(state),
  noTasksFound: selectors.noTasksFound(state),
  saveInProgress: selectors.saveInProgress(state),
  isAssigned: selectors.isAssigned(state),
  taskFetchError: selectors.taskFetchError(state),
  showAssign: selectors.showAssign(state),
  user: loginSelectors.getUser(state),
  EvalId: selectors.evalId(state),
  TaskId: selectors.taskId(state),
  groupName: selectors.groupName(state),
  LoanNumber: selectors.loanNumber(state),
});

const mapDispatchToProps = dispatch => ({
  onClear: operations.onClearDisposition(dispatch),
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
  onDispositionSelect: operations.onDispositionSelect(dispatch),
  onPostComment: commentoperations.postComment(dispatch),
});

const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);

const TestHooks = {
  Disposition,
};

export default DispositionContainer;

export {
  TestHooks,
};
