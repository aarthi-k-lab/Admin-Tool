import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TrialHeaderAndDetails from './TrialHeaderAndDetails';
import { selectors, operations } from '../../state/ducks/dashboard';
import './LoanActivity.css';
import WidgetBuilder from '../../components/Widgets/WidgetBuilder';

class LoanActivity extends React.PureComponent {
  componentWillMount() {
    const { loadTrials } = this.props;
    const { evalId } = this.props;
    // const evalId = 1912245;
    // const evalId = 56629;
    if (evalId) {
      loadTrials(evalId);
    }
  }

  render() {
    const { trialHeader } = this.props;
    const { trialsDetail } = this.props;
    const { inProgress } = this.props;
    const { resultUnderwriting } = this.props;
    return (
      <>
        <Grid alignItems="stretch" container styleName="loan-activity">
          <Grid item styleName="status-details-parent" xs={9}>
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
        <WidgetBuilder />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadTrials: operations.loadTrials(dispatch),
});
const mapStateToProps = state => ({
  evalId: selectors.evalId(state),
  inProgress: selectors.inProgress(state),
  trialHeader: selectors.getTrialHeader(state),
  trialsDetail: selectors.getTrialsDetail(state),
  trialsLetter: selectors.getTrialLetter(state),
  resultUnderwriting: selectors.resultUnderwriting(state),
});

LoanActivity.defaultProps = {
  evalId: 0,
  inProgress: false,
  resultUnderwriting: { level: '', status: '' },
  trialHeader: {},
  trialsDetail: [],
};

LoanActivity.propTypes = {
  evalId: PropTypes.string,
  inProgress: PropTypes.bool,
  loadTrials: PropTypes.func.isRequired,
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
