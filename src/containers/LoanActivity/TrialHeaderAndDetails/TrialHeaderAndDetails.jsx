import React from 'react';
import Card from '@material-ui/core/Card';
import { operations, selectors } from 'ducks/dashboard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import Button from '@material-ui/core/Button';
import TrialHeader from './TrialHeader/TrialHeader';
import TrialDetails from './TrialDetails';
import UserNotification from '../../../components/UserNotification/UserNotification';
import SweetAlertBox from '../../../components/SweetAlertBox';
import './TrialHeaderAndDetails.css';

class TrialHeaderAndDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderDetailsCard = this.renderDetailsCard.bind(this);
    this.handleUpdateTrialPeriod = this.handleUpdateTrialPeriod.bind(this);
  }

  handleClose = () => {
    const { closeSweetAlert } = this.props;
    closeSweetAlert();
  }

  handleUpdateTrialPeriod() {
    const { onUpdateTrialPeriod } = this.props;
    onUpdateTrialPeriod();
  }

  renderDetailsCard() {
    const {
      trialHeader, isSaveDisabled, trialsDetail, resultOperation, resultUnderwriting, inProgress,
    } = this.props;
    const isTrialHeader = trialHeader ? trialHeader.trialName : '';
    const renderAlert = (
      <SweetAlertBox
        confirmButtonColor="#004261"
        message={resultOperation.status}
        onConfirm={this.handleClose}
        show={resultOperation.isOpen}
        type={resultOperation.level}
      />
    );
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
          {renderAlert}
        </div>
        {isTrialHeader && (
          <>
            <div styleName="title-row">
              <div styleName="title-style">
                {trialHeader && trialHeader.trialName && (trialHeader.trialName.includes('Trial') ? 'Trial Period' : 'Forbearance')}
                <Button
                  className="material-ui-button"
                  color="primary"
                  disabled={isSaveDisabled}
                  onClick={this.handleUpdateTrialPeriod}
                  styleName="getNext-button"
                  variant="contained"
                >
                  SAVE
                </Button>
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
  resultOperation: {},
  resultUnderwriting: { level: '', status: '' },
  trialHeader: {},
  trialsDetail: [],
  onUpdateTrialPeriod: () => { },
};

TrialHeaderAndDetails.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  isSaveDisabled: PropTypes.bool.isRequired,
  onUpdateTrialPeriod: PropTypes.func,
  resultOperation: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
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

const mapStateToProps = state => ({
  isSaveDisabled: selectors.isSaveDisabled(state),
  resultOperation: selectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  onUpdateTrialPeriod: operations.onUpdateTrialPeriod(dispatch),
  closeSweetAlert: operations.closeSweetAlert(dispatch),
});

export { TrialHeaderAndDetails };

export default connect(mapStateToProps, mapDispatchToProps)(TrialHeaderAndDetails);
