import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AdditionalInfo from 'containers/AdditionalInfo';
import { selectors as dashboardSelectors, operations as dashboardOperations } from 'ducks/dashboard';
import MilestoneActivity from './MilestoneActivity';
import TrialHeaderAndDetails from './TrialHeaderAndDetails';
import './LoanActivity.css';
import { ADDITIONAL_INFO, HISTORY } from '../../constants/widgets';
import WidgetBuilder from '../../components/Widgets/WidgetBuilder';
import SweetAlertBox from '../../components/SweetAlertBox/SweetAlertBox';
import { selectors as tombstoneSelectors } from '../../state/ducks/tombstone';
import { EDITABLE_FIELDS } from '../../constants/loanInfoComponents';
import RFDContent from '../../components/Tombstone/TombstoneComponents/RFDContent';
import CollateralContent from '../../components/Tombstone/TombstoneComponents/CollateralContent';
import Popup from '../../components/Popup';

class LoanActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    const { loadTrials } = this.props;
    const { evalId } = this.props;
    this.setState({ isOpen: true });
    if (evalId) {
      loadTrials(evalId);
    }
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  renderCollateralAlert() {
    const { clearPopupData, popupData } = this.props;
    if (popupData) {
      const {
        isOpen, message, title, level,
        confirmButtonText, onConfirm,
      } = popupData;
      const confirmAction = clearPopupData;
      return (
        <Popup
          confirmButtonText={confirmButtonText}
          level={level}
          message={message}
          onConfirm={() => confirmAction(onConfirm)}
          show={isOpen}
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
      <Grid styleName="loan-info-components">
        {checklistCenterPaneView === 'Reason for Default' ? <RFDContent /> : <CollateralContent />}
      </Grid>
    );
  }

  render() {
    const {
      trialHeader, openWidgetList, trialsDetail, inProgress, resultUnderwriting, getTrialResponse,
      checklistCenterPaneView,
    } = this.props;
    const { isOpen } = this.state;
    let renderComponent = null;
    let RenderContent = '';
    if (getTrialResponse && getTrialResponse.status) {
      RenderContent = getTrialResponse.status;
      renderComponent = (
        <SweetAlertBox
          message={RenderContent}
          onConfirm={this.handleClose}
          show={isOpen}
          type={getTrialResponse.level}
        />
      );
    }
    return (
      <>
        {R.contains(ADDITIONAL_INFO, openWidgetList) && (
          <div styleName="addInfo">
            <div styleName="bookingWidget">
              <span styleName="widgetTitle">
                ADDITIONAL INFO
              </span>
            </div>
            <AdditionalInfo />
          </div>
        )
        }
        {R.contains(HISTORY, openWidgetList) && (
          <MilestoneActivity />
        )
        }
        {EDITABLE_FIELDS.includes(checklistCenterPaneView)
          ? (
            <>
              {this.renderCollateralAlert()}
              {this.renderLoanInfoComponents()}
            </>
          )
          : (
            <>
              {!(R.contains(ADDITIONAL_INFO, openWidgetList)
                || R.contains(HISTORY, openWidgetList)) && (
                  <Grid alignItems="stretch" container styleName="loan-activity">
                    <Grid item styleName="status-details-parent" xs={9}>
                      {renderComponent}
                      <div styleName="status-details">
                        <TrialHeaderAndDetails
                          inProgress={inProgress}
                          resultUnderwriting={resultUnderwriting}
                          trialHeader={trialHeader}
                          trialsDetail={trialsDetail}
                        />
                      </div>
                    </Grid>
                  </Grid>
              )}
            </>

          )}
        <WidgetBuilder page="LA" styleName="loan-act-widget" />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadTrials: dashboardOperations.loadTrials(dispatch),
  clearPopupData: dashboardOperations.clearPopupData(dispatch),
});

const mapStateToProps = state => ({
  evalId: dashboardSelectors.evalId(state),
  LoanNumber: dashboardSelectors.loanNumber(state),
  inProgress: dashboardSelectors.inProgress(state),
  trialHeader: dashboardSelectors.getTrialHeader(state),
  trialsDetail: dashboardSelectors.getTrialsDetail(state),
  trialsLetter: dashboardSelectors.getTrialLetter(state),
  resultUnderwriting: dashboardSelectors.resultUnderwriting(state),
  getTrialResponse: dashboardSelectors.getTrialResponse(state),
  checklistCenterPaneView: tombstoneSelectors.getChecklistCenterPaneView(state),
  popupData: dashboardSelectors.getPopupData(state),
});

LoanActivity.defaultProps = {
  evalId: '',
  inProgress: false,
  resultUnderwriting: { level: '', status: '' },
  trialHeader: {},
  trialsDetail: [],
  getTrialResponse: {},
  openWidgetList: [],
  checklistCenterPaneView: 'Checklist',
  popupData: {
    confirmButtonText: 'Okay!',
  },
};

LoanActivity.propTypes = {
  checklistCenterPaneView: PropTypes.string,
  clearPopupData: PropTypes.func.isRequired,
  evalId: PropTypes.string,
  getTrialResponse: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  inProgress: PropTypes.bool,
  loadTrials: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  popupData: PropTypes.shape({
    confirmButtonText: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
  }),
  resultUnderwriting: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  trialHeader: PropTypes.shape({
    downPayment: PropTypes.number,
    evalId: PropTypes.number,
    fhaTrialLetterReceivedDate: PropTypes.string,
    loanId: PropTypes.number,
    resolutionChoiceType: PropTypes.string,
    resolutionId: PropTypes.number,
    trialAcceptanceDate: PropTypes.string,
    trialName: PropTypes.string,
  }),
  trialsDetail: PropTypes.arrayOf(
    PropTypes.shape({
      deadlineOn: PropTypes.string,
      escrowAmount: PropTypes.string,
      evalId: PropTypes.number,
      forbearanceId: PropTypes.number,
      paidOn: PropTypes.string,
      pandIAmount: PropTypes.string,
      resolutionId: PropTypes.number,
      sequence: PropTypes.string,
      totalTrialAmount: PropTypes.string,
      trialDueOn: PropTypes.string,
      trialName: PropTypes.string,
      trialPmtMonthYear: PropTypes.string,
    }),
  ),
};

const TestHooks = {
  LoanActivity,
};
const container = connect(mapStateToProps, mapDispatchToProps)(LoanActivity);
export default container;
export {
  TestHooks,
};
