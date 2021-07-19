import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import TrialHeader from './TrialHeader/TrialHeader';
import TrialDetails from './TrialDetails';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './TrialHeaderAndDetails.css';

class TrialHeaderAndDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderDetailsCard = this.renderDetailsCard.bind(this);
  }

  renderDetailsCard() {
    const { trialHeader } = this.props;
    const { trialsDetail } = this.props;
    const { resultUnderwriting } = this.props;
    const { inProgress } = this.props;
    const isTrialHeader = trialHeader ? trialHeader.trialName : '';
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <div style={{ paddingTop: '0.1rem', paddingBottom: '0' }} styleName="title-row">
          {(resultUnderwriting && resultUnderwriting.status)
            ? <UserNotification level={resultUnderwriting.level} message={resultUnderwriting.status} type="alert-box" />
            : ''
          }
        </div>
        {isTrialHeader && (
          <>
            <div styleName="title-row">
              <div styleName="title-style">
                {trialHeader && trialHeader.trialName && (trialHeader.trialName.includes('Trial') ? 'Trial Period' : 'Forbearance')}
              </div>
              <Card styleName="card-border">
                {trialHeader && <TrialHeader trialHeader={trialHeader} />}
              </Card>
            </div>
            <TrialDetails trialsDetail={trialsDetail} />
          </>
        )}
      </>
    );
  }

  render() {
    return (
      this.renderDetailsCard()
    );
  }
}

TrialHeaderAndDetails.defaultProps = {
  inProgress: false,
  resultUnderwriting: { level: '', status: '' },
  trialHeader: {},
  trialsDetail: [],
};

TrialHeaderAndDetails.propTypes = {
  inProgress: PropTypes.bool,
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

export default TrialHeaderAndDetails;
