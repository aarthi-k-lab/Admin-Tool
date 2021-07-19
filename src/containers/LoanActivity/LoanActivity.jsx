import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AdditionalInfo from 'containers/AdditionalInfo';
import MilestoneActivity from './MilestoneActivity';
import TrialHeaderAndDetails from './TrialHeaderAndDetails';
import { selectors, operations } from '../../state/ducks/dashboard';
import './LoanActivity.css';
import { ADDITIONAL_INFO, HISTORY } from '../../constants/widgets';
import WidgetBuilder from '../../components/Widgets/WidgetBuilder';
import SweetAlertBox from '../../components/SweetAlertBox/SweetAlertBox';

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

  render() {
    const {
      trialHeader, openWidgetList, trialsDetail, inProgress, resultUnderwriting, getTrialResponse,
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
        { R.contains(HISTORY, openWidgetList) && (
        <MilestoneActivity />
        )
          }
        {!(R.contains(ADDITIONAL_INFO, openWidgetList) || R.contains(HISTORY, openWidgetList)) && (
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
        <WidgetBuilder page="LA" styleName="loan-act-widget" />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadTrials: operations.loadTrials(dispatch),
});

const mapStateToProps = state => ({
  evalId: selectors.evalId(state),
  LoanNumber: selectors.loanNumber(state),
  inProgress: selectors.inProgress(state),
  trialHeader: selectors.getTrialHeader(state),
  trialsDetail: selectors.getTrialsDetail(state),
  trialsLetter: selectors.getTrialLetter(state),
  resultUnderwriting: selectors.resultUnderwriting(state),
  getTrialResponse: selectors.getTrialResponse(state),
});

LoanActivity.defaultProps = {
  evalId: '',
  inProgress: false,
  resultUnderwriting: { level: '', status: '' },
  trialHeader: {},
  trialsDetail: [],
  getTrialResponse: {},
  openWidgetList: [],
};

LoanActivity.propTypes = {
  evalId: PropTypes.string,
  getTrialResponse: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  inProgress: PropTypes.bool,
  loadTrials: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
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
