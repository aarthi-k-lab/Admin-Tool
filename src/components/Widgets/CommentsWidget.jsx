
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import moment from 'moment-timezone';
import * as R from 'ramda';
import DashboardModel from 'models/Dashboard';
import { selectors, operations } from '../../state/ducks/comments';
import './CommentsWidget.css';
import { selectors as dashboardSelectors } from '../../state/ducks/dashboard';
import { selectors as loginSelectors } from '../../state/ducks/login';

const formatDateWithoutTimeZone = (date) => {
  if (date) {
    const newDate = moment(`${date}Z`).tz('America/Chicago').format('MMMM DD YYYY h:mm A');
    return newDate;
  }
  return null;
};

const getFullName = (comments, userName) => {
  if (comments.userName === userName) return 'you';
  return comments.userName;
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
    case 'PROC':
      taskName = 'Processing Review';
      break;
    default:
      taskName = groupName;
      break;
  }
  return taskName;
};

const getContextData = (Context) => {
  try {
    const context = JSON.parse(Context);
    const taskName = getContextTaskName(context.task ? context.task : context.TASK);
    return (R.isNil(context.TASK_ACTN) || R.isEmpty(context.TASK_ACTN)) ? `${taskName}` : `${taskName} - ${context.TASK_ACTN}`;
  } catch (e) {
    return '';
  }
};

const showLoader = () => (
  <div styleName="circular-progress-loader">
    <CircularProgress
      left={10}
      size={40}
      status="loading"
      top={-10}
    />
  </div>
);

const renderNoCommentsArea = () => (
  <span styleName="no-comments-area">No Comments</span>
);

class CommentsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      content: '',
    };
    this.commentArea = React.createRef();
    this.loadComments = this.loadComments.bind(this);
    this.saveComments = this.saveComments.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.showCommentsArea = this.showCommentsArea.bind(this);
    this.renderCommentsActivity = this.renderCommentsActivity.bind(this);
  }

  componentDidMount() {
    this.loadComments();
  }

  componentDidUpdate() {
    this.commentArea.scrollTop = this.commentArea.scrollHeight;
  }

  onCommentChange(event) {
    if (event.charCode === 13 || event.key === 'Enter') {
      event.preventDefault();
      if (event.target.value !== '') {
        this.saveComments();
        this.setState({ content: '' });
      }
    } else {
      this.setState({ content: event.target.value });
    }
  }

  loadComments() {
    const {
      AppName,
      LoanNumber,
      ProcessId,
      ProcIdType,
      onGetComments,
      groupName,
    } = this.props;

    const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
    const eventName = !R.isNil(page) ? page.taskCode : '';

    const payload = {
      applicationName: AppName,
      loanNumber: LoanNumber,
      processIdType: ProcIdType,
      processId: ProcessId,
      eventName,
    };
    onGetComments(payload);
    this.setState({ Loader: false });
  }

  saveComments() {
    const {
      content,
    } = this.state;
    const {
      AppName,
      LoanNumber,
      ProcessId,
      ProcIdType,
      TaskId,
      taskIterationCounter,
      User,
      onPostComment,
      groupName,
    } = this.props;

    const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
    const eventName = !R.isNil(page) ? page.taskCode : '';
    const taskName = !R.isNil(page) ? page.task : '';

    const payload = {
      applicationName: AppName,
      loanNumber: LoanNumber,
      processIdType: ProcIdType,
      processId: ProcessId,
      eventName,
      comment: content,
      commentContext: JSON.stringify({
        TASK: taskName,
        TASK_ID: TaskId,
        processId: ProcessId,
        TASK_ITRN_CNTR: taskIterationCounter,
      }),
      userName: User.userDetails.name,
      createdDate: new Date().toJSON(),
    };

    onPostComment(payload);
    this.loadComments();
    this.setState({ content: '' });
  }

  showCommentsArea() {
    const { comments, User } = this.props;
    return (
      comments.map(comment => (
        <div
          key={comment.userName}
          id="row_main_container"
          styleName={comment.userName === User.userDetails.name ? 'row-main-container-right' : 'row-main-container-left'}
        >
          <div id="row_header" styleName="row-header">
            <div styleName={comment.userName === User.userDetails.name ? 'messagee-body-current-user' : 'message-body-other-user'}>
              {comment.comment}
              <div styleName="message-body-bottom" />
              <div>
                <span styleName="user-name">{getFullName(comment, User.userDetails.name)}</span>
                <span styleName="display-date">{formatDateWithoutTimeZone(comment.createdDate)}</span>
              </div>
              <div styleName="check-icon-style">
                <CheckCircleIcon styleName="check-circle-icon" />
                <span styleName="disposition-selected">{getContextData(comment.commentContext)}</span>
              </div>
            </div>
          </div>
        </div>
      ))
    );
  }

  renderCommentsActivity() {
    const { comments, LoanNumber, EvalId } = this.props;
    const { content } = this.state;
    return (
      <>
        <div styleName="comment-header">Comments</div>
        <div id="comment_main" styleName="comment-main-style">
          <div ref={(ref) => { this.commentArea = ref; }} styleName="comment-area">
            { comments && comments.length ? this.showCommentsArea() : renderNoCommentsArea()}
          </div>
          <div id="send_area" styleName="send-area">
            <div id="send_text_area" styleName="send-text-area">
              <TextField
                InputProps={{ style: { fontSize: '1.1rem' } }}
                multiline
                onChange={event => this.onCommentChange(event)}
                onKeyPress={event => this.onCommentChange(event)}
                placeholder="Enter Comment"
                rowsMax="4"
                style={{ width: '100%', height: '5.75rem' }}
                value={content}
              />
            </div>
            <div id="send_button_area" styleName="send-button-area">
              <Button
                color="primary"
                disabled={content.length === 0 || LoanNumber === null || EvalId === null}
                id="post_button"
                onClick={this.saveComments}
                styleName="post-button"
                variant="contained"
              >
                POST
              </Button>
            </div>
          </div>
        </div>
      </>);
  }

  render() {
    const { Loader } = this.state;
    return (
      Loader ? showLoader() : this.renderCommentsActivity()
    );
  }
}

const TestHooks = {
  CommentsWidget,
};

CommentsWidget.propTypes = {
  AppName: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
  })).isRequired,
  EvalId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  LoanNumber: PropTypes.string.isRequired,
  onGetComments: PropTypes.func.isRequired,
  onPostComment: PropTypes.func.isRequired,
  ProcessId: PropTypes.number.isRequired,
  ProcIdType: PropTypes.string,
  TaskId: PropTypes.number.isRequired,
  taskIterationCounter: PropTypes.number.isRequired,
  User: PropTypes.shape({
    userDetails: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

CommentsWidget.defaultProps = {
  AppName: 'CMOD',
  ProcIdType: 'WF_PRCS_ID',
  groupName: '',
};

const mapStateToProps = state => ({
  comments: selectors.getCommentsData(state),
  // Disposition: dashboardSelectors.getDisposition(state),
  EvalId: dashboardSelectors.evalId(state),
  TaskId: dashboardSelectors.taskId(state),
  LoanNumber: dashboardSelectors.loanNumber(state),
  ProcessId: dashboardSelectors.processId(state),
  groupName: dashboardSelectors.groupName(state),
  taskIterationCounter: dashboardSelectors.taskIterationCounter(state),
  User: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  onGetComments: operations.getComments(dispatch),
  onPostComment: operations.postComment(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsWidget);

export {
  TestHooks,
};
