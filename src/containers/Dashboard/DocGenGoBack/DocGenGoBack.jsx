import React from 'react';
import * as R from 'ramda';
import ContentHeader from 'components/ContentHeader';
import AdditionalInfo from 'containers/AdditionalInfo';
import Controls from 'containers/Controls';
import Loader from 'components/Loader/Loader';
import Tombstone from 'containers/Dashboard/Tombstone';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import PropTypes from 'prop-types';
import DashboardModel from 'models/Dashboard';
import MilestoneActivity from '../../LoanActivity/MilestoneActivity';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import widgets from '../../../constants/widget';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './DocGenGoBack.css';

class DocGenGoBack extends React.PureComponent {
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
    const taskName = 'Approved for Doc Generation';
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

  handleAIChange = (value, widgetId) => {
    const {
      onAdditionalInfoSelect, isAdditionalInfoOpen, isHistoryOpen,
      onHistorySelect, onAdditionalInfo, LoanNumber,
    } = this.props;
    if (R.equals(widgetId, widgets.additionalInfo)) {
      onAdditionalInfoSelect(!isAdditionalInfoOpen);
      onHistorySelect(false);
      if (!isAdditionalInfoOpen) onAdditionalInfo(LoanNumber);
    } else if (R.equals(widgetId, widgets.history)) {
      onHistorySelect(!isHistoryOpen);
      onAdditionalInfoSelect(false);
    }
  }

  render() {
    const {
      inProgress, user, isHistoryOpen, isAdditionalInfoOpen,
    } = this.props;
    const showButton = user.groupList.includes('docgen-mgr') || user.groupList.includes('docgen');
    const title = 'Send Back Doc Gen';
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
            showSendToDocGen={showButton}
            showSendToDocGenStager={showButton}
          />
        </ContentHeader>
        <Tombstone />
        {isAdditionalInfoOpen && (
          <div styleName="bookingWidget">
            <span styleName="widgetTitle">
              ADDITIONAL INFO
            </span>
          </div>
        )
        }
        <WidgetBuilder triggerAI={this.handleAIChange} />
        { isAdditionalInfoOpen && <AdditionalInfo />}
        { isHistoryOpen && <MilestoneActivity />}
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

DocGenGoBack.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  AppName: 'CMOD',
  isAdditionalInfoOpen: false,
  ProcIdType: 'ProcessId',
  groupName: 'DOC_GEN_BACK',
  isHistoryOpen: false,
  onCleanResult: () => {},
  // location: {
  //   pathname: '',
  // },
};

DocGenGoBack.propTypes = {
  AppName: PropTypes.string,
  dispositionReason: PropTypes.string.isRequired,
  EvalId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  isAdditionalInfoOpen: PropTypes.bool,
  isHistoryOpen: PropTypes.bool,
  LoanNumber: PropTypes.number.isRequired,
  onAdditionalInfo: PropTypes.func.isRequired,
  onAdditionalInfoSelect: PropTypes.func.isRequired,
  onCleanResult: PropTypes.func,
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  onHistorySelect: PropTypes.func.isRequired,
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
  isAdditionalInfoOpen: selectors.isAdditionalInfoOpen(state),
  resultOperation: selectors.resultOperation(state),
  isHistoryOpen: selectors.isHistoryOpen(state),
});

const mapDispatchToProps = dispatch => ({
  onCleanResult: operations.onCleanResult(dispatch),
  onAdditionalInfo: operations.onAdditionalInfoClick(dispatch),
  onAdditionalInfoSelect: operations.onAdditionalInfoSelect(dispatch),
  onHistorySelect: operations.onHistorySelect(dispatch),
});

const DocGenGoBackContainer = connect(mapStateToProps, mapDispatchToProps)(DocGenGoBack);

const TestHooks = {
  DocGenGoBack,
};

export default withRouter(DocGenGoBackContainer);
export { TestHooks };
