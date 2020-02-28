import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './CoviusBulkOrder.css';
import Simpleselect from 'react-select';
import Loader from 'components/Loader/Loader';
import UserNotification from 'components/UserNotification';
import ErrorIcon from '@material-ui/icons/Error';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';

const validLoanEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateLoanFormat = (loanNumbers) => {
  let isValid = true;
  // eslint-disable-next-line
  if (validLoanEntries.test(loanNumbers)) {
    isValid = false;
  }
  return isValid;
};

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      loanNumbers: '',
      isSubmitDisabled: 'disabled',
    };

    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  OnSubmitLoans = () => {
    const { loanNumbers } = this.state;
    const { onCoviusBulkSubmit, onFailedLoanValidation } = this.props;
    if (validateLoanFormat(loanNumbers)) {
      this.setState({ isSubmitDisabled: 'disabled' });
      const loans = loanNumbers.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const loanNumbersList = new Set(loans);
      const payload = {
        loanNumbers: [...loanNumbersList],
      };
      onCoviusBulkSubmit(payload);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter loan number(s) in correct format. Only comma and newline separated loan numbers are accepted',
      };
      onFailedLoanValidation(payload);
    }
  }

  handleLoanChange = (event) => {
    this.setState({
      loanNumbers: event.target.value,
      isSubmitDisabled: event.target.value.trim() ? '' : 'disabled',
    });
  }

  renderNotepadArea() {
    const { loanNumbers, isSubmitDisabled } = this.state;
    const techCompanies = [
      { label: 'Apple', value: 1 },
      { label: 'Facebook', value: 2 },
      { label: 'Netflix', value: 3 },
      { label: 'Tesla', value: 4 },
      { label: 'Amazon', value: 5 },
      { label: 'Alphabet', value: 6 },
    ];
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Bulk Upload'}
        </span>
        <div styleName="loan-numbers">
          <span>
            {'Request Category'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Simpleselect options={techCompanies} />

        </div>
        <div styleName="loan-numbers">
          <span>
            {'Request Code'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Simpleselect
            options={techCompanies}
          />

        </div>
        <span styleName="loan-numbers">
          {'Case id(s)'}
        </span>
        <div styleName="status-details">
          <TextField
            id="loanNumbers"
            margin="normal"
            multiline
            onChange={event => this.handleLoanChange(event)}
            style={{ height: '98%', width: '99%', resize: 'none' }}
            value={loanNumbers}
          />
        </div>
        <div styleName="interactive-button">
          <div>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={isSubmitDisabled}
              margin="normal"
              onClick={() => this.OnSubmitLoans()}
              styleName="submitButton"
              variant="contained"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderResults() {
    const { resultData } = this.props;
    console.log(resultData);
  }

  render() {
    const { inProgress, resultOperation } = this.props;
    const title = '';
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <ContentHeader title={title}>
          <Grid container style={{ height: '3rem' }} xs={12}>
            <Grid item xs={1}>
              <div styleName="coviusLabel">
                Covius
              </div>
            </Grid>
            <Grid item xs={4}>
              <div styleName="title-row">
                {(resultOperation && resultOperation.status)
                  ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                  : ''
                }
              </div>
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container styleName="loan-activity" xs={12}>
          <Grid item xs={2}>{this.renderNotepadArea()}</Grid>
        </Grid>
      </>
    );
  }
}

CoviusBulkOrder.defaultProps = {
  inProgress: false,
  onCoviusBulkSubmit: () => { },
  onFailedLoanValidation: () => { },
  resultData: [],
  resultOperation: { level: '', status: '' },
};

CoviusBulkOrder.propTypes = {
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onFailedLoanValidation: PropTypes.func,
  resultData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      pid: PropTypes.string,
      statusMessage: PropTypes.string,
    }),
  ),
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultData: selectors.resultData(state),
});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusLoansSubmit(dispatch),
  onFailedLoanValidation: operations.onFailedLoanValidation(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);


export default withRouter(CoviusBulkOrderContainer);
