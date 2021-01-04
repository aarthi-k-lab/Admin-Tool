import React from 'react';
import * as R from 'ramda';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import Loader from 'components/Loader/Loader';
import Tombstone from 'containers/Dashboard/Tombstone';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import PropTypes from 'prop-types';
import DashboardModel from 'models/Dashboard';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './DocsInGoBack.css';

class DocsInGoBack extends React.PureComponent {
  constructor(props) {
    super(props);
    const { onCleanResult } = props;
    onCleanResult();
  }

  componentDidUpdate() {
    const {
      onPostComment, LoanNumber, ProcIdType, EvalId,
      user, groupName, dispositionReason, AppName, TaskId,
    } = this.props;
    const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
    const eventName = !R.isNil(page) ? page.taskCode : '';
    const taskName = 'Mod Booked';
    if (this.savedComments) {
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

  render() {
    const { inProgress, user } = this.props;
    const showButton = user.groupList.includes('docsin-mgr');
    const title = 'Send Back Docs In';
    const { resultOperation } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <ContentHeader title={title}>
          <Controls
            showSendToBooking={showButton}
            showSendToDocsIn={showButton}
          />
        </ContentHeader>
        <Tombstone />
        <WidgetBuilder />
        <div style={{ paddingTop: '0.1rem', paddingBottom: '0' }} styleName="title-row">
          {(resultOperation && resultOperation.status)
            ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
            : ''
          }
        </div>
      </>
    );
  }
}

DocsInGoBack.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  AppName: 'CMOD',
  ProcIdType: 'ProcessId',
  groupName: 'DOCS_IN_BACK',
  onCleanResult: () => {},
  // location: {
  //   pathname: '',
  // },
};

DocsInGoBack.propTypes = {
  AppName: PropTypes.string,
  dispositionReason: PropTypes.string.isRequired,
  EvalId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  LoanNumber: PropTypes.number.isRequired,
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  onCleanResult: PropTypes.func,
  onPostComment: PropTypes.func.isRequired,
  ProcIdType: PropTypes.string,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  TaskId: PropTypes.number.isRequired,
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
  inProgress: selectors.inProgress(state),
  user: loginSelectors.getUser(state),
  EvalId: selectors.evalId(state),
  TaskId: selectors.taskId(state),
  groupName: selectors.groupName(state),
  LoanNumber: selectors.loanNumber(state),
  resultOperation: selectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  onCleanResult: operations.onCleanResult(dispatch),
});

const DocsInGoBackContainer = connect(mapStateToProps, mapDispatchToProps)(DocsInGoBack);

const TestHooks = {
  DocsInGoBack,
};

export default withRouter(DocsInGoBackContainer);
export { TestHooks };
