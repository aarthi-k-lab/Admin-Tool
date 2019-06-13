import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';
import RadioButtonGroup from 'components/RadioButtonGroup';
import Loader from 'components/Loader/Loader';
import dispositionOptions from 'constants/dispositionOptions';
import DispositionModel from 'models/Disposition';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import DashboardModel from 'models/Dashboard';
import CustomSnackBar from 'components/CustomSnackBar';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import { selectors as loginSelectors } from 'ducks/login';
import { operations as commentoperations } from '../../../state/ducks/comments';
import CommentBox from '../../../components/CommentBox/CommentBox';
import './FrontEndDisposition.css';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';

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
    this.renderSnackBar = this.renderSnackBar.bind(this);
  }

  componentDidUpdate() {
    const {
      enableGetNext, onPostComment, LoanNumber, ProcIdType, EvalId,
      user, groupName, dispositionReason, AppName, TaskId,
    } = this.props;
    const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
    const eventName = !R.isNil(page) ? page.taskCode : '';
    const taskName = !R.isNil(page) ? page.task : '';
    if (enableGetNext && this.savedComments) {
      const commentsPayload = {
        applicationName: AppName,
        loanNumber: LoanNumber,
        processIdType: ProcIdType,
        processId: EvalId,
        eventName,
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

  renderSnackBar() {
    const { snackBarData, closeSnackBar } = this.props;
    return (
      <CustomSnackBar
        message={snackBarData && snackBarData.message}
        onClose={closeSnackBar}
        open={snackBarData && snackBarData.open}
        type={snackBarData && snackBarData.type}
      />
    );
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
      taskFetchError, isAssigned, isTasksLimitExceeded,
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
            {this.renderSnackBar()}
            {
              (noTasksFound || taskFetchError || isTasksLimitExceeded)
                ? DashboardModel.Messages.renderErrorNotification(
                  dispositionReason,
                  enableGetNext, isAssigned, noTasksFound, taskFetchError,
                  dispositionErrorMessages,
                  user,
                  showAssign,
                  isTasksLimitExceeded,
                ) : (
                  <>
                    <header styleName="title">Please select the outcome of your review</header>
                    { DashboardModel.Messages.renderErrorNotification(
                      dispositionReason,
                      enableGetNext, isAssigned, noTasksFound, taskFetchError,
                      dispositionErrorMessages,
                      user,
                      showAssign,
                      isTasksLimitExceeded,
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
  isTasksLimitExceeded: false,
  taskFetchError: false,
  inProgress: false,
  saveInProgress: false,
  AppName: 'CMOD',
  ProcIdType: 'WF_PRCS_ID',
  groupName: '',
};

Disposition.propTypes = {
  AppName: PropTypes.string,
  closeSnackBar: PropTypes.func.isRequired,
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispositionReason: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  EvalId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  isTasksLimitExceeded: PropTypes.bool,
  LoanNumber: PropTypes.number.isRequired,
  noTasksFound: PropTypes.bool,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
  onPostComment: PropTypes.func.isRequired,
  ProcIdType: PropTypes.string,
  saveInProgress: PropTypes.bool,
  showAssign: PropTypes.bool.isRequired,
  snackBarData: PropTypes.node.isRequired,
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
  snackBarData: notificationSelectors.getSnackBarState(state),
  dispositionReason: selectors.getDisposition(state),
  enableGetNext: selectors.enableGetNext(state),
  inProgress: selectors.inProgress(state),
  noTasksFound: selectors.noTasksFound(state),
  saveInProgress: selectors.saveInProgress(state),
  isAssigned: selectors.isAssigned(state),
  taskFetchError: selectors.taskFetchError(state),
  isTasksLimitExceeded: selectors.isTasksLimitExceeded(state),
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
  closeSnackBar: notificationOperations.closeSnackBar(dispatch),
});

const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);

const TestHooks = {
  Disposition,
};

export default DispositionContainer;

export {
  TestHooks,
};
