import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment-timezone';
import '../TrialHeaderAndDetails.css';

class TrialHeader extends React.PureComponent {
  renderDetailsCard() {
    const { trialHeader } = this.props;
    const opt = 'MM/DD/YYYY';
    // const isTrialHeader = trialHeader.trialName;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return (
      <>
        <CardContent styleName="card-content">
          <div style={{ display: 'flex' }}>
            <div styleName="item">
              <span styleName="header-style">Acceptance Date</span>
              <span styleName="value-style">
                {moment(trialHeader.trialAcceptanceDate).format(opt) !== '01/01/0001'
                  ? moment(trialHeader.trialAcceptanceDate).format(opt) : 'N/A'}
              </span>
            </div>
            <div styleName="item">
              <span styleName="header-style">Down Payment</span>
              <span styleName="value-style">
                {formatter.format(trialHeader.downPayment)}
              </span>
            </div>
            <div styleName="item">
              <span styleName="header-style">Case Id</span>
              <span styleName="value-style">
                {trialHeader.resolutionId}
              </span>
            </div>
            <div styleName="item">
              <span styleName="header-style">Case Type</span>
              <span styleName="value-style">
                {trialHeader.trialName.includes('Trial') ? 'Trial' : 'Forbearance'}
              </span>
            </div>
            <div styleName="item">
              <span styleName="header-style">FHA Trial Letter Received</span>
              <span styleName="value-style">
                {moment(trialHeader.fhaTrialLetterReceivedDate).format(opt) !== '01/01/0001'
                  ? moment(trialHeader.fhaTrialLetterReceivedDate).format(opt) : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  render() {
    const { trialHeader } = this.props;
    if (Object.keys(trialHeader).length === 0) {
      return null;
    }
    return (
      this.renderDetailsCard()
    );
  }
}

TrialHeader.defaultProps = {
  trialHeader: [],
};

TrialHeader.propTypes = {
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
};

export default TrialHeader;
