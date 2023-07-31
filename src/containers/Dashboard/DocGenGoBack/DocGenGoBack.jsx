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
import { selectors as tombstoneSelectors } from 'ducks/tombstone';
import PropTypes from 'prop-types';
import DashboardModel from 'models/Dashboard';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import Grid from '@material-ui/core/Grid';
import LSAMSNotesWidget from 'components/Widgets/LSAMSNotesWidget';
import MilestoneActivity from '../../LoanActivity/MilestoneActivity';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import {
  ADDITIONAL_INFO, HISTORY, LSAMS_NOTES,
} from '../../../constants/widgets';
import getTombstonePopup from '../../../components/Tombstone/PopupSelect';
import { EDITABLE_FIELDS } from '../../../constants/loanInfoComponents';
import Popup from '../../../components/Popup';
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

  renderSweetAlert() {
    const { clearPopupData, popupData, dispatchAction } = this.props;
    if (popupData) {
      const {
        isOpen, message, title, level, showCancelButton,
        cancelButtonText, confirmButtonText, onConfirm,
      } = popupData;
      const confirmAction = onConfirm ? dispatchAction : clearPopupData;
      return (
        <Popup
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          level={level}
          message={message}
          onCancel={clearPopupData}
          onConfirm={() => confirmAction(onConfirm)}
          show={isOpen}
          showCancelButton={showCancelButton}
          showConfirmButton
          title={title}
        />
      );
    }
    return null;
  }

  renderLoanInfoComponents() {
    const { checklistCenterPaneView } = this.props;
    return (
      <section styleName="loanInfo">
        <Grid styleName="rfdData">
          {getTombstonePopup(checklistCenterPaneView)}
        </Grid>
        {this.renderSweetAlert()}
      </section>

    );
  }

  render() {
    const {
      inProgress, user, openWidgetList, checklistCenterPaneView,
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
        <div styleName="docksin-container">
          <Tombstone />
          {
              EDITABLE_FIELDS.includes(checklistCenterPaneView)
                ? (
                  <div styleName="scroll-wrapper">
                    {this.renderLoanInfoComponents()}
                  </div>
                ) : (
                  <div style={{ width: '86%' }}>
                    {
                    R.contains(ADDITIONAL_INFO, openWidgetList) && (
                    <div styleName="bookingWidget">
                      <span styleName="widgetTitle">
                      ADDITIONAL INFO

                      </span>
                    </div>
                    )
                    }
                    {
                     R.contains(ADDITIONAL_INFO, openWidgetList)
                     && (
                     <div styleName="container">
                       <AdditionalInfo />
                     </div>
                     )
                    }
                    {((R.contains(HISTORY, openWidgetList)))
                    && (
                    <div styleName="container">
                      <MilestoneActivity />
                    </div>
                    )
                    }
                    {((R.contains(LSAMS_NOTES, openWidgetList)))
                    && (
                    <div styleName="container">
                      <LSAMSNotesWidget />
                    </div>
                    )
                    }
                  </div>
                )

          }
          <div style={{ paddingTop: '1.1rem', paddingBottom: '0' }} styleName="title-row">
            {
                  (resultOperation && resultOperation.status)
                    ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                    : ''
                }
            <WidgetBuilder page="DOCGEN_GOBACK" />
          </div>
        </div>
      </>
    );
  }
}

DocGenGoBack.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  AppName: 'CMOD',
  ProcIdType: 'ProcessId',
  groupName: 'DOC_GEN_BACK',
  openWidgetList: [],
  onCleanResult: () => {},
};

DocGenGoBack.propTypes = {
  AppName: PropTypes.string,
  checklistCenterPaneView: PropTypes.string.isRequired,
  clearPopupData: PropTypes.func.isRequired,
  dispatchAction: PropTypes.func.isRequired,
  dispositionReason: PropTypes.string.isRequired,
  EvalId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  inProgress: PropTypes.bool,
  LoanNumber: PropTypes.number.isRequired,
  onCleanResult: PropTypes.func,
  onPostComment: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  popupData: PropTypes.shape({
    cancelButtonText: PropTypes.string,
    clearData: PropTypes.string,
    confirmButtonText: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    title: PropTypes.string,
  }).isRequired,
  ProcIdType: PropTypes.string,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  TaskId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  inProgress: selectors.inProgress(state),
  user: loginSelectors.getUser(state),
  EvalId: selectors.evalId(state),
  TaskId: selectors.taskId(state),
  groupName: selectors.groupName(state),
  LoanNumber: selectors.loanNumber(state),
  resultOperation: selectors.resultOperation(state),
  checklistCenterPaneView: tombstoneSelectors.getChecklistCenterPaneView(state),
  popupData: selectors.getPopupData(state),
});

const mapDispatchToProps = dispatch => ({
  onCleanResult: operations.onCleanResult(dispatch),
  clearPopupData: operations.clearPopupData(dispatch),
  dispatchAction: operations.dispatchAction(dispatch),
});

const DocGenGoBackContainer = connect(mapStateToProps, mapDispatchToProps)(DocGenGoBack);

const TestHooks = {
  DocGenGoBack,
};

export default withRouter(DocGenGoBackContainer);
export { TestHooks };
